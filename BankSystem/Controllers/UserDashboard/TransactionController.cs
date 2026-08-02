

// ============================================
// FILE: Controllers/UserDashboard/TransactionsController.cs
// PURPOSE: User transaction endpoints
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
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(
            ITransactionService transactionService,
            ILogger<TransactionsController> logger)
        {
            _transactionService = transactionService;
            _logger = logger;
        }

        /// <summary>
        /// Create a P2P transfer
        /// </summary>
        [HttpPost("transfer")]
        public async Task<IActionResult> CreateTransfer([FromBody] CreateTransferRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var transaction = await _transactionService.CreateTransferAsync(userId, request);

                return Ok(new 
                { 
                    success = true, 
                    data = transaction,
                    message = "Transfer completed successfully" 
                });
            }
            catch (InsufficientFundsException ex)
            {
                return UnprocessableEntity(new { success = false, error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Transfer failed for user {UserId}", GetCurrentUserId());
                return StatusCode(500, new { success = false, error = "Transfer failed. Please try again." });
            }
        }

        /// <summary>
        /// Get user's transaction history with filters
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetTransactions([FromQuery] TransactionQueryParams queryParams)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _transactionService.GetUserTransactionsAsync(userId, queryParams);

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transactions for user {UserId}", GetCurrentUserId());
                return StatusCode(500, new { success = false, error = "Failed to retrieve transactions" });
            }
        }

        /// <summary>
        /// Get detailed information about a specific transaction
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransactionDetail(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var transaction = await _transactionService.GetTransactionDetailAsync(id, userId);

                if (transaction == null)
                    return NotFound(new { success = false, error = "Transaction not found" });

                return Ok(new { success = true, data = transaction });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transaction {TransactionId}", id);
                return StatusCode(500, new { success = false, error = "Failed to retrieve transaction" });
            }
        }

        /// <summary>
        /// Get list of recent recipients for quick transfers
        /// </summary>
        [HttpGet("recent-recipients")]
        public async Task<IActionResult> GetRecentRecipients([FromQuery] int limit = 10)
        {
            try
            {
                var userId = GetCurrentUserId();
                var recipients = await _transactionService.GetRecentRecipientsAsync(userId, limit);

                return Ok(new { success = true, data = recipients });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent recipients for user {UserId}", GetCurrentUserId());
                return StatusCode(500, new { success = false, error = "Failed to retrieve recipients" });
            }
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("User ID not found in token");
            
            return Guid.Parse(userIdClaim);
        }
        
/// <summary>
/// Lightweight status check for any transaction type.
/// Useful for polling after initiating a transfer or deposit.
/// </summary>
[HttpGet("{id}/status")]
public async Task<IActionResult> GetTransactionStatus(Guid id)
{
    try
    {
        var userId = GetCurrentUserId();
        var transaction = await _transactionService.GetTransactionDetailAsync(id, userId);

        if (transaction == null)
            return NotFound(new { success = false, error = "Transaction not found" });

        return Ok(new
        {
            success = true,
            data = new
            {
                id = transaction.Id,
                status = transaction.Status,
                type = transaction.Type,
                amount = transaction.Amount,
                currency = transaction.Currency,
                createdAt = transaction.CreatedAt,
                completedAt = transaction.CompletedAt
            }
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error retrieving transaction status {TransactionId}", id);
        return StatusCode(500, new { success = false, error = "Failed to retrieve status" });
    }
}
    }
}