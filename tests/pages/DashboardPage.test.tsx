import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../../src/pages/DashboardPage';

vi.mock('../../src/hooks/useIndices', () => ({
  useIndices: vi.fn(() => ({
    indices: [
      { symbol: 'SPY', name: 'S&P 500', price: 512.5, change: 2.5, changePercent: 0.49 },
      { symbol: 'QQQ', name: 'NASDAQ', price: 442.0, change: 2.0, changePercent: 0.45 },
      { symbol: 'DIA', name: 'Dow Jones', price: 392.0, change: -1.0, changePercent: -0.26 },
    ],
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../../src/hooks/useMovers', () => ({
  useMovers: vi.fn(() => ({
    gainers: [
      { ticker: 'TSLA', price: '250.00', change_amount: '25.00', change_percentage: '+11.11%', volume: '90000000' },
      { ticker: 'NVDA', price: '800.00', change_amount: '40.00', change_percentage: '+5.26%', volume: '60000000' },
    ],
    losers: [
      { ticker: 'META', price: '300.00', change_amount: '-15.00', change_percentage: '-4.76%', volume: '40000000' },
    ],
    isLoading: false,
    error: null,
  })),
}));

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );
}

describe('DashboardPage', () => {
  it('renders Market Overview heading', () => {
    renderDashboard();
    expect(screen.getByText('Market Overview')).toBeInTheDocument();
  });

  it('renders 3 index cards', () => {
    renderDashboard();
    expect(screen.getByText('S&P 500')).toBeInTheDocument();
    expect(screen.getByText('NASDAQ')).toBeInTheDocument();
    expect(screen.getByText('Dow Jones')).toBeInTheDocument();
  });

  it('renders Top Movers heading', () => {
    renderDashboard();
    expect(screen.getByText('Top Movers')).toBeInTheDocument();
  });

  it('renders Top Gainers section', () => {
    renderDashboard();
    expect(screen.getByText('Top Gainers')).toBeInTheDocument();
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });

  it('renders Top Losers section', () => {
    renderDashboard();
    expect(screen.getByText('Top Losers')).toBeInTheDocument();
    expect(screen.getByText('META')).toBeInTheDocument();
  });

  it('shows skeleton during index loading', () => {
    const { useIndices } = require('../../src/hooks/useIndices');
    useIndices.mockReturnValueOnce({ indices: [], isLoading: true, error: null });

    const { container } = renderDashboard();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows error message on API failure', () => {
    const { useIndices } = require('../../src/hooks/useIndices');
    useIndices.mockReturnValueOnce({ indices: [], isLoading: false, error: 'Failed to load' });

    renderDashboard();
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });
});
