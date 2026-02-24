import { useAuthStore } from "@/lib/authStore";
import axios, { type AxiosRequestConfig } from "axios";

type ApiResult<T> = {
  ok: true;
  data: T;
} | {
  ok: false;
  error: string;
  status?: number;
};

const DEFAULT_BASE_URL = "http://localhost:5000";

function getBaseUrl(): string {
  return DEFAULT_BASE_URL;
}

async function request<T>(input: {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}): Promise<ApiResult<T>> {
  try {
    const token = input.auth ? useAuthStore.getState().accessToken : null;

    const config: AxiosRequestConfig = {
      url: `${getBaseUrl()}${input.path}`,
      method: input.method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      data: input.body,
    };

    const res = await axios.request<T>(config);
    return { ok: true, data: res.data };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status;
      const data = e.response?.data as any;
      const error = data?.error ?? data?.message ?? e.message ?? "Request failed";
      return { ok: false, error, status };
    }
    return { ok: false, error: "Network error" };
  }
}

export const api = {
  get: <T>(path: string, opts?: { auth?: boolean }) =>
    request<T>({ path, method: "GET", auth: opts?.auth }),
  post: <T>(path: string, body?: unknown, opts?: { auth?: boolean }) =>
    request<T>({ path, method: "POST", body, auth: opts?.auth }),
};
