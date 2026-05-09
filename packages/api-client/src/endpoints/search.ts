import type { KommuneSummary, ApiResponse, Locale } from '@nabodata/types';
import { apiFetch } from '../client.js';

export function search(
  baseUrl: string,
  q: string,
  lang?: Locale,
): Promise<ApiResponse<{ results: KommuneSummary[] }>> {
  const params = new URLSearchParams({ q });
  if (lang) params.set('lang', lang);
  return apiFetch<{ results: KommuneSummary[] }>(baseUrl, `/api/v1/search?${params.toString()}`);
}
