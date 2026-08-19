// ============================================
// FILE: Models/DTOs/UserDashboard/InboxDTOs.cs
// ============================================

using System;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class InboxMessageDto
    {
        public Guid Id { get; set; }
        public string From { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}