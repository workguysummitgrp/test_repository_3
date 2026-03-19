import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useWatchlistQuotes } from '../../src/hooks/useWatchlistQuotes';

vi.mock('../../src/services/alphaVantageService', () => ({
  alphaVantageService: {
    getQuote: vi.fn().mockImplementation((symbol: string) => {
      if (symbol === 'FAIL') return Promise.reject(new Error('API error'));
      return Promise.resolve({
        symbol,
        open: 150, high: 155, low: 149, price: 153, volume: 50000000,
        latestTradingDay: '2026-03-19', previousClose: 150, change: 3, changePercent: 2.0,
      });
    }),
  },
}));

describe('useWatchlistQuotes', () => {
  it('should return empty quotes for empty tickers', () => {
    const { result } = renderHook(() => useWatchlistQuotes([]));
    expect(result.current.quotes).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it('should fetch quotes for each ticker', async () => {
    const { result } = renderHook(() => useWatchlistQuotes(['AAPL', 'MSFT']));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 10000 });

    expect(result.current.quotes['AAPL']).toBeDefined();
    expect(result.current.quotes['MSFT']).toBeDefined();
    expect(result.current.quotes['AAPL'].symbol).toBe('AAPL');
  });

  it('should skip failed individual fetches', async () => {
    const { result } = renderHook(() => useWatchlistQuotes(['AAPL', 'FAIL']));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 10000 });

    expect(result.current.quotes['AAPL']).toBeDefined();
    expect(result.current.quotes['FAIL']).toBeUndefined();
  });

  it('should start loading when tickers provided', () => {
    const { result } = renderHook(() => useWatchlistQuotes(['AAPL']));
    expect(result.current.isLoading).toBe(true);
  });
});
