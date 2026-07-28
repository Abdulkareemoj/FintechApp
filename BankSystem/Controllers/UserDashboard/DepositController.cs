
// ============================================
// FILE: Controllers/UserDashboard/DepositsController.cs
// PURPOSE: Wallet top-up endpoints
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
    [Route("api/user/[controller]")]
    public class DepositsController : ControllerBase
    {
        private readonly IDepositService _depositService;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<DepositsController> _logger;

        public DepositsController(
            IDepositService depositService,
            IWebHostEnvironment environment,
            ILogger<DepositsController> logger)
        {
            _depositService = depositService;
            _environment = environment;
            _logger = logger;
        }

        /// <summary>
        /// Start a deposit (top-up). Returns a reference the user would use
        /// to complete payment via the (future) real payment provider.
        /// </summary>
        [HttpPost("initiate")]
        public async Task<IActionResult> InitiateDeposit([FromBody] InitiateDepositRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var deposit = await _depositService.InitiateDepositAsync(userId, request);

                return Ok(new
                {
                    success = true,
                    data = deposit,
                    message = "Deposit initiated. Awaiting confirmation."
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Deposit initiation failed for user {UserId}", GetCurrentUserId());
                return StatusCode(500, new { success = false, error = "Failed to initiate deposit" });
            }
        }

        /// <summary>
        /// Get full deposit details
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDeposit(Guid id)
        {
            var userId = GetCurrentUserId();
            var deposit = await _depositService.GetDepositAsync(id, userId);

            if (deposit == null)
                return NotFound(new { success = false, error = "Deposit not found" });

            return Ok(new { success = true, data = deposit });
        }

        /// <summary>
        /// Lightweight status check - meant for polling from the frontend
        /// while a deposit is pending (e.g. "Waiting for bank confirmation...")
        /// </summary>
        [HttpGet("{id}/status")]
        public async Task<IActionResult> GetDepositStatus(Guid id)
        {
            var userId = GetCurrentUserId();
            var status = await _depositService.GetDepositStatusAsync(id, userId);

            if (status == null)
                return NotFound(new { success = false, error = "Deposit not found" });

            return Ok(new { success = true, data = status });
        }

        /// <summary>
        /// DEV-ONLY: Simulates a payment provider webhook confirming or failing a deposit.
        /// This endpoint will be replaced by a real webhook (e.g. /api/webhooks/stripe)
        /// once a payment processor is integrated. Disabled outside Development.
        /// </summary>
        [HttpPost("{id}/simulate-callback")]
        public async Task<IActionResult> SimulateCallback(Guid id, [FromBody] SimulateDepositCallbackRequest request)
        {
            if (!_environment.IsDevelopment())
                return NotFound(); // Hide this endpoint entirely outside dev

            try
            {
                var deposit = await _depositService.SimulateCallbackAsync(id, request.Success, request.FailureReason);

                return Ok(new
                {
                    success = true,
                    data = deposit,
                    message = $"Deposit marked as {deposit.Status}"
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Simulate callback failed for deposit {DepositId}", id);
                return StatusCode(500, new { success = false, error = "Failed to update deposit" });
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
