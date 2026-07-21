

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Models.Enums;

namespace FinTech.Services.UserDashboard
{
    public interface IWalletService
    {
        Task<List<WalletDto>> GetUserWalletsAsync(Guid userId);
        Task<WalletDto?> GetWalletByIdAsync(Guid walletId, Guid userId);
        Task<WalletBalanceDto> GetWalletBalanceAsync(Guid walletId, Guid userId);
        Task<WalletDto> CreateWalletAsync(Guid userId, string currencyCode);
    }

    public class WalletService : IWalletService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<WalletService> _logger;

        public WalletService(
            AppDbContext context,
            IMemoryCache cache,
            ILogger<WalletService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        public async Task<List<WalletDto>> GetUserWalletsAsync(Guid userId)
        {
            var wallets = await _context.Wallets
                .Where(w => w.UserId == userId && w.Status == WalletStatus.Active)
                .OrderBy(w => w.CreatedAt)
                .ToListAsync();

            var walletDtos = new List<WalletDto>();

            foreach (var wallet in wallets)
            {
                var balance = await GetWalletBalanceAsync(wallet.Id, userId);
                
                walletDtos.Add(new WalletDto
                {
                    Id = wallet.Id,
                    UserId = wallet.UserId,
                    CurrencyCode = wallet.CurrencyCode,
                    Balance = balance.AvailableBalance,
                    Status = wallet.Status.ToString(),
                    CreatedAt = wallet.CreatedAt
                });
            }

            return walletDtos;
        }

        public async Task<WalletDto?> GetWalletByIdAsync(Guid walletId, Guid userId)
        {
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == walletId && w.UserId == userId);

            if (wallet == null)
                return null;

            var balance = await GetWalletBalanceAsync(walletId, userId);

            return new WalletDto
            {
                Id = wallet.Id,
                UserId = wallet.UserId,
                CurrencyCode = wallet.CurrencyCode,
                Balance = balance.AvailableBalance,
                Status = wallet.Status.ToString(),
                CreatedAt = wallet.CreatedAt
            };
        }

        public async Task<WalletBalanceDto> GetWalletBalanceAsync(Guid walletId, Guid userId)
        {
            // Check cache first
            var cacheKey = $"balance_{walletId}";
            if (_cache.TryGetValue(cacheKey, out WalletBalanceDto? cachedBalance))
            {
                return cachedBalance!;
            }

            // Verify wallet belongs to user
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == walletId && w.UserId == userId);

            if (wallet == null)
                throw new UnauthorizedAccessException("Wallet not found or access denied");

            // Calculate balance from transactions (ALWAYS ACCURATE)
            var credits = await _context.Transactions
                .Where(t => t.ToWalletId == walletId && 
                           t.Status == TransactionStatus.Completed)
                .SumAsync(t => t.Amount);

            var debits = await _context.Transactions
                .Where(t => t.FromWalletId == walletId && 
                           t.Status == TransactionStatus.Completed)
                .SumAsync(t => t.Amount);

            var pendingCredits = await _context.Transactions
                .Where(t => t.ToWalletId == walletId && 
                           t.Status == TransactionStatus.Pending)
                .SumAsync(t => t.Amount);

            var balance = new WalletBalanceDto
            {
                WalletId = walletId,
                CurrencyCode = wallet.CurrencyCode,
                AvailableBalance = credits - debits,
                PendingBalance = pendingCredits,
                TotalBalance = credits - debits + pendingCredits
            };

            // Cache for 30 seconds
            _cache.Set(cacheKey, balance, TimeSpan.FromSeconds(30));

            return balance;
        }

        public async Task<WalletDto> CreateWalletAsync(Guid userId, string currencyCode)
        {
            // Check if user already has wallet in this currency
            var existingWallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == userId && 
                                         w.CurrencyCode == currencyCode);

            if (existingWallet != null)
                throw new InvalidOperationException($"Wallet already exists for {currencyCode}");

            var wallet = new Wallet
            {
                UserId = userId,
                CurrencyCode = currencyCode.ToUpper(),
                Status = WalletStatus.Active
            };

            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Wallet created: {WalletId} for user {UserId} in {Currency}",
                wallet.Id, userId, currencyCode);

            return new WalletDto
            {
                Id = wallet.Id,
                UserId = wallet.UserId,
                CurrencyCode = wallet.CurrencyCode,
                Balance = 0,
                Status = wallet.Status.ToString(),
                CreatedAt = wallet.CreatedAt
            };
        }
    }
}
