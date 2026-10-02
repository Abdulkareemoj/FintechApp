using FinTech.Data;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Models.Enums;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace FinTech.Services.UserDashboard
{
    public interface IAnalyticsService
    {
        Task<AnalyticsSummaryDto> GetSummaryAsync(Guid userId, string currency, int months);
    }

    // ============================================
    // Aggregates a user's completed transactions into an analytics
    // summary: all-time totals, a monthly trend grid, spending
    // grouped by transaction type, and rolling 7-day spending.
    // Single-currency (query param, default USD) — currencies are
    // never mixed.
    // ============================================
    public class AnalyticsService : IAnalyticsService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AnalyticsService> _logger;

        public AnalyticsService(AppDbContext context, ILogger<AnalyticsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<AnalyticsSummaryDto> GetSummaryAsync(Guid userId, string currency, int months)
        {
            months = Math.Clamp(months, 1, 24);
            currency = string.IsNullOrWhiteSpace(currency) ? "USD" : currency.Trim().ToUpperInvariant();

            var summary = new AnalyticsSummaryDto { Currency = currency };

            var now = DateTime.UtcNow;
            var monthStarts = new List<DateTime>();
            for (var i = months - 1; i >= 0; i--)
                monthStarts.Add(new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc).AddMonths(-i));

            var weekStart = now.Date.AddDays(-6);

            // Monthly + weekly grids are always returned (zeros when no
            // data) so charts render an empty grid instead of nothing.
            summary.Monthly = monthStarts
                .Select(ms => new MonthlyAnalyticsDto { Month = ms.ToString("MMM", CultureInfo.InvariantCulture) })
                .ToList();
            summary.Weekly = Enumerable.Range(0, 7)
                .Select(i => new DailyTotalDto { Day = weekStart.AddDays(i).ToString("ddd", CultureInfo.InvariantCulture) })
                .ToList();

            var walletIds = await _context.Wallets
                .Where(w => w.UserId == userId)
                .Select(w => w.Id)
                .ToListAsync();

            if (walletIds.Count == 0)
                return summary;

            var txs = await _context.Transactions
                .Where(t => t.Status == TransactionStatus.Completed
                    && t.Currency == currency
                    && ((t.FromWalletId.HasValue && walletIds.Contains(t.FromWalletId.Value))
                     || (t.ToWalletId.HasValue && walletIds.Contains(t.ToWalletId.Value))))
                .Select(t => new { t.CreatedAt, t.Amount, t.Type, t.FromWalletId, t.ToWalletId })
                .ToListAsync();

            static bool InWallets(Guid? walletId, List<Guid> walletIds) =>
                walletId.HasValue && walletIds.Contains(walletId.Value);

            // Incoming = credited from outside; outgoing = debited to
            // outside. Transfers between the user's own wallets are
            // internal moves and count as neither income nor expense.
            var incomes = txs
                .Where(t => InWallets(t.ToWalletId, walletIds) && !InWallets(t.FromWalletId, walletIds))
                .ToList();
            var expenses = txs
                .Where(t => InWallets(t.FromWalletId, walletIds) && !InWallets(t.ToWalletId, walletIds))
                .ToList();

            summary.TotalIncome = incomes.Sum(t => t.Amount);
            summary.TotalExpenses = expenses.Sum(t => t.Amount);
            summary.NetSavings = summary.TotalIncome - summary.TotalExpenses;
            summary.SavingsRate = summary.TotalIncome > 0
                ? Math.Round(summary.NetSavings / summary.TotalIncome * 100, 1)
                : 0m;
            summary.TransactionCount = incomes.Count + expenses.Count;
            summary.ExpenseCount = expenses.Count;
            summary.AverageTransaction = expenses.Count > 0
                ? Math.Round(summary.TotalExpenses / expenses.Count, 2)
                : 0m;

            for (var i = 0; i < monthStarts.Count; i++)
            {
                var start = monthStarts[i];
                var end = start.AddMonths(1);
                var income = incomes.Where(t => t.CreatedAt >= start && t.CreatedAt < end).Sum(t => t.Amount);
                var expense = expenses.Where(t => t.CreatedAt >= start && t.CreatedAt < end).Sum(t => t.Amount);
                summary.Monthly[i].Income = income;
                summary.Monthly[i].Expenses = expense;
                summary.Monthly[i].Savings = income - expense;
            }

            summary.Categories = expenses
                .GroupBy(t => t.Type)
                .Select(g => new CategoryTotalDto { Name = g.Key.ToString(), Value = g.Sum(t => t.Amount) })
                .Where(c => c.Value > 0)
                .OrderByDescending(c => c.Value)
                .ToList();

            for (var i = 0; i < summary.Weekly.Count; i++)
            {
                var day = weekStart.AddDays(i);
                summary.Weekly[i].Amount = expenses
                    .Where(t => t.CreatedAt >= day && t.CreatedAt < day.AddDays(1))
                    .Sum(t => t.Amount);
            }

            return summary;
        }
    }
}
