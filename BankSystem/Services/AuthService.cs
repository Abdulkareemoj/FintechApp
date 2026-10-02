using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs;
using FinTech.Models.Enums;

namespace FinTech.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request, string? ipAddress);
        Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress);
        Task<AuthResponse> RefreshTokenAsync(string refreshToken, string? ipAddress);
        Task<bool> RevokeTokenAsync(string refreshToken);
        Task SendEmailVerificationAsync(Guid userId);
        Task<bool> VerifyEmailAsync(string token);
        Task SendPasswordResetEmailAsync(string email, string? ipAddress);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task ChangePasswordAsync(Guid userId, string currentPassword, string newPassword);
        Task<AuthResponse> LoginWithTwoFactorAsync(TwoFactorLoginRequest request, string? ipAddress);
        Task<TwoFactorSetupResponse> BeginTwoFactorSetupAsync(Guid userId);
        Task<bool> EnableTwoFactorAsync(Guid userId, string code);
        Task<bool> DisableTwoFactorAsync(Guid userId, TwoFactorDisableRequest request);
        Task<bool> IsTwoFactorEnabledAsync(Guid userId);

    }
    public partial class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly JwtSettings _jwtSettings;
        private readonly ILogger<AuthService> _logger;
        private readonly IEmailService _emailService;

        public AuthService(
            AppDbContext context,
            IJwtService jwtService,
            IOptions<JwtSettings> jwtSettings,
            ILogger<AuthService> logger,
            IEmailService emailService)
        {
            _context = context;
            _jwtService = jwtService;
            _jwtSettings = jwtSettings.Value ?? throw new ArgumentNullException(nameof(jwtSettings));
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request, string? ipAddress)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new InvalidOperationException("Email already registered");
            }

            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                Phone = request.Phone,
                Role = UserRole.User,
                Status = UserStatus.Active,
                EmailVerified = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var wallet = new Wallet
            {
                UserId = user.Id,
                CurrencyCode = "USD",
                Status = WalletStatus.Active
            };

            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();

            return await GenerateAuthResponse(user, ipAddress);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (user.Status != UserStatus.Active)
            {
                throw new UnauthorizedAccessException("Account is not active");
            }

            // 2FA enabled -> password alone is not enough; issue a short-lived
            // pending token instead of real credentials.
            var twoFactor = await _context.UserTwoFactors
                .FirstOrDefaultAsync(t => t.UserId == user.Id);

            if (twoFactor is { Enabled: true })
            {
                return new AuthResponse
                {
                    RequiresTwoFactor = true,
                    TwoFactorToken = _jwtService.GenerateTwoFactorToken(user.Id),
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName ?? "",
                        LastName = user.LastName ?? "",
                        Role = user.Role.ToString()
                    }
                };
            }

            return await GenerateAuthResponse(user, ipAddress);
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken, string? ipAddress)
        {
            var token = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (token == null || !token.IsActive)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;

            var response = await GenerateAuthResponse(token.User, ipAddress);
            await _context.SaveChangesAsync();

            return response;
        }

        public async Task<bool> RevokeTokenAsync(string refreshToken)
        {
            var token = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (token == null || !token.IsActive)
            {
                return false;
            }

            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<AuthResponse> GenerateAuthResponse(User user, string? ipAddress)
        {
            var accessToken = _jwtService.GenerateAccessToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            // Store refresh token
            var refreshTokenEntity = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays),
                CreatedByIp = ipAddress
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName ?? "",
                    LastName = user.LastName ?? "",
                    Role = user.Role.ToString()
                }
            };
        }
          public async Task SendEmailVerificationAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            if (user.EmailVerified)
                throw new InvalidOperationException("Email already verified");

            // Generate verification token
            var token = GenerateSecureToken();
            var verificationToken = new EmailVerificationToken
            {
                UserId = user.Id,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(24) // Valid for 24 hours
            };

            _context.EmailVerificationTokens.Add(verificationToken);
            await _context.SaveChangesAsync();

            // Send email
            await _emailService.SendEmailVerificationAsync(
                user.Email, 
                $"{user.FirstName} {user.LastName}", 
                token);
        }

        public async Task<bool> VerifyEmailAsync(string token)
        {
            var verificationToken = await _context.EmailVerificationTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == token);

            if (verificationToken == null || !verificationToken.IsValid)
                return false;

            // Mark email as verified
            verificationToken.User.EmailVerified = true;
            verificationToken.IsUsed = true;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task SendPasswordResetEmailAsync(string email, string? ipAddress)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            
            // Don't reveal if user exists or not (security)
            if (user == null)
            {
                // Still log for monitoring
                _logger.LogWarning("Password reset requested for non-existent email: {Email}", email);
                return;
            }

            // Generate reset token
            var token = GenerateSecureToken();
            var resetToken = new PasswordResetToken
            {
                UserId = user.Id,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddHours(1), // Valid for 1 hour
                CreatedByIp = ipAddress
            };

            _context.PasswordResetTokens.Add(resetToken);
            await _context.SaveChangesAsync();

            // Send email
            await _emailService.SendPasswordResetAsync(
                user.Email, 
                $"{user.FirstName} {user.LastName}", 
                token);

            _logger.LogInformation("Password reset email sent to {Email}", email);
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var resetToken = await _context.PasswordResetTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == token);

            if (resetToken == null || !resetToken.IsValid)
                return false;

            // Update password
            resetToken.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            resetToken.IsUsed = true;

            await _context.SaveChangesAsync();

            // Send confirmation email
            await _emailService.SendPasswordChangedNotificationAsync(
                resetToken.User.Email,
                $"{resetToken.User.FirstName} {resetToken.User.LastName}");

            _logger.LogInformation("Password reset successful for user {UserId}", resetToken.UserId);

            return true;
        }

        public async Task ChangePasswordAsync(Guid userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
                throw new UnauthorizedAccessException("Current password is incorrect");

            // Update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();

            // Send confirmation email
            await _emailService.SendPasswordChangedNotificationAsync(
                user.Email,
                $"{user.FirstName} {user.LastName}");

            _logger.LogInformation("Password changed for user {UserId}", userId);
        }

        // ============================================
        // Two-factor authentication (TOTP)
        // ============================================

        public async Task<AuthResponse> LoginWithTwoFactorAsync(TwoFactorLoginRequest request, string? ipAddress)
        {
            var principal = _jwtService.ValidateToken(request.TwoFactorToken);
            if (principal == null)
                throw new UnauthorizedAccessException("Invalid or expired two-factor session");

            var purpose = principal.FindFirst("purpose")?.Value;
            if (purpose != "2fa")
                throw new UnauthorizedAccessException("Invalid two-factor session");

            var userIdClaim = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("Invalid two-factor session");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null || user.Status != UserStatus.Active)
                throw new UnauthorizedAccessException("Account is not active");

            var twoFactor = await _context.UserTwoFactors
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (twoFactor is not { Enabled: true })
                throw new UnauthorizedAccessException("Two-factor authentication is not enabled");

            if (!TotpService.VerifyCode(twoFactor.Secret, request.Code))
            {
                _logger.LogWarning("Failed 2FA login attempt for user {UserId}", userId);
                throw new UnauthorizedAccessException("Invalid authentication code");
            }

            _logger.LogInformation("2FA login successful for user {UserId}", userId);
            return await GenerateAuthResponse(user, ipAddress);
        }

        public async Task<TwoFactorSetupResponse> BeginTwoFactorSetupAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            var twoFactor = await _context.UserTwoFactors
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (twoFactor is { Enabled: true })
                throw new InvalidOperationException(
                    "Two-factor authentication is already enabled. Disable it first.");

            var secret = TotpService.GenerateSecret();

            if (twoFactor == null)
            {
                twoFactor = new UserTwoFactor { UserId = userId };
                _context.UserTwoFactors.Add(twoFactor);
            }

            twoFactor.Secret = secret;
            twoFactor.Enabled = false;
            twoFactor.ConfirmedAt = null;
            twoFactor.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return new TwoFactorSetupResponse
            {
                Secret = secret,
                OtpauthUri = TotpService.BuildOtpauthUri(secret, user.Email),
                Enabled = false
            };
        }

        public async Task<bool> EnableTwoFactorAsync(Guid userId, string code)
        {
            var twoFactor = await _context.UserTwoFactors
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (twoFactor == null)
                throw new InvalidOperationException("Start the setup flow first");

            if (twoFactor.Enabled)
                throw new InvalidOperationException("Two-factor authentication is already enabled");

            if (!TotpService.VerifyCode(twoFactor.Secret, code))
                throw new InvalidOperationException("Invalid authentication code");

            twoFactor.Enabled = true;
            twoFactor.ConfirmedAt = DateTime.UtcNow;
            twoFactor.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("2FA enabled for user {UserId}", userId);
            return true;
        }

        public async Task<bool> DisableTwoFactorAsync(Guid userId, TwoFactorDisableRequest request)
        {
            var twoFactor = await _context.UserTwoFactors
                .FirstOrDefaultAsync(t => t.UserId == userId);

            if (twoFactor is not { Enabled: true })
                throw new InvalidOperationException("Two-factor authentication is not enabled");

            var verified = false;

            if (!string.IsNullOrWhiteSpace(request.Code))
            {
                verified = TotpService.VerifyCode(twoFactor.Secret, request.Code);
            }

            if (!verified && !string.IsNullOrWhiteSpace(request.Password))
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    verified = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
                }
            }

            if (!verified)
            {
                _logger.LogWarning("Failed 2FA disable attempt for user {UserId}", userId);
                throw new UnauthorizedAccessException("Invalid code or password");
            }

            _context.UserTwoFactors.Remove(twoFactor);
            await _context.SaveChangesAsync();

            _logger.LogInformation("2FA disabled for user {UserId}", userId);
            return true;
        }

        public async Task<bool> IsTwoFactorEnabledAsync(Guid userId)
        {
            return await _context.UserTwoFactors
                .AnyAsync(t => t.UserId == userId && t.Enabled);
        }

        private string GenerateSecureToken()
        {
            var randomBytes = new byte[32];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }
    }
}