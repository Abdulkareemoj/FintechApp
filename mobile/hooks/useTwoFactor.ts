// ============================================
// FILE: hooks/useTwoFactor.ts
// PURPOSE: React Query hooks for 2FA (TOTP)
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  securityApi,
  type TwoFactorDisableRequest,
} from "@/lib/api/security";

export function useTwoFactorStatus() {
  return useQuery({
    queryKey: ["two-factor"],
    queryFn: async () => {
      const result = await securityApi.getStatus();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return (response.data || response) as import("@/lib/api/security").TwoFactorStatus;
    },
  });
}

export function useTwoFactorSetup() {
  return useMutation({
    mutationFn: async () => {
      const result = await securityApi.setup();
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
  });
}

export function useEnableTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const result = await securityApi.enable(code);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["two-factor"] });
    },
  });
}

export function useDisableTwoFactor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: TwoFactorDisableRequest) => {
      const result = await securityApi.disable(req);
      if (!result.ok) {
        throw new Error(result.error);
      }
      const response = result.data as any;
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["two-factor"] });
    },
  });
}
