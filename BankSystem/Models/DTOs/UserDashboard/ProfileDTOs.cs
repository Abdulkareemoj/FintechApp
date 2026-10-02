using System;
using System.ComponentModel.DataAnnotations;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class ProfileDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Role { get; set; } = string.Empty;
        public bool EmailVerified { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UpdateProfileRequest
    {
        [Required]
        [MinLength(2)]
        [MaxLength(60)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        [MaxLength(60)]
        public string LastName { get; set; } = string.Empty;

        [Phone]
        [MaxLength(30)]
        public string? Phone { get; set; }

        [MaxLength(200)]
        public string? Address { get; set; }

        public DateTime? DateOfBirth { get; set; }
    }

    public class UserSettingsDto
    {
        public bool EmailNotifications { get; set; }
        public bool PushNotifications { get; set; }
        public bool SmsAlerts { get; set; }
        public bool TransactionAlerts { get; set; }
        public bool LoginAlerts { get; set; }
        public bool MarketingEmails { get; set; }
        public string Language { get; set; } = "en";
        public string Currency { get; set; } = "USD";
        public bool CompactView { get; set; }
        public bool ShowBalance { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class UpdateSettingsRequest
    {
        public bool? EmailNotifications { get; set; }
        public bool? PushNotifications { get; set; }
        public bool? SmsAlerts { get; set; }
        public bool? TransactionAlerts { get; set; }
        public bool? LoginAlerts { get; set; }
        public bool? MarketingEmails { get; set; }

        [MaxLength(10)]
        public string? Language { get; set; }

        [MaxLength(3)]
        public string? Currency { get; set; }

        public bool? CompactView { get; set; }
        public bool? ShowBalance { get; set; }
    }
}
