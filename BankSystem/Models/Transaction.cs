using System;
using FinTech.Models.Enums;

namespace FinTech.Models
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid IdempotencyKey { get; set; }
        public Guid? FromWalletId { get; set; }
        public Guid? ToWalletId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public TransactionType Type { get; set; }
        public TransactionStatus Status { get; set; } = TransactionStatus.Pending;
        public string? Description { get; set; }
        public string? Metadata { get; set; } // JSON stored as string
        public string? ReferenceId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        // Navigation properties
        public virtual Wallet? FromWallet { get; set; }
        public virtual Wallet? ToWallet { get; set; }
    }
}
