using System;

namespace FinTech.Models
{
    public class UserSettings
    {
        public Guid UserId { get; set; }
        public bool EmailNotifications { get; set; } = true;
        public bool PushNotifications { get; set; } = true;
        public bool SmsAlerts { get; set; } = false;
        public bool TransactionAlerts { get; set; } = true;
        public bool LoginAlerts { get; set; } = true;
        public bool MarketingEmails { get; set; } = false;
        public string Language { get; set; } = "en";
        public string Currency { get; set; } = "USD";
        public bool CompactView { get; set; } = false;
        public bool ShowBalance { get; set; } = true;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual User User { get; set; } = null!;
    }
}
