// PriceChart — [FRD-005], [US-005] Price history chart using Recharts

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { ChartData } from '../../types';
import { formatCurrency, formatShortDate } from '../../utils/formatters';

interface PriceChartProps {
  data: ChartData;
  isLoading?: boolean;
}

interface TooltipPayload {
  value: number;
  payload: { date: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
      <div className="text-gray-400 text-xs mb-1">{formatShortDate(payload[0].payload.date)}</div>
      <div className="font-mono font-semibold">{formatCurrency(payload[0].value)}</div>
    </div>
  );
}

export default function PriceChart({ data, isLoading }: PriceChartProps) {
  if (isLoading) {
    return (
      <div className="h-80 bg-gray-50 rounded-xl animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
        No chart data available
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#6366F1"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorClose)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
