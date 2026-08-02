// ============================================
// FILE: Models/MoneyRequest.cs
// PURPOSE: Represents a request for payment from one user to another
// ============================================

using System;
using FinTech.Models.Enums;

namespace FinTech.Models
{
    public class MoneyRequest
    {
        public Guid Id { get; set; }

        public Guid RequesterId { get; set; }        // Who is asking to be paid
        public Guid RequesterWalletId { get; set; }   // Where the money should land once paid

        public Guid PayerId { get; set; }             // Who is being asked to pay

        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string? Description { get; set; }

        public MoneyRequestStatus Status { get; set; } = MoneyRequestStatus.Pending;

        public Guid? TransactionId { get; set; }      // Set once paid - links to the actual transfer

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RespondedAt { get; set; }
        public DateTime ExpiresAt { get; set; }

        // Navigation
        public virtual User Requester { get; set; } = null!;
        public virtual User Payer { get; set; } = null!;
        public virtual Wallet RequesterWallet { get; set; } = null!;
        public virtual Transaction? Transaction { get; set; }
    }
}
