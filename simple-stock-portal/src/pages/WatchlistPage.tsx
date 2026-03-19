// WatchlistPage — [US-007], [US-008], [US-009]

import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useWatchlistQuotes } from '../hooks/useWatchlistQuotes';
import WatchlistRow from '../components/ui/WatchlistRow';
import EmptyState from '../components/ui/EmptyState';

export default function WatchlistPage() {
  const { tickers, removeTicker, storageWarning } = useWatchlist();
  const { quotes, isLoading } = useWatchlistQuotes(tickers);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Watchlist</h1>

      {storageWarning && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-lg">
          Watchlist storage is unavailable. Your selections won&apos;t be saved.
        </div>
      )}

      {tickers.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          }
          title="Your watchlist is empty"
          description="Add stocks to your watchlist from the search or stock detail pages to track them here."
          action={
            <Link
              to="/search"
              className="bg-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
            >
              Search Stocks
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {tickers.map((ticker) => (
            <WatchlistRow
              key={ticker}
              ticker={ticker}
              quote={quotes[ticker]}
              isLoading={isLoading && !quotes[ticker]}
              onRemove={removeTicker}
            />
          ))}
        </div>
      )}
    </div>
  );
}
