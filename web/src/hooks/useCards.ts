// ============================================
// FILE: hooks/useCards.ts
// PURPOSE: React Query hook for cards
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cardsApi } from "@/lib/api/cards";

export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: cardsApi.getCards,
  });
}

export function useCard(cardId: string) {
  return useQuery({
    queryKey: ["card", cardId],
    queryFn: () => cardsApi.getCard(cardId),
    enabled: !!cardId,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cardsApi.createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useFreezeCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cardsApi.freezeCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useUnfreezeCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cardsApi.unfreezeCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}
