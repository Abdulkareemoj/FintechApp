// ============================================
// FILE: Controllers/UserDashboard/SecurityController.cs
// PURPOSE: Two-factor authentication management (setup/enable/disable/status)
// ============================================

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinTech.Models.DTOs;
using FinTech.Services;

namespace FinTech.Controllers.UserDashboard
{
    [Authorize(Roles = "User")]
    [ApiController]
    [Route("api/user/security")]
    public class SecurityController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<SecurityController> _logger;

        public SecurityController(
            IAuthService authService,
            ILogger<SecurityController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        private Guid UserId => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        /// <summary>Current 2FA status</summary>
        [HttpGet("2fa")]
        public async Task<IActionResult> GetStatus()
        {
            try
            {
                var enabled = await _authService.IsTwoFactorEnabledAsync(UserId);
                return Ok(new { success = true, data = new { enabled } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to read 2FA status for user {UserId}", UserId);
                return StatusCode(500, new { success = false, error = "Failed to read two-factor status" });
            }
        }

        /// <summary>Generate a secret (does not enable 2FA until verified)</summary>
        [HttpPost("2fa/setup")]
        public async Task<IActionResult> Setup()
        {
            try
            {
                var setup = await _authService.BeginTwoFactorSetupAsync(UserId);
                return Ok(new { success = true, data = setup });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "2FA setup failed for user {UserId}", UserId);
                return StatusCode(500, new { success = false, error = "Failed to start two-factor setup" });
            }
        }

        /// <summary>Confirm a code from the authenticator app and enable 2FA</summary>
        [HttpPost("2fa/enable")]
        public async Task<IActionResult> Enable([FromBody] TwoFactorEnableRequest request)
        {
            try
            {
                await _authService.EnableTwoFactorAsync(UserId, request.Code);
                return Ok(new { success = true, data = new { enabled = true } });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "2FA enable failed for user {UserId}", UserId);
                return StatusCode(500, new { success = false, error = "Failed to enable two-factor authentication" });
            }
        }

        /// <summary>Disable 2FA with a current code, or password as fallback</summary>
        [HttpPost("2fa/disable")]
        public async Task<IActionResult> Disable([FromBody] TwoFactorDisableRequest request)
        {
            try
            {
                await _authService.DisableTwoFactorAsync(UserId, request);
                return Ok(new { success = true, data = new { enabled = false } });
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "2FA disable failed for user {UserId}", UserId);
                return StatusCode(500, new { success = false, error = "Failed to disable two-factor authentication" });
            }
        }
    }
}
