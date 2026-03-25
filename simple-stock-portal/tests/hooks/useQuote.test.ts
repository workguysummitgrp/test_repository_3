import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useQuote } from '../../src/hooks/useQuote';

vi.mock('../../src/services/alphaVantageService', () => ({
  alphaVantageService: {
    getQuote: vi.fn(),
  },
}));

import { alphaVantageService } from '../../src/services/alphaVantageService';

const mockQuote = {
  symbol: 'AAPL',
  open: 150,
  high: 155,
  low: 149,
  price: 152,
  volume: 1000000,
  latestTradingDay: '2026-03-25',
  previousClose: 151,
  change: 1,
  changePercent: 0.66,
  fetchedAt: 1711382400000,
};

describe('useQuote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns fetchedAt from the quote data on successful fetch', async () => {
    vi.mocked(alphaVantageService.getQuote).mockResolvedValue(mockQuote);

    const { result } = renderHook(() => useQuote('AAPL'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.quote).not.toBeNull();
    expect(result.current.quote?.fetchedAt).toBe(1711382400000);
    expect(result.current.fetchedAt).toBe(1711382400000);
  });

  it('returns null fetchedAt when no symbol is provided', () => {
    const { result } = renderHook(() => useQuote(undefined));
    expect(result.current.fetchedAt).toBeNull();
    expect(result.current.quote).toBeNull();
  });

  it('returns null fetchedAt on error', async () => {
    vi.mocked(alphaVantageService.getQuote).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useQuote('AAPL'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.fetchedAt).toBeNull();
    expect(result.current.quote).toBeNull();
  });

  it('preserves fetchedAt from cached quote data', async () => {
    const cachedQuote = { ...mockQuote, fetchedAt: 1711300000000 };
    vi.mocked(alphaVantageService.getQuote).mockResolvedValue(cachedQuote);

    const { result } = renderHook(() => useQuote('AAPL'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.fetchedAt).toBe(1711300000000);
  });
});
