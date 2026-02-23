/**
 * jamaica-phone
 *
 * Validates and formats Jamaican phone numbers.
 * Jamaica is part of the NANP (country code +1) with area codes 876 and 658.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Best-guess carrier based on prefix heuristics. */
export type Carrier = "flow" | "digicel" | "landline" | "unknown";

/** Structured representation of a parsed Jamaican phone number. */
export interface ParsedPhone {
  /** NANP country code, always "1". */
  countryCode: string;
  /** Jamaican area code: "876" or "658". */
  areaCode: string;
  /** Seven-digit local subscriber number (no separators). */
  localNumber: string;
  /** Whether the number passed all validation checks. */
  isValid: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Valid Jamaican area codes. */
const VALID_AREA_CODES = new Set(["876", "658"]);

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Strip all non-digit characters except a leading "+".
 * Then strip the leading "+" as well, returning pure digits and a flag
 * indicating whether a "+" was present.
 */
function stripToDigits(phone: string): { digits: string; hasPlus: boolean } {
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return { digits, hasPlus };
}

/**
 * Attempt to extract a 10-digit Jamaican number (area code + 7 local digits)
 * from a raw input string. Returns `null` if the input cannot be interpreted
 * as a Jamaican number.
 */
function extractTenDigits(phone: string): string | null {
  const { digits, hasPlus } = stripToDigits(phone);

  let ten: string | undefined;

  if (hasPlus) {
    // Must start with "1" (country code) followed by 10 digits
    if (digits.length === 11 && digits.startsWith("1")) {
      ten = digits.slice(1);
    }
  } else if (digits.length === 10) {
    ten = digits;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    ten = digits.slice(1);
  }

  if (!ten) return null;

  const areaCode = ten.slice(0, 3);
  if (!VALID_AREA_CODES.has(areaCode)) return null;

  // NXX validation: the first digit of the 7-digit local portion must be 2-9
  const exchangeDigit = ten[3];
  if (exchangeDigit < "2" || exchangeDigit > "9") return null;

  return ten;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return `true` if `phone` can be interpreted as a valid Jamaican phone
 * number in any common format.
 */
export function isValidJamaicanNumber(phone: string): boolean {
  return extractTenDigits(phone) !== null;
}

/**
 * Parse a phone string into a structured `ParsedPhone` object.
 * Returns `null` when the input cannot be interpreted as a valid Jamaican
 * number.
 */
export function parsePhone(phone: string): ParsedPhone | null {
  const ten = extractTenDigits(phone);
  if (!ten) return null;

  return {
    countryCode: "1",
    areaCode: ten.slice(0, 3),
    localNumber: ten.slice(3),
    isValid: true,
  };
}

/**
 * Format as a 7-digit local number: `NXX-XXXX`.
 * Throws if the input is invalid.
 */
export function formatLocal(phone: string): string {
  const parsed = parsePhone(phone);
  if (!parsed) throw new Error(`Invalid Jamaican phone number: ${phone}`);
  const ln = parsed.localNumber;
  return `${ln.slice(0, 3)}-${ln.slice(3)}`;
}

/**
 * Format in national style: `(876) NXX-XXXX`.
 * Throws if the input is invalid.
 */
export function formatNational(phone: string): string {
  const parsed = parsePhone(phone);
  if (!parsed) throw new Error(`Invalid Jamaican phone number: ${phone}`);
  const ln = parsed.localNumber;
  return `(${parsed.areaCode}) ${ln.slice(0, 3)}-${ln.slice(3)}`;
}

/**
 * Format in E.164: `+1876NXXXXXX` (no spaces or punctuation).
 * Throws if the input is invalid.
 */
export function formatE164(phone: string): string {
  const parsed = parsePhone(phone);
  if (!parsed) throw new Error(`Invalid Jamaican phone number: ${phone}`);
  return `+${parsed.countryCode}${parsed.areaCode}${parsed.localNumber}`;
}

/**
 * Format in international style: `+1 (876) NXX-XXXX`.
 * Throws if the input is invalid.
 */
export function formatInternational(phone: string): string {
  const parsed = parsePhone(phone);
  if (!parsed) throw new Error(`Invalid Jamaican phone number: ${phone}`);
  const ln = parsed.localNumber;
  return `+${parsed.countryCode} (${parsed.areaCode}) ${ln.slice(0, 3)}-${ln.slice(3)}`;
}

/**
 * Best-guess carrier identification based on known prefix patterns.
 *
 * **WARNING: Unreliable since May 2015.** Jamaica introduced number
 * portability, so subscribers can keep their number when switching
 * carriers. This function uses original allocation prefixes only and
 * should be treated as a rough heuristic. Do NOT use for billing,
 * routing, or any decision requiring accurate carrier information.
 * Use an HLR/MNP lookup service for production carrier detection.
 *
 * Heuristics (approximate, based on original allocations):
 * - Flow mobile:    876-3[0-4]x, 876-4xx, 876-5xx
 * - Digicel mobile: 876-2xx, 876-3[5-9]x, 876-8xx
 * - Landline:       876-6xx, 876-7xx, 876-9xx
 * - 658 area code:  unknown (too new to map reliably)
 */
export function getCarrier(phone: string): Carrier {
  const parsed = parsePhone(phone);
  if (!parsed) return "unknown";

  // 658 overlay area code -- carrier mapping is not well established
  if (parsed.areaCode === "658") return "unknown";

  const exchange = parseInt(parsed.localNumber.slice(0, 3), 10);
  const exchangeFirstDigit = Math.floor(exchange / 100);

  // Landline ranges: 6xx, 7xx, 9xx
  if (
    exchangeFirstDigit === 6 ||
    exchangeFirstDigit === 7 ||
    exchangeFirstDigit === 9
  ) {
    return "landline";
  }

  // Digicel ranges: 2xx, 8xx, 3[5-9]x
  if (exchangeFirstDigit === 2 || exchangeFirstDigit === 8) {
    return "digicel";
  }

  if (exchangeFirstDigit === 3) {
    const secondDigit = Math.floor((exchange % 100) / 10);
    if (secondDigit >= 5) return "digicel";
    return "flow";
  }

  // Flow ranges: 4xx, 5xx
  if (exchangeFirstDigit === 4 || exchangeFirstDigit === 5) {
    return "flow";
  }

  return "unknown";
}

/** Returns `true` if the number uses the original 876 area code. */
export function isAreaCode876(phone: string): boolean {
  const parsed = parsePhone(phone);
  return parsed?.areaCode === "876";
}

/** Returns `true` if the number uses the newer 658 overlay area code. */
export function isAreaCode658(phone: string): boolean {
  const parsed = parsePhone(phone);
  return parsed?.areaCode === "658";
}

/**
 * Best-guess mobile detection. Uses {@link getCarrier} heuristics internally.
 *
 * **WARNING: Unreliable since May 2015** due to number portability.
 * See {@link getCarrier} for details.
 */
export function isMobile(phone: string): boolean {
  const carrier = getCarrier(phone);
  if (carrier === "flow" || carrier === "digicel") return true;

  const parsed = parsePhone(phone);
  if (!parsed) return false;

  // 658 numbers are predominantly mobile
  if (parsed.areaCode === "658") return true;

  return false;
}
