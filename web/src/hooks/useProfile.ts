// ============================================
// FILE: hooks/useProfile.ts
// PURPOSE: React Query hooks for profile, settings,
// and password changes
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type ChangePasswordInput,
	profileApi,
	type UpdateProfileInput,
	type UpdateSettingsInput,
} from "@/lib/api/profile";

export function useProfile() {
	return useQuery({
		queryKey: ["profile"],
		queryFn: () => profileApi.getProfile(),
	});
}

export function useSettings() {
	return useQuery({
		queryKey: ["settings"],
		queryFn: () => profileApi.getSettings(),
	});
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: UpdateProfileInput) => profileApi.updateProfile(input),
		onSuccess: (data) => {
			queryClient.setQueryData(["profile"], data);
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}

export function useUpdateSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: UpdateSettingsInput) =>
			profileApi.updateSettings(input),
		onSuccess: (data) => {
			queryClient.setQueryData(["settings"], data);
		},
		onError: () => {
			queryClient.invalidateQueries({ queryKey: ["settings"] });
		},
	});
}

export function useChangePassword() {
	return useMutation({
		mutationFn: (input: ChangePasswordInput) =>
			profileApi.changePassword(input),
	});
}
