import { describe, it, expect, beforeEach } from 'vitest';
import { getCached, setCache, clearCache, CACHE_TTLS } from '../../src/services/cacheManager';

describe('CacheManager', () => {
  beforeEach(() => {
    clearCache();
  });

  it('should return null for missing cache entries', () => {
    expect(getCached('nonexistent')).toBeNull();
  });

  it('should store and retrieve cache entries', () => {
    setCache('test-key', { value: 42 }, CACHE_TTLS.quote);
    expect(getCached('test-key')).toEqual({ value: 42 });
  });

  it('should return null for expired entries', () => {
    // Set with 0ms TTL (already expired)
    setCache('expired-key', 'data', 0);
    expect(getCached('expired-key')).toBeNull();
  });

  it('should clear all entries', () => {
    setCache('key1', 'val1', CACHE_TTLS.search);
    setCache('key2', 'val2', CACHE_TTLS.search);
    clearCache();
    expect(getCached('key1')).toBeNull();
    expect(getCached('key2')).toBeNull();
  });

  it('should overwrite existing entries', () => {
    setCache('key', 'old', CACHE_TTLS.quote);
    setCache('key', 'new', CACHE_TTLS.quote);
    expect(getCached('key')).toBe('new');
  });

  it('should use correct TTL values', () => {
    expect(CACHE_TTLS.quote).toBe(60_000);
    expect(CACHE_TTLS.chart).toBe(3_600_000);
    expect(CACHE_TTLS.search).toBe(300_000);
    expect(CACHE_TTLS.movers).toBe(300_000);
    expect(CACHE_TTLS.index).toBe(300_000);
  });
});
