// ============================================
// FILE: Models/Notification.cs
// PURPOSE: User notification entity
// ============================================

using System;
using FinTech.Models.Enums;

namespace FinTech.Models
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public NotificationType Type { get; set; } = NotificationType.System;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual User User { get; set; } = null!;
    }
}