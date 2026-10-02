using System;
using System.ComponentModel.DataAnnotations;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class CreateBillRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [MaxLength(40)]
        public string Category { get; set; } = null!;

        [Required]
        [Range(0.01, 1000000, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [MaxLength(60)]
        public string? Reference { get; set; }
    }

    public class PayBillRequest
    {
        [Required]
        public Guid WalletId { get; set; }

        public Guid? IdempotencyKey { get; set; }
    }

    public class QuickPayBillRequest
    {
        [Required]
        [MaxLength(40)]
        public string Category { get; set; } = null!;

        [MaxLength(100)]
        public string? Name { get; set; }

        [Required]
        [Range(0.01, 1000000, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [MaxLength(60)]
        public string? Reference { get; set; }

        [Required]
        public Guid WalletId { get; set; }

        public Guid? IdempotencyKey { get; set; }
    }

    public class BillDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public decimal Amount { get; set; }
        public string? Reference { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = "upcoming";
        public DateTime? PaidAt { get; set; }
        public Guid? PaidWalletId { get; set; }
        public Guid? TransactionId { get; set; }
    }
}
