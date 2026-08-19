// ============================================
// FILE: Services/UserDashboard/NotificationService.cs
// PURPOSE: User notification operations
// ============================================

using Microsoft.EntityFrameworkCore;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs.UserDashboard;

namespace FinTech.Services.UserDashboard
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetUserNotificationsAsync(Guid userId);
        Task<NotificationDto?> MarkReadAsync(Guid notificationId, Guid userId);
        Task<int> MarkAllReadAsync(Guid userId);
        Task<int> GetUnreadCountAsync(Guid userId);
    }

    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(AppDbContext context, ILogger<NotificationService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<NotificationDto>> GetUserNotificationsAsync(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return notifications.Select(MapToDto).ToList();
        }

        public async Task<NotificationDto?> MarkReadAsync(Guid notificationId, Guid userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

            if (notification == null)
                return null;

            if (!notification.IsRead)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
            }

            return MapToDto(notification);
        }

        public async Task<int> MarkAllReadAsync(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in notifications)
                notification.IsRead = true;

            if (notifications.Count > 0)
                await _context.SaveChangesAsync();

            _logger.LogInformation("Marked {Count} notifications read for user {UserId}", notifications.Count, userId);

            return notifications.Count;
        }

        public async Task<int> GetUnreadCountAsync(Guid userId)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        private static NotificationDto MapToDto(Notification notification)
        {
            return new NotificationDto
            {
                Id = notification.Id,
                Title = notification.Title,
                Body = notification.Body,
                Type = notification.Type.ToString(),
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };
        }
    }
}