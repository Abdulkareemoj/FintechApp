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
		queryFn: billsApi.getBills,
	});
}

export function useCreateBill() {
	const invalidate = useInvalidateMoneyQueries();

	return useMutation({
		mutationFn: (req: CreateBillRequest) => billsApi.createBill(req),
		onSuccess: invalidate,
	});
}

export function useDeleteBill() {
	const invalidate = useInvalidateMoneyQueries();

	return useMutation({
		mutationFn: (id: string) => billsApi.deleteBill(id),
		onSuccess: invalidate,
	});
}

export function usePayBill() {
	const invalidate = useInvalidateMoneyQueries();

	return useMutation({
		mutationFn: ({ id, req }: { id: string; req: PayBillRequest }) =>
			billsApi.payBill(id, req),
		onSuccess: invalidate,
	});
}

export function useQuickPayBill() {
	const invalidate = useInvalidateMoneyQueries();

	return useMutation({
		mutationFn: (req: QuickPayBillRequest) => billsApi.quickPay(req),
		onSuccess: invalidate,
	});
}
