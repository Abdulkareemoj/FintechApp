

// ============================================
// FILE: Controllers/UserDashboard/CardsController.cs
// PURPOSE: User card endpoints
// ============================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Models.Enums;
using FinTech.Services.UserDashboard;
using System.Security.Claims;

namespace FinTech.Controllers.UserDashboard
{
    [Authorize(Roles = "User")]
    [ApiController]
    [Route("api/user/[controller]")]
    public class CardsController : ControllerBase
    {
        private readonly ICardService _cardService;
        private readonly ILogger<CardsController> _logger;

        public CardsController(
            ICardService cardService,
            ILogger<CardsController> logger)
        {
            _cardService = cardService;
            _logger = logger;
        }

        /// <summary>
        /// Get all cards for the current user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMyCards()
        {
            try
            {
                var userId = GetCurrentUserId();
                var cards = await _cardService.GetUserCardsAsync(userId);

                return Ok(new { success = true, data = cards });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cards for user");
                return StatusCode(500, new { success = false, error = "Failed to retrieve cards" });
            }
        }

        /// <summary>
        /// Get specific card by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCard(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var card = await _cardService.GetCardByIdAsync(id, userId);

                if (card == null)
                    return NotFound(new { success = false, error = "Card not found" });

                return Ok(new { success = true, data = card });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving card {CardId}", id);
                return StatusCode(500, new { success = false, error = "Failed to retrieve card" });
            }
        }

        /// <summary>
        /// Create a new virtual card
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateCard([FromBody] CreateCardRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var card = await _cardService.CreateVirtualCardAsync(userId, request);

                return CreatedAtAction(
                    nameof(GetCard),
                    new { id = card.Id },
                    new { success = true, data = card, message = "Card created successfully" }
                );
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
                _logger.LogError(ex, "Error creating card for user");
                return StatusCode(500, new { success = false, error = "Failed to create card" });
            }
        }

        /// <summary>
        /// Freeze a card
        /// </summary>
        [HttpPut("{id}/freeze")]
        public async Task<IActionResult> FreezeCard(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var card = await _cardService.UpdateCardStatusAsync(id, userId, CardStatus.Frozen);

                return Ok(new { success = true, data = card, message = "Card frozen successfully" });
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
                _logger.LogError(ex, "Error freezing card {CardId}", id);
                return StatusCode(500, new { success = false, error = "Failed to freeze card" });
            }
        }

        /// <summary>
        /// Unfreeze a card
        /// </summary>
        [HttpPut("{id}/unfreeze")]
        public async Task<IActionResult> UnfreezeCard(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var card = await _cardService.UpdateCardStatusAsync(id, userId, CardStatus.Active);

                return Ok(new { success = true, data = card, message = "Card unfrozen successfully" });
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
                _logger.LogError(ex, "Error unfreezing card {CardId}", id);
                return StatusCode(500, new { success = false, error = "Failed to unfreeze card" });
            }
        }

        /// <summary>
        /// Update card spending limits
        /// </summary>
        [HttpPut("{id}/limits")]
        public async Task<IActionResult> UpdateCardLimits(Guid id, [FromBody] UpdateCardLimitsRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var card = await _cardService.UpdateCardLimitsAsync(id, userId, request);

                return Ok(new { success = true, data = card, message = "Limits updated successfully" });
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
                _logger.LogError(ex, "Error updating card limits {CardId}", id);
                return StatusCode(500, new { success = false, error = "Failed to update limits" });
            }
        }

        /// <summary>
        /// Get card spending information
        /// </summary>
        [HttpGet("{id}/spending")]
        public async Task<IActionResult> GetCardSpending(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var spending = await _cardService.GetCardSpendingAsync(id, userId);

                return Ok(new { success = true, data = spending });
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
                _logger.LogError(ex, "Error retrieving card spending {CardId}", id);
                return StatusCode(500, new { success = false, error = "Failed to retrieve spending" });
            }
        }

        /// <summary>
        /// Delete/Cancel a card
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCard(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _cardService.DeleteCardAsync(id, userId);

                if (!result)
                    return NotFound(new { success = false, error = "Card not found" });

                return Ok(new { success = true, message = "Card cancelled successfully" });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting card {CardId}", id);
                return StatusCode(500, new { success = false, error = "Failed to cancel card" });
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