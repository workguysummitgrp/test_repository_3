import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearCache } from '../../src/services/cacheManager';

// Mock the rate limiter to pass through immediately
vi.mock('../../src/services/rateLimiter', () => ({
  enqueueRequest: vi.fn().mockResolvedValue(undefined),
}));

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('alphaVantageService', () => {
  beforeEach(() => {
    vi.resetModules();
    clearCache();
    mockFetch.mockReset();
  });

  it('searchSymbols returns normalized results', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        bestMatches: [
          {
            '1. symbol': 'AAPL',
            '2. name': 'Apple Inc',
            '3. type': 'Equity',
            '4. region': 'United States',
            '8. currency': 'USD',
            '9. matchScore': '1.0000',
          },
        ],
      }),
    });

    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    const results = await alphaVantageService.searchSymbols('AAPL');

    expect(results).toHaveLength(1);
    expect(results[0].symbol).toBe('AAPL');
    expect(results[0].name).toBe('Apple Inc');
    expect(results[0].type).toBe('Equity');
  });

  it('getQuote returns normalized quote data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        'Global Quote': {
          '01. symbol': 'AAPL',
          '02. open': '150.00',
          '03. high': '155.00',
          '04. low': '149.00',
          '05. price': '153.50',
          '06. volume': '75000000',
          '07. latest trading day': '2026-03-19',
          '08. previous close': '150.00',
          '09. change': '3.50',
          '10. change percent': '2.33%',
        },
      }),
    });

    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    const quote = await alphaVantageService.getQuote('AAPL');

    expect(quote.symbol).toBe('AAPL');
    expect(quote.price).toBe(153.5);
    expect(quote.change).toBe(3.5);
    expect(quote.changePercent).toBe(2.33);
    expect(quote.volume).toBe(75000000);
  });

  it('getDailyTimeSeries returns sorted chart data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        'Time Series (Daily)': {
          '2026-03-19': { '1. open': '150', '2. high': '155', '3. low': '149', '4. close': '153', '5. volume': '5000000' },
          '2026-03-18': { '1. open': '148', '2. high': '152', '3. low': '147', '4. close': '150', '5. volume': '4000000' },
        },
      }),
    });

    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    const chart = await alphaVantageService.getDailyTimeSeries('AAPL');

    expect(chart).toHaveLength(2);
    expect(chart[0].date).toBe('2026-03-18'); // sorted ascending
    expect(chart[1].date).toBe('2026-03-19');
    expect(chart[1].close).toBe(153);
  });

  it('getTopMovers returns gainers and losers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        top_gainers: [
          { ticker: 'TSLA', price: '250', change_amount: '25', change_percentage: '11%', volume: '90000000' },
        ],
        top_losers: [
          { ticker: 'META', price: '300', change_amount: '-15', change_percentage: '-4.7%', volume: '40000000' },
        ],
      }),
    });

    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    const movers = await alphaVantageService.getTopMovers();

    expect(movers.gainers).toHaveLength(1);
    expect(movers.losers).toHaveLength(1);
    expect(movers.gainers[0].ticker).toBe('TSLA');
  });

  it('throws on API rate limit response (Note field)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ Note: 'Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute.' }),
    });

    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    await expect(alphaVantageService.searchSymbols('TEST')).rejects.toThrow('API rate limit reached');
  });

  it('throws on Error Message response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 'Error Message': 'Invalid API call' }),
    });

    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    await expect(alphaVantageService.searchSymbols('INVALID')).rejects.toThrow('Invalid API call');
  });

  it('throws on HTTP error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    await expect(alphaVantageService.searchSymbols('ERR')).rejects.toThrow('API request failed');
  });

  it('returns empty results for missing bestMatches', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { alphaVantageService } = await import('../../src/services/alphaVantageService');
    const results = await alphaVantageService.searchSymbols('EMPTY');
    expect(results).toEqual([]);
  });
});
