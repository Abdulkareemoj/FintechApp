
// ================================================================
// FILE: hooks/useRecipientLookup.ts
// PURPOSE: React Query hook for lookups
// ================================================================

import { recipientsApi } from "@/lib/api/recipients";
import { unwrapResult } from "@/lib/api/unwrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRecipientLookup() {
  return useMutation({
    mutationFn: ({ identifier, currency }: { identifier: string; currency: string }) =>
      unwrapResult(recipientsApi.lookupByEmail(identifier, currency)),
  });
}
