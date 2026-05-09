import type { Kommune } from '@nabodata/types';
import type { ApiResponse } from '@nabodata/types';
import { apiFetch } from '../client.js';

export function getKommune(baseUrl: string, slug: string): Promise<ApiResponse<Kommune>> {
  return apiFetch<Kommune>(baseUrl, `/api/areas/kommune/${encodeURIComponent(slug)}/summary`);
}
