import { describe, it, expect } from 'vitest';
import {
  getSchools,
  getSchoolsByParish,
  getSchoolsByType,
  getSchoolsByLevel,
  getSchoolsByOwnership,
  getSchool,
  getUniversities,
  searchSchools,
  getSchoolCount,
  getSchoolCountByParish,
  type School,
} from '../index';

// ---------------------------------------------------------------------------
// getSchools
// ---------------------------------------------------------------------------

describe('getSchools', () => {
  it('returns a non-empty array of schools', () => {
    const schools = getSchools();
    expect(schools.length).toBeGreaterThan(0);
  });

  it('returns copies, not references to the internal data', () => {
    const a = getSchools();
    const b = getSchools();
    expect(a).not.toBe(b);
    expect(a[0]).not.toBe(b[0]);
    expect(a).toEqual(b);
  });

  it('every school has the required fields', () => {
    for (const school of getSchools()) {
      expect(school).toHaveProperty('name');
      expect(school).toHaveProperty('type');
      expect(school).toHaveProperty('level');
      expect(school).toHaveProperty('ownership');
      expect(school).toHaveProperty('parish');
      expect(school).toHaveProperty('isUniversity');
    }
  });
});

// ---------------------------------------------------------------------------
// getSchoolsByParish
// ---------------------------------------------------------------------------

describe('getSchoolsByParish', () => {
  it('returns schools for Kingston', () => {
    const schools = getSchoolsByParish('Kingston');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.parish).toBe('Kingston');
    }
  });

  it('is case-insensitive', () => {
    const lower = getSchoolsByParish('kingston');
    const upper = getSchoolsByParish('KINGSTON');
    const mixed = getSchoolsByParish('kInGsToN');
    expect(lower).toEqual(upper);
    expect(upper).toEqual(mixed);
  });

  it('returns schools for every parish', () => {
    const parishes = [
      'Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon',
      'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover',
      'St. James', 'Trelawny', 'St. Ann', 'St. Mary',
      'Portland', 'St. Thomas',
    ];
    for (const parish of parishes) {
      const schools = getSchoolsByParish(parish);
      expect(schools.length).toBeGreaterThan(0);
    }
  });

  it('returns empty array for invalid parish', () => {
    expect(getSchoolsByParish('Atlantis')).toEqual([]);
  });

  it('returns copies of school objects', () => {
    const a = getSchoolsByParish('Kingston');
    const b = getSchoolsByParish('Kingston');
    expect(a[0]).not.toBe(b[0]);
    expect(a).toEqual(b);
  });
});

// ---------------------------------------------------------------------------
// getSchoolsByType
// ---------------------------------------------------------------------------

describe('getSchoolsByType', () => {
  it('returns secondary schools', () => {
    const schools = getSchoolsByType('secondary');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.type).toBe('secondary');
    }
  });

  it('returns primary schools', () => {
    const schools = getSchoolsByType('primary');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.type).toBe('primary');
    }
  });

  it('returns tertiary schools', () => {
    const schools = getSchoolsByType('tertiary');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.type).toBe('tertiary');
    }
  });

  it('returns all-age schools', () => {
    const schools = getSchoolsByType('all-age');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.type).toBe('all-age');
    }
  });
});

// ---------------------------------------------------------------------------
// getSchoolsByLevel
// ---------------------------------------------------------------------------

describe('getSchoolsByLevel', () => {
  it('returns all secondary-level schools', () => {
    const schools = getSchoolsByLevel('secondary');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.level).toBe('secondary');
    }
  });

  it('returns all primary-level schools', () => {
    const schools = getSchoolsByLevel('primary');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.level).toBe('primary');
    }
  });

  it('returns all tertiary-level schools', () => {
    const schools = getSchoolsByLevel('tertiary');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.level).toBe('tertiary');
    }
  });
});

// ---------------------------------------------------------------------------
// getSchoolsByOwnership
// ---------------------------------------------------------------------------

describe('getSchoolsByOwnership', () => {
  it('returns government schools', () => {
    const schools = getSchoolsByOwnership('government');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.ownership).toBe('government');
    }
  });

  it('returns government-aided schools', () => {
    const schools = getSchoolsByOwnership('government-aided');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.ownership).toBe('government-aided');
    }
  });

  it('returns church schools', () => {
    const schools = getSchoolsByOwnership('church');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.ownership).toBe('church');
    }
  });

  it('returns independent schools', () => {
    const schools = getSchoolsByOwnership('independent');
    expect(schools.length).toBeGreaterThan(0);
    for (const s of schools) {
      expect(s.ownership).toBe('independent');
    }
  });
});

// ---------------------------------------------------------------------------
// getSchool
// ---------------------------------------------------------------------------

