
// ============================================
// FILE: Services/UserDashboard/MoneyRequestService.cs
// PURPOSE: Request payment from another user
// ============================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Models.Enums;

namespace FinTech.Services.UserDashboard
{
    public interface IMoneyRequestService
    {
        Task<MoneyRequestDto> CreateRequestAsync(Guid requesterId, CreateMoneyRequestRequest request);
        Task<PaginatedResult<MoneyRequestDto>> GetIncomingRequestsAsync(Guid userId, int page, int pageSize);
        Task<PaginatedResult<MoneyRequestDto>> GetOutgoingRequestsAsync(Guid userId, int page, int pageSize);
        Task<MoneyRequestDto?> GetRequestDetailAsync(Guid requestId, Guid userId);
        Task<MoneyRequestDto> AcceptRequestAsync(Guid requestId, Guid payerId, AcceptMoneyRequestRequest request);
        Task<MoneyRequestDto> DeclineRequestAsync(Guid requestId, Guid payerId);
        Task<MoneyRequestDto> CancelRequestAsync(Guid requestId, Guid requesterId);
        Task ExpireStaleRequestsAsync(); // called by recurring Hangfire job
    }

    public class MoneyRequestService : IMoneyRequestService
    {
        private readonly AppDbContext _context;
        private readonly ITransactionService _transactionService;
        private readonly ILogger<MoneyRequestService> _logger;

        private static readonly TimeSpan DefaultExpiry = TimeSpan.FromDays(7);

        public MoneyRequestService(
            AppDbContext context,
            ITransactionService transactionService,
            ILogger<MoneyRequestService> logger)
        {
            _context = context;
            _transactionService = transactionService;
            _logger = logger;
        }

        public async Task<MoneyRequestDto> CreateRequestAsync(Guid requesterId, CreateMoneyRequestRequest request)
        {
            var requesterWallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == request.RequesterWalletId && w.UserId == requesterId);

            if (requesterWallet == null)
                throw new UnauthorizedAccessException("Wallet not found or access denied");

            if (requesterWallet.Status != WalletStatus.Active)
                throw new InvalidOperationException("Wallet is not active");

            if (request.Amount <= 0)
                throw new InvalidOperationException("Amount must be greater than 0");

            var payer = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.PayerEmail.Trim().ToLower());

            if (payer == null)
                throw new InvalidOperationException("No user found with that email");

            if (payer.Id == requesterId)
                throw new InvalidOperationException("Cannot request money from yourself");

            var moneyRequest = new MoneyRequest
            {
                RequesterId = requesterId,
                RequesterWalletId = requesterWallet.Id,
                PayerId = payer.Id,
                Amount = request.Amount,
                Currency = requesterWallet.CurrencyCode,
                Description = request.Description,
                Status = MoneyRequestStatus.Pending,
                ExpiresAt = DateTime.UtcNow.Add(DefaultExpiry)
            };

