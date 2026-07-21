
// ============================================
// FILE: Services/UserDashboard/CardService.cs
// PURPOSE: Handle all card operations for users
// ============================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FinTech.Data;
using FinTech.Models;
using FinTech.Models.DTOs.UserDashboard;
using FinTech.Models.Enums;

namespace FinTech.Services.UserDashboard
{
    public interface ICardService
    {
        Task<List<CardDto>> GetUserCardsAsync(Guid userId);
        Task<CardDto?> GetCardByIdAsync(Guid cardId, Guid userId);
        Task<CardDto> CreateVirtualCardAsync(Guid userId, CreateCardRequest request);
        Task<CardDto> UpdateCardStatusAsync(Guid cardId, Guid userId, CardStatus newStatus);
        Task<CardDto> UpdateCardLimitsAsync(Guid cardId, Guid userId, UpdateCardLimitsRequest request);
        Task<bool> DeleteCardAsync(Guid cardId, Guid userId);
        Task<CardSpendingDto> GetCardSpendingAsync(Guid cardId, Guid userId);
    }

    public class CardService : ICardService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CardService> _logger;
        private readonly string _encryptionKey; // In production, use proper key management

        public CardService(
            AppDbContext context,
            IConfiguration configuration,
            ILogger<CardService> logger)
        {
            _context = context;
            _logger = logger;
            _encryptionKey = configuration["Encryption:Key"] ?? throw new InvalidOperationException("Encryption key not configured");
        }

        public async Task<List<CardDto>> GetUserCardsAsync(Guid userId)
        {
            var userWalletIds = await _context.Wallets
                .Where(w => w.UserId == userId)
                .Select(w => w.Id)
                .ToListAsync();

            var cards = await _context.Cards
                .Include(c => c.Wallet)
                .Where(c => userWalletIds.Contains(c.WalletId) && c.Status != CardStatus.Cancelled)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return cards.Select(MapToCardDto).ToList();
        }

        public async Task<CardDto?> GetCardByIdAsync(Guid cardId, Guid userId)
        {
            var card = await _context.Cards
                .Include(c => c.Wallet)
                .FirstOrDefaultAsync(c => c.Id == cardId);

            if (card == null)
                return null;

            // Verify ownership
            if (card.Wallet.UserId != userId)
                return null;

            return MapToCardDto(card);
        }

        public async Task<CardDto> CreateVirtualCardAsync(Guid userId, CreateCardRequest request)
        {
            // Verify wallet ownership
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.Id == request.WalletId && w.UserId == userId);

            if (wallet == null)
                throw new UnauthorizedAccessException("Wallet not found or access denied");

            if (wallet.Status != WalletStatus.Active)
                throw new InvalidOperationException("Wallet is not active");

            // Check if user has reached card limit (e.g., max 5 active cards)
            var activeCardCount = await _context.Cards
                .CountAsync(c => c.Wallet.UserId == userId && 
                                c.Status == CardStatus.Active);

            if (activeCardCount >= 5)
                throw new InvalidOperationException("Maximum number of active cards reached");

            // Generate card details
            var cardNumber = GenerateCardNumber();
            var cvv = GenerateCVV();
            var expiry = GenerateExpiry();

            var card = new Card
            {
                WalletId = request.WalletId,
                CardType = "Virtual",
                CardNumber = EncryptCardNumber(cardNumber),
                LastFourDigits = cardNumber.Substring(cardNumber.Length - 4),
                CardHolderName = request.CardHolderName.ToUpper(),
                ExpiryMonth = expiry.Month,
                ExpiryYear = expiry.Year,
                CVV = EncryptCVV(cvv),
                Status = CardStatus.Active,
                SpendingLimit = request.SpendingLimit ?? 1000,
                DailyLimit = request.DailyLimit ?? 500,
                MonthlyLimit = request.MonthlyLimit ?? 5000
            };

            _context.Cards.Add(card);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Virtual card created: {CardId} for user {UserId}", card.Id, userId);

