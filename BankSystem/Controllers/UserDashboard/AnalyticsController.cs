using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinTech.Services.UserDashboard;
using System.Security.Claims;

namespace FinTech.Controllers.UserDashboard
{
    /// <summary>
    /// User analytics endpoints
    /// </summary>
    [Authorize(Roles = "User")]
    [ApiController]
    [Route("api/user/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(
            IAnalyticsService analyticsService,
            ILogger<AnalyticsController> logger)
        {
            _analyticsService = analyticsService;
            _logger = logger;
        }

        /// <summary>
        /// Get analytics summary for the current user
        /// (totals, monthly trend, spending by type, weekly spending)
        /// </summary>
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(
            [FromQuery] string? currency = null,
            [FromQuery] int months = 6)
        {
            try
            {
                var userId = GetCurrentUserId();
                var summary = await _analyticsService.GetSummaryAsync(userId, currency ?? "USD", months);
                return Ok(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving analytics summary for user {UserId}", GetCurrentUserId());
                return StatusCode(500, new { success = false, error = "Failed to retrieve analytics summary" });
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
