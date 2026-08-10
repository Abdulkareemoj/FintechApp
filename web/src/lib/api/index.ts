// ================================================================
// FILE: src/lib/api/index.ts   (MISSING FILE — creates it)
// PURPOSE: Base wrapper around apiClient (axios). Unwraps the
// backend's { success, data, error } envelope and throws on failure
// so TanStack Query treats failures as errors automatically.
//
// FIX: apiClient.ts baseURL is just the host (no /api). All the
// existing modules (wallets.ts, transactions.ts, cards.ts) call
// paths like "/user/cards" with no /api prefix. This wrapper adds
// the /api prefix here, in ONE place, instead of touching apiClient.ts
// or every call site.
// ================================================================

import type { AxiosRequestConfig } from "axios";
import { apiClient } from "@/lib/apiClient";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function unwrap<T>(
  promise: Promise<{ data: ApiEnvelope<T> }>
): Promise<T> {
  const res = await promise;
  if (!res.data.success) {
    throw new Error(res.data.error ?? res.data.message ?? "Request failed");
  }
  return res.data.data as T;
}

export const api = {
  get: <T>(path: string, config?: AxiosRequestConfig) =>
    unwrap<T>(apiClient.get(`/api${path}`, config)),
  post: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(apiClient.post(`/api${path}`, body, config)),
  put: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    unwrap<T>(apiClient.put(`/api${path}`, body, config)),
  delete: <T>(path: string, config?: AxiosRequestConfig) =>
    unwrap<T>(apiClient.delete(`/api${path}`, config)),
};
