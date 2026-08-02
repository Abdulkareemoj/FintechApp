
// ============================================
// FILE: Controllers/UserDashboard/RecipientsController.cs
// ============================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinTech.Services.UserDashboard;
using System.Security.Claims;

namespace FinTech.Controllers.UserDashboard
{
    [Authorize(Roles = "User")]
    [ApiController]
    [Route("api/user/[controller]")]
    public class RecipientsController : ControllerBase
    {
        private readonly IRecipientLookupService _lookupService;

        public RecipientsController(IRecipientLookupService lookupService)
        {
            _lookupService = lookupService;
        }

        /// <summary>
        /// Look up a recipient by email before sending or requesting money.
        /// Returns their wallet id (matching the given currency) if found.
        /// </summary>
        [HttpGet("lookup")]
        public async Task<IActionResult> Lookup([FromQuery] string identifier, [FromQuery] string currency)
        {
            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(currency))
                return BadRequest(new { success = false, error = "identifier and currency are required" });

            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var result = await _lookupService.FindByEmailAsync(identifier, currency, userId);

            if (result == null)
                return NotFound(new { success = false, error = "No matching user with an active wallet in that currency" });

            return Ok(new { success = true, data = result });
        }
    }
}
