// ============================================
// FILE: Models/SupportMessage.cs
// PURPOSE: Support ticket thread message entity
// ============================================

using System;

namespace FinTech.Models
{
    public class SupportMessage
    {
        public Guid Id { get; set; }
        public Guid TicketId { get; set; }
        public Guid? SenderId { get; set; }
        public bool IsFromUser { get; set; } = true;
        public string Body { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual SupportTicket Ticket { get; set; } = null!;
        public virtual User? Sender { get; set; }
    }
}