
using System;
using System.ComponentModel.DataAnnotations;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class WalletDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class WalletBalanceDto
    {
        public Guid WalletId { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
        public decimal AvailableBalance { get; set; }
        public decimal PendingBalance { get; set; }
        public decimal TotalBalance { get; set; }
    }

    public class CreateWalletRequest
    {
        [Required]
        [StringLength(3, MinimumLength = 3)]
        public string CurrencyCode { get; set; } = string.Empty;
    }
}
