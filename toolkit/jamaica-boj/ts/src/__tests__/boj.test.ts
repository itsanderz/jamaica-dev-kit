import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createBOJClient,
  getExchangeRates,
  getExchangeRate,
  convertFromJMD,
  convertToJMD,
  getFallbackRates,
  getFallbackRate,
  getSupportedCurrencies,
  parseCounterRatesHtml,
  clearCache,
} from '../index';

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------
beforeEach(() => {
  clearCache();
});

// ---------------------------------------------------------------------------
// Fallback/offline functions
// ---------------------------------------------------------------------------
describe('getFallbackRates', () => {
  it('returns all fallback rates', () => {
    const rates = getFallbackRates();
    expect(rates.length).toBeGreaterThan(0);
    expect(rates.find((r) => r.currency === 'USD')).toBeTruthy();
  });

  it('returns copies (not references)', () => {
    const rates1 = getFallbackRates();
    const rates2 = getFallbackRates();
    expect(rates1).not.toBe(rates2);
  });

  it('each rate has required fields', () => {
    const rates = getFallbackRates();
    for (const rate of rates) {
      expect(rate.currency).toBeTruthy();
      expect(rate.name).toBeTruthy();
      expect(rate.buy).toBeGreaterThan(0);
      expect(rate.sell).toBeGreaterThan(0);
      expect(rate.mid).toBeGreaterThan(0);
      expect(rate.date).toBeTruthy();
    }
  });

  it('mid is average of buy and sell', () => {
    const rates = getFallbackRates();
    for (const rate of rates) {
      expect(rate.mid).toBeCloseTo((rate.buy + rate.sell) / 2, 2);
    }
  });

  it('sell rate is higher than buy rate', () => {
    const rates = getFallbackRates();
    for (const rate of rates) {
      expect(rate.sell).toBeGreaterThanOrEqual(rate.buy);
    }
  });
});

describe('getFallbackRate', () => {
  it('returns USD rate', () => {
    const rate = getFallbackRate('USD');
    expect(rate).toBeDefined();
    expect(rate!.currency).toBe('USD');
    expect(rate!.buy).toBeGreaterThan(100);
  });

  it('returns GBP rate', () => {
    const rate = getFallbackRate('GBP');
    expect(rate).toBeDefined();
    expect(rate!.buy).toBeGreaterThan(rate!.buy * 0); // positive
  });

  it('returns undefined for unknown currency', () => {
    const rate = getFallbackRate('XYZ' as any);
    expect(rate).toBeUndefined();
  });

  it('returns copy (not reference)', () => {
    const rate1 = getFallbackRate('USD');
    const rate2 = getFallbackRate('USD');
    expect(rate1).not.toBe(rate2);
    expect(rate1).toEqual(rate2);
  });
});

describe('getSupportedCurrencies', () => {
  it('includes major currencies', () => {
    const currencies = getSupportedCurrencies();
    expect(currencies).toContain('USD');
    expect(currencies).toContain('GBP');
    expect(currencies).toContain('CAD');
    expect(currencies).toContain('EUR');
  });

  it('includes Caribbean currencies', () => {
    const currencies = getSupportedCurrencies();
    expect(currencies).toContain('TTD');
    expect(currencies).toContain('BBD');
    expect(currencies).toContain('KYD');
    expect(currencies).toContain('XCD');
  });

  it('returns 11 currencies', () => {
    expect(getSupportedCurrencies().length).toBe(11);
  });
});