            _context.MoneyRequests.Add(moneyRequest);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Money request created: {RequestId} from {RequesterId} to {PayerId}, Amount: {Amount} {Currency}",
                moneyRequest.Id, requesterId, payer.Id, request.Amount, requesterWallet.CurrencyCode);

            // TODO: notify payer (email/push) that they've been asked for money

            return await MapToDtoAsync(moneyRequest);
        }

        public async Task<PaginatedResult<MoneyRequestDto>> GetIncomingRequestsAsync(Guid userId, int page, int pageSize)
        {
            var query = _context.MoneyRequests
                .Include(r => r.Requester)
                .Include(r => r.Payer)
                .Where(r => r.PayerId == userId)
                .OrderByDescending(r => r.CreatedAt);

            return await PaginateAsync(query, page, pageSize);
        }

        public async Task<PaginatedResult<MoneyRequestDto>> GetOutgoingRequestsAsync(Guid userId, int page, int pageSize)
        {
            var query = _context.MoneyRequests
                .Include(r => r.Requester)
                .Include(r => r.Payer)
                .Where(r => r.RequesterId == userId)
                .OrderByDescending(r => r.CreatedAt);

            return await PaginateAsync(query, page, pageSize);
        }

        public async Task<MoneyRequestDto?> GetRequestDetailAsync(Guid requestId, Guid userId)
        {
            var request = await _context.MoneyRequests
                .Include(r => r.Requester)
                .Include(r => r.Payer)
                .FirstOrDefaultAsync(r => r.Id == requestId &&
                                         (r.RequesterId == userId || r.PayerId == userId));

            return request == null ? null : await MapToDtoAsync(request);
        }

        public async Task<MoneyRequestDto> AcceptRequestAsync(Guid requestId, Guid payerId, AcceptMoneyRequestRequest request)
        {
            var moneyRequest = await _context.MoneyRequests
                .Include(r => r.Requester)
                .Include(r => r.Payer)
                .FirstOrDefaultAsync(r => r.Id == requestId);

            if (moneyRequest == null)
                throw new InvalidOperationException("Money request not found");

            if (moneyRequest.PayerId != payerId)
                throw new UnauthorizedAccessException("You are not the payer for this request");

            if (moneyRequest.Status != MoneyRequestStatus.Pending)
                throw new InvalidOperationException($"Request is already {moneyRequest.Status}");

            if (moneyRequest.ExpiresAt < DateTime.UtcNow)
            {
                moneyRequest.Status = MoneyRequestStatus.Expired;
                await _context.SaveChangesAsync();
                throw new InvalidOperationException("This request has expired");
            }

            // Reuse the existing, battle-tested transfer logic (idempotent + atomic)
            var transferResult = await _transactionService.CreateTransferAsync(payerId, new CreateTransferRequest
            {
                IdempotencyKey = request.IdempotencyKey,
                FromWalletId = request.FromWalletId,
                ToWalletId = moneyRequest.RequesterWalletId,
                Amount = moneyRequest.Amount,
                Description = moneyRequest.Description ?? $"Paid request from {moneyRequest.Requester.FirstName}"
            });

            // Transfer succeeded - now mark the request as paid.
            // If this second save fails, money has already moved but the request
            // status wouldn't reflect it - log loudly so it can be reconciled manually.
            try
            {
                moneyRequest.Status = MoneyRequestStatus.Paid;
                moneyRequest.RespondedAt = DateTime.UtcNow;
                moneyRequest.TransactionId = transferResult.Id;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex,
                    "Transfer {TransactionId} succeeded for money request {RequestId} but request status update FAILED. Needs manual reconciliation.",
                    transferResult.Id, requestId);
                throw;
            }

            _logger.LogInformation("Money request {RequestId} paid via transaction {TransactionId}",
                requestId, transferResult.Id);

            return await MapToDtoAsync(moneyRequest);
        }

        public async Task<MoneyRequestDto> DeclineRequestAsync(Guid requestId, Guid payerId)
        {
            var moneyRequest = await _context.MoneyRequests
                .Include(r => r.Requester)
                .Include(r => r.Payer)
                .FirstOrDefaultAsync(r => r.Id == requestId);

            if (moneyRequest == null)
                throw new InvalidOperationException("Money request not found");

            if (moneyRequest.PayerId != payerId)
                throw new UnauthorizedAccessException("You are not the payer for this request");

            if (moneyRequest.Status != MoneyRequestStatus.Pending)
                throw new InvalidOperationException($"Request is already {moneyRequest.Status}");

            moneyRequest.Status = MoneyRequestStatus.Declined;
            moneyRequest.RespondedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await MapToDtoAsync(moneyRequest);
        }

        public async Task<MoneyRequestDto> CancelRequestAsync(Guid requestId, Guid requesterId)
        {
            var moneyRequest = await _context.MoneyRequests
                .Include(r => r.Requester)
                .Include(r => r.Payer)
                .FirstOrDefaultAsync(r => r.Id == requestId);

            if (moneyRequest == null)
                throw new InvalidOperationException("Money request not found");

            if (moneyRequest.RequesterId != requesterId)
                throw new UnauthorizedAccessException("You did not create this request");

            if (moneyRequest.Status != MoneyRequestStatus.Pending)
                throw new InvalidOperationException($"Request is already {moneyRequest.Status}");

            moneyRequest.Status = MoneyRequestStatus.Cancelled;
            moneyRequest.RespondedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await MapToDtoAsync(moneyRequest);
        }

        public async Task ExpireStaleRequestsAsync()
        {
            var stale = await _context.MoneyRequests
                .Where(r => r.Status == MoneyRequestStatus.Pending && r.ExpiresAt < DateTime.UtcNow)
                .ToListAsync();

            if (stale.Count == 0)
                return;

            foreach (var r in stale)
                r.Status = MoneyRequestStatus.Expired;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Expired {Count} stale money requests", stale.Count);
        }

        private async Task<PaginatedResult<MoneyRequestDto>> PaginateAsync(
            IQueryable<MoneyRequest> query, int page, int pageSize)
        {
            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = new List<MoneyRequestDto>();
            foreach (var item in items)
                dtos.Add(await MapToDtoAsync(item));

            return new PaginatedResult<MoneyRequestDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        private Task<MoneyRequestDto> MapToDtoAsync(MoneyRequest r)
        {
            return Task.FromResult(new MoneyRequestDto
            {
                Id = r.Id,
                RequesterId = r.RequesterId,
                RequesterName = $"{r.Requester.FirstName} {r.Requester.LastName}",
                PayerId = r.PayerId,
                PayerName = $"{r.Payer.FirstName} {r.Payer.LastName}",
                Amount = r.Amount,
                Currency = r.Currency,
                Description = r.Description,
                Status = r.Status.ToString(),
                CreatedAt = r.CreatedAt,
                RespondedAt = r.RespondedAt,
                ExpiresAt = r.ExpiresAt,
                TransactionId = r.TransactionId
            });
        }
    }
}
