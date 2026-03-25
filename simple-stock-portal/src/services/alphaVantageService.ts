// Alpha Vantage API Service — [TR-006] API Abstraction Layer
// Implements StockApiService interface with cache + rate limiting

import type { SearchResult, QuoteData, ChartData, MoverData, StockApiService } from '../types';
import { getCached, setCache, CACHE_TTLS } from './cacheManager';
import { enqueueRequest } from './rateLimiter';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

async function fetchApi(params: Record<string, string>): Promise<unknown> {
  await enqueueRequest();

  const url = new URL(BASE_URL);
  url.searchParams.set('apikey', API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Alpha Vantage returns rate limit errors in the response body
  if (data['Note'] || data['Information']) {
    throw new Error('API rate limit reached. Please wait a moment and try again.');
  }

  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }

  return data;
}

function normalizeSearchResults(data: unknown): SearchResult[] {
  const raw = data as { bestMatches?: Record<string, string>[] };
  if (!raw.bestMatches) return [];

  return raw.bestMatches.slice(0, 10).map((match) => ({
    symbol: match['1. symbol'] || '',
    name: match['2. name'] || '',
    type: match['3. type'] || '',
    region: match['4. region'] || '',
    currency: match['8. currency'] || '',
    matchScore: parseFloat(match['9. matchScore'] || '0'),
  }));
}

function normalizeQuote(data: unknown): QuoteData {
  const raw = data as { 'Global Quote'?: Record<string, string> };
  const quote = raw['Global Quote'];
  if (!quote || !quote['01. symbol']) {
    throw new Error('Invalid quote data received');
  }

  return {
    symbol: quote['01. symbol'],
    open: parseFloat(quote['02. open'] || '0'),
    high: parseFloat(quote['03. high'] || '0'),
    low: parseFloat(quote['04. low'] || '0'),
    price: parseFloat(quote['05. price'] || '0'),
    volume: parseInt(quote['06. volume'] || '0', 10),
    latestTradingDay: quote['07. latest trading day'] || '',
    previousClose: parseFloat(quote['08. previous close'] || '0'),
    change: parseFloat(quote['09. change'] || '0'),
    changePercent: parseFloat((quote['10. change percent'] || '0').replace('%', '')),
    fetchedAt: Date.now(),
  };
}

function normalizeTimeSeries(data: unknown, seriesKey: string): ChartData {
  const raw = data as Record<string, Record<string, Record<string, string>>>;
  const series = raw[seriesKey];
  if (!series) return [];

  return Object.entries(series)
    .map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open'] || '0'),
      high: parseFloat(values['2. high'] || '0'),
      low: parseFloat(values['3. low'] || '0'),
      close: parseFloat(values['4. close'] || '0'),
      volume: parseInt(values['5. volume'] || '0', 10),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function normalizeMovers(data: unknown): { gainers: MoverData[]; losers: MoverData[] } {
  const raw = data as {
    top_gainers?: MoverData[];
    top_losers?: MoverData[];
  };

  return {
    gainers: (raw.top_gainers || []).slice(0, 5),
    losers: (raw.top_losers || []).slice(0, 5),
  };
}

export const alphaVantageService: StockApiService = {
  async searchSymbols(query: string): Promise<SearchResult[]> {
    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = getCached<SearchResult[]>(cacheKey);
    if (cached) return cached;

    const data = await fetchApi({ function: 'SYMBOL_SEARCH', keywords: query });
    const results = normalizeSearchResults(data);
    setCache(cacheKey, results, CACHE_TTLS.search);
    return results;
  },

  async getQuote(symbol: string): Promise<QuoteData> {
    const cacheKey = `quote:${symbol.toUpperCase()}`;
    const cached = getCached<QuoteData>(cacheKey);
    if (cached) return cached;

    const data = await fetchApi({ function: 'GLOBAL_QUOTE', symbol });
    const quote = normalizeQuote(data);
    setCache(cacheKey, quote, CACHE_TTLS.quote);
    return quote;
  },

  async getDailyTimeSeries(symbol: string): Promise<ChartData> {
    const cacheKey = `daily:${symbol.toUpperCase()}`;
    const cached = getCached<ChartData>(cacheKey);
    if (cached) return cached;

    const data = await fetchApi({ function: 'TIME_SERIES_DAILY', symbol, outputsize: 'compact' });
    const chart = normalizeTimeSeries(data, 'Time Series (Daily)');
    setCache(cacheKey, chart, CACHE_TTLS.chart);
    return chart;
  },

  async getWeeklyTimeSeries(symbol: string): Promise<ChartData> {
    const cacheKey = `weekly:${symbol.toUpperCase()}`;
    const cached = getCached<ChartData>(cacheKey);
    if (cached) return cached;

    const data = await fetchApi({ function: 'TIME_SERIES_WEEKLY', symbol });
    const chart = normalizeTimeSeries(data, 'Weekly Time Series');
    setCache(cacheKey, chart, CACHE_TTLS.chart);
    return chart;
  },

  async getTopMovers(): Promise<{ gainers: MoverData[]; losers: MoverData[] }> {
    const cacheKey = 'movers';
    const cached = getCached<{ gainers: MoverData[]; losers: MoverData[] }>(cacheKey);
    if (cached) return cached;

    const data = await fetchApi({ function: 'TOP_GAINERS_LOSERS' });
    const movers = normalizeMovers(data);
    setCache(cacheKey, movers, CACHE_TTLS.movers);
    return movers;
  },
};
