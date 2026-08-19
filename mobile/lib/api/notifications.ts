// ============================================
// FILE: lib/api/notifications.ts
// PURPOSE: Notification API calls
// ============================================

import { api } from ".";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  // Get user notifications
  getNotifications: () =>
    api.get<Notification[]>("/user/notifications", { auth: true }),

  // Mark a single notification as read
  markRead: (notificationId: string) =>
    api.put<Notification>(
      `/user/notifications/${notificationId}/read`,
      {},
      { auth: true }
    ),

  // Mark all notifications as read
  markAllRead: () =>
    api.put<{ marked: number }>(
      "/user/notifications/read-all",
      {},
      { auth: true }
    ),

  // Get unread count
  getUnreadCount: () =>
    api.get<{ count: number }>("/user/notifications/unread-count", {
      auth: true,
    }),
};