import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useQuote } from '../../src/hooks/useQuote';

vi.mock('../../src/services/alphaVantageService', () => ({
  alphaVantageService: {
    getQuote: vi.fn().mockResolvedValue({
      symbol: 'AAPL',
      open: 150.0,
      high: 155.0,
      low: 149.0,
      price: 153.5,
      volume: 75000000,
      latestTradingDay: '2026-03-19',
      previousClose: 150.0,
      change: 3.5,
      changePercent: 2.33,
    }),
  },
}));

describe('useQuote', () => {
  it('should not fetch with undefined symbol', () => {
    const { result } = renderHook(() => useQuote(undefined));
    expect(result.current.quote).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should load quote for valid symbol', async () => {
    const { result } = renderHook(() => useQuote('AAPL'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.quote).not.toBeNull();
    expect(result.current.quote?.symbol).toBe('AAPL');
    expect(result.current.quote?.price).toBe(153.5);
  });

  it('should set error on API failure', async () => {
    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    vi.mocked(alphaVantageService.getQuote).mockRejectedValueOnce(new Error('API rate limit reached'));

    const { result } = renderHook(() => useQuote('FAIL'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.error).toBe('API rate limit reached');
    expect(result.current.quote).toBeNull();
  });

  it('should provide a retry function', async () => {
    const { result } = renderHook(() => useQuote('AAPL'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(typeof result.current.retry).toBe('function');
  });
});
