// ============================================
// FILE: lib/api/wallets.ts
// PURPOSE: Wallet-related API calls
// ============================================

import { api } from ".";

export interface Wallet {
  id: string;
  userId: string;
  currencyCode: string;
  balance: number;
  status: string;
  createdAt: string;
}

export interface WalletBalance {
  walletId: string;
  currencyCode: string;
  availableBalance: number;
  pendingBalance: number;
  totalBalance: number;
}

export const walletsApi = {
  // Get all user wallets
  getWallets: () => api.get<Wallet[]>("/user/wallets"),

  // Get specific wallet
  getWallet: (walletId: string) => api.get<Wallet>(`/user/wallets/${walletId}`),

  // Get wallet balance
  getBalance: (walletId: string) =>
    api.get<WalletBalance>(`/user/wallets/${walletId}/balance`),

  // Create new wallet
  createWallet: (currencyCode: string) =>
    api.post<Wallet>("/user/wallets", { currencyCode }),
};
