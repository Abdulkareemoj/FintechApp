// ============================================
// FILE: hooks/useAnalytics.ts (React Query Hook)
// PURPOSE: React Query hook for the analytics summary
// ============================================

import { useQuery } from "@tanstack/react-query";
import {
  analyticsApi,
  type AnalyticsSummaryParams,
} from "@/lib/api/analytics";

export function useAnalyticsSummary(params?: AnalyticsSummaryParams) {
  return useQuery({
    queryKey: ["analytics", "summary", params ?? {}],
    queryFn: async () => {
      const result = await analyticsApi.getSummary(params);
      if (!result.ok) {
        throw new Error(result.error);
      }
      // API returns { success: true, data: {...} }
      const response = result.data as any;
      return response.data || response;
    },
  });
}
