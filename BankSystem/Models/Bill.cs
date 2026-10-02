using System;

namespace FinTech.Models
{
    public class Bill
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; } = null!;
        public string Category { get; set; } = "Other";
        public decimal Amount { get; set; }
        public string? Reference { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }
        public Guid? PaidWalletId { get; set; }
        public Guid? TransactionId { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
}
