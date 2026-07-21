
using System;
using FinTech.Models.Enums;

namespace FinTech.Models
{
    public class Card
    {
        public Guid Id { get; set; }
        public Guid WalletId { get; set; }
        public string CardType { get; set; } = "Virtual"; // Virtual, Physical
        public string CardNumber { get; set; } = string.Empty; // Encrypted
        public string LastFourDigits { get; set; } = string.Empty;
        public string CardHolderName { get; set; } = string.Empty;
        public string ExpiryMonth { get; set; } = string.Empty;
        public string ExpiryYear { get; set; } = string.Empty;
        public string CVV { get; set; } = string.Empty; // Encrypted, never returned in API
        public CardStatus Status { get; set; } = CardStatus.Active;
        public decimal SpendingLimit { get; set; }
        public decimal DailyLimit { get; set; }
        public decimal MonthlyLimit { get; set; }
        public string? Metadata { get; set; } // JSON for additional info
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual Wallet Wallet { get; set; } = null!;
    }
}
