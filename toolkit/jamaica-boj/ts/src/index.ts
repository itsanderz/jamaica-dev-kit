/**
 * jamaica-boj — Bank of Jamaica exchange rate client.
 *
 * Provides live and cached FX rates for JMD currency pairs,
 * with built-in caching and offline fallback.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExchangeRate {
  /** Currency code (e.g., "USD", "GBP") */
  currency: string;
  /** Currency name (e.g., "US Dollar") */
  name: string;
  /** Buying rate (JMD per 1 unit of foreign currency) */
  buy: number;
  /** Selling rate (JMD per 1 unit of foreign currency) */
  sell: number;
  /** Mid-market rate (average of buy and sell) */
  mid: number;
  /** Date the rate was published */
  date: string;
}

export interface ExchangeRateResponse {
  /** All rates returned */
  rates: ExchangeRate[];
  /** When the rates were last updated */
  lastUpdated: string;
  /** Whether rates came from cache or were freshly fetched */
  source: 'live' | 'cache' | 'fallback';
}

export interface HistoricalRate {
  /** Currency code */
  currency: string;
  /** Date string (YYYY-MM-DD) */
  date: string;
  /** Buying rate */
  buy: number;
  /** Selling rate */
  sell: number;
  /** Mid-market rate */
  mid: number;
}

/** A fetch-compatible function signature */
export type FetchFn = (url: string, init?: Record<string, unknown>) => Promise<{ ok: boolean; status: number; text: () => Promise<string>; json: () => Promise<unknown> }>;

export interface BOJClientOptions {
  /** Cache duration in milliseconds (default: 1 hour) */
  cacheTtl?: number;
  /** Custom fetch function (for testing or custom HTTP clients) */
  fetchFn?: FetchFn;
  /** Base URL for the BOJ website (default: "https://boj.org.jm") */
  baseUrl?: string;
}

export type CurrencyCode = 'USD' | 'GBP' | 'CAD' | 'EUR' | 'JPY' | 'KYD' | 'TTD' | 'BBD' | 'BZD' | 'GYD' | 'XCD';

// ---------------------------------------------------------------------------
// Fallback rates (BOJ counter rates, periodically updated)
// ---------------------------------------------------------------------------

const FALLBACK_RATES: ExchangeRate[] = [
  { currency: 'USD', name: 'US Dollar', buy: 154.50, sell: 156.50, mid: 155.50, date: '2025-02-01' },
  { currency: 'GBP', name: 'British Pound', buy: 193.80, sell: 197.20, mid: 195.50, date: '2025-02-01' },
  { currency: 'CAD', name: 'Canadian Dollar', buy: 108.20, sell: 110.80, mid: 109.50, date: '2025-02-01' },
  { currency: 'EUR', name: 'Euro', buy: 161.50, sell: 164.50, mid: 163.00, date: '2025-02-01' },
  { currency: 'JPY', name: 'Japanese Yen', buy: 1.01, sell: 1.05, mid: 1.03, date: '2025-02-01' },
  { currency: 'KYD', name: 'Cayman Dollar', buy: 186.50, sell: 190.50, mid: 188.50, date: '2025-02-01' },
  { currency: 'TTD', name: 'Trinidad & Tobago Dollar', buy: 22.50, sell: 23.50, mid: 23.00, date: '2025-02-01' },
  { currency: 'BBD', name: 'Barbados Dollar', buy: 76.50, sell: 78.50, mid: 77.50, date: '2025-02-01' },
  { currency: 'BZD', name: 'Belize Dollar', buy: 76.00, sell: 78.00, mid: 77.00, date: '2025-02-01' },
  { currency: 'GYD', name: 'Guyana Dollar', buy: 0.72, sell: 0.76, mid: 0.74, date: '2025-02-01' },
  { currency: 'XCD', name: 'East Caribbean Dollar', buy: 56.50, sell: 58.50, mid: 57.50, date: '2025-02-01' },
];

const CURRENCY_MAP = new Map(FALLBACK_RATES.map((r) => [r.currency, r]));

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

interface CacheEntry {
  rates: ExchangeRate[];
  timestamp: number;
}

