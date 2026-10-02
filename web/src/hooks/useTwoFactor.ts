// ============================================
// FILE: hooks/useTwoFactor.ts
// PURPOSE: React Query hooks for 2FA (TOTP)
// ============================================

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { securityApi, type TwoFactorDisableRequest } from "@/lib/api/security";

export function useTwoFactorStatus() {
	return useQuery({
		queryKey: ["two-factor"],
		queryFn: securityApi.getStatus,
	});
}

export function useTwoFactorSetup() {
	return useMutation({
		mutationFn: securityApi.setup,
	});
}

export function useEnableTwoFactor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (code: string) => securityApi.enable(code),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["two-factor-setup"] });
			queryClient.invalidateQueries({ queryKey: ["two-factor"] });
		},
	});
}

export function useDisableTwoFactor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (req: TwoFactorDisableRequest) => securityApi.disable(req),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ["two-factor-setup"] });
			queryClient.invalidateQueries({ queryKey: ["two-factor"] });
		},
	});
}
