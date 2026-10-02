using System;
using System.Collections.Generic;

namespace FinTech.Models.DTOs.UserDashboard
{
    public class AnalyticsSummaryDto
    {
        public string Currency { get; set; } = "USD";
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetSavings { get; set; }
        public decimal SavingsRate { get; set; }
        public int TransactionCount { get; set; }
        public int ExpenseCount { get; set; }
        public decimal AverageTransaction { get; set; }
        public List<MonthlyAnalyticsDto> Monthly { get; set; } = new();
        public List<CategoryTotalDto> Categories { get; set; } = new();
        public List<DailyTotalDto> Weekly { get; set; } = new();
    }

    public class MonthlyAnalyticsDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Income { get; set; }
        public decimal Expenses { get; set; }
        public decimal Savings { get; set; }
    }

    public class CategoryTotalDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Value { get; set; }
    }

    public class DailyTotalDto
    {
        public string Day { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
