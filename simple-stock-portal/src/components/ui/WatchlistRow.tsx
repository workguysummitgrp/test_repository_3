// WatchlistRow — [FRD-004], [FRD-008], [US-008]

import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { QuoteData } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import LastUpdated from './LastUpdated';

interface WatchlistRowProps {
  ticker: string;
  quote?: QuoteData;
  isLoading: boolean;
  onRemove: (ticker: string) => void;
}

export default function WatchlistRow({ ticker, quote, isLoading, onRemove }: WatchlistRowProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group">
      <button
        onClick={() => navigate(`/stock/${ticker}`)}
        className="flex items-center gap-4 flex-1 text-left min-w-0"
      >
        <span className="font-mono text-sm font-semibold text-gray-900 w-16 shrink-0">{ticker}</span>
        {isLoading ? (
          <div className="flex gap-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : quote ? (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-gray-900">{formatCurrency(quote.price)}</span>
              <span className={`font-mono text-sm font-medium ${quote.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {quote.change >= 0 ? '▲' : '▼'} {formatPercent(quote.changePercent)}
              </span>
            </div>
            <LastUpdated fetchedAt={quote.fetchedAt} />
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(ticker);
        }}
        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        title="Remove from watchlist"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
