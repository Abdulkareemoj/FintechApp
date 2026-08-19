// ============================================
// FILE: hooks/useInbox.ts
// PURPOSE: React Query hooks for inbox messages
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inboxApi } from "@/lib/api/inbox";

export function useInboxMessages() {
  return useQuery({
    queryKey: ["inbox"],
    queryFn: async () => {
      const result = await inboxApi.getMessages();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useInboxUnreadCount() {
  return useQuery({
    queryKey: ["inbox", "unread"],
    queryFn: async () => {
      const result = await inboxApi.getUnreadCount();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const result = await inboxApi.markRead(messageId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      queryClient.invalidateQueries({ queryKey: ["inbox", "unread"] });
    },
  });
}

export function useMarkAllMessagesRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await inboxApi.markAllRead();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      queryClient.invalidateQueries({ queryKey: ["inbox", "unread"] });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const result = await inboxApi.deleteMessage(messageId);
      if (!result.ok) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inbox"] });
      queryClient.invalidateQueries({ queryKey: ["inbox", "unread"] });
    },
  });
}