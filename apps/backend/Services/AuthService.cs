
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
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
    }

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly JwtSettings _jwtSettings;

        public AuthService(
            AppDbContext context,
            IJwtService jwtService,
            IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtService = jwtService;
            _jwtSettings = jwtSettings.Value;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request, string? ipAddress)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                throw new InvalidOperationException("Email already registered");
            }

            // Create user
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

            // Create default USD wallet
            var wallet = new Wallet
            {
                UserId = user.Id,
                CurrencyCode = "USD",
                Status = WalletStatus.Active
            };

            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();

            // Generate tokens
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

            // Revoke old token
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;

            // Generate new tokens
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
    }
}