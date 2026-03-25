// StockDetailPage — [US-004], [US-005], [US-006], [US-007]
// Quote + chart + watchlist toggle + last updated timestamp

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { TimeRange } from '../types';
import { useQuote } from '../hooks/useQuote';
import { useChart } from '../hooks/useChart';
import QuotePanel from '../components/ui/QuotePanel';
import PriceChart from '../components/ui/PriceChart';
import TimeRangeSelector from '../components/ui/TimeRangeSelector';
import WatchlistButton from '../components/ui/WatchlistButton';
import ErrorMessage from '../components/ui/ErrorMessage';
import SkeletonCard from '../components/ui/SkeletonCard';
import LastUpdated from '../components/ui/LastUpdated';

export default function StockDetailPage() {
  const { ticker } = useParams<{ ticker: string }>();
  const symbol = ticker?.toUpperCase();
  const [range, setRange] = useState<TimeRange>('1M');

  const { quote, isLoading: quoteLoading, error: quoteError, retry } = useQuote(symbol);
  const { chartData, isLoading: chartLoading, error: chartError } = useChart(symbol, range);

  if (!symbol) {
    return (
      <ErrorMessage message="No ticker symbol provided." />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/search" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            <span className="font-mono">{symbol}</span>
          </h1>
        </div>
        <WatchlistButton ticker={symbol} />
      </div>

      {/* Quote Panel */}
      {quoteError ? (
        <ErrorMessage message={quoteError} onRetry={retry} />
      ) : quoteLoading ? (
        <SkeletonCard lines={4} />
      ) : quote ? (
        <>
          <QuotePanel quote={quote} />
          <LastUpdated fetchedAt={quote.fetchedAt} />
        </>
      ) : null}

      {/* Chart */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Price History</h2>
          <TimeRangeSelector selected={range} onChange={setRange} />
        </div>
        {chartError ? (
          <ErrorMessage message={chartError} />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <PriceChart data={chartData} isLoading={chartLoading} />
          </div>
        )}
      </section>
    </div>
  );
}
