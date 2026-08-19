// ============================================
// FILE: Models/DTOs/UserDashboard/SupportDTOs.cs
// ============================================

using System;
using System.ComponentModel.DataAnnotations;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class CreateSupportTicketRequest
    {
        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [MaxLength(4000)]
        public string Description { get; set; } = string.Empty;
    }

    public class SupportTicketDto
    {
        public Guid Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? LastMessage { get; set; }
        public DateTime? LastMessageAt { get; set; }
        public int MessageCount { get; set; }
    }

    public class SupportMessageDto
    {
        public Guid Id { get; set; }
        public Guid TicketId { get; set; }
        public bool IsFromUser { get; set; }
        public string Body { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class SendSupportMessageRequest
    {
        [Required]
        [MaxLength(4000)]
        public string Body { get; set; } = string.Empty;
    }
}