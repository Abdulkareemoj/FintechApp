using System;

namespace FinTech.Models
{
    public class UserTwoFactor
    {
        public Guid UserId { get; set; }
        public string Secret { get; set; } = null!;
        public bool Enabled { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
    }
}
