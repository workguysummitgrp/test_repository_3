// DashboardPage — [US-010], [US-011] Market indices + top movers

import IndexCard from '../components/ui/IndexCard';
import MoverRow from '../components/ui/MoverRow';
import SkeletonCard from '../components/ui/SkeletonCard';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useIndices } from '../hooks/useIndices';
import { useMovers } from '../hooks/useMovers';

export default function DashboardPage() {
  const { indices, isLoading: indicesLoading, error: indicesError } = useIndices();
  const { gainers, losers, isLoading: moversLoading, error: moversError } = useMovers();

  return (
    <div className="space-y-8">
      {/* Market Indices */}
      <section>
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Market Overview</h1>
        {indicesError && <ErrorMessage message={indicesError} />}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {indicesLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} lines={2} />)
            : indices.map((idx) => (
                <IndexCard
                  key={idx.symbol}
                  name={idx.name}
                  symbol={idx.symbol}
                  price={idx.price}
                  change={idx.change}
                  changePercent={idx.changePercent}
                />
              ))}
        </div>
      </section>

      {/* Top Movers */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Movers</h2>
        {moversError && <ErrorMessage message={moversError} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gainers */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-emerald-600 mb-3">Top Gainers</h3>
            {moversLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-0.5">
                {gainers.map((m, i) => (
                  <MoverRow
                    key={m.ticker}
                    ticker={m.ticker}
                    price={m.price}
                    changePercent={m.change_percentage}
                    rank={i + 1}
                    type="gainer"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Losers */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-red-600 mb-3">Top Losers</h3>
            {moversLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-0.5">
                {losers.map((m, i) => (
                  <MoverRow
                    key={m.ticker}
                    ticker={m.ticker}
                    price={m.price}
                    changePercent={m.change_percentage}
                    rank={i + 1}
                    type="loser"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
