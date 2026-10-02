// ============================================
// FILE: lib/api/security.ts
// PURPOSE: 2FA (TOTP) security API — status, setup, enable, disable
// ============================================

import { api } from ".";

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
  getStatus: () => api.get<TwoFactorStatus>("/user/security/2fa", { auth: true }),
  setup: () => api.post<TwoFactorSetup>("/user/security/2fa/setup", undefined, { auth: true }),
  enable: (code: string) =>
    api.post<TwoFactorActionResponse>("/user/security/2fa/enable", { code }, { auth: true }),
  disable: (req: TwoFactorDisableRequest) =>
    api.post<TwoFactorActionResponse>("/user/security/2fa/disable", req, { auth: true }),
};
