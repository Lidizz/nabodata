import type { ApiResponse, ApiError } from '@nabodata/types';

export class ApiClientError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiFetch<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({
      error: { code: 'UNKNOWN', message: res.statusText, statusCode: res.status },
    }))) as ApiError;
    throw new ApiClientError(
      body.error.statusCode,
      body.error.code,
      body.error.message,
    );
  }

  return res.json() as Promise<ApiResponse<T>>;
}
