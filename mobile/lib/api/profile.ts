// ============================================
// FILE: lib/api/profile.ts
// PURPOSE: Profile and settings API calls
// ============================================

import { api } from "./index";

export interface Profile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  transactionAlerts: boolean;
  loginAlerts: boolean;
  marketingEmails: boolean;
  language: string;
  currency: string;
  compactView: boolean;
  showBalance: boolean;
  updatedAt: string;
}

export interface UpdateSettingsInput {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsAlerts?: boolean;
  transactionAlerts?: boolean;
  loginAlerts?: boolean;
  marketingEmails?: boolean;
  language?: string;
  currency?: string;
  compactView?: boolean;
  showBalance?: boolean;
}

export const profileApi = {
  getProfile: () => api.get<Profile>("/user/profile", { auth: true }),

  updateProfile: (input: UpdateProfileInput) =>
    api.put<Profile>("/user/profile", input, { auth: true }),

  getSettings: () => api.get<UserSettings>("/user/settings", { auth: true }),

  updateSettings: (input: UpdateSettingsInput) =>
    api.put<UserSettings>("/user/settings", input, { auth: true }),
};
