/**
 * Jamaica Constituencies Toolkit
 *
 * Provides data for all 63 constituencies of Jamaica's House of Representatives,
 * grouped by their 14 parishes.  Based on the Electoral Commission of Jamaica's
 * official constituency boundaries used in the 2025 general election.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Constituency {
  name: string;
  parish: string;
}

// ---------------------------------------------------------------------------
// Embedded constituency data (63 constituencies across 14 parishes)
// ---------------------------------------------------------------------------

const CONSTITUENCIES: readonly Constituency[] = [
  // Kingston (3)
  { name: 'Kingston Central', parish: 'Kingston' },
  { name: 'Kingston East and Port Royal', parish: 'Kingston' },
  { name: 'Kingston Western', parish: 'Kingston' },

  // St. Andrew (12)
  { name: 'St. Andrew East Central', parish: 'St. Andrew' },
  { name: 'St. Andrew East Rural', parish: 'St. Andrew' },
  { name: 'St. Andrew Eastern', parish: 'St. Andrew' },
  { name: 'St. Andrew North Central', parish: 'St. Andrew' },
  { name: 'St. Andrew North Eastern', parish: 'St. Andrew' },
  { name: 'St. Andrew North Western', parish: 'St. Andrew' },
  { name: 'St. Andrew South Eastern', parish: 'St. Andrew' },
  { name: 'St. Andrew South Western', parish: 'St. Andrew' },
  { name: 'St. Andrew Southern', parish: 'St. Andrew' },
  { name: 'St. Andrew West Central', parish: 'St. Andrew' },
  { name: 'St. Andrew West Rural', parish: 'St. Andrew' },
  { name: 'St. Andrew Western', parish: 'St. Andrew' },

  // St. Catherine (11)
  { name: 'St. Catherine Central', parish: 'St. Catherine' },
  { name: 'St. Catherine East Central', parish: 'St. Catherine' },
  { name: 'St. Catherine Eastern', parish: 'St. Catherine' },
  { name: 'St. Catherine North Central', parish: 'St. Catherine' },
  { name: 'St. Catherine North Eastern', parish: 'St. Catherine' },
  { name: 'St. Catherine North Western', parish: 'St. Catherine' },
  { name: 'St. Catherine South Central', parish: 'St. Catherine' },
  { name: 'St. Catherine South Eastern', parish: 'St. Catherine' },
  { name: 'St. Catherine South Western', parish: 'St. Catherine' },
  { name: 'St. Catherine Southern', parish: 'St. Catherine' },
  { name: 'St. Catherine West Central', parish: 'St. Catherine' },

  // St. Thomas (2)
  { name: 'St. Thomas Eastern', parish: 'St. Thomas' },
  { name: 'St. Thomas Western', parish: 'St. Thomas' },

  // Portland (2)
  { name: 'Portland Eastern', parish: 'Portland' },
  { name: 'Portland Western', parish: 'Portland' },

  // St. Mary (3)
  { name: 'St. Mary Central', parish: 'St. Mary' },
  { name: 'St. Mary South Eastern', parish: 'St. Mary' },
  { name: 'St. Mary Western', parish: 'St. Mary' },

  // St. Ann (4)
  { name: 'St. Ann North Eastern', parish: 'St. Ann' },
  { name: 'St. Ann North Western', parish: 'St. Ann' },
  { name: 'St. Ann South Eastern', parish: 'St. Ann' },
  { name: 'St. Ann South Western', parish: 'St. Ann' },

  // Trelawny (2)
  { name: 'Trelawny Northern', parish: 'Trelawny' },
  { name: 'Trelawny Southern', parish: 'Trelawny' },

  // St. James (5)
  { name: 'St. James Central', parish: 'St. James' },
  { name: 'St. James East Central', parish: 'St. James' },
  { name: 'St. James North Western', parish: 'St. James' },
  { name: 'St. James Southern', parish: 'St. James' },
  { name: 'St. James West Central', parish: 'St. James' },

  // Hanover (2)
  { name: 'Hanover Eastern', parish: 'Hanover' },
  { name: 'Hanover Western', parish: 'Hanover' },

  // Clarendon (6)
  { name: 'Clarendon Central', parish: 'Clarendon' },
  { name: 'Clarendon North Central', parish: 'Clarendon' },
  { name: 'Clarendon North Western', parish: 'Clarendon' },
  { name: 'Clarendon Northern', parish: 'Clarendon' },
  { name: 'Clarendon South Eastern', parish: 'Clarendon' },
  { name: 'Clarendon South Western', parish: 'Clarendon' },

  // Manchester (4)
  { name: 'Manchester Central', parish: 'Manchester' },
  { name: 'Manchester North Eastern', parish: 'Manchester' },
  { name: 'Manchester North Western', parish: 'Manchester' },
  { name: 'Manchester Southern', parish: 'Manchester' },

  // St. Elizabeth (4)
  { name: 'St. Elizabeth North Eastern', parish: 'St. Elizabeth' },
  { name: 'St. Elizabeth North Western', parish: 'St. Elizabeth' },
  { name: 'St. Elizabeth South Eastern', parish: 'St. Elizabeth' },
  { name: 'St. Elizabeth South Western', parish: 'St. Elizabeth' },

  // Westmoreland (3)
  { name: 'Westmoreland Central', parish: 'Westmoreland' },
  { name: 'Westmoreland Eastern', parish: 'Westmoreland' },
  { name: 'Westmoreland Western', parish: 'Westmoreland' },
] as const;

// ---------------------------------------------------------------------------
// Pre-built lookup maps
// ---------------------------------------------------------------------------

const byNameLower = new Map<string, Constituency>(
  CONSTITUENCIES.map((c) => [c.name.toLowerCase(), c]),
);

const byParishLower = new Map<string, Constituency[]>();
for (const c of CONSTITUENCIES) {
  const key = c.parish.toLowerCase();
  const list = byParishLower.get(key);
  if (list) {
    list.push(c);
  } else {
    byParishLower.set(key, [c]);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return all 63 constituencies as a new array.
 */
