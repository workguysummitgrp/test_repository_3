// useWatchlistQuotes — [FRD-004] Staggered quotes for watchlist items (1/sec)

import { useState, useEffect } from 'react';
import type { QuoteData } from '../types';
import { alphaVantageService } from '../services/alphaVantageService';

export function useWatchlistQuotes(tickers: string[]) {
  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tickers.length === 0) {
      setQuotes({});
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const fetchQuotes = async () => {
      const results: Record<string, QuoteData> = {};

      try {
        for (const ticker of tickers) {
          if (cancelled) return;
          try {
            const quote = await alphaVantageService.getQuote(ticker);
            results[ticker] = quote;
            if (!cancelled) {
              setQuotes({ ...results });
            }
          } catch {
            // Skip individual failures, continue with others
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load watchlist quotes.');
        }
      } finally {
        if (!cancelled) {
          setQuotes(results);
          setIsLoading(false);
        }
      }
    };

    fetchQuotes();
    return () => {
      cancelled = true;
    };
  }, [tickers.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return { quotes, isLoading, error };
}
