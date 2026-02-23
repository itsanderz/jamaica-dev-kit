// jamaica-schools — Jamaica schools and universities directory
// Search, filter by parish, type, level, and ownership

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SchoolType =
  | 'infant'
  | 'primary'
  | 'all-age'
  | 'primary-junior-high'
  | 'secondary'
  | 'technical'
  | 'tertiary';

export type SchoolLevel =
  | 'early-childhood'
  | 'primary'
  | 'secondary'
  | 'tertiary';

export type SchoolOwnership =
  | 'government'
  | 'government-aided'
  | 'independent'
  | 'church';

export interface School {
  name: string;
  type: SchoolType;
  level: SchoolLevel;
  ownership: SchoolOwnership;
  parish: string;
  address?: string;
  isUniversity: boolean;
}

// ---------------------------------------------------------------------------
// Valid parishes
// ---------------------------------------------------------------------------

const PARISHES: readonly string[] = [
  'Kingston',
  'St. Andrew',
  'St. Catherine',
  'Clarendon',
  'Manchester',
  'St. Elizabeth',
  'Westmoreland',
  'Hanover',
  'St. James',
  'Trelawny',
  'St. Ann',
  'St. Mary',
  'Portland',
  'St. Thomas',
] as const;

/** Lowercase parish lookup map for case-insensitive matching. */
const PARISH_LOOKUP: ReadonlyMap<string, string> = new Map(
  PARISHES.map((p) => [p.toLowerCase(), p]),
);

// ---------------------------------------------------------------------------
// School data
// ---------------------------------------------------------------------------

