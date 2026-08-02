
// ============================================
// FILE: Services/UserDashboard/RecipientLookupService.cs
// PURPOSE: Find a user + their matching-currency wallet by email
// Used by both Send Money and Request Money flows
// ============================================

using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FinTech.Data;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Models.Enums;

namespace FinTech.Services.UserDashboard
{
    public interface IRecipientLookupService
    {
        Task<RecipientLookupDto?> FindByEmailAsync(string email, string currency, Guid excludeUserId);
    }

    public class RecipientLookupService : IRecipientLookupService
    {
        private readonly AppDbContext _context;

        public RecipientLookupService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<RecipientLookupDto?> FindByEmailAsync(string email, string currency, Guid excludeUserId)
        {
            var normalizedEmail = email.Trim().ToLower();

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail &&
                                          u.Status == UserStatus.Active);

            if (user == null)
                return null;

            if (user.Id == excludeUserId)
                return null; // Can't send/request money to/from yourself

            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == user.Id &&
                                         w.CurrencyCode == currency.ToUpper() &&
                                         w.Status == WalletStatus.Active);

            if (wallet == null)
                return null; // User exists but has no active wallet in that currency

            return new RecipientLookupDto
            {
                UserId = user.Id,
                Name = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                WalletId = wallet.Id,
                CurrencyCode = wallet.CurrencyCode
            };
        }
    }
}