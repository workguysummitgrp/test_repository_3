import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WatchlistButton from '../../src/components/ui/WatchlistButton';
import { WatchlistProvider } from '../../src/context/WatchlistContext';

// Mock storageService
vi.mock('../../src/services/storageService', () => ({
  getWatchlist: vi.fn(() => []),
  saveWatchlist: vi.fn(),
  isStorageAvailable: vi.fn(() => true),
}));

function renderWithProvider(ticker: string) {
  return render(
    <WatchlistProvider>
      <WatchlistButton ticker={ticker} />
    </WatchlistProvider>
  );
}

describe('WatchlistButton', () => {
  it('should show "Add to Watchlist" when not watchlisted', () => {
    renderWithProvider('AAPL');
    expect(screen.getByText('Add to Watchlist')).toBeInTheDocument();
  });

  it('should toggle to "Remove from Watchlist" after click', () => {
    renderWithProvider('TSLA');
    fireEvent.click(screen.getByText('Add to Watchlist'));
    expect(screen.getByText('Remove from Watchlist')).toBeInTheDocument();
  });

  it('should toggle back to "Add to Watchlist" after removing', () => {
    renderWithProvider('MSFT');
    fireEvent.click(screen.getByText('Add to Watchlist'));
    expect(screen.getByText('Remove from Watchlist')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Remove from Watchlist'));
    expect(screen.getByText('Add to Watchlist')).toBeInTheDocument();
  });
});
