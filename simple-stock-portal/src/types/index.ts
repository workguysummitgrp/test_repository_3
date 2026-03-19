// Types — [TR-006] API Abstraction Layer, [FRD-001], [FRD-003], [FRD-005]

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
  matchScore: number;
}

export interface QuoteData {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: number;
}

export interface ChartPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ChartData = ChartPoint[];

export interface MoverData {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

export interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export type TimeRange = '1W' | '1M' | '3M' | '1Y';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface StockApiService {
  searchSymbols(query: string): Promise<SearchResult[]>;
  getQuote(symbol: string): Promise<QuoteData>;
  getDailyTimeSeries(symbol: string): Promise<ChartData>;
  getWeeklyTimeSeries(symbol: string): Promise<ChartData>;
  getTopMovers(): Promise<{ gainers: MoverData[]; losers: MoverData[] }>;
}
