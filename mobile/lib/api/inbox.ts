// ============================================
// FILE: lib/api/inbox.ts
// PURPOSE: Inbox message API calls
// ============================================

import { api } from ".";

export interface InboxMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const inboxApi = {
  // Get user inbox messages
  getMessages: () => api.get<InboxMessage[]>("/user/inbox", { auth: true }),

  // Mark a single message as read
  markRead: (messageId: string) =>
    api.put<InboxMessage>(`/user/inbox/${messageId}/read`, {}, { auth: true }),

  // Mark all messages as read
  markAllRead: () =>
    api.put<{ marked: number }>("/user/inbox/read-all", {}, { auth: true }),

  // Get unread count
  getUnreadCount: () =>
    api.get<{ count: number }>("/user/inbox/unread-count", { auth: true }),

  // Delete a message
  deleteMessage: (messageId: string) =>
    api.delete(`/user/inbox/${messageId}`, { auth: true }),
};