import type { Redis } from 'ioredis';

export async function cacheGet<T>(redis: Redis, key: string): Promise<T | null> {
  const raw = await redis.get(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

export async function cacheSet(
  redis: Redis,
  key: string,
  value: unknown,
  ttlSeconds: number,
): Promise<void> {
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

export const TTL = {
  FYLKE_LIST: 86_400,   // 24h
  FYLKE_DETAIL: 86_400, // 24h
  KOMMUNE: 21_600,      // 6h
  SEARCH: 3_600,        // 1h
  I18N: 604_800,        // 7 days
} as const;
