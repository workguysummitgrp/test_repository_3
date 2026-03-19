// MoverRow — single mover row [FRD-011], [US-011]

import { useNavigate } from 'react-router-dom';

interface MoverRowProps {
  ticker: string;
  price: string;
  changePercent: string;
  rank: number;
  type: 'gainer' | 'loser';
}

export default function MoverRow({ ticker, price, changePercent, rank, type }: MoverRowProps) {
  const navigate = useNavigate();
  const colorClass = type === 'gainer' ? 'text-emerald-500' : 'text-red-500';

  return (
    <button
      onClick={() => navigate(`/stock/${ticker}`)}
      className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-4">{rank}.</span>
        <span className="font-mono text-sm font-semibold text-gray-900">{ticker}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm text-gray-600">${parseFloat(price).toFixed(2)}</span>
        <span className={`font-mono text-sm font-medium ${colorClass} w-20 text-right`}>
          {changePercent}
        </span>
      </div>
    </button>
  );
}