export function getConstituencies(): Constituency[] {
  return CONSTITUENCIES.map((c) => ({ ...c }));
}

/**
 * Return all constituencies within a given parish (case-insensitive).
 * Returns an empty array when the parish is not found.
 */
export function getConstituencyByParish(parish: string): Constituency[] {
  const list = byParishLower.get(parish.toLowerCase());
  if (!list) return [];
  return list.map((c) => ({ ...c }));
}

/**
 * Look up a single constituency by its exact name (case-insensitive).
 * Returns `null` when no match is found.
 */
export function getConstituency(name: string): Constituency | null {
  const c = byNameLower.get(name.toLowerCase());
  return c ? { ...c } : null;
}

/**
 * Search constituencies by substring match on the name (case-insensitive).
 * Returns a new array of matching constituencies.
 */
export function searchConstituencies(query: string): Constituency[] {
  const needle = query.toLowerCase();
  return CONSTITUENCIES.filter((c) => c.name.toLowerCase().includes(needle)).map((c) => ({
    ...c,
  }));
}

/**
 * Return the total number of constituencies (always 63).
 */
export function getConstituencyCount(): number {
  return CONSTITUENCIES.length;
}

/**
 * Return a record mapping each parish name to its constituency count.
 */
export function getConstituencyCountByParish(): Record<string, number> {
  const result: Record<string, number> = {};
  for (const c of CONSTITUENCIES) {
    result[c.parish] = (result[c.parish] ?? 0) + 1;
  }
  return result;
}

/**
 * Return the unique list of parishes that have constituencies, in alphabetical order.
 */
export function getParishes(): string[] {
  const set = new Set<string>();
  for (const c of CONSTITUENCIES) {
    set.add(c.parish);
  }
  return [...set].sort();
}
