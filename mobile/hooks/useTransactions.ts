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
    queryFn: async () => {
      const result = await transactionsApi.getTransactions(params);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useTransaction(transactionId: string) {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      const result = await transactionsApi.getTransaction(transactionId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    enabled: !!transactionId,
  });
}

export function useRecentRecipients(limit?: number) {
  return useQuery({
    queryKey: ["recent-recipients", limit],
    queryFn: async () => {
      const result = await transactionsApi.getRecentRecipients(limit);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      transfer: import("@/lib/api/transactions").CreateTransferRequest
    ) => {
      const result = await transactionsApi.createTransfer(transfer);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
    },
  });
}
