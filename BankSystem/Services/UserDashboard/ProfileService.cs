using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs.UserDashboard;
using Microsoft.EntityFrameworkCore;

namespace FinTech.Services.UserDashboard
{
    public interface IProfileService
    {
        Task<ProfileDto?> GetProfileAsync(Guid userId);
        Task<ProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
        Task<UserSettingsDto> GetSettingsAsync(Guid userId);
        Task<UserSettingsDto> UpdateSettingsAsync(Guid userId, UpdateSettingsRequest request);
    }

    public class ProfileService : IProfileService
    {
        private static readonly string[] AllowedLanguages = { "en", "es", "fr", "de" };
        private static readonly string[] AllowedCurrencies = { "USD", "EUR", "GBP", "NGN" };

        private readonly AppDbContext _context;
        private readonly ILogger<ProfileService> _logger;

        public ProfileService(AppDbContext context, ILogger<ProfileService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ProfileDto?> GetProfileAsync(Guid userId)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
            return user == null ? null : MapProfile(user);
        }

        public async Task<ProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new InvalidOperationException("User not found");

            if (request.DateOfBirth.HasValue && request.DateOfBirth.Value.Date >= DateTime.UtcNow.Date)
                throw new InvalidOperationException("Date of birth must be in the past");

            user.FirstName = request.FirstName.Trim();
            user.LastName = request.LastName.Trim();
            user.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();
            user.Address = string.IsNullOrWhiteSpace(request.Address) ? null : request.Address.Trim();
            user.DateOfBirth = request.DateOfBirth?.Date;
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Profile updated for user {UserId}", userId);
            return MapProfile(user);
        }

        public async Task<UserSettingsDto> GetSettingsAsync(Guid userId)
        {
            var settings = await _context.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings == null)
            {
                settings = new UserSettings { UserId = userId };
                _context.UserSettings.Add(settings);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateException)
                {
                    // Another request created the row concurrently, reload it.
                    _context.Entry(settings).State = EntityState.Detached;
                    settings = await _context.UserSettings
                        .AsNoTracking()
                        .FirstAsync(s => s.UserId == userId);
                }
            }

            return MapSettings(settings);
        }

        public async Task<UserSettingsDto> UpdateSettingsAsync(Guid userId, UpdateSettingsRequest request)
        {
            var settings = await _context.UserSettings
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings == null)
            {
                settings = new UserSettings { UserId = userId };
                _context.UserSettings.Add(settings);
            }

            if (request.EmailNotifications.HasValue) settings.EmailNotifications = request.EmailNotifications.Value;
            if (request.PushNotifications.HasValue) settings.PushNotifications = request.PushNotifications.Value;
            if (request.SmsAlerts.HasValue) settings.SmsAlerts = request.SmsAlerts.Value;
            if (request.TransactionAlerts.HasValue) settings.TransactionAlerts = request.TransactionAlerts.Value;
            if (request.LoginAlerts.HasValue) settings.LoginAlerts = request.LoginAlerts.Value;
            if (request.MarketingEmails.HasValue) settings.MarketingEmails = request.MarketingEmails.Value;
            if (request.CompactView.HasValue) settings.CompactView = request.CompactView.Value;
            if (request.ShowBalance.HasValue) settings.ShowBalance = request.ShowBalance.Value;

            if (!string.IsNullOrWhiteSpace(request.Language))
            {
                var language = request.Language.Trim().ToLowerInvariant();
                if (!AllowedLanguages.Contains(language))
                    throw new InvalidOperationException($"Unsupported language: {language}");
                settings.Language = language;
            }

            if (!string.IsNullOrWhiteSpace(request.Currency))
            {
                var currency = request.Currency.Trim().ToUpperInvariant();
                if (!AllowedCurrencies.Contains(currency))
                    throw new InvalidOperationException($"Unsupported currency: {currency}");
                settings.Currency = currency;
            }

            settings.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapSettings(settings);
        }

        private static ProfileDto MapProfile(User user) => new()
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Phone = user.Phone,
            Address = user.Address,
            DateOfBirth = user.DateOfBirth,
            Role = user.Role.ToString(),
            EmailVerified = user.EmailVerified,
            CreatedAt = user.CreatedAt
        };

        private static UserSettingsDto MapSettings(UserSettings settings) => new()
        {
            EmailNotifications = settings.EmailNotifications,
            PushNotifications = settings.PushNotifications,
            SmsAlerts = settings.SmsAlerts,
            TransactionAlerts = settings.TransactionAlerts,
            LoginAlerts = settings.LoginAlerts,
            MarketingEmails = settings.MarketingEmails,
            Language = settings.Language,
            Currency = settings.Currency,
            CompactView = settings.CompactView,
            ShowBalance = settings.ShowBalance,
            UpdatedAt = settings.UpdatedAt
        };
    }
}
