import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../../src/components/layout/NavBar';

vi.mock('../../src/components/ui/SearchInput', () => ({
  default: ({ value, onChange, compact }: { value: string; onChange: (v: string) => void; compact?: boolean }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={compact ? 'Quick search\u2026' : 'Search\u2026'}
    />
  ),
}));

function renderNavBar(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <NavBar />
    </MemoryRouter>
  );
}

describe('NavBar', () => {
  it('renders logo text', () => {
    renderNavBar();
    expect(screen.getByText('StockPortal')).toBeInTheDocument();
  });

  it('renders Dashboard nav link', () => {
    renderNavBar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders Search nav link', () => {
    renderNavBar();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('renders Watchlist nav link', () => {
    renderNavBar();
    expect(screen.getByText('Watchlist')).toBeInTheDocument();
  });

  it('uses nav element (accessibility)', () => {
    const { container } = renderNavBar();
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('logo links to home', () => {
    renderNavBar();
    const logo = screen.getByText('StockPortal');
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });
});
