
// ================================================================
// FILE: src/hooks/useDeposits.ts
// PURPOSE: React Query hook for deposits
// ================================================================

import { depositsApi, type InitiateDepositRequest } from "@/lib/api/deposits";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDeposit(depositId: string | undefined) {
  return useQuery({
    queryKey: ["deposit", depositId],
    queryFn: () => depositsApi.get(depositId as string),
    enabled: !!depositId,
  });
}

// Poll status while a deposit is pending — stop once it resolves.
export function useDepositStatus(depositId: string ) {
  return useQuery({
    queryKey: ["deposit-status", depositId],
    queryFn: () => depositsApi.getStatus(depositId ),
    enabled: !!depositId,
    refetchInterval: (query) =>
      query.state.data?.status === "Pending" ? 3000 : false,
  });
}

export function useInitiateDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: InitiateDepositRequest) => depositsApi.initiate(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

// DEV ONLY helper — lets you finish testing a deposit locally
// without a real payment provider wired in yet.
export function useSimulateDepositCallback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      depositId,
      success,
      failureReason,
    }: {
      depositId: string;
      success: boolean;
      failureReason?: string;
    }) => depositsApi.simulateCallback(depositId, success, failureReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["deposit-status"] });
    },
  });
}
