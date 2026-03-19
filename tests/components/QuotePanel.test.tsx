import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import QuotePanel from '../../src/components/ui/QuotePanel';
import type { QuoteData } from '../../src/types';

const mockQuote: QuoteData = {
  symbol: 'AAPL',
  open: 150.0,
  high: 155.0,
  low: 149.0,
  price: 153.5,
  volume: 75000000,
  latestTradingDay: '2026-03-19',
  previousClose: 150.0,
  change: 3.5,
  changePercent: 2.33,
};

describe('QuotePanel', () => {
  it('displays the current price', () => {
    render(<QuotePanel quote={mockQuote} />);
    expect(screen.getByText('$153.50')).toBeInTheDocument();
  });

  it('displays Open stat', () => {
    render(<QuotePanel quote={mockQuote} />);
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument();
  });

  it('displays High stat', () => {
    render(<QuotePanel quote={mockQuote} />);
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('$155.00')).toBeInTheDocument();
  });

  it('displays Low stat', () => {
    render(<QuotePanel quote={mockQuote} />);
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(screen.getByText('$149.00')).toBeInTheDocument();
  });

  it('displays Prev Close stat', () => {
    render(<QuotePanel quote={mockQuote} />);
    expect(screen.getByText('Prev Close')).toBeInTheDocument();
  });

  it('displays Volume stat', () => {
    render(<QuotePanel quote={mockQuote} />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('75.00M')).toBeInTheDocument();
  });

  it('displays latest trading day', () => {
    render(<QuotePanel quote={mockQuote} />);
    expect(screen.getByText('Latest Trading Day')).toBeInTheDocument();
    expect(screen.getByText('2026-03-19')).toBeInTheDocument();
  });
});
