// ============================================
// FILE: lib/api/bills.ts
// PURPOSE: Typed API module for bills + bill payments
// ============================================

import { api } from "@/lib/api/index";

export type BillStatus = "paid" | "overdue" | "due" | "upcoming";

export interface Bill {
	id: string;
	name: string;
	category: string;
	amount: number;
	reference: string | null;
	dueDate: string;
	createdAt: string;
	status: BillStatus;
	paidAt: string | null;
	paidWalletId: string | null;
	transactionId: string | null;
}

export interface CreateBillRequest {
	name: string;
	category: string;
	amount: number;
	dueDate: string;
	reference?: string;
}

export interface PayBillRequest {
	walletId: string;
	idempotencyKey?: string;
}

export interface QuickPayBillRequest {
	category: string;
	name?: string;
	amount: number;
	reference?: string;
	walletId: string;
	idempotencyKey?: string;
}

export const BILL_CATEGORIES = [
	"Electricity",
	"Water",
	"Gas",
	"Internet",
	"Phone",
	"TV & Cable",
	"Insurance",
	"Airtime",
	"Data",
	"Other",
] as const;

export const billsApi = {
	getBills: () => api.get<Bill[]>("/user/bills"),
	createBill: (req: CreateBillRequest) => api.post<Bill>("/user/bills", req),
	deleteBill: (id: string) => api.delete<boolean>(`/user/bills/${id}`),
	payBill: (id: string, req: PayBillRequest) =>
		api.post<Bill>(`/user/bills/${id}/pay`, req),
	quickPay: (req: QuickPayBillRequest) =>
		api.post<Bill>("/user/bills/pay", req),
};
