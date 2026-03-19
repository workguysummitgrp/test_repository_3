import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChart } from '../../src/hooks/useChart';

vi.mock('../../src/services/alphaVantageService', () => ({
  alphaVantageService: {
    getDailyTimeSeries: vi.fn().mockResolvedValue(
      Array.from({ length: 30 }, (_, i) => ({
        date: `2026-02-${String(i + 1).padStart(2, '0')}`,
        open: 150 + i, high: 155 + i, low: 148 + i, close: 152 + i, volume: 5000000,
      }))
    ),
    getWeeklyTimeSeries: vi.fn().mockResolvedValue(
      Array.from({ length: 60 }, (_, i) => ({
        date: `2025-${String(Math.floor(i / 4) + 1).padStart(2, '0')}-01`,
        open: 140 + i, high: 145 + i, low: 138 + i, close: 142 + i, volume: 10000000,
      }))
    ),
  },
}));

describe('useChart', () => {
  it('should not fetch with undefined symbol', () => {
    const { result } = renderHook(() => useChart(undefined));
    expect(result.current.chartData).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should load daily data for 1M range', async () => {
    const { result } = renderHook(() => useChart('AAPL', '1M'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.chartData.length).toBeLessThanOrEqual(22);
    expect(result.current.chartData.length).toBeGreaterThan(0);
  });

  it('should load weekly data for 1Y range', async () => {
    const { alphaVantageService } = await import('../../src/services/alphaVantageService');

    const { result } = renderHook(() => useChart('AAPL', '1Y'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(alphaVantageService.getWeeklyTimeSeries).toHaveBeenCalledWith('AAPL');
    expect(result.current.chartData.length).toBeLessThanOrEqual(52);
  });

  it('should handle error state on failure', async () => {
    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    vi.mocked(alphaVantageService.getDailyTimeSeries).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useChart('FAIL', '1M'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.error).toBeTruthy();
  });

  it('should slice data for 1W range (5 points)', async () => {
    const { result } = renderHook(() => useChart('AAPL', '1W'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.chartData.length).toBeLessThanOrEqual(5);
  });
});
