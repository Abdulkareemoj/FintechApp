// ============================================
// FILE: Services/UserDashboard/DepositService.cs
// PURPOSE: Handle wallet funding (top-up) from external sources
// ============================================

using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Hangfire;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Models.Enums;

namespace FinTech.Services.UserDashboard
{
    public interface IDepositService
    {
        Task<DepositDto> InitiateDepositAsync(Guid userId, InitiateDepositRequest request);
        Task<DepositDto?> GetDepositAsync(Guid depositId, Guid userId);
        Task<DepositStatusDto?> GetDepositStatusAsync(Guid depositId, Guid userId);
        Task<DepositDto> SimulateCallbackAsync(Guid depositId, bool success, string? failureReason);
        Task ExpirePendingDepositAsync(Guid depositId); // called by Hangfire
    }

    public class DepositService : IDepositService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<DepositService> _logger;

        // How long a simulated deposit stays "pending" before auto-expiring.
        // In production this would instead be driven by real processor webhooks/timeouts.
        private static readonly TimeSpan PendingExpiry = TimeSpan.FromHours(24);

        public DepositService(
            AppDbContext context,
            IMemoryCache cache,
            ILogger<DepositService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        public async Task<DepositDto> InitiateDepositAsync(Guid userId, InitiateDepositRequest request)
        {
            // Idempotency check - same as transfers
            var existing = await _context.Transactions
                .FirstOrDefaultAsync(t => t.IdempotencyKey == request.IdempotencyKey);

            if (existing != null)
            {
                _logger.LogWarning("Duplicate deposit attempt with idempotency key: {Key}", request.IdempotencyKey);
                return MapToDepositDto(existing);
            }

            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == request.WalletId && w.UserId == userId);

            if (wallet == null)
                throw new UnauthorizedAccessException("Wallet not found or access denied");

            if (wallet.Status != Models.Enums.WalletStatus.Active)
                throw new InvalidOperationException("Wallet is not active");

            if (request.Amount <= 0)
                throw new InvalidOperationException("Amount must be greater than 0");

            var reference = GenerateDepositReference();
            var metadata = JsonSerializer.Serialize(new
            {
                source = request.Source.ToString(),
                reference
            });

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                IdempotencyKey = request.IdempotencyKey,
                FromWalletId = null, // Money is coming from outside the platform
                ToWalletId = wallet.Id,
                Amount = request.Amount,
                Currency = wallet.CurrencyCode,
                Type = Models.Enums.TransactionType.Deposit,
                Status = Models.Enums.TransactionStatus.Pending,
                Description = request.Description ?? $"Deposit via {request.Source}",
                Metadata = metadata,
                ReferenceId = reference,
                CreatedAt = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            // Schedule auto-expiry so deposits don't stay "pending" forever if never confirmed.
            // Mirrors how a real payment processor timeout/webhook would eventually resolve this.
            BackgroundJob.Schedule<IDepositService>(
                svc => svc.ExpirePendingDepositAsync(transaction.Id),
                PendingExpiry);

            _logger.LogInformation(
                "Deposit initiated: {TransactionId} for wallet {WalletId}, Amount: {Amount} {Currency}, Reference: {Reference}",
                transaction.Id, wallet.Id, request.Amount, wallet.CurrencyCode, reference);

            return MapToDepositDto(transaction);
        }

        public async Task<DepositDto?> GetDepositAsync(Guid depositId, Guid userId)
        {
            var walletIds = await _context.Wallets
                .Where(w => w.UserId == userId)
                .Select(w => w.Id)
                .ToListAsync();

            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == depositId &&
                                          t.Type == Models.Enums.TransactionType.Deposit &&
                                          t.ToWalletId.HasValue &&
                                          walletIds.Contains(t.ToWalletId.Value));

