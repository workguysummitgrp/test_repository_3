import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StockDetailPage from '../../src/pages/StockDetailPage';

vi.mock('../../src/hooks/useQuote', () => ({
  useQuote: vi.fn((symbol) => {
    if (symbol === 'FAIL') {
      return { quote: null, isLoading: false, error: 'Unable to load stock data. Please try again.', retry: vi.fn() };
    }
    return {
      quote: {
        symbol: symbol || 'AAPL',
        open: 150, high: 155, low: 149, price: 153.5, volume: 75000000,
        latestTradingDay: '2026-03-19', previousClose: 150, change: 3.5, changePercent: 2.33,
      },
      isLoading: false,
      error: null,
      retry: vi.fn(),
    };
  }),
}));

vi.mock('../../src/hooks/useChart', () => ({
  useChart: vi.fn(() => ({
    chartData: [
      { date: '2026-03-01', open: 150, high: 155, low: 148, close: 152, volume: 5000000 },
    ],
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../../src/components/ui/PriceChart', () => ({
  default: ({ data }: { data: unknown[] }) => <div data-testid="price-chart">Chart ({data.length} points)</div>,
}));

vi.mock('../../src/components/ui/TimeRangeSelector', () => ({
  default: ({ selected, onChange }: { selected: string; onChange: (r: string) => void }) => (
    <div data-testid="time-range-selector">{selected}</div>
  ),
}));

vi.mock('../../src/services/storageService', () => ({
  getWatchlist: vi.fn(() => []),
  saveWatchlist: vi.fn(),
  isStorageAvailable: vi.fn(() => true),
}));

vi.mock('../../src/context/WatchlistContext', async () => {
  const actual = await vi.importActual('../../src/context/WatchlistContext');
  return actual;
});

function renderStockDetail(ticker = 'AAPL') {
  return render(
    <MemoryRouter initialEntries={[`/stock/${ticker}`]}>
      <Routes>
        <Route path="/stock/:ticker" element={<StockDetailPage />} />
      </Routes>
    </MemoryRouter>,
    {
      wrapper: ({ children }) => {
        const { WatchlistProvider } = require('../../src/context/WatchlistContext');
        return <WatchlistProvider>{children}</WatchlistProvider>;
      },
    }
  );
}

describe('StockDetailPage', () => {
  it('renders ticker symbol in heading', () => {
    renderStockDetail('AAPL');
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  it('renders quote panel with price', () => {
    renderStockDetail('AAPL');
    expect(screen.getByText('$153.50')).toBeInTheDocument();
  });

  it('renders price chart', () => {
    renderStockDetail('AAPL');
    expect(screen.getByTestId('price-chart')).toBeInTheDocument();
  });

  it('renders time range selector', () => {
    renderStockDetail('AAPL');
    expect(screen.getByTestId('time-range-selector')).toBeInTheDocument();
  });

  it('renders Price History heading', () => {
    renderStockDetail('AAPL');
    expect(screen.getByText('Price History')).toBeInTheDocument();
  });

  it('shows error message on quote failure', () => {
    renderStockDetail('FAIL');
    expect(screen.getByText('Unable to load stock data. Please try again.')).toBeInTheDocument();
  });

  it('shows Try Again button on error', () => {
    renderStockDetail('FAIL');
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});
