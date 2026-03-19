// ChangeIndicator — displays positive/negative change with color coding
// [FRD-010], [US-010]

import { formatChange, formatPercent } from '../../utils/formatters';

interface ChangeIndicatorProps {
  change: number;
  changePercent: number;
  showIcon?: boolean;
  className?: string;
}

export default function ChangeIndicator({ change, changePercent, showIcon = true, className = '' }: ChangeIndicatorProps) {
  const isPositive = change >= 0;
  const colorClass = isPositive ? 'text-emerald-500' : 'text-red-500';
  const bgClass = isPositive ? 'bg-emerald-100' : 'bg-red-100';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${colorClass} ${bgClass} ${className}`}>
      {showIcon && (
        <span className="text-xs">{isPositive ? '▲' : '▼'}</span>
      )}
      <span className="font-mono">{formatChange(change)}</span>
      <span className="font-mono">({formatPercent(changePercent)})</span>
    </span>
  );
}
