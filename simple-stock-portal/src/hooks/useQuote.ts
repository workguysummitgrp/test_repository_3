// useQuote — [FRD-003] Fetch + cache stock quote, [US-002] Track fetch timestamp

import { useState, useEffect } from 'react';
import type { QuoteData } from '../types';
import { alphaVantageService } from '../services/alphaVantageService';

export function useQuote(symbol: string | undefined) {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    alphaVantageService
      .getQuote(symbol)
      .then((data) => {
        if (!cancelled) {
          setQuote(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load stock data. Please try again.');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  const retry = () => {
    if (symbol) {
      setError(null);
      setIsLoading(true);
      alphaVantageService
        .getQuote(symbol)
        .then(setQuote)
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load data.'))
        .finally(() => setIsLoading(false));
    }
  };

  return { quote, isLoading, error, retry, fetchedAt: quote?.fetchedAt ?? null };
}
