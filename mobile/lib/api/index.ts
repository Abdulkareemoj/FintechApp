import axios, { type AxiosRequestConfig } from "axios";

type ApiResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
      status?: number;
    };

const DEFAULT_BASE_URL = __DEV__
  ? "http://10.0.2.2:5182/api"
  : "http://localhost:5182/api";

function getBaseUrl(): string {
  // Allow override via environment variable for real devices
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  return DEFAULT_BASE_URL;
}

async function request<T>(input: {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  _retry?: boolean; // Add retry flag to type
}): Promise<ApiResult<T>> {
  const url = `${getBaseUrl()}${input.path}`;
  console.log(`[API] ${input.method} ${url}`, {
    auth: input.auth,
    body: input.body,
  });
  try {
    const { useAuthStore } = await import("@/lib/authStore");
    const token = input.auth ? useAuthStore.getState().accessToken : null;

    const config: AxiosRequestConfig = {
      url,
      method: input.method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      data: input.body,
    };

    const res = await axios.request<T>(config);
    console.log(`[API] SUCCESS ${input.method} ${url}`, res.data);
    return { ok: true, data: res.data };
  } catch (e) {
    console.log(`[API] ERROR ${input.method} ${url}`, e);
    if (axios.isAxiosError(e)) {
      const status = e.response?.status;

      if (status === 401 && input.auth && !input._retry) {
        const { useAuthStore } = await import("@/lib/authStore");
        const state = useAuthStore.getState();
        const refreshToken = state.refreshToken;

        if (refreshToken) {
          try {
            const refreshRes = await axios.request<{
              accessToken: string;
              refreshToken: string;
              expiresAt: string;
              user: unknown;
            }>({
              url: `${getBaseUrl()}/auth/refresh`,
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              data: { refreshToken },
            });

            state.setTokensFromRefresh(
              refreshRes.data.accessToken,
              refreshRes.data.refreshToken
            );

            // Retry the original request with _retry flag
            return request<T>({ ...input, _retry: true });
          } catch {
            state.clearAuth();
          }
        } else {
          const { useAuthStore } = await import("@/lib/authStore");
          const state = useAuthStore.getState();
          state.clearAuth();
        }
      }

      const data = e.response?.data as any;
      const error =
        data?.error ?? data?.message ?? e.message ?? "Request failed";
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
  put: <T>(path: string, body?: any, opts?: { auth?: boolean }) =>
    request<T>({ path, method: "PUT", body, auth: opts?.auth }),
  delete: <T>(path: string, opts?: { auth?: boolean }) =>
    request<T>({ path, method: "DELETE", auth: opts?.auth }),
};
