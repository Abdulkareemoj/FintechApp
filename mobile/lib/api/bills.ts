// ============================================
// FILE: lib/api/bills.ts
// PURPOSE: Bill-related API calls
// ============================================

import { api } from ".";

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
  getBills: () => api.get<Bill[]>("/user/bills", { auth: true }),
  createBill: (bill: CreateBillRequest) =>
    api.post<Bill>("/user/bills", bill, { auth: true }),
  deleteBill: (billId: string) =>
    api.delete<boolean>(`/user/bills/${billId}`, { auth: true }),
  payBill: (billId: string, req: PayBillRequest) =>
    api.post<Bill>(`/user/bills/${billId}/pay`, req, { auth: true }),
  quickPay: (req: QuickPayBillRequest) =>
    api.post<Bill>("/user/bills/pay", req, { auth: true }),
};
