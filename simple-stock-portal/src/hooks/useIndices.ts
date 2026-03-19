// useIndices — [FRD-010] Fetch 3 ETF proxy quotes (SPY/QQQ/DIA) staggered

import { useState, useEffect } from 'react';
import type { IndexData } from '../types';
import { alphaVantageService } from '../services/alphaVantageService';

const INDEX_MAP: { symbol: string; name: string }[] = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'NASDAQ' },
  { symbol: 'DIA', name: 'Dow Jones' },
];

export function useIndices() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchIndices = async () => {
      setIsLoading(true);
      setError(null);
      const results: IndexData[] = [];

      try {
        for (const idx of INDEX_MAP) {
          if (cancelled) return;
          const quote = await alphaVantageService.getQuote(idx.symbol);
          results.push({
            symbol: idx.symbol,
            name: idx.name,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
          });
        }
        if (!cancelled) {
          setIndices(results);
        }
      } catch (err) {
        if (!cancelled) {
          if (results.length > 0) setIndices(results);
          setError(err instanceof Error ? err.message : 'Failed to load market data.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchIndices();
    return () => {
      cancelled = true;
    };
  }, []);

  return { indices, isLoading, error };
}
