
// ================================================================
// FILE: src/lib/api/moneyRequests.ts
// ================================================================

import { api } from ".";

export interface MoneyRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  payerId: string;
  payerName: string;
  amount: number;
  currency: string;
  description: string | null;
  status: "Pending" | "Paid" | "Declined" | "Cancelled" | "Expired";
  createdAt: string;
  respondedAt: string | null;
  expiresAt: string;
  transactionId: string | null;
}

export interface PaginatedMoneyRequests {
  items: MoneyRequest[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateMoneyRequestRequest {
  requesterWalletId: string;
  payerEmail: string;
  amount: number;
  description?: string;
}

export interface AcceptMoneyRequestRequest {
  idempotencyKey: string;
  fromWalletId: string;
}

export const moneyRequestsApi = {
  create: (req: CreateMoneyRequestRequest) =>
    api.post<MoneyRequest>("/user/money-requests", req),

  getIncoming: (page = 1, pageSize = 20) =>
    api.get<PaginatedMoneyRequests>(
      `/user/money-requests/incoming?page=${page}&pageSize=${pageSize}`
    ),

  getOutgoing: (page = 1, pageSize = 20) =>
    api.get<PaginatedMoneyRequests>(
      `/user/money-requests/outgoing?page=${page}&pageSize=${pageSize}`
    ),

  get: (id: string) => api.get<MoneyRequest>(`/user/money-requests/${id}`),

  accept: (id: string, req: AcceptMoneyRequestRequest) =>
    api.post<MoneyRequest>(`/user/money-requests/${id}/accept`, req),

  decline: (id: string) =>
    api.post<MoneyRequest>(`/user/money-requests/${id}/decline`),

  cancel: (id: string) =>
    api.post<MoneyRequest>(`/user/money-requests/${id}/cancel`),
};
