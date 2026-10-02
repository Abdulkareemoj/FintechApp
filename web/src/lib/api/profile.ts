// ============================================
// FILE: lib/api/profile.ts
// PURPOSE: Profile, settings, and password API calls
// ============================================

import { api } from ".";

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

export interface ChangePasswordInput {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

/**
 * Extract a human-readable message from an axios error:
 * envelope errors, ASP.NET ProblemDetails (detail / validation
 * errors dictionary), or a plain Error fallback.
 */
export function extractErrorMessage(err: unknown): string {
	if (err && typeof err === "object") {
		const e = err as {
			response?: {
				data?: {
					error?: string;
					detail?: string;
					errors?: Record<string, string[]>;
				};
			};
			message?: string;
		};
		const data = e.response?.data;
		if (data?.error) return data.error;
		if (data?.detail) return data.detail;
		if (data?.errors) {
			const first = Object.values(data.errors).flat()[0];
			if (first) return first;
		}
		if (e.message) return e.message;
	}
	return "Something went wrong";
}

export const profileApi = {
	getProfile: () => api.get<Profile>("/user/profile"),

	updateProfile: (input: UpdateProfileInput) =>
		api.put<Profile>("/user/profile", input),

	getSettings: () => api.get<UserSettings>("/user/settings"),

	updateSettings: (input: UpdateSettingsInput) =>
		api.put<UserSettings>("/user/settings", input),

	changePassword: (input: ChangePasswordInput) =>
		api.post<void>("/auth/change-password", input),
};
