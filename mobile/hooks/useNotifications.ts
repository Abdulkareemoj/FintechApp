// ============================================
// FILE: hooks/useNotifications.ts
// PURPOSE: React Query hooks for notifications
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const result = await notificationsApi.getNotifications();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useNotificationsUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      const result = await notificationsApi.getUnreadCount();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const result = await notificationsApi.markRead(notificationId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await notificationsApi.markAllRead();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });
}