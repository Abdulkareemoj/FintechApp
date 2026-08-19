// ============================================
// FILE: hooks/useHelp.ts
// PURPOSE: React Query hook for help articles
// ============================================

import { useQuery } from "@tanstack/react-query";
import { helpApi } from "@/lib/api/help";

export function useHelpArticles() {
  return useQuery({
    queryKey: ["help-articles"],
    queryFn: async () => {
      const result = await helpApi.getArticles();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}