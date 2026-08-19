// ============================================
// FILE: Models/SupportTicket.cs
// PURPOSE: Support ticket entity
// ============================================

using System;
using System.Collections.Generic;
using FinTech.Models.Enums;

namespace FinTech.Models
{
    public class SupportTicket
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public SupportTicketStatus Status { get; set; } = SupportTicketStatus.Open;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual User User { get; set; } = null!;
        public virtual ICollection<SupportMessage> Messages { get; set; } = new List<SupportMessage>();
    }
}