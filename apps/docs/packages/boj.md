# jamaica-boj

Bank of Jamaica exchange rate client — live FX rates for JMD currency pairs with built-in caching and offline fallback.

## Installation

::: code-group
```bash [npm]
npm install jamaica-boj
```
```bash [pnpm]
pnpm add jamaica-boj
```
:::

## Quick Start

```typescript
import { getExchangeRate, getExchangeRates, convertToJMD, getFallbackRates } from 'jamaica-boj';

// Get USD rate (fetches live, falls back to cached/built-in)
const usd = await getExchangeRate('USD');
console.log(`USD/JMD: Buy ${usd.buy}, Sell ${usd.sell}, Mid ${usd.mid}`);

// Convert USD to JMD
const jmd = await convertToJMD(100, 'USD');
console.log(`$100 USD = J$${jmd.toFixed(2)}`);

// Get all rates
const { rates, source } = await getExchangeRates();
console.log(`Rates from: ${source}`); // "live", "cache", or "fallback"

// Offline-safe: use fallback rates synchronously
const fallback = getFallbackRates();
```

## How It Works

The package fetches exchange rates from the [Bank of Jamaica](https://boj.org.jm/market/foreign-exchange/counter-rates/) counter rates page. Rates are cached in memory for 1 hour by default. If the BOJ site is unreachable, the package falls back to built-in baseline rates.

| Source | When Used |
|--------|-----------|
| `live` | Successfully fetched from BOJ |
| `cache` | Within cache TTL (default: 1 hour) |
| `fallback` | Fetch failed, no cache available |

## Supported Currencies

| Code | Currency |
|------|----------|
| USD | US Dollar |
| GBP | British Pound |
| CAD | Canadian Dollar |
| EUR | Euro |
| JPY | Japanese Yen |
| KYD | Cayman Dollar |
| TTD | Trinidad & Tobago Dollar |
| BBD | Barbados Dollar |
| BZD | Belize Dollar |
| GYD | Guyana Dollar |
| XCD | East Caribbean Dollar |

## API Reference

### Async Functions (Network)

#### `getExchangeRates()`
Returns all rates with source metadata.

```typescript
const { rates, lastUpdated, source } = await getExchangeRates();
```

#### `getExchangeRate(currency)`
Returns rate for a specific currency.

```typescript
const usd = await getExchangeRate('USD');
// { currency: 'USD', name: 'US Dollar', buy: 154.50, sell: 156.50, mid: 155.50, date: '...' }
```

#### `convertToJMD(amount, currency)`
Converts foreign currency to JMD using the **buy** rate.

#### `convertFromJMD(amount, currency)`
Converts JMD to foreign currency using the **sell** rate.

### Sync Functions (Offline)

#### `getFallbackRates()`
Returns built-in baseline rates (no network call).

#### `getFallbackRate(currency)`
Returns a specific fallback rate.

#### `getSupportedCurrencies()`
Returns all supported currency codes.

### Client Factory

#### `createBOJClient(options?)`
Create a custom client with specific options.

```typescript
const client = createBOJClient({
  cacheTtl: 30 * 60 * 1000, // 30 minutes
  fetchFn: customFetch,       // custom HTTP client
  baseUrl: 'https://boj.org.jm',
});

const rates = await client.getRates();
const usd = await client.getRate('USD');
client.clearCache();
```

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cacheTtl` | `number` | `3600000` (1h) | Cache duration in ms |
| `fetchFn` | `typeof fetch` | `globalThis.fetch` | Custom fetch function |
| `baseUrl` | `string` | `"https://boj.org.jm"` | BOJ base URL |
