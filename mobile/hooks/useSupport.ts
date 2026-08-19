// ============================================
// FILE: hooks/useSupport.ts
// PURPOSE: React Query hook for support tickets
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateSupportTicketRequest,
  supportApi,
} from "@/lib/api/support";

export function useMyTickets() {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const result = await supportApi.getMyTickets();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateSupportTicketRequest) => {
      const result = await supportApi.createTicket(request);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
}

export function useTicketMessages(ticketId: string | null) {
  return useQuery({
    queryKey: ["support-tickets", ticketId, "messages"],
    queryFn: async () => {
      const result = await supportApi.getTicketMessages(ticketId as string);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    enabled: !!ticketId,
  });
}

export function useSendTicketMessage(ticketId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: string) => {
      const result = await supportApi.sendMessage(ticketId as string, body);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["support-tickets", ticketId, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
}