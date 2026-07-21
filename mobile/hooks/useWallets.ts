// ============================================
// FILE: hooks/useWallets.ts (React Query Hook)
// PURPOSE: React Query hook for wallets
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletsApi } from "@/lib/api/wallets";

export function useWallets() {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      const result = await walletsApi.getWallets();
      if (!result.ok) {
        throw new Error(result.error);
      }
      // API returns { success: true, data: [...] }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useWallet(walletId: string) {
  return useQuery({
    queryKey: ["wallet", walletId],
    queryFn: async () => {
      const result = await walletsApi.getWallet(walletId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    enabled: !!walletId,
  });
}

export function useWalletBalance(walletId: string) {
  return useQuery({
    queryKey: ["wallet-balance", walletId],
    queryFn: async () => {
      const result = await walletsApi.getBalance(walletId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    enabled: !!walletId,
    refetchInterval: 30_000, // Refresh every 30 seconds
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (currencyCode: string) => {
      const result = await walletsApi.createWallet(currencyCode);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}
