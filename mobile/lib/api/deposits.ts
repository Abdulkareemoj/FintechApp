
// ================================================================
// MOBILE — FILE: lib/api/deposits.ts   (NEW)
// ================================================================

import { api } from ".";

export type DepositSource = "BankTransfer" | "DebitCard" | "USSD" | "Other";

export interface Deposit {
  id: string;
  walletId: string;
  amount: number;
  currency: string;
  status: "Pending" | "Completed" | "Failed";
  source: string | null;
  referenceId: string | null;
  description: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface DepositStatus {
  id: string;
  status: "Pending" | "Completed" | "Failed";
  amount: number;
  currency: string;
  createdAt: string;
  completedAt: string | null;
}

export interface InitiateDepositRequest {
  idempotencyKey: string;
  walletId: string;
  amount: number;
  source: DepositSource;
  description?: string;
}

export const depositsApi = {
  initiate: (req: InitiateDepositRequest) =>
    api.post<Deposit>("/user/deposits/initiate", req, { auth: true }),

  get: (depositId: string) =>
    api.get<Deposit>(`/user/deposits/${depositId}`, { auth: true }),

  getStatus: (depositId: string) =>
    api.get<DepositStatus>(`/user/deposits/${depositId}/status`, {
      auth: true,
    }),

  // DEV ONLY — stands in for a real payment webhook. 404s outside Development.
  simulateCallback: (
    depositId: string,
    success: boolean,
    failureReason?: string
  ) =>
    api.post<Deposit>(
      `/user/deposits/${depositId}/simulate-callback`,
      { success, failureReason },
      { auth: true }
    ),
};
