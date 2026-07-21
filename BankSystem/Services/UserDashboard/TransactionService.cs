// ============================================
// FILE: Services/UserDashboard/TransactionService.cs
// PURPOSE: Handle all transaction operations for users
// ============================================

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
    public interface ITransactionService
    {
        Task<TransactionDto> CreateTransferAsync(Guid userId, CreateTransferRequest request);
        Task<PaginatedResult<TransactionDto>> GetUserTransactionsAsync(Guid userId, TransactionQueryParams queryParams);
        Task<TransactionDetailDto?> GetTransactionDetailAsync(Guid transactionId, Guid userId);
        Task<List<RecentRecipientDto>> GetRecentRecipientsAsync(Guid userId, int limit = 10);
    }

    public class TransactionService : ITransactionService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly ILogger<TransactionService> _logger;

        public TransactionService(
            AppDbContext context,
            IMemoryCache cache,
            ILogger<TransactionService> logger)
        {
            _context = context;
            _cache = cache;
            _logger = logger;
        }

        public async Task<TransactionDto> CreateTransferAsync(Guid userId, CreateTransferRequest request)
        {
            // STEP 1: Check idempotency
            var existingTransaction = await _context.Transactions
                .FirstOrDefaultAsync(t => t.IdempotencyKey == request.IdempotencyKey);

            if (existingTransaction != null)
            {
                _logger.LogWarning("Duplicate transaction attempt with idempotency key: {Key}", request.IdempotencyKey);
                return MapToTransactionDto(existingTransaction);
            }

            // STEP 2: Validate sender's wallet
            var fromWallet = await _context.Wallets
                .Include(w => w.User)
                .FirstOrDefaultAsync(w => w.Id == request.FromWalletId && w.UserId == userId);

            if (fromWallet == null)
                throw new UnauthorizedAccessException("Wallet not found or access denied");

            if (fromWallet.Status != WalletStatus.Active)
                throw new InvalidOperationException("Wallet is not active");

            // STEP 3: Validate recipient's wallet
            var toWallet = await _context.Wallets
                .Include(w => w.User)
                .FirstOrDefaultAsync(w => w.Id == request.ToWalletId);

            if (toWallet == null)
                throw new InvalidOperationException("Recipient wallet not found");

            if (toWallet.Status != WalletStatus.Active)
                throw new InvalidOperationException("Recipient wallet is not active");

            // Can't send to yourself
            if (fromWallet.Id == toWallet.Id)
                throw new InvalidOperationException("Cannot transfer to the same wallet");

            // Currency must match
            if (fromWallet.CurrencyCode != toWallet.CurrencyCode)
                throw new InvalidOperationException($"Currency mismatch: {fromWallet.CurrencyCode} vs {toWallet.CurrencyCode}");

            // STEP 4: Check balance
            var currentBalance = await GetWalletBalance(fromWallet.Id);
            if (currentBalance < request.Amount)
                throw new InsufficientFundsException($"Insufficient funds. Available: {currentBalance}, Required: {request.Amount}");

            // STEP 5: Process transfer atomically
            using var dbTransaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

            try
            {
                var transaction = new Transaction
                {
                    Id = Guid.NewGuid(),
                    IdempotencyKey = request.IdempotencyKey,
                    FromWalletId = fromWallet.Id,
                    ToWalletId = toWallet.Id,
                    Amount = request.Amount,
                    Currency = fromWallet.CurrencyCode,
                    Type = TransactionType.Transfer,
                    Status = TransactionStatus.Pending,
                    Description = request.Description ?? "P2P Transfer",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                // Mark as completed
                transaction.Status = TransactionStatus.Completed;
                transaction.CompletedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                await dbTransaction.CommitAsync();

                // Invalidate balance cache
                InvalidateBalanceCache(fromWallet.Id, toWallet.Id);

                _logger.LogInformation(
                    "Transfer completed: {TransactionId} from {FromWallet} to {ToWallet}, Amount: {Amount} {Currency}",
                    transaction.Id, fromWallet.Id, toWallet.Id, request.Amount, fromWallet.CurrencyCode);

                // TODO: Send notifications async (don't block response)
                _ = Task.Run(() => SendTransferNotifications(transaction, fromWallet.User, toWallet.User));

                return MapToTransactionDto(transaction);
            }
            catch (Exception ex)
            {
                await dbTransaction.RollbackAsync();
                _logger.LogError(ex, "Transfer failed for idempotency key: {Key}", request.IdempotencyKey);
                throw;
            }
        }

        public async Task<PaginatedResult<TransactionDto>> GetUserTransactionsAsync(
            Guid userId, 
            TransactionQueryParams queryParams)
        {
            // Get user's wallet IDs
            var walletIds = await _context.Wallets
                .Where(w => w.UserId == userId)
                .Select(w => w.Id)
                .ToListAsync();

            if (!walletIds.Any())
                return new PaginatedResult<TransactionDto> { Items = new List<TransactionDto>(), TotalCount = 0 };

            // Build query
            var query = _context.Transactions
                .Where(t => walletIds.Contains(t.FromWalletId.Value) || 
                           walletIds.Contains(t.ToWalletId.Value));

            // Apply filters
            if (queryParams.StartDate.HasValue)
                query = query.Where(t => t.CreatedAt >= queryParams.StartDate.Value);

            if (queryParams.EndDate.HasValue)
                query = query.Where(t => t.CreatedAt <= queryParams.EndDate.Value);

            if (queryParams.Type.HasValue)
                query = query.Where(t => t.Type == queryParams.Type.Value);

            if (queryParams.Status.HasValue)
                query = query.Where(t => t.Status == queryParams.Status.Value);

            if (!string.IsNullOrEmpty(queryParams.Search))
            {
                query = query.Where(t => t.Description!.Contains(queryParams.Search) ||
                                        t.ReferenceId!.Contains(queryParams.Search));
            }

            // Get total count
            var totalCount = await query.CountAsync();

            // Apply pagination and sorting
            var transactions = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((queryParams.Page - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .Include(t => t.FromWallet)
                .Include(t => t.ToWallet)
                .ToListAsync();

            var transactionDtos = transactions.Select(t => MapToTransactionDto(t, walletIds)).ToList();

            return new PaginatedResult<TransactionDto>
            {
                Items = transactionDtos,
                TotalCount = totalCount,
                Page = queryParams.Page,
                PageSize = queryParams.PageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)queryParams.PageSize)
            };
        }

        public async Task<TransactionDetailDto?> GetTransactionDetailAsync(Guid transactionId, Guid userId)
        {
            // Get user's wallet IDs
            var walletIds = await _context.Wallets
                .Where(w => w.UserId == userId)
                .Select(w => w.Id)
                .ToListAsync();

            var transaction = await _context.Transactions
                .Include(t => t.FromWallet)
                    .ThenInclude(w => w!.User)
                .Include(t => t.ToWallet)
                    .ThenInclude(w => w!.User)
                .FirstOrDefaultAsync(t => t.Id == transactionId);

            if (transaction == null)
                return null;

            // Verify user has access to this transaction
            var hasAccess = (transaction.FromWalletId.HasValue && walletIds.Contains(transaction.FromWalletId.Value)) ||
                           (transaction.ToWalletId.HasValue && walletIds.Contains(transaction.ToWalletId.Value));

            if (!hasAccess)
                return null;

            // Determine direction for current user
            var isOutgoing = transaction.FromWalletId.HasValue && walletIds.Contains(transaction.FromWalletId.Value);

            return new TransactionDetailDto
            {
                Id = transaction.Id,
                Amount = transaction.Amount,
                Currency = transaction.Currency,
                Type = transaction.Type.ToString(),
                Status = transaction.Status.ToString(),
                Description = transaction.Description,
                Direction = isOutgoing ? "outgoing" : "incoming",
                FromWallet = transaction.FromWallet != null ? new WalletSummaryDto
                {
                    Id = transaction.FromWallet.Id,
                    CurrencyCode = transaction.FromWallet.CurrencyCode,
                    OwnerName = $"{transaction.FromWallet.User.FirstName} {transaction.FromWallet.User.LastName}",
                    IsCurrentUser = walletIds.Contains(transaction.FromWallet.Id)
                } : null,
                ToWallet = transaction.ToWallet != null ? new WalletSummaryDto
                {
                    Id = transaction.ToWallet.Id,
                    CurrencyCode = transaction.ToWallet.CurrencyCode,
                    OwnerName = $"{transaction.ToWallet.User.FirstName} {transaction.ToWallet.User.LastName}",
                    IsCurrentUser = walletIds.Contains(transaction.ToWallet.Id)
                } : null,
                CreatedAt = transaction.CreatedAt,
                CompletedAt = transaction.CompletedAt,
                ReferenceId = transaction.ReferenceId
            };
        }

        public async Task<List<RecentRecipientDto>> GetRecentRecipientsAsync(Guid userId, int limit = 10)
        {
            var userWalletIds = await _context.Wallets
                .Where(w => w.UserId == userId)
                .Select(w => w.Id)
                .ToListAsync();

            // Get recent recipients (unique users user has sent money to)
            var recentRecipients = await _context.Transactions
                .Where(t => userWalletIds.Contains(t.FromWalletId.Value) && 
                           t.Status == TransactionStatus.Completed)
                .Include(t => t.ToWallet)
                    .ThenInclude(w => w!.User)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new
                {
                    UserId = t.ToWallet!.UserId,
                    t.ToWallet.User.FirstName,
                    t.ToWallet.User.LastName,
                    t.ToWallet.User.Email,
                    LastTransactionDate = t.CreatedAt
                })
                .GroupBy(x => x.UserId)
                .Select(g => g.OrderByDescending(x => x.LastTransactionDate).First())
                .Take(limit)
                .ToListAsync();

            return recentRecipients.Select(r => new RecentRecipientDto
            {
                UserId = r.UserId,
                Name = $"{r.FirstName} {r.LastName}",
                Email = r.Email,
                LastTransactionDate = r.LastTransactionDate
            }).ToList();
        }

        // Helper methods
        private async Task<decimal> GetWalletBalance(Guid walletId)
        {
            var credits = await _context.Transactions
                .Where(t => t.ToWalletId == walletId && t.Status == TransactionStatus.Completed)
                .SumAsync(t => t.Amount);

            var debits = await _context.Transactions
                .Where(t => t.FromWalletId == walletId && t.Status == TransactionStatus.Completed)
                .SumAsync(t => t.Amount);

            return credits - debits;
        }

        private void InvalidateBalanceCache(Guid? fromWalletId, Guid? toWalletId)
        {
            if (fromWalletId.HasValue)
                _cache.Remove($"balance_{fromWalletId}");

            if (toWalletId.HasValue)
                _cache.Remove($"balance_{toWalletId}");
        }

        private TransactionDto MapToTransactionDto(Transaction transaction, List<Guid>? userWalletIds = null)
        {
            var isOutgoing = userWalletIds != null && 
                            transaction.FromWalletId.HasValue && 
                            userWalletIds.Contains(transaction.FromWalletId.Value);

            return new TransactionDto
            {
                Id = transaction.Id,
                Amount = transaction.Amount,
                Currency = transaction.Currency,
                Type = transaction.Type.ToString(),
                Status = transaction.Status.ToString(),
                Description = transaction.Description,
                Direction = isOutgoing ? "outgoing" : "incoming",
                CreatedAt = transaction.CreatedAt
            };
        }

        private async Task SendTransferNotifications(Transaction transaction, User sender, User recipient)
        {
            try
            {
                // TODO: Implement actual email/SMS sending
                _logger.LogInformation("Sending notifications for transaction {TransactionId}", transaction.Id);
                await Task.CompletedTask; // Placeholder
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send notifications for transaction {TransactionId}", transaction.Id);
            }
        }
    }

    // Custom exception
    public class InsufficientFundsException : Exception
    {
        public InsufficientFundsException(string message) : base(message) { }
    }
}