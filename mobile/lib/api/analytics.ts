// ============================================
// FILE: lib/api/analytics.ts
// PURPOSE: Analytics summary API (totals, monthly trend,
// spending by category, weekly spending)
// ============================================

import { api } from "@/lib/api";

export interface MonthlyPoint {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategoryTotal {
  name: string;
  value: number;
}

export interface DailyTotal {
  day: string;
  amount: number;
}

export interface AnalyticsSummary {
  currency: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  transactionCount: number;
  expenseCount: number;
  averageTransaction: number;
  monthly: MonthlyPoint[];
  categories: CategoryTotal[];
  weekly: DailyTotal[];
}

export interface AnalyticsSummaryParams {
  currency?: string;
  months?: number;
}

export const analyticsApi = {
  getSummary: (params?: AnalyticsSummaryParams) => {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();

    return api.get<AnalyticsSummary>(
      `/user/analytics/summary${query ? `?${query}` : ""}`,
      { auth: true }
    );
  },
};
