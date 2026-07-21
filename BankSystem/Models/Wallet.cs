using System;
using System.Collections.Generic;
using FinTech.Models.Enums;

namespace FinTech.Models
{
    public class Wallet
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string CurrencyCode { get; set; } = "USD";
        public WalletStatus Status { get; set; } = WalletStatus.Active;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Transaction> TransactionsFrom { get; set; } = new List<Transaction>();
        public virtual ICollection<Transaction> TransactionsTo { get; set; } = new List<Transaction>();
    }
}
