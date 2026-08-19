// ============================================
// FILE: lib/api/help.ts
// PURPOSE: Help center article API calls
// ============================================

import { api } from ".";

export interface HelpArticle {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const helpApi = {
  // Get published help articles
  getArticles: () => api.get<HelpArticle[]>("/user/help", { auth: true }),
};