            return transaction == null ? null : MapToDepositDto(transaction);
        }

        public async Task<DepositStatusDto?> GetDepositStatusAsync(Guid depositId, Guid userId)
        {
            var deposit = await GetDepositAsync(depositId, userId);
            if (deposit == null)
                return null;

            return new DepositStatusDto
            {
                Id = deposit.Id,
                Status = deposit.Status,
                Amount = deposit.Amount,
                Currency = deposit.Currency,
                CreatedAt = deposit.CreatedAt,
                CompletedAt = deposit.CompletedAt
            };
        }

        /// <summary>
        /// DEV-ONLY placeholder for a real payment processor webhook (e.g. Stripe/Paystack).
        /// In production this logic would live in a webhook endpoint that verifies the
        /// processor's signature before calling this same completion logic.
        /// </summary>
        public async Task<DepositDto> SimulateCallbackAsync(Guid depositId, bool success, string? failureReason)
        {
            var transaction = await _context.Transactions
                .Include(t => t.ToWallet)
                .FirstOrDefaultAsync(t => t.Id == depositId && t.Type == Models.Enums.TransactionType.Deposit);

            if (transaction == null)
                throw new InvalidOperationException("Deposit not found");

            if (transaction.Status != Models.Enums.TransactionStatus.Pending)
                throw new InvalidOperationException($"Deposit is already {transaction.Status}, cannot update");

            using var dbTransaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

            try
            {
                transaction.Status = success ? Models.Enums.TransactionStatus.Completed : Models.Enums.TransactionStatus.Failed;
                transaction.CompletedAt = DateTime.UtcNow;

                if (!success && !string.IsNullOrEmpty(failureReason))
                {
                    transaction.Description = $"{transaction.Description} (Failed: {failureReason})";
                }

                await _context.SaveChangesAsync();
                await dbTransaction.CommitAsync();

                if (transaction.ToWalletId.HasValue)
                    _cache.Remove($"balance_{transaction.ToWalletId}");

                _logger.LogInformation(
                    "Deposit {TransactionId} resolved as {Status}",
                    transaction.Id, transaction.Status);

                return MapToDepositDto(transaction);
            }
            catch
            {
                await dbTransaction.RollbackAsync();
                throw;
            }
        }

        public async Task ExpirePendingDepositAsync(Guid depositId)
        {
            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.Id == depositId && t.Type == Models.Enums.TransactionType.Deposit);

            // Only touch it if it's STILL pending - if it was already confirmed/failed, do nothing
            if (transaction == null || transaction.Status != Models.Enums.TransactionStatus.Pending)
                return;

            transaction.Status = Models.Enums.TransactionStatus.Failed;
            transaction.CompletedAt = DateTime.UtcNow;
            transaction.Description = $"{transaction.Description} (Expired: no confirmation received)";

            await _context.SaveChangesAsync();

            _logger.LogWarning("Deposit {TransactionId} auto-expired after {Hours}h with no confirmation",
                depositId, PendingExpiry.TotalHours);
        }

        private DepositDto MapToDepositDto(Transaction transaction)
        {
            string? source = null;
            string? reference = transaction.ReferenceId;

            if (!string.IsNullOrEmpty(transaction.Metadata))
            {
                try
                {
                    using var doc = JsonDocument.Parse(transaction.Metadata);
                    if (doc.RootElement.TryGetProperty("source", out var sourceEl))
                        source = sourceEl.GetString();
                }
                catch
                {
                    // Metadata wasn't valid JSON - ignore, non-critical
                }
            }

            return new DepositDto
            {
                Id = transaction.Id,
                WalletId = transaction.ToWalletId!.Value,
                Amount = transaction.Amount,
                Currency = transaction.Currency,
                Status = transaction.Status.ToString(),
                Source = source,
                ReferenceId = reference,
                Description = transaction.Description,
                CreatedAt = transaction.CreatedAt,
                CompletedAt = transaction.CompletedAt
            };
        }

        private string GenerateDepositReference()
        {
            // Human-readable reference the "bank" would show the user, e.g. DEP-7F3K9QZX
            var random = new Random();
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
            var suffix = new string(Enumerable.Range(0, 8)
                .Select(_ => chars[random.Next(chars.Length)])
                .ToArray());
            return $"DEP-{suffix}";
        }
    }
}
