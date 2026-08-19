// ============================================
// FILE: Models/DTOs/UserDashboard/HelpDTOs.cs
// ============================================

using System;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class HelpArticleDto
    {
        public Guid Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
    }
}