
// ================================================================
//  FILE: src/hooks/useRecipientLookup.ts
// This is an on-demand action (triggered by a form/button), not
// passive data, so it's modeled as a mutation rather than a query.
// ================================================================
import { recipientsApi } from "@/lib/api/recipients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRecipientLookup() {
  return useMutation({
    mutationFn: ({ identifier, currency }: { identifier: string; currency: string }) =>
      recipientsApi.lookupByEmail(identifier, currency),
  });
}
