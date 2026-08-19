// ============================================
// FILE: Services/UserDashboard/InboxService.cs
// PURPOSE: Inbox message operations
// ============================================

using Microsoft.EntityFrameworkCore;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs.UserDashboard;

namespace FinTech.Services.UserDashboard
{
    public interface IInboxService
    {
        Task<List<InboxMessageDto>> GetUserMessagesAsync(Guid userId);
        Task<InboxMessageDto?> MarkReadAsync(Guid messageId, Guid userId);
        Task<int> MarkAllReadAsync(Guid userId);
        Task<bool> DeleteMessageAsync(Guid messageId, Guid userId);
        Task<int> GetUnreadCountAsync(Guid userId);
    }

    public class InboxService : IInboxService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<InboxService> _logger;

        public InboxService(AppDbContext context, ILogger<InboxService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<InboxMessageDto>> GetUserMessagesAsync(Guid userId)
        {
            var messages = await _context.InboxMessages
                .Where(m => m.UserId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return messages.Select(MapToDto).ToList();
        }

        public async Task<InboxMessageDto?> MarkReadAsync(Guid messageId, Guid userId)
        {
            var message = await _context.InboxMessages
                .FirstOrDefaultAsync(m => m.Id == messageId && m.UserId == userId);

            if (message == null)
                return null;

            if (!message.IsRead)
            {
                message.IsRead = true;
                await _context.SaveChangesAsync();
            }

            return MapToDto(message);
        }

        public async Task<int> MarkAllReadAsync(Guid userId)
        {
            var messages = await _context.InboxMessages
                .Where(m => m.UserId == userId && !m.IsRead)
                .ToListAsync();

            foreach (var message in messages)
                message.IsRead = true;

            if (messages.Count > 0)
                await _context.SaveChangesAsync();

            return messages.Count;
        }

        public async Task<bool> DeleteMessageAsync(Guid messageId, Guid userId)
        {
            var message = await _context.InboxMessages
                .FirstOrDefaultAsync(m => m.Id == messageId && m.UserId == userId);

            if (message == null)
                return false;

            _context.InboxMessages.Remove(message);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Inbox message {MessageId} deleted by user {UserId}", messageId, userId);

            return true;
        }

        public async Task<int> GetUnreadCountAsync(Guid userId)
        {
            return await _context.InboxMessages
                .CountAsync(m => m.UserId == userId && !m.IsRead);
        }

        private static InboxMessageDto MapToDto(InboxMessage message)
        {
            return new InboxMessageDto
            {
                Id = message.Id,
                From = message.From,
                Subject = message.Subject,
                Body = message.Body,
                Type = message.Type.ToString(),
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt
            };
        }
    }
}