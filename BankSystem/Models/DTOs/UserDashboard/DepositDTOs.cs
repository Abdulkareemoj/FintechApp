
// ============================================
// FILE: Models/DTOs/UserDashboard/DepositDTOs.cs
// ============================================

using System;
using System.ComponentModel.DataAnnotations;
using FinTech.Models.Enums;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class InitiateDepositRequest
    {
        [Required]
        public Guid IdempotencyKey { get; set; }

        [Required]
        public Guid WalletId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        public DepositSource Source { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }
    }

    public class DepositDto
    {
        public Guid Id { get; set; }
        public Guid WalletId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // Pending, Completed, Failed
        public string? Source { get; set; }
        public string? ReferenceId { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public class DepositStatusDto
    {
        public Guid Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public class SimulateDepositCallbackRequest
    {
        [Required]
        public bool Success { get; set; }

        public string? FailureReason { get; set; }
    }
}

