// ============================================
// FILE: Models/InboxMessage.cs
// PURPOSE: Inbox message entity
// ============================================

using System;
using FinTech.Models.Enums;

namespace FinTech.Models
{
    public class InboxMessage
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string From { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public InboxMessageType Type { get; set; } = InboxMessageType.System;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual User User { get; set; } = null!;
    }
}