
using System;
using System.ComponentModel.DataAnnotations;
using FinTech.Models.Enums;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class CreateTransferRequest
    {
        [Required]
        public Guid IdempotencyKey { get; set; }

        [Required]
        public Guid FromWalletId { get; set; }

        [Required]
        public Guid ToWalletId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }
    }

    public class TransactionDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Direction { get; set; } = string.Empty; // "incoming" or "outgoing"
        public DateTime CreatedAt { get; set; }
    }

    public class TransactionDetailDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Direction { get; set; } = string.Empty;
        public WalletSummaryDto? FromWallet { get; set; }
        public WalletSummaryDto? ToWallet { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? ReferenceId { get; set; }
    }

    public class WalletSummaryDto
    {
        public Guid Id { get; set; }
        public string CurrencyCode { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public bool IsCurrentUser { get; set; }
    }

    public class TransactionQueryParams
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public TransactionType? Type { get; set; }
        public TransactionStatus? Status { get; set; }
        public string? Search { get; set; }
    }

    public class PaginatedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    public class RecentRecipientDto
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime LastTransactionDate { get; set; }
    }
}
