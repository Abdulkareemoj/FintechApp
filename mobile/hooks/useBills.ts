// ============================================
// FILE: hooks/useBills.ts
// PURPOSE: React Query hooks for bills
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  billsApi,
  type CreateBillRequest,
  type PayBillRequest,
  type QuickPayBillRequest,
} from "@/lib/api/bills";

function useInvalidateMoneyQueries() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["bills"] });
    queryClient.invalidateQueries({ queryKey: ["wallets"] });
    queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };
}

export function useBills() {
  return useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const result = await billsApi.getBills();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return (response.data || response) as import("@/lib/api/bills").Bill[];
    },
  });
}

export function useCreateBill() {
  const invalidate = useInvalidateMoneyQueries();

  return useMutation({
    mutationFn: async (bill: CreateBillRequest) => {
      const result = await billsApi.createBill(bill);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteBill() {
  const invalidate = useInvalidateMoneyQueries();

  return useMutation({
    mutationFn: async (billId: string) => {
      const result = await billsApi.deleteBill(billId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: invalidate,
  });
}

export function usePayBill() {
  const invalidate = useInvalidateMoneyQueries();

  return useMutation({
    mutationFn: async ({ id, req }: { id: string; req: PayBillRequest }) => {
      const result = await billsApi.payBill(id, req);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: invalidate,
  });
}

export function useQuickPayBill() {
  const invalidate = useInvalidateMoneyQueries();

  return useMutation({
    mutationFn: async (req: QuickPayBillRequest) => {
      const result = await billsApi.quickPay(req);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: invalidate,
  });
}
