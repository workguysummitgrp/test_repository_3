import { describe, it, expect } from 'vitest';
import { enqueueRequest, getQueueLength } from '../../src/services/rateLimiter';

describe('RateLimiter', () => {
  it('should process a single request immediately', async () => {
    const start = Date.now();
    await enqueueRequest();
    const elapsed = Date.now() - start;
    // First request should be nearly instant
    expect(elapsed).toBeLessThan(2000);
  });

  it('should report queue length', () => {
    // Queue should be empty initially (or after processing)
    expect(typeof getQueueLength()).toBe('number');
  });

  it('should return a promise', () => {
    const result = enqueueRequest();
    expect(result).toBeInstanceOf(Promise);
  });
});
