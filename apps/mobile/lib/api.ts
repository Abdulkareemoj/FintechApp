import { useAuthStore } from "@/lib/authStore";

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

    const res = await fetch(`${getBaseUrl()}${input.path}`, {
      method: input.method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: input.body ? JSON.stringify(input.body) : undefined,
    });

    const contentType = res.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      return {
        ok: false,
        error:
          typeof payload === "string"
            ? payload
            : (payload?.message ?? "Request failed"),
        status: res.status,
      };
    }

    return { ok: true, data: payload as T };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export const api = {
  get: <T>(path: string, opts?: { auth?: boolean }) =>
    request<T>({ path, method: "GET", auth: opts?.auth }),
  post: <T>(path: string, body?: unknown, opts?: { auth?: boolean }) =>
    request<T>({ path, method: "POST", body, auth: opts?.auth }),
};