describe('getSchool', () => {
  it('finds a school by exact name (case-insensitive)', () => {
    const school = getSchool('kingston college');
    expect(school).not.toBeNull();
    expect(school!.name).toBe('Kingston College');
  });

  it('finds a school by partial name', () => {
    const school = getSchool('Wolmer');
    expect(school).not.toBeNull();
    expect(school!.name).toContain('Wolmer');
  });

  it('returns null for unknown school', () => {
    expect(getSchool('Nonexistent School ABC123')).toBeNull();
  });

  it('prefers exact match over partial match', () => {
    const school = getSchool('Kingston College');
    expect(school).not.toBeNull();
    expect(school!.name).toBe('Kingston College');
  });

  it('returns a copy', () => {
    const a = getSchool('Kingston College');
    const b = getSchool('Kingston College');
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

// ---------------------------------------------------------------------------
// getUniversities
// ---------------------------------------------------------------------------

describe('getUniversities', () => {
  it('returns only universities', () => {
    const unis = getUniversities();
    expect(unis.length).toBeGreaterThan(0);
    for (const u of unis) {
      expect(u.isUniversity).toBe(true);
    }
  });

  it('includes UWI Mona', () => {
    const unis = getUniversities();
    const uwi = unis.find((u) => u.name.includes('University of the West Indies'));
    expect(uwi).toBeDefined();
  });

  it('includes UTech', () => {
    const unis = getUniversities();
    const utech = unis.find((u) => u.name.includes('University of Technology'));
    expect(utech).toBeDefined();
  });

  it('includes NCU', () => {
    const unis = getUniversities();
    const ncu = unis.find((u) => u.name.includes('Northern Caribbean University'));
    expect(ncu).toBeDefined();
    expect(ncu!.parish).toBe('Manchester');
  });

  it('includes CASE', () => {
    const unis = getUniversities();
    const cas = unis.find((u) => u.name.includes('College of Agriculture'));
    expect(cas).toBeDefined();
    expect(cas!.parish).toBe('Portland');
  });

  it('all universities are tertiary level', () => {
    const unis = getUniversities();
    for (const u of unis) {
      expect(u.level).toBe('tertiary');
      expect(u.type).toBe('tertiary');
    }
  });
});

// ---------------------------------------------------------------------------
// searchSchools
// ---------------------------------------------------------------------------

describe('searchSchools', () => {
  it('finds schools by partial name', () => {
    const results = searchSchools('High School');
    expect(results.length).toBeGreaterThan(5);
    for (const r of results) {
      expect(r.name.toLowerCase()).toContain('high school');
    }
  });

  it('is case-insensitive', () => {
    const lower = searchSchools('cornwall');
    const upper = searchSchools('CORNWALL');
    expect(lower).toEqual(upper);
    expect(lower.length).toBeGreaterThan(0);
  });

  it('returns empty array when nothing matches', () => {
    expect(searchSchools('xyznonexistent')).toEqual([]);
  });

  it('returns copies', () => {
    const a = searchSchools('Kingston');
    const b = searchSchools('Kingston');
    expect(a[0]).not.toBe(b[0]);
    expect(a).toEqual(b);
  });

  it('finds all primary schools when searching "Primary"', () => {
    const results = searchSchools('Primary');
    expect(results.length).toBeGreaterThanOrEqual(14);
    for (const r of results) {
      expect(r.name.toLowerCase()).toContain('primary');
    }
  });

  it('finds "College" in name — includes both secondary and tertiary', () => {
    const results = searchSchools('College');
    expect(results.length).toBeGreaterThan(3);
    const levels = new Set(results.map((r) => r.level));
    expect(levels.size).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// getSchoolCount
// ---------------------------------------------------------------------------

describe('getSchoolCount', () => {
  it('returns total count matching getSchools().length', () => {
    expect(getSchoolCount()).toBe(getSchools().length);
  });

  it('count is positive', () => {
    expect(getSchoolCount()).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// getSchoolCountByParish
// ---------------------------------------------------------------------------

describe('getSchoolCountByParish', () => {
  it('returns counts for all 14 parishes', () => {
    const counts = getSchoolCountByParish();
    expect(Object.keys(counts).length).toBe(14);
  });

  it('all counts are positive', () => {
    const counts = getSchoolCountByParish();
    for (const [parish, count] of Object.entries(counts)) {
      expect(count).toBeGreaterThan(0);
    }
  });

  it('sum of parish counts equals total count', () => {
    const counts = getSchoolCountByParish();
    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(sum).toBe(getSchoolCount());
  });

  it('Kingston count matches getSchoolsByParish result', () => {
    const counts = getSchoolCountByParish();
    const kingstonSchools = getSchoolsByParish('Kingston');
    expect(counts['Kingston']).toBe(kingstonSchools.length);
  });
});

// ---------------------------------------------------------------------------
// Cross-cutting validations
// ---------------------------------------------------------------------------

describe('data integrity', () => {
  it('no duplicate school names', () => {
    const schools = getSchools();
    const names = schools.map((s) => s.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('all parishes are valid Jamaica parishes', () => {
    const validParishes = new Set([
      'Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon',
      'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover',
      'St. James', 'Trelawny', 'St. Ann', 'St. Mary',
      'Portland', 'St. Thomas',
    ]);
    for (const s of getSchools()) {
      expect(validParishes.has(s.parish)).toBe(true);
    }
  });

  it('universities are marked correctly', () => {
    for (const s of getSchools()) {
      if (s.isUniversity) {
        expect(s.type).toBe('tertiary');
        expect(s.level).toBe('tertiary');
      }
    }
  });

  it('non-university schools are not marked as universities', () => {
    const nonUnis = getSchools().filter((s) => !s.isUniversity);
    for (const s of nonUnis) {
      expect(s.type).not.toBe('tertiary');
    }
  });
});
