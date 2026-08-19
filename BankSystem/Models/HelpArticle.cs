// ============================================
// FILE: Models/HelpArticle.cs
// PURPOSE: Help center article/FAQ entity
// ============================================

using System;

namespace FinTech.Models
{
    public class HelpArticle
    {
        public Guid Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public int SortOrder { get; set; } = 0;
        public bool IsPublished { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}