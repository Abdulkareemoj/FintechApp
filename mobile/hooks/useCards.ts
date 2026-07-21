// ============================================
// FILE: hooks/useCards.ts
// PURPOSE: React Query hook for cards
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cardsApi } from "@/lib/api/cards";

export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const result = await cardsApi.getCards();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useCard(cardId: string) {
  return useQuery({
    queryKey: ["card", cardId],
    queryFn: async () => {
      const result = await cardsApi.getCard(cardId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    enabled: !!cardId,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (card: import("@/lib/api/cards").CreateCardRequest) => {
      const result = await cardsApi.createCard(card);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useFreezeCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId: string) => {
      const result = await cardsApi.freezeCard(cardId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUnfreezeCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId: string) => {
      const result = await cardsApi.unfreezeCard(cardId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}
