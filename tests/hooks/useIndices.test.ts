import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useIndices } from '../../src/hooks/useIndices';

vi.mock('../../src/services/alphaVantageService', () => ({
  alphaVantageService: {
    getQuote: vi.fn().mockImplementation((symbol: string) => {
      const map: Record<string, unknown> = {
        SPY: { symbol: 'SPY', open: 510, high: 515, low: 508, price: 512.5, volume: 80000000, latestTradingDay: '2026-03-19', previousClose: 510, change: 2.5, changePercent: 0.49 },
        QQQ: { symbol: 'QQQ', open: 440, high: 445, low: 438, price: 442.0, volume: 50000000, latestTradingDay: '2026-03-19', previousClose: 440, change: 2.0, changePercent: 0.45 },
        DIA: { symbol: 'DIA', open: 390, high: 395, low: 388, price: 392.0, volume: 30000000, latestTradingDay: '2026-03-19', previousClose: 390, change: 2.0, changePercent: 0.51 },
      };
      if (map[symbol]) return Promise.resolve(map[symbol]);
      return Promise.reject(new Error('Unknown symbol'));
    }),
  },
}));

describe('useIndices', () => {
  it('should fetch 3 index quotes', async () => {
    const { result } = renderHook(() => useIndices());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 10000 });

    expect(result.current.indices).toHaveLength(3);
    expect(result.current.indices[0].symbol).toBe('SPY');
    expect(result.current.indices[1].symbol).toBe('QQQ');
    expect(result.current.indices[2].symbol).toBe('DIA');
  });

  it('should map names correctly', async () => {
    const { result } = renderHook(() => useIndices());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 10000 });

    expect(result.current.indices[0].name).toBe('S&P 500');
    expect(result.current.indices[1].name).toBe('NASDAQ');
    expect(result.current.indices[2].name).toBe('Dow Jones');
  });

  it('should include price and change data', async () => {
    const { result } = renderHook(() => useIndices());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 10000 });

    expect(result.current.indices[0].price).toBe(512.5);
    expect(result.current.indices[0].change).toBe(2.5);
    expect(result.current.indices[0].changePercent).toBe(0.49);
  });

  it('should start in loading state', () => {
    const { result } = renderHook(() => useIndices());
    expect(result.current.isLoading).toBe(true);
  });
});
