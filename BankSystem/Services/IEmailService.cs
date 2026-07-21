
// ============================================
// FILE: Services/IEmailService.cs
// PURPOSE: Email sending interface (implement with SendGrid/SMTP later)
// ============================================

namespace FinTech.Services
{
    public interface IEmailService
    {
        Task SendEmailVerificationAsync(string email, string name, string token);
        Task SendPasswordResetAsync(string email, string name, string token);
        Task SendPasswordChangedNotificationAsync(string email, string name);
    }

    public class EmailService : IEmailService
    {
        private readonly ILogger<EmailService> _logger;
        private readonly IConfiguration _configuration;

        public EmailService(ILogger<EmailService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public async Task SendEmailVerificationAsync(string email, string name, string token)
        {
            // TODO: Implement with SendGrid, AWS SES, or SMTP
            var verificationLink = $"{_configuration["App:FrontendUrl"]}/verify-email?token={token}";
            
            _logger.LogInformation("Sending email verification to {Email}: {Link}", email, verificationLink);
            
            // Placeholder - replace with actual email sending
            await Task.CompletedTask;
        }

        public async Task SendPasswordResetAsync(string email, string name, string token)
        {
            // TODO: Implement with SendGrid, AWS SES, or SMTP
            var resetLink = $"{_configuration["App:FrontendUrl"]}/reset-password?token={token}";
            
            _logger.LogInformation("Sending password reset to {Email}: {Link}", email, resetLink);
            
            // Placeholder - replace with actual email sending
            await Task.CompletedTask;
        }

        public async Task SendPasswordChangedNotificationAsync(string email, string name)
        {
            // TODO: Implement notification
            _logger.LogInformation("Sending password changed notification to {Email}", email);
            await Task.CompletedTask;
        }
    }
}