// ============================================
// FILE: Controllers/UserDashboard/InboxController.cs
// PURPOSE: User inbox message endpoints
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
    public class InboxController : ControllerBase
    {
        private readonly IInboxService _inboxService;
        private readonly ILogger<InboxController> _logger;

        public InboxController(
            IInboxService inboxService,
            ILogger<InboxController> logger)
        {
            _inboxService = inboxService;
            _logger = logger;
        }

        /// <summary>
        /// Get all inbox messages for the current user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            try
            {
                var userId = GetCurrentUserId();
                var messages = await _inboxService.GetUserMessagesAsync(userId);

                return Ok(new { success = true, data = messages });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving inbox messages for user");
                return StatusCode(500, new { success = false, error = "Failed to retrieve messages" });
            }
        }

        /// <summary>
        /// Mark a single message as read
        /// </summary>
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkRead(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var message = await _inboxService.MarkReadAsync(id, userId);

                if (message == null)
                    return NotFound(new { success = false, error = "Message not found" });

                return Ok(new { success = true, data = message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking inbox message {MessageId} as read", id);
                return StatusCode(500, new { success = false, error = "Failed to update message" });
            }
        }

        /// <summary>
        /// Mark all messages as read
        /// </summary>
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllRead()
        {
            try
            {
                var userId = GetCurrentUserId();
                var count = await _inboxService.MarkAllReadAsync(userId);

                return Ok(new { success = true, data = new { marked = count } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all inbox messages as read");
                return StatusCode(500, new { success = false, error = "Failed to update messages" });
            }
        }

        /// <summary>
        /// Get unread message count for the current user
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            try
            {
                var userId = GetCurrentUserId();
                var count = await _inboxService.GetUnreadCountAsync(userId);

                return Ok(new { success = true, data = new { count } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving unread inbox count");
                return StatusCode(500, new { success = false, error = "Failed to retrieve unread count" });
            }
        }

        /// <summary>
        /// Delete a message
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var deleted = await _inboxService.DeleteMessageAsync(id, userId);

                if (!deleted)
                    return NotFound(new { success = false, error = "Message not found" });

                return Ok(new { success = true, message = "Message deleted" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting inbox message {MessageId}", id);
                return StatusCode(500, new { success = false, error = "Failed to delete message" });
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