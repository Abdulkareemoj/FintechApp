// ============================================
// FILE: Services/UserDashboard/HelpService.cs
// PURPOSE: Help center article operations
// ============================================

using Microsoft.EntityFrameworkCore;
using FinTech.Data;
using FinTech.Models.DTOs.UserDashboard;

namespace FinTech.Services.UserDashboard
{
    public interface IHelpService
    {
        Task<List<HelpArticleDto>> GetPublishedArticlesAsync();
    }

    public class HelpService : IHelpService
    {
        private readonly AppDbContext _context;

        public HelpService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<HelpArticleDto>> GetPublishedArticlesAsync()
        {
            var articles = await _context.HelpArticles
                .Where(a => a.IsPublished)
                .OrderBy(a => a.SortOrder)
                .ThenBy(a => a.CreatedAt)
                .ToListAsync();

            return articles.Select(a => new HelpArticleDto
            {
                Id = a.Id,
                Category = a.Category,
                Question = a.Question,
                Answer = a.Answer
            }).ToList();
        }
    }
}