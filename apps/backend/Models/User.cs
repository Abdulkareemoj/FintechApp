using System;
using System.Collections.Generic;
using FinTech.Models.Enums;

namespace FinTech.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public UserRole Role { get; set; } = UserRole.User;
        public UserStatus Status { get; set; } = UserStatus.Active;
        public bool EmailVerified { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<Wallet> Wallets { get; set; } = new List<Wallet>();
    }
}
