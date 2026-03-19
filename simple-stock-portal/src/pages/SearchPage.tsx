// SearchPage — [US-001], [US-002], [US-003]

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchInput from '../components/ui/SearchInput';
import SearchResultRow from '../components/ui/SearchResultRow';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';
import { useSearch } from '../hooks/useSearch';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();
  const { results, isLoading, error } = useSearch(query);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Search Stocks</h1>

      <SearchInput
        value={query}
        onChange={setQuery}
        isLoading={isLoading}
        autoFocus
      />

      {error && <ErrorMessage message={error} />}

      {!error && !isLoading && query.length >= 2 && results.length === 0 && (
        <EmptyState
          title="No stocks found for your query."
          description="Try searching with a different ticker symbol or company name."
        />
      )}

      {results.length > 0 && (
        <div className="divide-y divide-gray-100">
          {results.map((result) => (
            <SearchResultRow
              key={`${result.symbol}-${result.region}`}
              symbol={result.symbol}
              name={result.name}
              type={result.type}
              region={result.region}
              onClick={() => navigate(`/stock/${result.symbol}`)}
            />
          ))}
        </div>
      )}

      {results.length > 0 && (
        <p className="text-sm text-gray-500">
          Showing {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}
