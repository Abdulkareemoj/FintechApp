// ============================================
// FILE: hooks/useNotifications.ts
// PURPOSE: React Query hooks for notifications
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";

export function useNotifications() {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: () => notificationsApi.getNotifications(),
	});
}

export function useNotificationsUnreadCount() {
	return useQuery({
		queryKey: ["notifications", "unread"],
		queryFn: () => notificationsApi.getUnreadCount(),
	});
}

export function useMarkNotificationRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (notificationId: string) =>
			notificationsApi.markRead(notificationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
		},
	});
}

export function useMarkAllNotificationsRead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => notificationsApi.markAllRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
		},
	});
}
