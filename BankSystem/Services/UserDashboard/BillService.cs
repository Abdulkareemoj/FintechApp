// ============================================
// FILE: Services/UserDashboard/BillService.cs
// PURPOSE: Handle bill management + bill payments for users
// ============================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Caching.Memory;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Models.Enums;

namespace FinTech.Services.UserDashboard
{
    public interface IBillService
    {
        Task<List<BillDto>> GetUserBillsAsync(Guid userId);
        Task<BillDto> CreateBillAsync(Guid userId, CreateBillRequest request);
        Task<bool> DeleteBillAsync(Guid userId, Guid billId);
        Task<BillDto> PayBillAsync(Guid userId, Guid billId, PayBillRequest request);
        Task<BillDto> QuickPayBillAsync(Guid userId, QuickPayBillRequest request);
    }

    public class BillService : IBillService
    {
        public static readonly string[] AllowedCategories =
        {
            "Electricity", "Water", "Gas", "Internet", "Phone",
            "TV & Cable", "Insurance", "Airtime", "Data", "Other"
        };

        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<BillService> _logger;

        public BillService(
            AppDbContext context,
            IMemoryCache cache,
            ILogger<BillService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        public async Task<List<BillDto>> GetUserBillsAsync(Guid userId)
        {
            var bills = await _context.Bills
                .AsNoTracking()
                .Where(b => b.UserId == userId)
                .ToListAsync();

            var unpaid = bills.Where(b => b.PaidAt == null).OrderBy(b => b.DueDate);
            var paid = bills.Where(b => b.PaidAt != null).OrderByDescending(b => b.PaidAt);

            return unpaid.Concat(paid).Select(MapToDto).ToList();
        }

        public async Task<BillDto> CreateBillAsync(Guid userId, CreateBillRequest request)
        {
            ValidateCategory(request.Category);

            var today = DateTime.UtcNow.Date;
            if (request.DueDate.Date < today.AddDays(-365) ||
                request.DueDate.Date > today.AddYears(5))
            {
                throw new InvalidOperationException("Due date must be within the last year or the next 5 years");
            }

            var bill = new Bill
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = request.Name.Trim(),
                Category = NormalizeCategory(request.Category),
                Amount = request.Amount,
                Reference = string.IsNullOrWhiteSpace(request.Reference) ? null : request.Reference.Trim(),
                DueDate = request.DueDate,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Bill {BillId} created for user {UserId}: {Amount} due {DueDate}",
                bill.Id, userId, bill.Amount, bill.DueDate);

            return MapToDto(bill);
        }

        public async Task<bool> DeleteBillAsync(Guid userId, Guid billId)
        {
            var bill = await _context.Bills
                .FirstOrDefaultAsync(b => b.Id == billId && b.UserId == userId);

            if (bill == null)
                throw new UnauthorizedAccessException("Bill not found or access denied");

            if (bill.PaidAt != null)
                throw new InvalidOperationException("Paid bills cannot be deleted");

            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<BillDto> PayBillAsync(Guid userId, Guid billId, PayBillRequest request)
        {
            // Idempotency: same key → return the bill already charged for it
            if (request.IdempotencyKey.HasValue)
            {
                var existingBill = await FindBillByTransactionKeyAsync(request.IdempotencyKey.Value);
                if (existingBill != null)
                    return MapToDto(existingBill);
            }

            var bill = await _context.Bills
                .FirstOrDefaultAsync(b => b.Id == billId && b.UserId == userId);

            if (bill == null)
                throw new UnauthorizedAccessException("Bill not found or access denied");

            if (bill.PaidAt != null)
                throw new InvalidOperationException("Bill is already paid");

            var wallet = await GetActiveWalletAsync(userId, request.WalletId);
            var idempotencyKey = request.IdempotencyKey ?? Guid.NewGuid();

            await EnsureSufficientFundsAsync(wallet.Id, bill.Amount);

            return await ExecutePaymentAsync(
                wallet,
                bill.Amount,
                idempotencyKey,
                $"Bill payment: {bill.Name}",
                bill.Category,
                bill.Reference,
                bill);
        }

        public async Task<BillDto> QuickPayBillAsync(Guid userId, QuickPayBillRequest request)
        {
            ValidateCategory(request.Category);

            // Idempotency: same key → return the bill already charged for it
            if (request.IdempotencyKey.HasValue)
            {
                var existingBill = await FindBillByTransactionKeyAsync(request.IdempotencyKey.Value);
                if (existingBill != null)
                    return MapToDto(existingBill);
            }

            var name = string.IsNullOrWhiteSpace(request.Name)
                ? NormalizeCategory(request.Category)
                : request.Name.Trim();

            var wallet = await GetActiveWalletAsync(userId, request.WalletId);
            var idempotencyKey = request.IdempotencyKey ?? Guid.NewGuid();

            await EnsureSufficientFundsAsync(wallet.Id, request.Amount);

            return await ExecutePaymentAsync(
                wallet,
                request.Amount,
                idempotencyKey,
                $"Bill payment: {name}",
                NormalizeCategory(request.Category),
                string.IsNullOrWhiteSpace(request.Reference) ? null : request.Reference.Trim(),
                bill: null,
                billName: name);
        }

        // ---- Shared payment core (atomic: transaction + bill row together) ----

        private async Task<BillDto> ExecutePaymentAsync(
            Wallet wallet,
            decimal amount,
            Guid idempotencyKey,
            string description,
            string category,
            string? reference,
            Bill? bill,
            string? billName = null)
        {
            var metadata = JsonSerializer.Serialize(new
            {
                category,
                reference,
                source = "bills"
            });

            // The DbContext has EnableRetryOnFailure, so an explicit
            // transaction must be wrapped in the execution strategy
            // otherwise SQL Server throws "does not support
            // user-initiated transactions".
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using var dbTransaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

                try
                {
                    if (bill != null)
                    {
                        // Re-check paid status from the database inside the
                        // transaction so concurrent pay clicks can't double-charge.
                        await _context.Entry(bill).ReloadAsync();
                        if (bill.PaidAt != null)
                            throw new InvalidOperationException("Bill is already paid");
                    }
                    else
                    {
                        bill = new Bill
                        {
                            Id = Guid.NewGuid(),
                            UserId = wallet.UserId,
                            Name = billName!,
                            Category = category,
                            Amount = amount,
                            Reference = reference,
                            DueDate = DateTime.UtcNow.Date,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.Bills.Add(bill);
                    }

                    var transaction = new Transaction
                    {
                        Id = Guid.NewGuid(),
                        IdempotencyKey = idempotencyKey,
                        FromWalletId = wallet.Id,
                        ToWalletId = null,
                        Amount = amount,
                        Currency = wallet.CurrencyCode,
                        Type = TransactionType.Withdrawal,
                        Status = TransactionStatus.Completed,
                        Description = description,
                        Metadata = metadata,
                        ReferenceId = reference,
                        CreatedAt = DateTime.UtcNow,
                        CompletedAt = DateTime.UtcNow
                    };
                    _context.Transactions.Add(transaction);

                    bill.PaidAt = DateTime.UtcNow;
                    bill.PaidWalletId = wallet.Id;
                    bill.TransactionId = transaction.Id;

                    await _context.SaveChangesAsync();
                    await dbTransaction.CommitAsync();

                    // Invalidate balance cache
                    _cache.Remove($"balance_{wallet.Id}");

                    _logger.LogInformation(
                        "Bill payment completed: {TransactionId}, Bill {BillId}, Amount: {Amount} {Currency}",
                        transaction.Id, bill.Id, amount, wallet.CurrencyCode);

                    return MapToDto(bill);
                }
                catch (Exception ex)
                {
                    await dbTransaction.RollbackAsync();
                    _logger.LogError(ex, "Bill payment failed for wallet {WalletId}, amount {Amount}",
                        wallet.Id, amount);
                    throw;
                }
            });
        }

