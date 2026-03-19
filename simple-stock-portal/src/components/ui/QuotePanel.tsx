// QuotePanel — stock quote stats grid [FRD-003], [US-004]

import type { QuoteData } from '../../types';
import { formatCurrency, formatVolume } from '../../utils/formatters';
import StatItem from './StatItem';
import ChangeIndicator from './ChangeIndicator';

interface QuotePanelProps {
  quote: QuoteData;
}

export default function QuotePanel({ quote }: QuotePanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-4 flex-wrap">
        <span className="font-mono text-2xl font-bold text-gray-900">{formatCurrency(quote.price)}</span>
        <ChangeIndicator change={quote.change} changePercent={quote.changePercent} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatItem label="Open" value={formatCurrency(quote.open)} />
        <StatItem label="High" value={formatCurrency(quote.high)} />
        <StatItem label="Low" value={formatCurrency(quote.low)} />
        <StatItem label="Prev Close" value={formatCurrency(quote.previousClose)} />
        <StatItem label="Volume" value={formatVolume(quote.volume)} />
        <StatItem label="Latest Trading Day" value={quote.latestTradingDay} />
      </div>
    </div>
  );
}
