
// ============================================
// FILE: Models/DTOs/UserDashboard/MoneyRequestDTOs.cs
// ============================================

using System;
using System.ComponentModel.DataAnnotations;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class CreateMoneyRequestRequest
    {
        [Required]
        public Guid RequesterWalletId { get; set; }

        [Required]
        [EmailAddress]
        public string PayerEmail { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }
    }

    public class AcceptMoneyRequestRequest
    {
        [Required]
        public Guid IdempotencyKey { get; set; }

        [Required]
        public Guid FromWalletId { get; set; } // Payer's wallet to pay from
    }

    public class MoneyRequestDto
    {
        public Guid Id { get; set; }
        public Guid RequesterId { get; set; }
        public string RequesterName { get; set; } = string.Empty;
        public Guid PayerId { get; set; }
        public string PayerName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public Guid? TransactionId { get; set; }
    }

    public class RecipientLookupDto
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Guid WalletId { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
    }
}