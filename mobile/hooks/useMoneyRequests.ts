
// ================================================================
// MOBILE: hooks/useMoneyRequests.ts
// PURPOSE: React Query hook for requests
// ================================================================

import {
  moneyRequestsApi,
  type CreateMoneyRequestRequest,
  type AcceptMoneyRequestRequest,
} from "@/lib/api/money-requests";
import { unwrapResult } from "@/lib/api/unwrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useIncomingMoneyRequests(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["money-requests", "incoming", page, pageSize],
    queryFn: () => unwrapResult(moneyRequestsApi.getIncoming(page, pageSize)),
  });
}

export function useOutgoingMoneyRequests(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["money-requests", "outgoing", page, pageSize],
    queryFn: () => unwrapResult(moneyRequestsApi.getOutgoing(page, pageSize)),
  });
}

export function useCreateMoneyRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateMoneyRequestRequest) =>
      unwrapResult(moneyRequestsApi.create(req)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["money-requests", "outgoing"] }),
  });
}

export function useAcceptMoneyRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: AcceptMoneyRequestRequest }) =>
      unwrapResult(moneyRequestsApi.accept(id, req)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["money-requests"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeclineMoneyRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unwrapResult(moneyRequestsApi.decline(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["money-requests"] }),
  });
}

export function useCancelMoneyRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unwrapResult(moneyRequestsApi.cancel(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["money-requests"] }),
  });
}
