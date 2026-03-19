// Cache Manager — [TR-001] Client-Side API Caching
// In-memory Map cache with configurable TTLs

import type { CacheEntry } from '../types';

export const CACHE_TTLS = {
  quote: 60_000,       // 60 seconds
  chart: 3_600_000,    // 1 hour
  search: 300_000,     // 5 minutes
  movers: 300_000,     // 5 minutes
  index: 300_000,      // 5 minutes
} as const;

const cache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttl: number): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

export function clearCache(): void {
  cache.clear();
}

export function removeCacheEntry(key: string): void {
  cache.delete(key);
}
