// ============================================
// FILE: lib/api/analytics.ts
// PURPOSE: Analytics summary API (totals, monthly trend,
// spending by type, weekly spending)
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
	getSummary: (params?: AnalyticsSummaryParams) =>
		api.get<AnalyticsSummary>("/user/analytics/summary", { params }),
};
