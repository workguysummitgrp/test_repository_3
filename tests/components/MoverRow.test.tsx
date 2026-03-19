import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MoverRow from '../../src/components/ui/MoverRow';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderMoverRow(props?: Partial<React.ComponentProps<typeof MoverRow>>) {
  const defaultProps = {
    ticker: 'TSLA',
    price: '250.00',
    changePercent: '+11.11%',
    rank: 1,
    type: 'gainer' as const,
  };
  return render(
    <MemoryRouter>
      <MoverRow {...defaultProps} {...props} />
    </MemoryRouter>
  );
}

describe('MoverRow', () => {
  it('renders ticker', () => {
    renderMoverRow();
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });

  it('renders rank', () => {
    renderMoverRow();
    expect(screen.getByText('1.')).toBeInTheDocument();
  });

  it('renders price', () => {
    renderMoverRow();
    expect(screen.getByText('$250.00')).toBeInTheDocument();
  });

  it('renders change percent', () => {
    renderMoverRow();
    expect(screen.getByText('+11.11%')).toBeInTheDocument();
  });

  it('shows green for gainer', () => {
    const { container } = renderMoverRow({ type: 'gainer' });
    expect(container.querySelector('.text-emerald-500')).toBeInTheDocument();
  });

  it('shows red for loser', () => {
    const { container } = renderMoverRow({ type: 'loser', changePercent: '-5.00%' });
    expect(container.querySelector('.text-red-500')).toBeInTheDocument();
  });

  it('navigates to stock detail on click', () => {
    renderMoverRow();
    fireEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/stock/TSLA');
  });
});
