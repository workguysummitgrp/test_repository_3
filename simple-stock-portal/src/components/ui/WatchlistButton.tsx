// WatchlistButton — [FRD-007], [US-007]

import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useWatchlist } from '../../context/WatchlistContext';

interface WatchlistButtonProps {
  ticker: string;
}

export default function WatchlistButton({ ticker }: WatchlistButtonProps) {
  const { isWatchlisted, addTicker, removeTicker, isFull } = useWatchlist();
  const isActive = isWatchlisted(ticker);

  const handleClick = () => {
    if (isActive) {
      removeTicker(ticker);
    } else {
      if (isFull) {
        alert('Watchlist is full. Remove a stock to add a new one.');
        return;
      }
      addTicker(ticker);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isActive
          ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50 active:bg-red-100'
          : 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'
      }`}
      title={isActive ? 'Remove from Watchlist' : 'Add to Watchlist'}
    >
      {isActive ? (
        <>
          <StarSolid className="w-4 h-4" />
          Remove from Watchlist
        </>
      ) : (
        <>
          <StarOutline className="w-4 h-4" />
          Add to Watchlist
        </>
      )}
    </button>
  );
}
