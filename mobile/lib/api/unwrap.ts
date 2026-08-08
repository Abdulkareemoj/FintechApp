
// ================================================================
// FILE: lib/api/unwrap.ts
// PURPOSE: mobile's request<T>() returns { ok: true, data } |
// { ok: false, error }. TanStack Query wants a thrown error on
// failure, so every hook runs its call through this first.
// ================================================================

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

export async function unwrapResult<T>(
  promise: Promise<ApiResult<T>>
): Promise<T> {
  const result = await promise;
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.data;
}
