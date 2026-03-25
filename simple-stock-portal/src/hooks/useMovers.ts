// useMovers — [FRD-011] Fetch top gainers/losers
// [US-007] Track section-level fetch timestamp

import { useState, useEffect } from 'react';
import type { MoverData } from '../types';
import { alphaVantageService } from '../services/alphaVantageService';

export function useMovers() {
  const [gainers, setGainers] = useState<MoverData[]>([]);
  const [losers, setLosers] = useState<MoverData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchMovers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await alphaVantageService.getTopMovers();
        if (!cancelled) {
          setGainers(data.gainers);
          setLosers(data.losers);
          setFetchedAt(Date.now());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load movers.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchMovers();
    return () => {
      cancelled = true;
    };
  }, []);

  return { gainers, losers, isLoading, error, fetchedAt };
}
