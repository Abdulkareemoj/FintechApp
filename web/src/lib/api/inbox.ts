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
	getMessages: () => api.get<InboxMessage[]>("/user/inbox"),

	// Mark a single message as read
	markRead: (messageId: string) =>
		api.put<InboxMessage>(`/user/inbox/${messageId}/read`),

	// Mark all messages as read
	markAllRead: () => api.put<{ marked: number }>("/user/inbox/read-all"),

	// Get unread count
	getUnreadCount: () => api.get<{ count: number }>("/user/inbox/unread-count"),

	// Delete a message
	deleteMessage: (messageId: string) =>
		api.delete<{ success: boolean }>(`/user/inbox/${messageId}`),
};
