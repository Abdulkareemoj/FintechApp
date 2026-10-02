// ============================================
// FILE: Controllers/UserDashboard/SettingsController.cs
// PURPOSE: Current-user notification/app preference endpoints
// ============================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Services.UserDashboard;
using System.Security.Claims;

namespace FinTech.Controllers.UserDashboard
{
    [Authorize(Roles = "User")]
    [ApiController]
    [Route("api/user/settings")]
    public class SettingsController : ControllerBase
    {
        private readonly IProfileService _profileService;
        private readonly ILogger<SettingsController> _logger;

        public SettingsController(
            IProfileService profileService,
            ILogger<SettingsController> logger)
        {
            _profileService = profileService;
            _logger = logger;
        }

        /// <summary>
        /// Get the current user's settings (creates defaults on first access)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            try
            {
                var userId = GetCurrentUserId();
                var settings = await _profileService.GetSettingsAsync(userId);

                return Ok(new { success = true, data = settings });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving settings");
                return StatusCode(500, new { success = false, error = "Failed to retrieve settings" });
            }
        }

        /// <summary>
        /// Partially update settings — send only the fields that changed
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateSettings([FromBody] UpdateSettingsRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var settings = await _profileService.UpdateSettingsAsync(userId, request);

                return Ok(new { success = true, data = settings });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating settings");
                return StatusCode(500, new { success = false, error = "Failed to update settings" });
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("User ID not found in token");

            return Guid.Parse(userIdClaim);
        }
    }
}
