// ============================================
// FILE: hooks/useProfile.ts
// PURPOSE: React Query hooks for profile and settings
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  profileApi,
  type Profile,
  type UpdateProfileInput,
  type UpdateSettingsInput,
  type UserSettings,
} from "@/lib/api/profile";

function unwrap<T>(payload: unknown): T {
  const response = payload as { data?: T };
  return response.data ?? (payload as T);
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const result = await profileApi.getProfile();
      if (!result.ok) {
        throw new Error(result.error);
      }
      return unwrap<Profile>(result.data);
    },
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const result = await profileApi.getSettings();
      if (!result.ok) {
        throw new Error(result.error);
      }
      return unwrap<UserSettings>(result.data);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateProfileInput) => {
      const result = await profileApi.updateProfile(input);
      if (!result.ok) {
        throw new Error(result.error);
      }
      return unwrap<Profile>(result.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateSettingsInput) => {
      const result = await profileApi.updateSettings(input);
      if (!result.ok) {
        throw new Error(result.error);
      }
      return unwrap<UserSettings>(result.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
