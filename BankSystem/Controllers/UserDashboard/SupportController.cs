// ============================================
// FILE: Controllers/UserDashboard/SupportController.cs
// PURPOSE: User support ticket endpoints
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
    public class SupportController : ControllerBase
    {
        private readonly ISupportService _supportService;
        private readonly ILogger<SupportController> _logger;

        public SupportController(
            ISupportService supportService,
            ILogger<SupportController> logger)
        {
            _supportService = supportService;
            _logger = logger;
        }

        /// <summary>
        /// Get all support tickets for the current user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMyTickets()
        {
            try
            {
                var userId = GetCurrentUserId();
                var tickets = await _supportService.GetUserTicketsAsync(userId);

                return Ok(new { success = true, data = tickets });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving support tickets for user");
                return StatusCode(500, new { success = false, error = "Failed to retrieve tickets" });
            }
        }

        /// <summary>
        /// Create a new support ticket
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] CreateSupportTicketRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var ticket = await _supportService.CreateTicketAsync(userId, request);

                return Ok(new { success = true, data = ticket, message = "Ticket submitted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating support ticket for user");
                return StatusCode(500, new { success = false, error = "Failed to create ticket" });
            }
        }

        /// <summary>
        /// Get the message thread for a support ticket
        /// </summary>
        [HttpGet("{ticketId}/messages")]
        public async Task<IActionResult> GetTicketMessages(Guid ticketId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var messages = await _supportService.GetTicketMessagesAsync(userId, ticketId);

                return Ok(new { success = true, data = messages });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { success = false, error = "Ticket not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving messages for ticket {TicketId}", ticketId);
                return StatusCode(500, new { success = false, error = "Failed to retrieve messages" });
            }
        }

        /// <summary>
        /// Send a message on a support ticket thread
        /// </summary>
        [HttpPost("{ticketId}/messages")]
        public async Task<IActionResult> SendMessage(Guid ticketId, [FromBody] SendSupportMessageRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Body))
                    return BadRequest(new { success = false, error = "Message body is required" });

                var userId = GetCurrentUserId();
                var message = await _supportService.SendMessageAsync(userId, ticketId, request.Body);

                return Ok(new { success = true, data = message, message = "Message sent" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { success = false, error = "Ticket not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message on ticket {TicketId}", ticketId);
                return StatusCode(500, new { success = false, error = "Failed to send message" });
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