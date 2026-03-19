import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMovers } from '../../src/hooks/useMovers';

vi.mock('../../src/services/alphaVantageService', () => ({
  alphaVantageService: {
    getTopMovers: vi.fn().mockResolvedValue({
      gainers: [
        { ticker: 'TSLA', price: '250.00', change_amount: '25.00', change_percentage: '11.11%', volume: '90000000' },
        { ticker: 'NVDA', price: '800.00', change_amount: '40.00', change_percentage: '5.26%', volume: '60000000' },
      ],
      losers: [
        { ticker: 'META', price: '300.00', change_amount: '-15.00', change_percentage: '-4.76%', volume: '40000000' },
        { ticker: 'AMZN', price: '170.00', change_amount: '-5.00', change_percentage: '-2.86%', volume: '35000000' },
      ],
    }),
  },
}));

describe('useMovers', () => {
  it('should fetch gainers and losers', async () => {
    const { result } = renderHook(() => useMovers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.gainers).toHaveLength(2);
    expect(result.current.losers).toHaveLength(2);
  });

  it('should have correct gainer data', async () => {
    const { result } = renderHook(() => useMovers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.gainers[0].ticker).toBe('TSLA');
    expect(result.current.gainers[0].price).toBe('250.00');
  });

  it('should have correct loser data', async () => {
    const { result } = renderHook(() => useMovers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.losers[0].ticker).toBe('META');
  });

  it('should handle error state', async () => {
    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    vi.mocked(alphaVantageService.getTopMovers).mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useMovers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.error).toBeTruthy();
  });

  it('should start in loading state', () => {
    const { result } = renderHook(() => useMovers());
    expect(result.current.isLoading).toBe(true);
  });
});
