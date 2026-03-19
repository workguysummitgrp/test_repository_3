// IndexCard — market index display [FRD-010], [US-010]

import { formatCurrency, formatPercent } from '../../utils/formatters';

interface IndexCardProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function IndexCard({ name, symbol, price, change, changePercent }: IndexCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{name}</h3>
        <span className="font-mono text-xs text-gray-400">{symbol}</span>
      </div>
      <div className="font-mono text-xl font-bold text-gray-900 mb-1">
        {formatCurrency(price)}
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        <span>{isPositive ? '▲' : '▼'}</span>
        <span className="font-mono">{isPositive ? '+' : ''}{change.toFixed(2)}</span>
        <span className="font-mono">({formatPercent(changePercent)})</span>
      </div>
    </div>
  );
}
