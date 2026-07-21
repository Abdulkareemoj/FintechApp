// ============================================
// FILE: hooks/useTransactions.ts
// PURPOSE: React Query hook for transactions
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type TransactionQueryParams,
  transactionsApi,
} from "@/lib/api/transactions";

export function useTransactions(params?: TransactionQueryParams) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionsApi.getTransactions(params),
  });
}

export function useTransaction(transactionId: string) {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => transactionsApi.getTransaction(transactionId),
    enabled: !!transactionId,
  });
}

export function useRecentRecipients(limit?: number) {
  return useQuery({
    queryKey: ["recent-recipients", limit],
    queryFn: () => transactionsApi.getRecentRecipients(limit),
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionsApi.createTransfer,
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
    },
  });
}
