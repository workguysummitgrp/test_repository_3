import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSearch } from '../../src/hooks/useSearch';

vi.mock('../../src/services/alphaVantageService', () => ({
  alphaVantageService: {
    searchSymbols: vi.fn().mockResolvedValue([
      { symbol: 'AAPL', name: 'Apple Inc', type: 'Equity', region: 'United States', currency: 'USD', matchScore: 1.0 },
    ]),
  },
}));

describe('useSearch', () => {
  it('should not search with less than 2 characters', () => {
    const { result } = renderHook(() => useSearch('A'));
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('should return empty results for empty query', () => {
    const { result } = renderHook(() => useSearch(''));
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should trigger search with 2+ characters', async () => {
    const { result } = renderHook(() => useSearch('AAPL'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 5000 });

    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].symbol).toBe('AAPL');
  });
});
