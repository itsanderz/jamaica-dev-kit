/**
 * Jamaica Tax Registration Number (TRN) validator and formatter.
 *
 * A TRN is a 9-digit number used for tax identification in Jamaica.
 * Format: NNN-NNN-NNN (display) or NNNNNNNNN (raw).
 * The 9th digit is a check digit computed using a weighted sum mod 11 algorithm.
 */

/** Weights used to compute the TRN check digit. */
const WEIGHTS = [3, 7, 1, 3, 7, 1, 3, 7] as const;

/** Pattern matching a raw 9-digit TRN. */
const RAW_PATTERN = /^\d{9}$/;

/** Pattern matching a formatted TRN (NNN-NNN-NNN). */
const FORMATTED_PATTERN = /^\d{3}-\d{3}-\d{3}$/;

/**
 * Strip a TRN string to its raw 9-digit form.
 *
 * Removes dashes and leading/trailing whitespace. If the input is already a raw
 * 9-digit string, it is returned unchanged (after trimming).
 *
 * @param trn - A TRN string in any accepted format.
 * @returns The raw 9-digit string with all dashes and whitespace removed.
 */
export function unformatTRN(trn: string): string {
  return trn.trim().replace(/-/g, "");
}

/**
 * Format a TRN as NNN-NNN-NNN.
 *
 * Accepts either a raw 9-digit string or an already-formatted string (with
 * optional surrounding whitespace). The output is always in NNN-NNN-NNN form.
 *
 * @param trn - A TRN string in any accepted format.
 * @returns The TRN formatted as NNN-NNN-NNN.
 * @throws {Error} If the input does not contain exactly 9 digits.
 */
export function formatTRN(trn: string): string {
  const raw = unformatTRN(trn);
  if (!RAW_PATTERN.test(raw)) {
    throw new Error(`Cannot format invalid TRN: "${trn}"`);
  }
  return `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6, 9)}`;
}

/**
 * Calculate the check digit for a TRN given its first 8 digits.
 *
 * The algorithm multiplies each of the 8 digits by the corresponding weight
 * [3, 7, 1, 3, 7, 1, 3, 7], sums the products, and takes the remainder
 * mod 11. If the remainder is 0 the check digit is 0; otherwise the check
 * digit is 11 minus the remainder. If the computed check digit is 10, the
 * combination is invalid and `null` is returned.
 *
 * @param digits - A string of exactly 8 numeric characters.
 * @returns The check digit (0-9), or `null` if the input is invalid or the
 *          computed check digit is 10.
 */
export function getTRNCheckDigit(digits: string): number | null {
  if (!/^\d{8}$/.test(digits)) {
    return null;
  }

  const sum = digits
    .split("")
    .reduce((acc, d, i) => acc + parseInt(d, 10) * WEIGHTS[i], 0);

  const remainder = sum % 11;
  const check = remainder === 0 ? 0 : 11 - remainder;

  return check === 10 ? null : check;
}

/**
 * Validate a Jamaica TRN.
 *
 * Accepts both raw (`NNNNNNNNN`) and formatted (`NNN-NNN-NNN`) forms, with
 * optional surrounding whitespace. Validation checks:
 * 1. The input contains exactly 9 digits (after stripping dashes/whitespace).
 * 2. The 9th digit matches the computed check digit.
 *
 * @param trn - The TRN string to validate.
 * @returns `true` if the TRN is valid, `false` otherwise.
 */
export function isValidTRN(trn: string): boolean {
  const raw = unformatTRN(trn);

  if (!RAW_PATTERN.test(raw)) {
    return false;
  }

  const prefix = raw.slice(0, 8);
  const provided = parseInt(raw[8], 10);
  const expected = getTRNCheckDigit(prefix);

  return expected !== null && provided === expected;
}

/**
 * Generate a random valid TRN for development and testing purposes.
 *
 * This function creates a random 8-digit prefix, computes the valid check
 * digit, and returns the full 9-digit TRN. If the random prefix produces an
 * invalid check digit (10), a new prefix is generated automatically.
 *
 * **Warning:** These TRNs are syntactically valid but are not real registered
 * numbers. Do not use them for production data.
 *
 * @returns A valid 9-digit TRN string.
 */
export function generateTestTRN(): string {
  let check: number | null = null;
  let prefix = "";

  while (check === null) {
    prefix = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");
    check = getTRNCheckDigit(prefix);
  }

  return `${prefix}${check}`;
}
