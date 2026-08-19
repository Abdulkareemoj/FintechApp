// ============================================
// FILE: Services/UserDashboard/SupportService.cs
// PURPOSE: Support ticket operations
// ============================================

using Microsoft.EntityFrameworkCore;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs.UserDashboard;

namespace FinTech.Services.UserDashboard
{
    public interface ISupportService
    {
        Task<List<SupportTicketDto>> GetUserTicketsAsync(Guid userId);
        Task<SupportTicketDto> CreateTicketAsync(Guid userId, CreateSupportTicketRequest request);
        Task<List<SupportMessageDto>> GetTicketMessagesAsync(Guid userId, Guid ticketId);
        Task<SupportMessageDto> SendMessageAsync(Guid userId, Guid ticketId, string body);
    }

    public class SupportService : ISupportService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SupportService> _logger;

        public SupportService(AppDbContext context, ILogger<SupportService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<SupportTicketDto>> GetUserTicketsAsync(Guid userId)
        {
            var tickets = await _context.SupportTickets
                .AsNoTracking()
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.UpdatedAt)
                .Select(t => new SupportTicketDto
                {
                    Id = t.Id,
                    Category = t.Category,
                    Subject = t.Subject,
                    Description = t.Description,
                    Status = t.Status.ToString(),
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    LastMessage = t.Messages
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => m.Body)
                        .FirstOrDefault(),
                    LastMessageAt = t.Messages
                        .OrderByDescending(m => m.CreatedAt)
                        .Select(m => m.CreatedAt)
                        .FirstOrDefault(),
                    MessageCount = t.Messages.Count()
                })
                .ToListAsync();

            return tickets;
        }

        public async Task<SupportTicketDto> CreateTicketAsync(Guid userId, CreateSupportTicketRequest request)
        {
            var ticket = new SupportTicket
            {
                UserId = userId,
                Category = request.Category,
                Subject = request.Subject,
                Description = request.Description,
                Status = Models.Enums.SupportTicketStatus.Open
            };

            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();

            // Seed the description as the opening message of the thread.
            _context.SupportMessages.Add(new SupportMessage
            {
                TicketId = ticket.Id,
                SenderId = userId,
                IsFromUser = true,
                Body = request.Description
            });
            await _context.SaveChangesAsync();

            _logger.LogInformation("Support ticket {TicketId} created for user {UserId}", ticket.Id, userId);

            var dto = await GetUserTicketsAsync(userId);
            return dto.First(t => t.Id == ticket.Id);
        }

        public async Task<List<SupportMessageDto>> GetTicketMessagesAsync(Guid userId, Guid ticketId)
        {
            var ticket = await _context.SupportTickets
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == ticketId && t.UserId == userId)
                ?? throw new KeyNotFoundException("Ticket not found");

            var messages = await _context.SupportMessages
                .AsNoTracking()
                .Where(m => m.TicketId == ticket.Id)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            return messages.Select(MapMessageToDto).ToList();
        }

        public async Task<SupportMessageDto> SendMessageAsync(Guid userId, Guid ticketId, string body)
        {
            var ticket = await _context.SupportTickets
                .FirstOrDefaultAsync(t => t.Id == ticketId && t.UserId == userId)
                ?? throw new KeyNotFoundException("Ticket not found");

            var message = new SupportMessage
            {
                TicketId = ticket.Id,
                SenderId = userId,
                IsFromUser = true,
                Body = body
            };

            _context.SupportMessages.Add(message);

            ticket.UpdatedAt = DateTime.UtcNow;
            if (ticket.Status == Models.Enums.SupportTicketStatus.Resolved)
                ticket.Status = Models.Enums.SupportTicketStatus.Open;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Support message {MessageId} added to ticket {TicketId}", message.Id, ticket.Id);

            return MapMessageToDto(message);
        }

        private static SupportMessageDto MapMessageToDto(SupportMessage message)
        {
            return new SupportMessageDto
            {
                Id = message.Id,
                TicketId = message.TicketId,
                IsFromUser = message.IsFromUser,
                Body = message.Body,
                CreatedAt = message.CreatedAt
            };
        }
    }
}