// ---------------------------------------------------------------------------
// HTML parser
// ---------------------------------------------------------------------------
describe('parseCounterRatesHtml', () => {
  const sampleHtml = `
    <table>
      <tr><th>Currency</th><th>Buy</th><th>Sell</th></tr>
      <tr><td>US Dollar</td><td>154.50</td><td>156.50</td></tr>
      <tr><td>British Pound</td><td>193.80</td><td>197.20</td></tr>
      <tr><td>Canadian Dollar</td><td>108.20</td><td>110.80</td></tr>
      <tr><td>Euro</td><td>161.50</td><td>164.50</td></tr>
    </table>
  `;

  it('parses exchange rates from HTML table', () => {
    const rates = parseCounterRatesHtml(sampleHtml);
    expect(rates.length).toBe(4);
  });

  it('parses USD correctly', () => {
    const rates = parseCounterRatesHtml(sampleHtml);
    const usd = rates.find((r) => r.currency === 'USD');
    expect(usd).toBeDefined();
    expect(usd!.buy).toBe(154.50);
    expect(usd!.sell).toBe(156.50);
    expect(usd!.mid).toBeCloseTo(155.50, 2);
  });

  it('parses GBP correctly', () => {
    const rates = parseCounterRatesHtml(sampleHtml);
    const gbp = rates.find((r) => r.currency === 'GBP');
    expect(gbp).toBeDefined();
    expect(gbp!.buy).toBe(193.80);
    expect(gbp!.sell).toBe(197.20);
  });

  it('returns empty array for invalid HTML', () => {
    expect(parseCounterRatesHtml('<p>No table here</p>')).toEqual([]);
  });

  it('skips non-numeric rows', () => {
    const html = `
      <table>
        <tr><td>US Dollar</td><td>N/A</td><td>N/A</td></tr>
      </table>
    `;
    expect(parseCounterRatesHtml(html)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Client with mock fetch
// ---------------------------------------------------------------------------
describe('createBOJClient', () => {
  const mockHtml = `
    <table>
      <tr><td>US Dollar</td><td>155.00</td><td>157.00</td></tr>
      <tr><td>British Pound</td><td>194.00</td><td>198.00</td></tr>
    </table>
  `;

  function createMockFetch(html: string = mockHtml, ok: boolean = true) {
    return vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      text: () => Promise.resolve(html),
    });
  }

  it('fetches live rates', async () => {
    const fetchFn = createMockFetch();
    const client = createBOJClient({ fetchFn });

    const result = await client.getRates();
    expect(result.source).toBe('live');
    expect(result.rates.length).toBe(2);
    expect(fetchFn).toHaveBeenCalledOnce();
  });

  it('caches rates', async () => {
    const fetchFn = createMockFetch();
    const client = createBOJClient({ fetchFn });

    await client.getRates();
    const result = await client.getRates();

    expect(result.source).toBe('cache');
    expect(fetchFn).toHaveBeenCalledOnce(); // Only one fetch call
  });

  it('falls back to built-in rates on fetch failure', async () => {
    const fetchFn = createMockFetch('', false);
    const client = createBOJClient({ fetchFn });

    const result = await client.getRates();
    expect(result.source).toBe('fallback');
    expect(result.rates.length).toBeGreaterThan(0);
  });

  it('falls back when fetch throws', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Network error'));
    const client = createBOJClient({ fetchFn });

    const result = await client.getRates();
    expect(result.source).toBe('fallback');
  });

  it('getRate returns specific currency', async () => {
    const fetchFn = createMockFetch();
    const client = createBOJClient({ fetchFn });

    const usd = await client.getRate('USD');
    expect(usd.currency).toBe('USD');
    expect(usd.buy).toBe(155.00);
    expect(usd.sell).toBe(157.00);
  });

  it('getRate throws for unknown currency', async () => {
    const fetchFn = createMockFetch();
    const client = createBOJClient({ fetchFn });

    await expect(client.getRate('JPY')).rejects.toThrow('No exchange rate found for JPY');
  });

  it('convertToJMD uses buy rate', async () => {
    const fetchFn = createMockFetch();
    const client = createBOJClient({ fetchFn });

    const jmd = await client.convertToJMD(100, 'USD');
    expect(jmd).toBe(100 * 155.00);
  });

  it('convertFromJMD uses sell rate', async () => {
    const fetchFn = createMockFetch();
    const client = createBOJClient({ fetchFn });

    const usd = await client.convertFromJMD(15700, 'USD');
    expect(usd).toBe(15700 / 157.00);
  });

  it('clearCache forces re-fetch', async () => {
    const fetchFn = createMockFetch();
    const client = createBOJClient({ fetchFn });

    await client.getRates();
    client.clearCache();
    await client.getRates();

    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('respects custom cacheTtl', async () => {
    const fetchFn = createMockFetch();
    const client = createBOJClient({ fetchFn, cacheTtl: 0 }); // 0ms = never cache

    await client.getRates();
    await client.getRates();

    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('uses custom baseUrl', async () => {
    const fetchFn = createMockFetch();
    const client = createBOJClient({ fetchFn, baseUrl: 'https://custom.boj.jm' });

    await client.getRates();
    expect(fetchFn).toHaveBeenCalledWith(
      expect.stringContaining('https://custom.boj.jm'),
      expect.any(Object),
    );
  });
});

// ---------------------------------------------------------------------------
// Convenience functions (use mocked default client)
// ---------------------------------------------------------------------------
describe('convenience functions', () => {
  it('getExchangeRates returns fallback rates without fetch', async () => {
    const result = await getExchangeRates();
    expect(result.source).toBe('fallback');
    expect(result.rates.length).toBeGreaterThan(0);
  });

  it('getExchangeRate returns USD fallback', async () => {
    const usd = await getExchangeRate('USD');
    expect(usd.currency).toBe('USD');
    expect(usd.buy).toBeGreaterThan(100);
  });

  it('convertToJMD converts using fallback rates', async () => {
    const jmd = await convertToJMD(100, 'USD');
    expect(jmd).toBeGreaterThan(10000);
  });

  it('convertFromJMD converts using fallback rates', async () => {
    const usd = await convertFromJMD(15000, 'USD');
    expect(usd).toBeGreaterThan(50);
    expect(usd).toBeLessThan(200);
  });
});
