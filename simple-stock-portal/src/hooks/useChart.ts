// useChart — [FRD-005], [FRD-006] Fetch + cache chart data with time range

import { useState, useEffect } from 'react';
import type { ChartData, TimeRange } from '../types';
import { alphaVantageService } from '../services/alphaVantageService';

const RANGE_POINTS: Record<TimeRange, number> = {
  '1W': 5,
  '1M': 22,
  '3M': 66,
  '1Y': 52,
};

export function useChart(symbol: string | undefined, range: TimeRange = '1M') {
  const [chartData, setChartData] = useState<ChartData>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let data: ChartData;
        if (range === '1Y') {
          data = await alphaVantageService.getWeeklyTimeSeries(symbol);
        } else {
          data = await alphaVantageService.getDailyTimeSeries(symbol);
        }

        if (!cancelled) {
          const sliced = data.slice(-RANGE_POINTS[range]);
          setChartData(sliced);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load chart data.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  return { chartData, isLoading, error };
}
