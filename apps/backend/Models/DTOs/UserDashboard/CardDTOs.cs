
using System;
using System.ComponentModel.DataAnnotations;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class CardDto
    {
        public Guid Id { get; set; }
        public Guid WalletId { get; set; }
        public string CardType { get; set; } = string.Empty;
        public string LastFourDigits { get; set; } = string.Empty;
        public string CardHolderName { get; set; } = string.Empty;
        public string ExpiryMonth { get; set; } = string.Empty;
        public string ExpiryYear { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal SpendingLimit { get; set; }
        public decimal DailyLimit { get; set; }
        public decimal MonthlyLimit { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateCardRequest
    {
        [Required]
        public Guid WalletId { get; set; }

        [Required]
        [StringLength(100)]
        public string CardHolderName { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal? SpendingLimit { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? DailyLimit { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? MonthlyLimit { get; set; }
    }

    public class UpdateCardLimitsRequest
    {
        [Range(0, double.MaxValue)]
        public decimal? DailyLimit { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? MonthlyLimit { get; set; }

        [Range(0, double.MaxValue)]
        public decimal? SpendingLimit { get; set; }
    }

    public class CardSpendingDto
    {
        public Guid CardId { get; set; }
        public decimal DailySpent { get; set; }
        public decimal DailyLimit { get; set; }
        public decimal MonthlySpent { get; set; }
        public decimal MonthlyLimit { get; set; }
        public decimal TotalLimit { get; set; }
    }
}