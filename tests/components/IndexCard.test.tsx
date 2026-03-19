import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import IndexCard from '../../src/components/ui/IndexCard';

describe('IndexCard', () => {
  const defaultProps = {
    name: 'S&P 500',
    symbol: 'SPY',
    price: 512.5,
    change: 2.5,
    changePercent: 0.49,
  };

  it('renders index name', () => {
    render(<IndexCard {...defaultProps} />);
    expect(screen.getByText('S&P 500')).toBeInTheDocument();
  });

  it('renders symbol', () => {
    render(<IndexCard {...defaultProps} />);
    expect(screen.getByText('SPY')).toBeInTheDocument();
  });

  it('renders price', () => {
    render(<IndexCard {...defaultProps} />);
    expect(screen.getByText('$512.50')).toBeInTheDocument();
  });

  it('shows green for positive change', () => {
    const { container } = render(<IndexCard {...defaultProps} />);
    expect(container.querySelector('.text-emerald-500')).toBeInTheDocument();
  });

  it('shows red for negative change', () => {
    const { container } = render(<IndexCard {...defaultProps} change={-3.0} changePercent={-0.58} />);
    expect(container.querySelector('.text-red-500')).toBeInTheDocument();
  });

  it('shows up arrow for positive', () => {
    render(<IndexCard {...defaultProps} />);
    expect(screen.getByText('\u25B2')).toBeInTheDocument();
  });

  it('shows down arrow for negative', () => {
    render(<IndexCard {...defaultProps} change={-1.0} changePercent={-0.2} />);
    expect(screen.getByText('\u25BC')).toBeInTheDocument();
  });

  it('uses h3 for name (accessibility)', () => {
    render(<IndexCard {...defaultProps} />);
    const heading = screen.getByText('S&P 500');
    expect(heading.tagName).toBe('H3');
  });
});
