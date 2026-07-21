// ============================================
// FILE: lib/api/transactions.ts
// PURPOSE: Transaction-related API calls
// ============================================

import { api } from ".";

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description: string | null;
  direction: "incoming" | "outgoing";
  createdAt: string;
}

export interface TransactionDetail {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description: string | null;
  direction: "incoming" | "outgoing";
  fromWallet: {
    id: string;
    currencyCode: string;
    ownerName: string;
    isCurrentUser: boolean;
  } | null;
  toWallet: {
    id: string;
    currencyCode: string;
    ownerName: string;
    isCurrentUser: boolean;
  } | null;
  createdAt: string;
  completedAt: string | null;
  referenceId: string | null;
}

export interface TransactionQueryParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
  status?: string;
  search?: string;
}

export interface PaginatedTransactions {
  items: Transaction[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateTransferRequest {
  idempotencyKey: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  description?: string;
}

export interface RecentRecipient {
  userId: string;
  name: string;
  email: string;
  lastTransactionDate: string;
}

export const transactionsApi = {
  // Get user transactions
  getTransactions: (params?: TransactionQueryParams) => {
    const query = new URLSearchParams(
      Object.entries(params || {})
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();

    return api.get<PaginatedTransactions>(
      `/user/transactions${query ? `?${query}` : ""}`,
      { auth: true }
    );
  },

  // Get transaction detail
  getTransaction: (transactionId: string) =>
    api.get<TransactionDetail>(`/user/transactions/${transactionId}`, {
      auth: true,
    }),

  // Create transfer
  createTransfer: (transfer: CreateTransferRequest) =>
    api.post<Transaction>("/user/transactions/transfer", transfer, {
      auth: true,
    }),

  // Get recent recipients
  getRecentRecipients: (limit?: number) =>
    api.get<RecentRecipient[]>(
      `/user/transactions/recent-recipients${limit ? `?limit=${limit}` : ""}`,
      { auth: true }
    ),
};
