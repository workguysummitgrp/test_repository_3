// WatchlistContext — [TR-004], [FRD-007]–[FRD-009]
// Global watchlist state with localStorage persistence

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getWatchlist, saveWatchlist, isStorageAvailable } from '../services/storageService';

const MAX_WATCHLIST_SIZE = 20;

interface WatchlistContextType {
  tickers: string[];
  addTicker: (ticker: string) => boolean;
  removeTicker: (ticker: string) => void;
  isWatchlisted: (ticker: string) => boolean;
  isFull: boolean;
  storageWarning: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [tickers, setTickers] = useState<string[]>(() => getWatchlist());
  const [storageWarning] = useState(!isStorageAvailable());

  useEffect(() => {
    saveWatchlist(tickers);
  }, [tickers]);

  const addTicker = useCallback(
    (ticker: string): boolean => {
      const upper = ticker.toUpperCase();
      if (tickers.length >= MAX_WATCHLIST_SIZE) return false;
      if (tickers.includes(upper)) return true;
      setTickers((prev) => [...prev, upper]);
      return true;
    },
    [tickers],
  );

  const removeTicker = useCallback((ticker: string) => {
    setTickers((prev) => prev.filter((t) => t !== ticker.toUpperCase()));
  }, []);

  const isWatchlisted = useCallback(
    (ticker: string) => tickers.includes(ticker.toUpperCase()),
    [tickers],
  );

  const isFull = tickers.length >= MAX_WATCHLIST_SIZE;

  return (
    <WatchlistContext.Provider value={{ tickers, addTicker, removeTicker, isWatchlisted, isFull, storageWarning }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist(): WatchlistContextType {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
