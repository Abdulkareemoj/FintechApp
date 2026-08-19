// ============================================
// FILE: Models/DTOs/UserDashboard/NotificationDTOs.cs
// ============================================

using System;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class NotificationDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}