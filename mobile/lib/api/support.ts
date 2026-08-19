// ============================================
// FILE: lib/api/support.ts
// PURPOSE: Support ticket API calls
// ============================================

import { api } from ".";

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  messageCount?: number;
}

export interface CreateSupportTicketRequest {
  category: string;
  subject: string;
  description: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  isFromUser: boolean;
  body: string;
  createdAt: string;
}

export const supportApi = {
  // Get user tickets
  getMyTickets: () => api.get<SupportTicket[]>("/user/support", { auth: true }),

  // Create a new ticket
  createTicket: (request: CreateSupportTicketRequest) =>
    api.post<SupportTicket>("/user/support", request, { auth: true }),

  // Get the message thread for a ticket
  getTicketMessages: (ticketId: string) =>
    api.get<SupportMessage[]>(`/user/support/${ticketId}/messages`, {
      auth: true,
    }),

  // Send a message on a ticket thread
  sendMessage: (ticketId: string, body: string) =>
    api.post<SupportMessage>(
      `/user/support/${ticketId}/messages`,
      { body },
      { auth: true }
    ),
};