        // ---- Helpers ----

        private async Task<Bill?> FindBillByTransactionKeyAsync(Guid idempotencyKey)
        {
            var transaction = await _context.Transactions
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.IdempotencyKey == idempotencyKey);

            if (transaction == null)
                return null;

            return await _context.Bills
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.TransactionId == transaction.Id);
        }

        private async Task<Wallet> GetActiveWalletAsync(Guid userId, Guid walletId)
        {
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == walletId && w.UserId == userId);

            if (wallet == null)
                throw new UnauthorizedAccessException("Wallet not found or access denied");

            if (wallet.Status != WalletStatus.Active)
                throw new InvalidOperationException("Wallet is not active");

            return wallet;
        }

        private async Task EnsureSufficientFundsAsync(Guid walletId, decimal amount)
        {
            var credits = await _context.Transactions
                .Where(t => t.ToWalletId == walletId && t.Status == TransactionStatus.Completed)
                .SumAsync(t => t.Amount);

            var debits = await _context.Transactions
                .Where(t => t.FromWalletId == walletId && t.Status == TransactionStatus.Completed)
                .SumAsync(t => t.Amount);

            var balance = credits - debits;
            if (balance < amount)
                throw new InsufficientFundsException($"Insufficient funds. Available: {balance}, Required: {amount}");
        }

        private static void ValidateCategory(string category)
        {
            if (!AllowedCategories.Contains(category, StringComparer.OrdinalIgnoreCase))
                throw new InvalidOperationException(
                    $"Category must be one of: {string.Join(", ", AllowedCategories)}");
        }

        private static string NormalizeCategory(string category)
        {
            var match = AllowedCategories.FirstOrDefault(
                c => string.Equals(c, category, StringComparison.OrdinalIgnoreCase));
            return match ?? "Other";
        }

        private static BillDto MapToDto(Bill bill)
        {
            string status;
            if (bill.PaidAt != null)
            {
                status = "paid";
            }
            else
            {
                var today = DateTime.UtcNow.Date;
                var due = bill.DueDate.Date;
                status = due < today ? "overdue" : due <= today.AddDays(7) ? "due" : "upcoming";
            }

            return new BillDto
            {
                Id = bill.Id,
                Name = bill.Name,
                Category = bill.Category,
                Amount = bill.Amount,
                Reference = bill.Reference,
                DueDate = bill.DueDate,
                CreatedAt = bill.CreatedAt,
                Status = status,
                PaidAt = bill.PaidAt,
                PaidWalletId = bill.PaidWalletId,
                TransactionId = bill.TransactionId
            };
        }
    }
}
