
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinTech.Models.DTOs;
using FinTech.Services;
using System.Security.Claims;
namespace FinTech.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var response = await _authService.RegisterAsync(request, ipAddress);
                
                _logger.LogInformation("User registered successfully: {Email}", request.Email);
                
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration failed for email: {Email}", request.Email);
                return StatusCode(500, new { error = "Registration failed" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var response = await _authService.LoginAsync(request, ipAddress);
                
                _logger.LogInformation("User logged in successfully: {Email}", request.Email);
                
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning("Failed login attempt for email: {Email}", request.Email);
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed for email: {Email}", request.Email);
                return StatusCode(500, new { error = "Login failed" });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var response = await _authService.RefreshTokenAsync(request.RefreshToken, ipAddress);
                
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Token refresh failed");
                return StatusCode(500, new { error = "Token refresh failed" });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var result = await _authService.RevokeTokenAsync(request.RefreshToken);
                
                if (result)
                {
                    return Ok(new { message = "Logged out successfully" });
                }
                
                return BadRequest(new { error = "Invalid token" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Logout failed");
                return StatusCode(500, new { error = "Logout failed" });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var firstName = User.FindFirst("first_name")?.Value;
            var lastName = User.FindFirst("last_name")?.Value;

            return Ok(new
            {
                id = userId,
                email,
                firstName,
                lastName,
                role
            });
        }
    /// <summary>
        /// Send email verification link to user
        /// </summary>
        [Authorize]
        [HttpPost("send-verification-email")]
        public async Task<IActionResult> SendVerificationEmail()
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                await _authService.SendEmailVerificationAsync(userId);

                return Ok(new { 
                    success = true, 
                    message = "Verification email sent. Please check your inbox." 
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send verification email");
                return StatusCode(500, new { success = false, error = "Failed to send verification email" });
            }
        }

        /// <summary>
        /// Verify email with token
        /// </summary>
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
        {
            try
            {
                var success = await _authService.VerifyEmailAsync(request.Token);

                if (!success)
                    return BadRequest(new { 
                        success = false, 
                        error = "Invalid or expired verification token" 
                    });

                return Ok(new { 
                    success = true, 
                    message = "Email verified successfully" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Email verification failed");
                return StatusCode(500, new { success = false, error = "Email verification failed" });
            }
        }

        /// <summary>
        /// Request password reset email
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                await _authService.SendPasswordResetEmailAsync(request.Email, ipAddress);

                // Always return success (don't reveal if email exists)
                return Ok(new { 
                    success = true, 
                    message = "If that email exists, a password reset link has been sent." 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Password reset request failed");
                return StatusCode(500, new { success = false, error = "Failed to process request" });
            }
        }

        /// <summary>
        /// Reset password with token
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var success = await _authService.ResetPasswordAsync(request.Token, request.NewPassword);

                if (!success)
                    return BadRequest(new { 
                        success = false, 
                        error = "Invalid or expired reset token" 
                    });

                return Ok(new { 
                    success = true, 
                    message = "Password reset successfully. You can now login with your new password." 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Password reset failed");
                return StatusCode(500, new { success = false, error = "Password reset failed" });
            }
        }

        /// <summary>
        /// Change password for authenticated user
        /// </summary>
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                await _authService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword);

                return Ok(new { 
                    success = true, 
                    message = "Password changed successfully" 
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Password change failed");
                return StatusCode(500, new { success = false, error = "Password change failed" });
            }
        }
    }
    
}
