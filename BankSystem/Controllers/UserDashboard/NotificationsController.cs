// ============================================
// FILE: Controllers/UserDashboard/NotificationsController.cs
// PURPOSE: User notification endpoints
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
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly ILogger<NotificationsController> _logger;

        public NotificationsController(
            INotificationService notificationService,
            ILogger<NotificationsController> logger)
        {
            _notificationService = notificationService;
            _logger = logger;
        }

        /// <summary>
        /// Get all notifications for the current user
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            try
            {
                var userId = GetCurrentUserId();
                var notifications = await _notificationService.GetUserNotificationsAsync(userId);

                return Ok(new { success = true, data = notifications });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notifications for user");
                return StatusCode(500, new { success = false, error = "Failed to retrieve notifications" });
            }
        }

        /// <summary>
        /// Mark a single notification as read
        /// </summary>
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkRead(Guid id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var notification = await _notificationService.MarkReadAsync(id, userId);

                if (notification == null)
                    return NotFound(new { success = false, error = "Notification not found" });

                return Ok(new { success = true, data = notification });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification {NotificationId} as read", id);
                return StatusCode(500, new { success = false, error = "Failed to update notification" });
            }
        }

        /// <summary>
        /// Mark all notifications as read
        /// </summary>
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllRead()
        {
            try
            {
                var userId = GetCurrentUserId();
                var count = await _notificationService.MarkAllReadAsync(userId);

                return Ok(new { success = true, data = new { marked = count } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking all notifications as read");
                return StatusCode(500, new { success = false, error = "Failed to update notifications" });
            }
        }

        /// <summary>
        /// Get unread notification count for the current user
        /// </summary>
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            try
            {
                var userId = GetCurrentUserId();
                var count = await _notificationService.GetUnreadCountAsync(userId);

                return Ok(new { success = true, data = new { count } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving unread notification count");
                return StatusCode(500, new { success = false, error = "Failed to retrieve unread count" });
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