            return MapToCardDto(card);
        }

        public async Task<CardDto> UpdateCardStatusAsync(Guid cardId, Guid userId, CardStatus newStatus)
        {
            var card = await _context.Cards
                .Include(c => c.Wallet)
                .FirstOrDefaultAsync(c => c.Id == cardId);

            if (card == null)
                throw new InvalidOperationException("Card not found");

            if (card.Wallet.UserId != userId)
                throw new UnauthorizedAccessException("Access denied");

            // Validate status transitions
            if (card.Status == CardStatus.Cancelled)
                throw new InvalidOperationException("Cannot modify cancelled card");

            if (newStatus == CardStatus.Cancelled && card.Status == CardStatus.Cancelled)
                throw new InvalidOperationException("Card already cancelled");

            card.Status = newStatus;
            card.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Card {CardId} status changed to {Status} by user {UserId}", 
                cardId, newStatus, userId);

            return MapToCardDto(card);
        }

        public async Task<CardDto> UpdateCardLimitsAsync(Guid cardId, Guid userId, UpdateCardLimitsRequest request)
        {
            var card = await _context.Cards
                .Include(c => c.Wallet)
                .FirstOrDefaultAsync(c => c.Id == cardId);

            if (card == null)
                throw new InvalidOperationException("Card not found");

            if (card.Wallet.UserId != userId)
                throw new UnauthorizedAccessException("Access denied");

            if (card.Status == CardStatus.Cancelled)
                throw new InvalidOperationException("Cannot modify cancelled card");

            // Update limits
            if (request.DailyLimit.HasValue)
                card.DailyLimit = request.DailyLimit.Value;

            if (request.MonthlyLimit.HasValue)
                card.MonthlyLimit = request.MonthlyLimit.Value;

            if (request.SpendingLimit.HasValue)
                card.SpendingLimit = request.SpendingLimit.Value;

            card.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Card {CardId} limits updated by user {UserId}", cardId, userId);

            return MapToCardDto(card);
        }

        public async Task<bool> DeleteCardAsync(Guid cardId, Guid userId)
        {
            var card = await _context.Cards
                .Include(c => c.Wallet)
                .FirstOrDefaultAsync(c => c.Id == cardId);

            if (card == null)
                return false;

            if (card.Wallet.UserId != userId)
                throw new UnauthorizedAccessException("Access denied");

            // Soft delete by setting status to cancelled
            card.Status = CardStatus.Cancelled;
            card.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Card {CardId} cancelled by user {UserId}", cardId, userId);

            return true;
        }

        public async Task<CardSpendingDto> GetCardSpendingAsync(Guid cardId, Guid userId)
        {
            var card = await _context.Cards
                .Include(c => c.Wallet)
                .FirstOrDefaultAsync(c => c.Id == cardId);

            if (card == null)
                throw new InvalidOperationException("Card not found");

            if (card.Wallet.UserId != userId)
                throw new UnauthorizedAccessException("Access denied");

            var now = DateTime.UtcNow;
            var startOfDay = now.Date;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            // TODO: When you have card transactions, calculate actual spending
            // For now, return zeros
            return new CardSpendingDto
            {
                CardId = cardId,
                DailySpent = 0,
                DailyLimit = card.DailyLimit,
                MonthlySpent = 0,
                MonthlyLimit = card.MonthlyLimit,
                TotalLimit = card.SpendingLimit
            };
        }

        // Helper methods
        private CardDto MapToCardDto(Card card)
        {
            return new CardDto
            {
                Id = card.Id,
                WalletId = card.WalletId,
                CardType = card.CardType,
                LastFourDigits = card.LastFourDigits,
                CardHolderName = card.CardHolderName,
                ExpiryMonth = card.ExpiryMonth,
                ExpiryYear = card.ExpiryYear,
                Status = card.Status.ToString(),
                SpendingLimit = card.SpendingLimit,
                DailyLimit = card.DailyLimit,
                MonthlyLimit = card.MonthlyLimit,
                CurrencyCode = card.Wallet.CurrencyCode,
                CreatedAt = card.CreatedAt
            };
        }

        private string GenerateCardNumber()
        {
            // Generate a valid-looking card number (not real, for demo purposes)
            // In production, integrate with actual card issuer
            var random = new Random();
            var bin = "4111"; // Visa test BIN
            var account = random.Next(100000000, 999999999).ToString();
            var checkDigit = "0"; // Simplified
            return bin + account + checkDigit;
        }

        private string GenerateCVV()
        {
            var random = new Random();
            return random.Next(100, 999).ToString();
        }

        private (string Month, string Year) GenerateExpiry()
        {
            var expiry = DateTime.UtcNow.AddYears(3);
            return (expiry.Month.ToString("D2"), expiry.Year.ToString().Substring(2));
        }

        private string EncryptCardNumber(string cardNumber)
        {
            // Simple encryption - in production use proper encryption (AES-256)
            // This is just a placeholder
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(cardNumber));
        }

        private string EncryptCVV(string cvv)
        {
            // Simple encryption - in production use proper encryption
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(cvv));
        }
    }
}