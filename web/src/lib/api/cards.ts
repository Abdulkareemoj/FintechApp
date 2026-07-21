// ============================================
// FILE: lib/api/cards.ts
// PURPOSE: Card-related API calls
// ============================================

import { api } from ".";

export interface Card {
  id: string;
  walletId: string;
  cardType: string;
  lastFourDigits: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  status: string;
  spendingLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  currencyCode: string;
  createdAt: string;
}

export interface CreateCardRequest {
  walletId: string;
  cardHolderName: string;
  spendingLimit?: number;
  dailyLimit?: number;
  monthlyLimit?: number;
}

export interface UpdateCardLimitsRequest {
  dailyLimit?: number;
  monthlyLimit?: number;
  spendingLimit?: number;
}

export interface CardSpending {
  cardId: string;
  dailySpent: number;
  dailyLimit: number;
  monthlySpent: number;
  monthlyLimit: number;
  totalLimit: number;
}

export const cardsApi = {
  // Get all user cards
  getCards: () => api.get<Card[]>("/user/cards"),

  // Get specific card
  getCard: (cardId: string) => api.get<Card>(`/user/cards/${cardId}`),

  // Create virtual card
  createCard: (card: CreateCardRequest) => api.post<Card>("/user/cards", card),

  // Freeze card
  freezeCard: (cardId: string) => api.put<Card>(`/user/cards/${cardId}/freeze`),

  // Unfreeze card
  unfreezeCard: (cardId: string) =>
    api.put<Card>(`/user/cards/${cardId}/unfreeze`),

  // Update card limits
  updateLimits: (cardId: string, limits: UpdateCardLimitsRequest) =>
    api.put<Card>(`/user/cards/${cardId}/limits`, limits),

  // Get card spending
  getSpending: (cardId: string) =>
    api.get<CardSpending>(`/user/cards/${cardId}/spending`),

  // Delete card
  deleteCard: (cardId: string) => api.delete(`/user/cards/${cardId}`),
};
