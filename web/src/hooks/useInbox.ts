// ============================================
// FILE: hooks/useInbox.ts
// PURPOSE: React Query hooks for inbox messages
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inboxApi } from "@/lib/api/inbox";

export function useInboxMessages() {
	return useQuery({
		queryKey: ["inbox"],
		queryFn: () => inboxApi.getMessages(),
	});
}

export function useInboxUnreadCount() {
	return useQuery({
		queryKey: ["inbox", "unread"],
		queryFn: () => inboxApi.getUnreadCount(),
	});
}

export function useMarkMessageRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (messageId: string) => inboxApi.markRead(messageId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox"] });
			queryClient.invalidateQueries({ queryKey: ["inbox", "unread"] });
		},
	});
}

export function useMarkAllMessagesRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => inboxApi.markAllRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox"] });
			queryClient.invalidateQueries({ queryKey: ["inbox", "unread"] });
		},
	});
}

export function useDeleteMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (messageId: string) => inboxApi.deleteMessage(messageId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inbox"] });
			queryClient.invalidateQueries({ queryKey: ["inbox", "unread"] });
		},
	});
}
