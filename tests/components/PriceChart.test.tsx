import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriceChart from '../../src/components/ui/PriceChart';
import type { ChartData } from '../../src/types';

// Mock Recharts since jsdom doesn't support SVG measurement APIs
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

const mockData: ChartData = [
  { date: '2026-03-01', open: 150, high: 155, low: 148, close: 152, volume: 5000000 },
  { date: '2026-03-02', open: 152, high: 157, low: 150, close: 155, volume: 6000000 },
  { date: '2026-03-03', open: 155, high: 158, low: 153, close: 156, volume: 4500000 },
];

describe('PriceChart', () => {
  it('renders loading state', () => {
    const { container } = render(<PriceChart data={[]} isLoading />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(<PriceChart data={[]} />);
    expect(screen.getByText('No chart data available')).toBeInTheDocument();
  });

  it('renders chart when data provided', () => {
    render(<PriceChart data={mockData} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renders chart area element', () => {
    render(<PriceChart data={mockData} />);
    expect(screen.getByTestId('area')).toBeInTheDocument();
  });
});
