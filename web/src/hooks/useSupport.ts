// ============================================
// FILE: hooks/useSupport.ts
// PURPOSE: React Query hooks for support tickets
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type CreateSupportTicketRequest, supportApi } from "@/lib/api/support";

export function useMyTickets() {
	return useQuery({
		queryKey: ["support-tickets"],
		queryFn: () => supportApi.getMyTickets(),
	});
}

export function useCreateTicket() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (request: CreateSupportTicketRequest) =>
			supportApi.createTicket(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
		},
	});
}

export function useTicketMessages(ticketId: string | null) {
	return useQuery({
		queryKey: ["support-tickets", ticketId, "messages"],
		queryFn: () => supportApi.getTicketMessages(ticketId as string),
		enabled: !!ticketId,
	});
}

export function useSendTicketMessage(ticketId: string | null) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: string) =>
			supportApi.sendMessage(ticketId as string, body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["support-tickets", ticketId, "messages"],
			});
			queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
		},
	});
}
