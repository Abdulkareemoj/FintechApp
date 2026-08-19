// ============================================
// FILE: hooks/useHelp.ts
// PURPOSE: React Query hooks for help articles
// ============================================

import { useQuery } from "@tanstack/react-query";
import { helpApi } from "@/lib/api/help";

export function useHelpArticles() {
	return useQuery({
		queryKey: ["help-articles"],
		queryFn: () => helpApi.getArticles(),
	});
}
