import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getWatchlist, saveWatchlist, isStorageAvailable } from '../../src/services/storageService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('StorageService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should return empty array when no watchlist exists', () => {
    expect(getWatchlist()).toEqual([]);
  });

  it('should save and retrieve watchlist', () => {
    saveWatchlist(['AAPL', 'MSFT']);
    expect(getWatchlist()).toEqual(['AAPL', 'MSFT']);
  });

  it('should handle corrupted data gracefully', () => {
    localStorageMock.getItem.mockReturnValueOnce('not-valid-json{');
    expect(getWatchlist()).toEqual([]);
  });

  it('should filter non-string items', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(['AAPL', 123, null, 'MSFT']));
    expect(getWatchlist()).toEqual(['AAPL', 'MSFT']);
  });

  it('should report storage availability', () => {
    expect(typeof isStorageAvailable()).toBe('boolean');
  });
});
