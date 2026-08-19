// ============================================
// FILE: Controllers/UserDashboard/HelpController.cs
// PURPOSE: Help center article endpoints
// ============================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinTech.Services.UserDashboard;

namespace FinTech.Controllers.UserDashboard
{
    [Authorize(Roles = "User")]
    [ApiController]
    [Route("api/user/[controller]")]
    public class HelpController : ControllerBase
    {
        private readonly IHelpService _helpService;
        private readonly ILogger<HelpController> _logger;

        public HelpController(
            IHelpService helpService,
            ILogger<HelpController> logger)
        {
            _helpService = helpService;
            _logger = logger;
        }

        /// <summary>
        /// Get all published help articles / FAQs
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetArticles()
        {
            try
            {
                var articles = await _helpService.GetPublishedArticlesAsync();

                return Ok(new { success = true, data = articles });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving help articles");
                return StatusCode(500, new { success = false, error = "Failed to retrieve help articles" });
            }
        }
    }
}