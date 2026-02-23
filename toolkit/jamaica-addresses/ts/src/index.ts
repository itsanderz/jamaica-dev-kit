// jamaica-addresses - Jamaica address parser and normalizer
// Handles informal Jamaican addressing where no functional postal code system exists

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ParsedAddress {
  streetNumber?: string;
  streetName?: string;
  unit?: string;
  community?: string;
  district?: string;
  parish?: string;
  kingstonSector?: number;
  raw: string;
}

export interface NormalizedAddress {
  line1: string;
  line2?: string;
  parish: string;
  kingstonSector?: number;
  formatted: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Valid Kingston sector numbers (1-20). */
export const KINGSTON_SECTORS: readonly number[] = Array.from(
  { length: 20 },
  (_, i) => i + 1,
);

/** All 14 Jamaican parish names in canonical form. */
export const PARISH_NAMES: readonly string[] = [
  "Kingston",
  "St. Andrew",
  "St. Catherine",
  "Clarendon",
  "Manchester",
  "St. Elizabeth",
  "Westmoreland",
  "Hanover",
  "St. James",
  "Trelawny",
  "St. Ann",
  "St. Mary",
  "Portland",
  "St. Thomas",
] as const;

/** Map of common aliases / abbreviations to canonical parish names. */
export const PARISH_ALIASES: Record<string, string> = {
  // Kingston
  kgn: "Kingston",
  kng: "Kingston",
  // St. Andrew
  "st andrew": "St. Andrew",
  "saint andrew": "St. Andrew",
  "st. andrew": "St. Andrew",
  // St. Catherine
  "st catherine": "St. Catherine",
  "saint catherine": "St. Catherine",
  "st. catherine": "St. Catherine",
  // Clarendon
  clarendon: "Clarendon",
  // Manchester
  manchester: "Manchester",
  // St. Elizabeth
  "st elizabeth": "St. Elizabeth",
  "saint elizabeth": "St. Elizabeth",
  "st. elizabeth": "St. Elizabeth",
  // Westmoreland
  westmoreland: "Westmoreland",
  // Hanover
  hanover: "Hanover",
  // St. James  (MoBay alias)
  "st james": "St. James",
  "saint james": "St. James",
  "st. james": "St. James",
  mobay: "St. James",
  "mo bay": "St. James",
  // Trelawny
  trelawny: "Trelawny",
  // St. Ann  (Ochi alias)
  "st ann": "St. Ann",
  "saint ann": "St. Ann",
  "st. ann": "St. Ann",
  ochi: "St. Ann",
  // St. Mary
  "st mary": "St. Mary",
  "saint mary": "St. Mary",
  "st. mary": "St. Mary",
  // Portland
  portland: "Portland",
  // St. Thomas
  "st thomas": "St. Thomas",
  "saint thomas": "St. Thomas",
  "st. thomas": "St. Thomas",
  // Kingston (canonical)
  kingston: "Kingston",
  // Savanna-la-Mar alias -> Westmoreland
  sav: "Westmoreland",
  "savanna-la-mar": "Westmoreland",
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Lowercase set of canonical parish names for fast lookup. */
const PARISH_LOWER_SET = new Set(
  PARISH_NAMES.map((p) => p.toLowerCase()),
);

/**
 * Normalizes "Saint" / "St " / "St." prefix variants to canonical "St." form.
 */
function normalizeSaintPrefix(text: string): string {
  return text.replace(/\b(Saint|St)\s+/gi, "St. ");
}

/**
 * Resolve a parish string (possibly an alias or variant) to canonical form.
 * Returns `null` if unrecognized.
 */
function resolveParish(text: string): string | null {
  const trimmed = text.trim();
  // Try canonical match first
  const normalized = normalizeSaintPrefix(trimmed);
  if (PARISH_LOWER_SET.has(normalized.toLowerCase())) {
    // Return with proper casing from canonical list
    return (
      PARISH_NAMES.find(
        (p) => p.toLowerCase() === normalized.toLowerCase(),
      ) ?? null
    );
  }
  // Try alias map
  const alias = PARISH_ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;
  return null;
}

/** Match Kingston sector pattern, e.g. "Kingston 10", "Kingston10". */
const KINGSTON_SECTOR_RE = /\bKingston\s*(\d{1,2})\b/i;

/**
 * Unit prefixes that indicate a sub-unit of an address.
 * Matches: Lot, Shop, Suite, Apt, Apartment, Unit, Floor, Flat
 */
const UNIT_RE =
  /^(Lot|Shop|Suite|Apt|Apartment|Unit|Floor|Flat)\s+[\w-]+/i;

/** District pattern: "District of <name>" */
const DISTRICT_RE = /^District\s+of\s+(.+)/i;

/** Street number at start of segment: "123 Main Street" */
const STREET_NUMBER_RE = /^(\d+[A-Za-z]?)\s+(.+)/;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse a raw informal Jamaican address into structured components.
 *
 * Handles patterns such as:
 *   "123 Main Street, Kingston 10"
 *   "Lot 5, Rose Hall, St. James"
 *   "Shop 3, Town Centre Plaza, May Pen, Clarendon"
 *   "District of Accompong, St. Elizabeth"
 *   "Half Way Tree, St. Andrew"
 *   "Apt 4, 20 Barbican Road, Kingston 8"
 */
export function parseAddress(raw: string): ParsedAddress {
  const result: ParsedAddress = { raw };
  const trimmed = raw.trim();
  if (!trimmed) return result;

  // Split into comma-separated segments and trim each
  const segments = trimmed.split(",").map((s) => s.trim());

  // ---------- Pass 1: extract parish & Kingston sector from the last segments ----------

  // Scan from the end to find a parish
  let parishIdx = -1;
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    // Check for "Kingston N" first
    const kMatch = seg.match(KINGSTON_SECTOR_RE);
    if (kMatch) {
      const sector = parseInt(kMatch[1], 10);
      if (sector >= 1 && sector <= 20) {
        result.kingstonSector = sector;
      }
      result.parish = "Kingston";
      parishIdx = i;
      break;
    }
    // Plain parish
    const resolved = resolveParish(seg);
    if (resolved) {
      result.parish = resolved;
      parishIdx = i;
      break;
    }
  }

  // Remaining segments (everything before the parish segment)
  const remaining =
    parishIdx >= 0 ? segments.slice(0, parishIdx) : [...segments];

  // ---------- Pass 2: interpret remaining segments ----------

  if (remaining.length === 0) {
    // Nothing besides the parish itself
    return result;
  }

  // Check first segment for district pattern
  const districtMatch = remaining[0].match(DISTRICT_RE);
  if (districtMatch) {
    result.district = districtMatch[1].trim();
    remaining.shift();
  }

  // Check first segment for unit prefix (Lot, Shop, Suite, Apt, etc.)
  if (remaining.length > 0 && UNIT_RE.test(remaining[0])) {
    result.unit = remaining.shift()!;
  }

  // If we still have segments, look for street number + street name
  if (remaining.length > 0) {
    const firstSeg = remaining[0];
    const numMatch = firstSeg.match(STREET_NUMBER_RE);
    if (numMatch) {
      result.streetNumber = numMatch[1];
      result.streetName = numMatch[2].trim();
      remaining.shift();
    }
  }

  // Remaining segments become community / street name depending on count
  if (remaining.length === 1) {
    // Single remaining: if we already have a streetName, this is community
    if (result.streetName || result.unit || result.district) {
      result.community = remaining[0];
    } else {
      // Could be a standalone place name (community/area)
      result.community = remaining[0];
    }
  } else if (remaining.length === 2) {
    // Two remaining: first is streetName (or place), second is community
    if (!result.streetName) {
      result.streetName = remaining[0];
    }
    result.community = remaining[1];
  } else if (remaining.length > 2) {
    // Multiple: first is streetName, last is community, middle joined into streetName
    if (!result.streetName) {
      result.streetName = remaining.slice(0, -1).join(", ");
    }
    result.community = remaining[remaining.length - 1];
  }

  return result;
}

/**
 * Normalize a ParsedAddress to a consistent formatted string.
 *
 * Output order:
 *   [unit, ] [streetNumber streetName, ] [community, ] [District of district, ] parish[ sectorNumber]
 */
export function normalizeAddress(parsed: ParsedAddress): string {
  const parts: string[] = [];

  if (parsed.unit) {
    parts.push(parsed.unit);
  }

  if (parsed.streetNumber && parsed.streetName) {
    parts.push(`${parsed.streetNumber} ${parsed.streetName}`);
  } else if (parsed.streetName) {
    parts.push(parsed.streetName);
  }

  if (parsed.community) {
    parts.push(parsed.community);
  }

  if (parsed.district) {
    parts.push(`District of ${parsed.district}`);
  }

  if (parsed.parish) {
    if (parsed.kingstonSector) {
      parts.push(`${parsed.parish} ${parsed.kingstonSector}`);
    } else {
      parts.push(parsed.parish);
    }
  }

  return parts.join(", ");
}

/**
 * Extract the canonical parish name from any address string.
 * Returns `null` if no parish is found.
 */
export function extractParish(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return null;

  // Check for Kingston (with or without sector)
  if (KINGSTON_SECTOR_RE.test(trimmed)) {
    return "Kingston";
  }

  // Split by comma and check each segment from the end
  const segments = trimmed.split(",").map((s) => s.trim());
  for (let i = segments.length - 1; i >= 0; i--) {
    const resolved = resolveParish(segments[i]);
    if (resolved) return resolved;
  }

  // Fallback: scan the entire string for parish names
  const lowerAddr = trimmed.toLowerCase();
  for (const name of PARISH_NAMES) {
    if (lowerAddr.includes(name.toLowerCase())) {
      return name;
    }
  }

  // Check aliases that might appear inline (KGN, MoBay, etc.)
  for (const [alias, canonical] of Object.entries(PARISH_ALIASES)) {
    // Only check short aliases (likely abbreviations embedded in text)
    if (alias.length <= 5) {
      const aliasRe = new RegExp(`\\b${escapeRegex(alias)}\\b`, "i");
      if (aliasRe.test(trimmed)) {
        return canonical;
      }
    }
  }

  return null;
}

/**
 * Check whether an address is in the Kingston Metropolitan Area
 * (Kingston parish or St. Andrew).
 */
export function isKingstonAddress(address: string): boolean {
  const parish = extractParish(address);
  return parish === "Kingston" || parish === "St. Andrew";
}

/**
 * Extract the Kingston sector number from an address string.
 * Returns `null` if not a Kingston address or no sector is specified.
 * Returns `null` for sector numbers outside the valid range (1-20).
 */
export function getKingstonSector(address: string): number | null {
  const match = address.match(KINGSTON_SECTOR_RE);
  if (!match) return null;
  const sector = parseInt(match[1], 10);
  if (sector < 1 || sector > 20) return null;
  return sector;
}

/**
 * Convert a ParsedAddress into a fully structured NormalizedAddress
 * with separate line1, line2, parish, and formatted fields.
 */
export function toNormalizedAddress(parsed: ParsedAddress): NormalizedAddress {
  const parts1: string[] = [];

  if (parsed.unit) parts1.push(parsed.unit);
  if (parsed.streetNumber && parsed.streetName) {
    parts1.push(`${parsed.streetNumber} ${parsed.streetName}`);
  } else if (parsed.streetName) {
    parts1.push(parsed.streetName);
  }

  const line1 = parts1.length > 0
    ? parts1.join(', ')
    : parsed.community || parsed.raw;

  const parts2: string[] = [];
  if (parts1.length > 0 && parsed.community) parts2.push(parsed.community);
  if (parsed.district) parts2.push(`District of ${parsed.district}`);
  const line2 = parts2.length > 0 ? parts2.join(', ') : undefined;

  const parish = parsed.parish ?? 'Unknown';
  const formatted = normalizeAddress(parsed);

  return { line1, line2, parish, kingstonSector: parsed.kingstonSector, formatted };
}

/**
 * Format a ParsedAddress into a human-readable display string.
 * Alias for `normalizeAddress` with identical output.
 */
export function formatAddress(parsed: ParsedAddress): string {
  return normalizeAddress(parsed);
}

// ---------------------------------------------------------------------------
// Internal utility
// ---------------------------------------------------------------------------

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
