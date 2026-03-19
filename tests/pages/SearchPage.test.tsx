import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchPage from '../../src/pages/SearchPage';

vi.mock('../../src/hooks/useSearch', () => ({
  useSearch: vi.fn((query: string) => {
    if (query === 'AAPL') {
      return {
        results: [{ symbol: 'AAPL', name: 'Apple Inc', type: 'Equity', region: 'United States', currency: 'USD', matchScore: 1.0 }],
        isLoading: false,
        error: null,
      };
    }
    if (query === 'NORESULT') {
      return { results: [], isLoading: false, error: null };
    }
    return { results: [], isLoading: false, error: null };
  }),
}));

vi.mock('../../src/components/ui/SearchResultRow', () => ({
  default: ({ symbol, name, onClick }: { symbol: string; name: string; onClick: () => void }) => (
    <button data-testid={`result-${symbol}`} onClick={onClick}>{symbol} - {name}</button>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderSearchPage(initialQuery = '') {
  const route = initialQuery ? `/search?q=${initialQuery}` : '/search';
  return render(
    <MemoryRouter initialEntries={[route]}>
      <SearchPage />
    </MemoryRouter>
  );
}

describe('SearchPage', () => {
  it('renders Search Stocks heading', () => {
    renderSearchPage();
    expect(screen.getByText('Search Stocks')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderSearchPage();
    expect(screen.getByPlaceholderText('Search by ticker or company name\u2026')).toBeInTheDocument();
  });

  it('shows no results message for empty search', () => {
    renderSearchPage('NORESULT');
    expect(screen.getByText('No stocks found for your query.')).toBeInTheDocument();
  });

  it('shows search results for valid query', () => {
    renderSearchPage('AAPL');
    expect(screen.getByText('AAPL - Apple Inc')).toBeInTheDocument();
  });
});
