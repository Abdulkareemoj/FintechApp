// ============================================
// FILE: hooks/useAnalytics.ts (React Query Hook)
// PURPOSE: React Query hook for the analytics summary
// ============================================

import { useQuery } from "@tanstack/react-query";
import { type AnalyticsSummaryParams, analyticsApi } from "@/lib/api/analytics";

export function useAnalyticsSummary(params?: AnalyticsSummaryParams) {
	return useQuery({
		queryKey: ["analytics", "summary", params ?? {}],
		queryFn: () => analyticsApi.getSummary(params),
	});
}
