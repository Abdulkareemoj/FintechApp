// ============================================
// FILE: hooks/useWallets.ts (React Query Hook)
// PURPOSE: React Query hook for wallets
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletsApi } from "@/lib/api/wallets";

export function useWallets() {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: walletsApi.getWallets,
  });
}

export function useWallet(walletId: string) {
  return useQuery({
    queryKey: ["wallet", walletId],
    queryFn: () => walletsApi.getWallet(walletId),
    enabled: !!walletId,
  });
}

export function useWalletBalance(walletId: string) {
  return useQuery({
    queryKey: ["wallet-balance", walletId],
    queryFn: () => walletsApi.getBalance(walletId),
    enabled: !!walletId,
    refetchInterval: 30_000, // Refresh every 30 seconds
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletsApi.createWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}
