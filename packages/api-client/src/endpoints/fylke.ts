import type { Fylke } from '@nabodata/types';
import type { ApiResponse } from '@nabodata/types';
import { apiFetch } from '../client.js';

export function getFylker(baseUrl: string): Promise<ApiResponse<Fylke[]>> {
  return apiFetch<Fylke[]>(baseUrl, '/api/areas/fylke');
}

export function getFylke(baseUrl: string, slug: string): Promise<ApiResponse<Fylke>> {
  return apiFetch<Fylke>(baseUrl, `/api/areas/fylke/${encodeURIComponent(slug)}/summary`);
}