const SCHOOLS: readonly School[] = [
  // ── Kingston ── Secondary ──────────────────────────────────────────────
  { name: 'Kingston Technical High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'Kingston', isUniversity: false },
  { name: 'Kingston College', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Kingston', isUniversity: false },
  { name: "Wolmer's Boys' School", type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Kingston', isUniversity: false },
  { name: "Wolmer's Girls' School", type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Kingston', isUniversity: false },
  { name: "St Hugh's High School", type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Kingston', isUniversity: false },
  { name: 'Campion College', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Kingston', isUniversity: false },
  { name: 'Immaculate Conception High School', type: 'secondary', level: 'secondary', ownership: 'church', parish: 'Kingston', isUniversity: false },

  // ── Kingston ── Primary ────────────────────────────────────────────────
  { name: 'Mona Heights Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'Kingston', isUniversity: false },

  // ── Kingston ── Tertiary / Universities ────────────────────────────────
  { name: 'University of the West Indies, Mona', type: 'tertiary', level: 'tertiary', ownership: 'government', parish: 'Kingston', isUniversity: true },
  { name: 'University of Technology, Jamaica', type: 'tertiary', level: 'tertiary', ownership: 'government', parish: 'Kingston', isUniversity: true },
  { name: 'Caribbean Maritime University', type: 'tertiary', level: 'tertiary', ownership: 'government', parish: 'Kingston', isUniversity: true },
  { name: 'The Mico University College', type: 'tertiary', level: 'tertiary', ownership: 'government-aided', parish: 'Kingston', isUniversity: true },
  { name: 'Edna Manley College of the Visual and Performing Arts', type: 'tertiary', level: 'tertiary', ownership: 'government', parish: 'Kingston', isUniversity: true },
  { name: 'University of the Commonwealth Caribbean', type: 'tertiary', level: 'tertiary', ownership: 'independent', parish: 'Kingston', isUniversity: true },

  // ── St. Andrew ── Secondary ────────────────────────────────────────────
  { name: 'Jamaica College', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Andrew', isUniversity: false },
  { name: 'St. Andrew High School for Girls', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Andrew', isUniversity: false },
  { name: 'Ardenne High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Andrew', isUniversity: false },
  { name: 'Meadowbrook High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'St. Andrew', isUniversity: false },
  { name: 'Holy Trinity High School', type: 'secondary', level: 'secondary', ownership: 'church', parish: 'St. Andrew', isUniversity: false },
  { name: 'Alpha Academy', type: 'secondary', level: 'secondary', ownership: 'church', parish: 'St. Andrew', isUniversity: false },
  { name: 'Excelsior High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Andrew', isUniversity: false },

  // ── St. Andrew ── Primary ──────────────────────────────────────────────
  { name: 'Half Way Tree Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'St. Andrew', isUniversity: false },

  // ── St. Catherine ── Secondary ─────────────────────────────────────────
  { name: 'St. Jago High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Catherine', isUniversity: false },
  { name: 'St. Catherine High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Catherine', isUniversity: false },
  { name: 'Charlemont High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Catherine', isUniversity: false },
  { name: 'Old Harbour High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'St. Catherine', isUniversity: false },
  { name: 'Glenmuir High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Catherine', isUniversity: false },

  // ── St. Catherine ── Primary ───────────────────────────────────────────
  { name: 'Spanish Town Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'St. Catherine', isUniversity: false },

  // ── Clarendon ── Secondary ─────────────────────────────────────────────
  { name: 'Clarendon College', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Clarendon', isUniversity: false },
  { name: 'Lennon High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'Clarendon', isUniversity: false },

  // ── Clarendon ── Primary ───────────────────────────────────────────────
  { name: 'Hayes Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'Clarendon', isUniversity: false },
  { name: 'May Pen Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'Clarendon', isUniversity: false },

  // ── Manchester ── Secondary ────────────────────────────────────────────
  { name: 'Manchester High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Manchester', isUniversity: false },
  { name: 'deCarteret College', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Manchester', isUniversity: false },
  { name: 'Belair High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Manchester', isUniversity: false },

  // ── Manchester ── Primary ──────────────────────────────────────────────
  { name: 'Mandeville Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'Manchester', isUniversity: false },

  // ── Manchester ── Tertiary ─────────────────────────────────────────────
  { name: 'Northern Caribbean University', type: 'tertiary', level: 'tertiary', ownership: 'church', parish: 'Manchester', isUniversity: true },

  // ── St. Elizabeth ── Secondary ─────────────────────────────────────────
  { name: 'Munro College', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Elizabeth', isUniversity: false },
  { name: 'Hampton School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Elizabeth', isUniversity: false },
  { name: 'Lacovia High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'St. Elizabeth', isUniversity: false },

  // ── St. Elizabeth ── Primary ───────────────────────────────────────────
  { name: 'Black River Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'St. Elizabeth', isUniversity: false },

  // ── Westmoreland ── Secondary ──────────────────────────────────────────
  { name: "Manning's School", type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Westmoreland', isUniversity: false },
  { name: 'Godfrey Stewart High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'Westmoreland', isUniversity: false },

  // ── Westmoreland ── Primary ────────────────────────────────────────────
  { name: 'Savanna-la-Mar Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'Westmoreland', isUniversity: false },

  // ── Hanover ── Secondary ───────────────────────────────────────────────
  { name: "Rusea's High School", type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Hanover', isUniversity: false },
  { name: 'Green Island High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'Hanover', isUniversity: false },

  // ── Hanover ── Primary ─────────────────────────────────────────────────
  { name: 'Lucea Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'Hanover', isUniversity: false },

  // ── St. James ── Secondary ─────────────────────────────────────────────
  { name: 'Cornwall College', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. James', isUniversity: false },
  { name: 'Montego Bay High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. James', isUniversity: false },
  { name: 'Herbert Morrison Technical High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'St. James', isUniversity: false },
  { name: 'Mount Alvernia High School', type: 'secondary', level: 'secondary', ownership: 'church', parish: 'St. James', isUniversity: false },

  // ── St. James ── Primary ───────────────────────────────────────────────
  { name: 'Montego Bay Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'St. James', isUniversity: false },

  // ── Trelawny ── Secondary ──────────────────────────────────────────────
  { name: 'William Knibb Memorial High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Trelawny', isUniversity: false },
  { name: 'Albert Town High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'Trelawny', isUniversity: false },

  // ── Trelawny ── All-Age ────────────────────────────────────────────────
  { name: 'Falmouth All-Age School', type: 'all-age', level: 'primary', ownership: 'government', parish: 'Trelawny', isUniversity: false },

  // ── Trelawny ── Primary ────────────────────────────────────────────────
  { name: 'Falmouth Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'Trelawny', isUniversity: false },

  // ── St. Ann ── Secondary ───────────────────────────────────────────────
  { name: "St. Hilda's Diocesan High School", type: 'secondary', level: 'secondary', ownership: 'church', parish: 'St. Ann', isUniversity: false },
  { name: 'York Castle High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Ann', isUniversity: false },
  { name: 'Marcus Garvey Technical High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'St. Ann', isUniversity: false },
  { name: "Brown's Town High School", type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Ann', isUniversity: false },

  // ── St. Ann ── Primary ─────────────────────────────────────────────────
  { name: "St. Ann's Bay Primary School", type: 'primary', level: 'primary', ownership: 'government', parish: 'St. Ann', isUniversity: false },

  // ── St. Mary ── Secondary ──────────────────────────────────────────────
  { name: 'St. Mary High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'St. Mary', isUniversity: false },
  { name: 'Port Maria High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Mary', isUniversity: false },
  { name: 'Carron Hall High School', type: 'secondary', level: 'secondary', ownership: 'church', parish: 'St. Mary', isUniversity: false },

  // ── St. Mary ── Primary ────────────────────────────────────────────────
  { name: 'Port Maria Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'St. Mary', isUniversity: false },

  // ── Portland ── Secondary ──────────────────────────────────────────────
  { name: 'Titchfield High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Portland', isUniversity: false },
  { name: 'Happy Grove High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'Portland', isUniversity: false },
  { name: 'Port Antonio High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'Portland', isUniversity: false },

  // ── Portland ── Primary ────────────────────────────────────────────────
  { name: 'Port Antonio Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'Portland', isUniversity: false },

  // ── Portland ── Tertiary ───────────────────────────────────────────────
  { name: 'College of Agriculture, Science and Education', type: 'tertiary', level: 'tertiary', ownership: 'government', parish: 'Portland', isUniversity: true },

  // ── St. Thomas ── Secondary ────────────────────────────────────────────
  { name: 'Morant Bay High School', type: 'secondary', level: 'secondary', ownership: 'government-aided', parish: 'St. Thomas', isUniversity: false },
  { name: 'Seaforth High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'St. Thomas', isUniversity: false },
  { name: 'St. Thomas Technical High School', type: 'secondary', level: 'secondary', ownership: 'government', parish: 'St. Thomas', isUniversity: false },

  // ── St. Thomas ── Primary ──────────────────────────────────────────────
  { name: 'Morant Bay Primary School', type: 'primary', level: 'primary', ownership: 'government', parish: 'St. Thomas', isUniversity: false },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolve a parish name case-insensitively.
 * Returns the canonical parish name or `undefined` if not found.
 */
function resolveParish(parish: string): string | undefined {
  return PARISH_LOOKUP.get(parish.toLowerCase());
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Return a copy of every school in the directory. */
export function getSchools(): School[] {
  return SCHOOLS.map((s) => ({ ...s }));
}

/**
 * Return all schools in the given parish.
 * Parish matching is case-insensitive.
 */
export function getSchoolsByParish(parish: string): School[] {
  const canonical = resolveParish(parish);
  if (!canonical) return [];
  return SCHOOLS.filter((s) => s.parish === canonical).map((s) => ({ ...s }));
}

/** Return all schools of the given type. */
export function getSchoolsByType(type: SchoolType): School[] {
  return SCHOOLS.filter((s) => s.type === type).map((s) => ({ ...s }));
}

/** Return all schools at the given level. */
export function getSchoolsByLevel(level: SchoolLevel): School[] {
  return SCHOOLS.filter((s) => s.level === level).map((s) => ({ ...s }));
}

/** Return all schools with the given ownership. */
export function getSchoolsByOwnership(ownership: SchoolOwnership): School[] {
  return SCHOOLS.filter((s) => s.ownership === ownership).map((s) => ({ ...s }));
}

/**
 * Find a single school by name.
 * First tries an exact case-insensitive match, then falls back to the first
 * partial (substring) match.  Returns `null` when no school matches.
 */
export function getSchool(name: string): School | null {
  const lower = name.toLowerCase();

  // Exact match first
  const exact = SCHOOLS.find((s) => s.name.toLowerCase() === lower);
  if (exact) return { ...exact };

  // Partial match
  const partial = SCHOOLS.find((s) => s.name.toLowerCase().includes(lower));
  if (partial) return { ...partial };

  return null;
}

/** Return all universities (schools where `isUniversity` is `true`). */
export function getUniversities(): School[] {
  return SCHOOLS.filter((s) => s.isUniversity).map((s) => ({ ...s }));
}

/**
 * Search schools by name (case-insensitive substring match).
 * Returns all matching schools.
 */
export function searchSchools(query: string): School[] {
  const lower = query.toLowerCase();
  return SCHOOLS.filter((s) => s.name.toLowerCase().includes(lower)).map((s) => ({ ...s }));
}

/** Return the total number of schools in the directory. */
export function getSchoolCount(): number {
  return SCHOOLS.length;
}

/** Return a map of parish name to school count. */
export function getSchoolCountByParish(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of SCHOOLS) {
    counts[s.parish] = (counts[s.parish] ?? 0) + 1;
  }
  return counts;
}
