// ============================================
// FILE: src/lib/api/security.ts
// PURPOSE: 2FA (TOTP) security API — status, setup, enable, disable
// ============================================

import { api } from "@/lib/api";

export type TwoFactorStatus = {
	enabled: boolean;
};

export type TwoFactorSetup = {
	secret: string;
	otpauthUri: string;
	enabled: boolean;
};

export type TwoFactorActionResponse = {
	enabled: boolean;
};

export type TwoFactorDisableRequest = {
	code?: string;
	password?: string;
};

export const securityApi = {
	getStatus: () => api.get<TwoFactorStatus>("/user/security/2fa"),
	setup: () => api.post<TwoFactorSetup>("/user/security/2fa/setup"),
	enable: (code: string) =>
		api.post<TwoFactorActionResponse>("/user/security/2fa/enable", { code }),
	disable: (req: TwoFactorDisableRequest) =>
		api.post<TwoFactorActionResponse>("/user/security/2fa/disable", req),
};
