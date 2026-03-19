// Storage Service — [TR-004] Local Storage Abstraction
// Wraps localStorage with error handling for watchlist persistence [FRD-009]

const WATCHLIST_KEY = 'ssp_watchlist';

let storageAvailable: boolean | null = null;

function isLocalStorageAvailable(): boolean {
  if (storageAvailable !== null) return storageAvailable;
  try {
    const testKey = '__ssp_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  return storageAvailable;
}

export function getWatchlist(): string[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

export function saveWatchlist(tickers: string[]): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(tickers));
  } catch {
    // Storage full or unavailable - silently fail
  }
}

export function isStorageAvailable(): boolean {
  return isLocalStorageAvailable();
}
