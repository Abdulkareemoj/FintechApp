
// ============================================
// FILE: Controllers/UserDashboard/MoneyRequestsController.cs
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
    [Route("api/user/money-requests")]
    public class MoneyRequestsController : ControllerBase
    {
        private readonly IMoneyRequestService _requestService;
        private readonly ILogger<MoneyRequestsController> _logger;

        public MoneyRequestsController(
            IMoneyRequestService requestService,
            ILogger<MoneyRequestsController> logger)
        {
            _requestService = requestService;
            _logger = logger;
        }

        /// <summary>Ask another user (by email) to pay you</summary>
        [HttpPost]
        public async Task<IActionResult> CreateRequest([FromBody] CreateMoneyRequestRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _requestService.CreateRequestAsync(userId, request);

                return CreatedAtAction(nameof(GetRequest), new { id = result.Id },
                    new { success = true, data = result, message = "Money request sent" });
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (InvalidOperationException ex) { return BadRequest(new { success = false, error = ex.Message }); }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create money request");
                return StatusCode(500, new { success = false, error = "Failed to create request" });
            }
        }

        /// <summary>Requests where you are being asked to pay</summary>
        [HttpGet("incoming")]
        public async Task<IActionResult> GetIncoming([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = GetCurrentUserId();
            var result = await _requestService.GetIncomingRequestsAsync(userId, page, pageSize);
            return Ok(new { success = true, data = result });
        }

        /// <summary>Requests you've sent asking to be paid</summary>
        [HttpGet("outgoing")]
        public async Task<IActionResult> GetOutgoing([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = GetCurrentUserId();
            var result = await _requestService.GetOutgoingRequestsAsync(userId, page, pageSize);
            return Ok(new { success = true, data = result });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRequest(Guid id)
        {
            var userId = GetCurrentUserId();
            var result = await _requestService.GetRequestDetailAsync(id, userId);

            if (result == null)
                return NotFound(new { success = false, error = "Request not found" });

            return Ok(new { success = true, data = result });
        }

        /// <summary>Pay a request that was sent to you</summary>
        [HttpPost("{id}/accept")]
        public async Task<IActionResult> Accept(Guid id, [FromBody] AcceptMoneyRequestRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _requestService.AcceptRequestAsync(id, userId, request);

                return Ok(new { success = true, data = result, message = "Payment sent" });
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (InsufficientFundsException ex) { return UnprocessableEntity(new { success = false, error = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { success = false, error = ex.Message }); }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to accept money request {RequestId}", id);
                return StatusCode(500, new { success = false, error = "Failed to process payment" });
            }
        }

        [HttpPost("{id}/decline")]
        public async Task<IActionResult> Decline(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _requestService.DeclineRequestAsync(id, userId);
                return Ok(new { success = true, data = result });
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (InvalidOperationException ex) { return BadRequest(new { success = false, error = ex.Message }); }
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _requestService.CancelRequestAsync(id, userId);
                return Ok(new { success = true, data = result });
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (InvalidOperationException ex) { return BadRequest(new { success = false, error = ex.Message }); }
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
