// ============================================
// FILE: Controllers/UserDashboard/BillsController.cs
// PURPOSE: Bill management + bill payments for users
// ============================================

using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Services.UserDashboard;

namespace FinTech.Controllers.UserDashboard
{
    [Authorize(Roles = "User")]
    [ApiController]
    [Route("api/user/bills")]
    public class BillsController : ControllerBase
    {
        private readonly IBillService _billService;
        private readonly ILogger<BillsController> _logger;

        public BillsController(
            IBillService billService,
            ILogger<BillsController> logger)
        {
            _billService = billService;
            _logger = logger;
        }

        private Guid UserId => Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        /// <summary>
        /// List the user's bills (unpaid first by due date, then paid by paid date)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetBills()
        {
            try
            {
                var bills = await _billService.GetUserBillsAsync(UserId);
                return Ok(new { success = true, data = bills });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to list bills for user {UserId}", UserId);
                return StatusCode(500, new { success = false, error = "Failed to retrieve bills" });
            }
        }

        /// <summary>
        /// Create an unpaid bill (scheduled)
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateBill([FromBody] CreateBillRequest request)
        {
            try
            {
                var bill = await _billService.CreateBillAsync(UserId, request);
                return Ok(new { success = true, data = bill });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create bill for user {UserId}", UserId);
                return StatusCode(500, new { success = false, error = "Failed to create bill" });
            }
        }

        /// <summary>
        /// Delete an unpaid bill
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteBill(Guid id)
        {
            try
            {
                await _billService.DeleteBillAsync(UserId, id);
                return Ok(new { success = true, data = true });
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
                _logger.LogError(ex, "Failed to delete bill {BillId} for user {UserId}", id, UserId);
                return StatusCode(500, new { success = false, error = "Failed to delete bill" });
            }
        }

        /// <summary>
        /// Pay a scheduled bill from a wallet
        /// </summary>
        [HttpPost("{id:guid}/pay")]
        public async Task<IActionResult> PayBill(Guid id, [FromBody] PayBillRequest request)
        {
            try
            {
                var bill = await _billService.PayBillAsync(UserId, id, request);
                return Ok(new { success = true, data = bill });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (InsufficientFundsException ex)
            {
                return UnprocessableEntity(new { success = false, error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to pay bill {BillId} for user {UserId}", id, UserId);
                return StatusCode(500, new { success = false, error = "Failed to process bill payment" });
            }
        }

        /// <summary>
        /// One-off bill payment (immediate charge, recorded as a paid bill)
        /// </summary>
        [HttpPost("pay")]
        public async Task<IActionResult> QuickPay([FromBody] QuickPayBillRequest request)
        {
            try
            {
                var bill = await _billService.QuickPayBillAsync(UserId, request);
                return Ok(new { success = true, data = bill });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (InsufficientFundsException ex)
            {
                return UnprocessableEntity(new { success = false, error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Quick bill payment failed for user {UserId}", UserId);
                return StatusCode(500, new { success = false, error = "Failed to process bill payment" });
            }
        }
    }
}