let cache: CacheEntry | null = null;

// ---------------------------------------------------------------------------
// HTML Parser (extract rates from BOJ counter rates page)
// ---------------------------------------------------------------------------

/**
 * Parse exchange rates from BOJ counter rates HTML.
 * The BOJ page contains a table with Currency, Buy, Sell columns.
 */
export function parseCounterRatesHtml(html: string): ExchangeRate[] {
  const rates: ExchangeRate[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Match table rows with currency data
  // Pattern: <td>Currency Name</td><td>Buy Rate</td><td>Sell Rate</td>
  const rowPattern = /<tr[^>]*>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>/gi;
  let match: RegExpExecArray | null;

  const currencyMapping: Record<string, { code: CurrencyCode; name: string }> = {
    'us dollar': { code: 'USD', name: 'US Dollar' },
    'canadian dollar': { code: 'CAD', name: 'Canadian Dollar' },
    'british pound': { code: 'GBP', name: 'British Pound' },
    'euro': { code: 'EUR', name: 'Euro' },
    'cayman island dollar': { code: 'KYD', name: 'Cayman Dollar' },
    'japanese yen': { code: 'JPY', name: 'Japanese Yen' },
    'trinidad & tobago dollar': { code: 'TTD', name: 'Trinidad & Tobago Dollar' },
    'barbados dollar': { code: 'BBD', name: 'Barbados Dollar' },
    'belize dollar': { code: 'BZD', name: 'Belize Dollar' },
    'guyana dollar': { code: 'GYD', name: 'Guyana Dollar' },
    'east caribbean dollar': { code: 'XCD', name: 'East Caribbean Dollar' },
  };

  while ((match = rowPattern.exec(html)) !== null) {
    const rawName = match[1].replace(/<[^>]*>/g, '').trim().toLowerCase();
    const buyStr = match[2].replace(/<[^>]*>/g, '').trim();
    const sellStr = match[3].replace(/<[^>]*>/g, '').trim();

    const buy = parseFloat(buyStr);
    const sell = parseFloat(sellStr);

    if (isNaN(buy) || isNaN(sell)) continue;

    const mapping = currencyMapping[rawName];
    if (!mapping) continue;

    rates.push({
      currency: mapping.code,
      name: mapping.name,
      buy,
      sell,
      mid: (buy + sell) / 2,
      date: today,
    });
  }

  return rates;
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

/**
 * Create a BOJ exchange rate client with caching.
 *
 * @example
 * ```typescript
 * const client = createBOJClient();
 * const rates = await client.getRates();
 * const usd = await client.getRate('USD');
 * console.log(`USD/JMD: Buy ${usd.buy}, Sell ${usd.sell}`);
 * ```
 */
export function createBOJClient(options: BOJClientOptions = {}) {
  const {
    cacheTtl = 60 * 60 * 1000, // 1 hour
    fetchFn = typeof (globalThis as any).fetch === 'function' ? (globalThis as any).fetch as FetchFn : undefined,
    baseUrl = 'https://boj.org.jm',
  } = options;

  function isCacheValid(): boolean {
    if (!cache) return false;
    return Date.now() - cache.timestamp < cacheTtl;
  }

  async function fetchLiveRates(): Promise<ExchangeRate[]> {
    if (!fetchFn) {
      throw new Error('No fetch function available. Pass a custom fetchFn in options or use Node 18+.');
    }

    const url = `${baseUrl}/market/foreign-exchange/counter-rates/`;
    const response = await fetchFn(url, {
      headers: {
        'User-Agent': 'jamaica-boj/0.1.0',
        Accept: 'text/html',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch BOJ rates: HTTP ${response.status}`);
    }

    const html = await response.text();
    const rates = parseCounterRatesHtml(html);

    if (rates.length === 0) {
      throw new Error('Failed to parse exchange rates from BOJ page');
    }

    return rates;
  }

  return {
    /**
     * Get all exchange rates (live with cache, falls back to built-in rates).
     */
    async getRates(): Promise<ExchangeRateResponse> {
      // Return cache if valid
      if (isCacheValid()) {
        return {
          rates: cache!.rates,
          lastUpdated: new Date(cache!.timestamp).toISOString(),
          source: 'cache',
        };
      }

      // Try fetching live rates
      try {
        const rates = await fetchLiveRates();
        cache = { rates, timestamp: Date.now() };
        return {
          rates,
          lastUpdated: new Date().toISOString(),
          source: 'live',
        };
      } catch {
        // Fall back to cached (even if expired) or fallback rates
        if (cache) {
          return {
            rates: cache.rates,
            lastUpdated: new Date(cache.timestamp).toISOString(),
            source: 'cache',
          };
        }

        return {
          rates: [...FALLBACK_RATES],
          lastUpdated: FALLBACK_RATES[0].date,
          source: 'fallback',
        };
      }
    },

    /**
     * Get exchange rate for a specific currency.
     */
    async getRate(currency: CurrencyCode): Promise<ExchangeRate> {
      const { rates } = await this.getRates();
      const rate = rates.find((r) => r.currency === currency);
      if (!rate) {
        throw new Error(`No exchange rate found for ${currency}`);
      }
      return rate;
    },

    /**
     * Convert JMD to a foreign currency.
     */
    async convertFromJMD(amount: number, currency: CurrencyCode): Promise<number> {
      const rate = await this.getRate(currency);
      return amount / rate.sell;
    },

    /**
     * Convert a foreign currency amount to JMD.
     */
    async convertToJMD(amount: number, currency: CurrencyCode): Promise<number> {
      const rate = await this.getRate(currency);
      return amount * rate.buy;
    },

    /**
     * Clear the rate cache.
     */
    clearCache(): void {
      cache = null;
    },
  };
}

// ---------------------------------------------------------------------------
// Convenience functions (use a default client)
// ---------------------------------------------------------------------------

let defaultClient: ReturnType<typeof createBOJClient> | null = null;

function getDefaultClient(): ReturnType<typeof createBOJClient> {
  if (!defaultClient) {
    defaultClient = createBOJClient();
  }
  return defaultClient;
}

/**
 * Get all exchange rates.
 *
 * @example
 * ```typescript
 * const { rates, source } = await getExchangeRates();
 * rates.forEach(r => console.log(`${r.currency}: Buy ${r.buy}, Sell ${r.sell}`));
 * ```
 */
export async function getExchangeRates(): Promise<ExchangeRateResponse> {
  return getDefaultClient().getRates();
}

/**
 * Get exchange rate for a specific currency.
 *
 * @example
 * ```typescript
 * const usd = await getExchangeRate('USD');
 * console.log(`USD/JMD mid rate: ${usd.mid}`);
 * ```
 */
export async function getExchangeRate(currency: CurrencyCode): Promise<ExchangeRate> {
  return getDefaultClient().getRate(currency);
}

/**
 * Convert JMD to a foreign currency using the sell rate.
 */
export async function convertFromJMD(amount: number, currency: CurrencyCode): Promise<number> {
  return getDefaultClient().convertFromJMD(amount, currency);
}

/**
 * Convert a foreign currency amount to JMD using the buy rate.
 */
export async function convertToJMD(amount: number, currency: CurrencyCode): Promise<number> {
  return getDefaultClient().convertToJMD(amount, currency);
}

// ---------------------------------------------------------------------------
// Synchronous fallback functions (no network, uses hardcoded rates)
// ---------------------------------------------------------------------------

/**
 * Get all fallback exchange rates (no network call).
 * Useful when you need rates synchronously or offline.
 */
export function getFallbackRates(): ExchangeRate[] {
  return [...FALLBACK_RATES];
}

/**
 * Get a fallback exchange rate for a specific currency (no network call).
 */
export function getFallbackRate(currency: CurrencyCode): ExchangeRate | undefined {
  return CURRENCY_MAP.get(currency) ? { ...CURRENCY_MAP.get(currency)! } : undefined;
}

/**
 * List all supported currency codes.
 */
export function getSupportedCurrencies(): CurrencyCode[] {
  return FALLBACK_RATES.map((r) => r.currency) as CurrencyCode[];
}

/**
 * Clear the global rate cache.
 */
export function clearCache(): void {
  cache = null;
  defaultClient = null;
}
