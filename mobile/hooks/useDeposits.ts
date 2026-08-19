// ================================================================
// MOBILE: hooks/useDeposits.ts
// PURPOSE: React Query hook for desposits
// ================================================================
//

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { depositsApi, type InitiateDepositRequest } from "@/lib/api/deposits";
import { unwrapResult } from "@/lib/api/unwrap";

export function useDepositStatus(id: string | undefined) {
  return useQuery({
    queryKey: ["deposit-status", id],
    queryFn: () => unwrapResult(depositsApi.getStatus(id as string)),
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.status === "Pending" ? 3000 : false,
  });
}

export function useInitiateDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: InitiateDepositRequest) =>
      unwrapResult(depositsApi.initiate(req)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
}


export function useSimulateDepositCallback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ depositId, success }: { depositId: string; success: boolean }) =>
      unwrapResult(depositsApi.simulateCallback(depositId, success)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["deposit-status"] });
    },
  });
}
