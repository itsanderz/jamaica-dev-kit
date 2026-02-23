// jamaica-currency - JMD currency formatting, parsing, and conversion utilities

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Standard General Consumption Tax rate (15%). */
export const GCT_RATE = 0.15;

/** Telecom-specific GCT rate (25%). */
export const TELECOM_GCT_RATE = 0.25;

/**
 * Default JMD-to-USD exchange rate (approx. Feb 2026).
 *
 * **For development and testing only.** For production applications, always
 * fetch the current exchange rate from the Bank of Jamaica (BOJ) or a
 * reliable FX API. The JMD/USD rate fluctuates daily.
 */
export const DEFAULT_EXCHANGE_RATE = 155.47;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Options accepted by {@link formatJMD}. */
export interface FormatOptions {
  /** Whether to include the "J$" symbol prefix. Defaults to `true`. */
  showSymbol?: boolean;
  /** Number of decimal places. Defaults to `2`. */
  decimals?: number;
  /** Whether to use comma grouping (e.g. 1,000). Defaults to `true`. */
  useGrouping?: boolean;
}

/** Breakdown returned by {@link formatWithGCT}. */
export interface GCTBreakdown {
  /** Formatted base amount before GCT. */
  base: string;
  /** Formatted GCT amount. */
  gct: string;
  /** Formatted total (base + GCT). */
  total: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Round a number to a given number of decimal places using the
 * "round half away from zero" strategy so that e.g. 99.999 rounded to 2 dp
 * gives 100.00.
 */
function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Format an absolute numeric value with grouping and fixed decimals.
 * Does NOT include any currency symbol or sign.
 */
function formatAbsolute(
  absValue: number,
  decimals: number,
  useGrouping: boolean,
): string {
  const rounded = roundTo(absValue, decimals);
  const fixed = rounded.toFixed(decimals);

  if (!useGrouping) {
    return fixed;
  }

  const [intPart, decPart] = fixed.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped;
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/**
 * Format a numeric amount as a JMD currency string.
 *
 * @example
 * ```ts
 * formatJMD(1234.56);            // "J$1,234.56"
 * formatJMD(1234.56, { showSymbol: false }); // "1,234.56"
 * formatJMD(1234.56, { decimals: 0 });       // "J$1,235"
 * ```
 */
export function formatJMD(amount: number, options?: FormatOptions): string {
  const showSymbol = options?.showSymbol ?? true;
  const decimals = options?.decimals ?? 2;
  const useGrouping = options?.useGrouping ?? true;

  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = formatAbsolute(abs, decimals, useGrouping);
  const symbol = showSymbol ? "J$" : "";

  return `${isNegative ? "-" : ""}${symbol}${formatted}`;
}

/**
 * Parse a JMD-formatted string back into a number.
 *
 * Accepts strings like `"J$1,234.56"`, `"1234.56"`, `"-J$500.75"`, and
 * strings with surrounding whitespace. Returns `null` when the input cannot
 * be parsed into a meaningful number.
 */
export function parseJMD(formatted: string): number | null {
  if (formatted == null) return null;

  // Trim whitespace
  let str = formatted.trim();
  if (str === "") return null;

  // Detect and remove leading negative sign
  let negative = false;
  if (str.startsWith("-")) {
    negative = true;
    str = str.slice(1).trim();
  }

  // Remove "J$" prefix (with optional space after)
  if (str.startsWith("J$")) {
    str = str.slice(2).trim();
  }

  // After stripping symbol there must be something left
  if (str === "") return null;

  // Remove commas
  str = str.replace(/,/g, "");

  // Validate remaining is a well-formed number
  if (!/^\d+(\.\d+)?$/.test(str)) return null;

  const value = parseFloat(str);
  if (isNaN(value)) return null;

  return negative ? -value : value;
}

/**
 * Format a numeric amount as a USD currency string.
 *
 * @example
 * ```ts
 * formatUSD(1234.56); // "US$1,234.56"
 * ```
 */
export function formatUSD(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = formatAbsolute(abs, 2, true);
  return `${isNegative ? "-" : ""}US$${formatted}`;
}

// ---------------------------------------------------------------------------
// Conversion
// ---------------------------------------------------------------------------

/**
 * Convert a JMD amount to USD.
 *
 * @param jmd   Amount in Jamaican dollars.
 * @param rate  Exchange rate (JMD per 1 USD). Defaults to {@link DEFAULT_EXCHANGE_RATE}.
 * @returns     Equivalent amount in US dollars (rounded to 3 decimal places).
 */
export function jmdToUSD(jmd: number, rate: number = DEFAULT_EXCHANGE_RATE): number {
  return roundTo(jmd / rate, 3);
}

/**
 * Convert a USD amount to JMD.
 *
 * @param usd   Amount in US dollars.
 * @param rate  Exchange rate (JMD per 1 USD). Defaults to {@link DEFAULT_EXCHANGE_RATE}.
 * @returns     Equivalent amount in Jamaican dollars (rounded to 2 decimal places).
 */
export function usdToJMD(usd: number, rate: number = DEFAULT_EXCHANGE_RATE): number {
  return roundTo(usd * rate, 2);
}

// ---------------------------------------------------------------------------
// GCT (General Consumption Tax)
// ---------------------------------------------------------------------------

/**
 * Add GCT to a base amount.
 *
 * @param amount  Base amount before tax.
 * @param rate    GCT rate as a decimal (e.g. 0.15 for 15%). Defaults to {@link GCT_RATE}.
 */
export function addGCT(amount: number, rate: number = GCT_RATE): number {
  return amount * (1 + rate);
}

/**
 * Remove GCT from a tax-inclusive amount to recover the base price.
 *
 * @param amountWithGCT  Total amount inclusive of GCT.
 * @param rate           GCT rate as a decimal. Defaults to {@link GCT_RATE}.
 */
export function removeGCT(amountWithGCT: number, rate: number = GCT_RATE): number {
  return amountWithGCT / (1 + rate);
}

/**
 * Add the telecom-specific GCT (25%) to a base amount.
 */
export function addTelecomGCT(amount: number): number {
  return amount * (1 + TELECOM_GCT_RATE);
}

/**
 * Return a formatted breakdown of an amount with standard GCT applied.
 *
 * @example
 * ```ts
 * formatWithGCT(1000);
 * // { base: "J$1,000.00", gct: "J$150.00", total: "J$1,150.00" }
 * ```
 */
export function formatWithGCT(amount: number): GCTBreakdown {
  const gctAmount = roundTo(amount * GCT_RATE, 2);
  const total = roundTo(amount + gctAmount, 2);
  return {
    base: formatJMD(amount),
    gct: formatJMD(gctAmount),
    total: formatJMD(total),
  };
}
