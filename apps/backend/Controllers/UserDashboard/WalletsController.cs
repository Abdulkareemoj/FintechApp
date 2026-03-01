
// ============================================
// FILE: Controllers/UserDashboard/WalletsController.cs
// PURPOSE: User wallet endpoints
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
    public class WalletsController : ControllerBase
    {
        private readonly IWalletService _walletService;
        private readonly ILogger<WalletsController> _logger;

        public WalletsController(
            IWalletService walletService,
            ILogger<WalletsController> logger)
        {
            _walletService = walletService;
            _logger = logger;
        }

        /// <summary>
        /// Get all wallets for the current user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMyWallets()
        {
            try
            {
                var userId = GetCurrentUserId();
                var wallets = await _walletService.GetUserWalletsAsync(userId);
                
                return Ok(new { success = true, data = wallets });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving wallets for user");
                return StatusCode(500, new { success = false, error = "Failed to retrieve wallets" });
            }
        }

        /// <summary>
        /// Get specific wallet by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetWallet(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var wallet = await _walletService.GetWalletByIdAsync(id, userId);

                if (wallet == null)
                    return NotFound(new { success = false, error = "Wallet not found" });

                return Ok(new { success = true, data = wallet });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving wallet {WalletId}", id);
                return StatusCode(500, new { success = false, error = "Failed to retrieve wallet" });
            }
        }

        /// <summary>
        /// Get wallet balance
        /// </summary>
        [HttpGet("{id}/balance")]
        public async Task<IActionResult> GetWalletBalance(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var balance = await _walletService.GetWalletBalanceAsync(id, userId);

                return Ok(new { success = true, data = balance });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving balance for wallet {WalletId}", id);
                return StatusCode(500, new { success = false, error = "Failed to retrieve balance" });
            }
        }

        /// <summary>
        /// Create a new wallet in different currency
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateWallet([FromBody] CreateWalletRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var wallet = await _walletService.CreateWalletAsync(userId, request.CurrencyCode);

                return CreatedAtAction(
                    nameof(GetWallet),
                    new { id = wallet.Id },
                    new { success = true, data = wallet }
                );
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating wallet for user");
                return StatusCode(500, new { success = false, error = "Failed to create wallet" });
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