import { describe, it, expect } from 'vitest';
import {
  getConstituencies,
  getConstituencyByParish,
  getConstituency,
  searchConstituencies,
  getConstituencyCount,
  getConstituencyCountByParish,
  getParishes,
} from '../index';
import type { Constituency } from '../index';

// Load shared test vectors
import vectors from '../../../shared-tests/vectors.json';

describe('jamaica-constituencies', () => {
  // -------------------------------------------------------------------------
  // getConstituencies
  // -------------------------------------------------------------------------
  describe('getConstituencies', () => {
    it('returns exactly 63 constituencies', () => {
      expect(getConstituencies()).toHaveLength(vectors.counts.total_constituencies);
    });

    it('returns a new array each time (defensive copy)', () => {
      const a = getConstituencies();
      const b = getConstituencies();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });

    it('returns new objects (not the internal reference)', () => {
      const a = getConstituencies();
      const b = getConstituencies();
      // Same data but different object identity for the first element
      expect(a[0]).not.toBe(b[0]);
      expect(a[0]).toEqual(b[0]);
    });

    it('contains all expected constituency names', () => {
      const names = getConstituencies().map((c) => c.name).sort();
      const expected = [...vectors.all_constituency_names].sort();
      expect(names).toEqual(expected);
    });
  });

  // -------------------------------------------------------------------------
  // getConstituencyCount
  // -------------------------------------------------------------------------
  describe('getConstituencyCount', () => {
    it('returns 63', () => {
      expect(getConstituencyCount()).toBe(vectors.counts.total_constituencies);
    });
  });

  // -------------------------------------------------------------------------
  // getParishes
  // -------------------------------------------------------------------------
  describe('getParishes', () => {
    it('returns exactly 14 parishes', () => {
      expect(getParishes()).toHaveLength(vectors.counts.total_parishes);
    });

    it('returns parishes in alphabetical order', () => {
      expect(getParishes()).toEqual(vectors.parishes_sorted);
    });

    it('returns a new array each time', () => {
      const a = getParishes();
      const b = getParishes();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });
  });

  // -------------------------------------------------------------------------
  // getConstituency (exact lookup by name)
  // -------------------------------------------------------------------------
  describe('getConstituency', () => {
    it.each(vectors.exact_lookups)(
      'finds "$input" -> $expected_parish',
      ({ input, expected_name, expected_parish }: any) => {
        const c = getConstituency(input);
        expect(c).not.toBeNull();
        expect(c!.name).toBe(expected_name);
        expect(c!.parish).toBe(expected_parish);
      },
    );

    it.each(vectors.case_insensitive_lookups)(
      'case-insensitive: "$input" -> $expected_name',
      ({ input, expected_name }: any) => {
        const c = getConstituency(input);
        expect(c).not.toBeNull();
        expect(c!.name).toBe(expected_name);
      },
    );

    it.each(vectors.null_lookups)('returns null for "%s"', (input: string) => {
      expect(getConstituency(input)).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // getConstituencyByParish
  // -------------------------------------------------------------------------
  describe('getConstituencyByParish', () => {
    it.each(vectors.parish_lookups)(
      'returns $expected_count constituencies for "$parish"',
      ({ parish, expected_count, expected_names }: any) => {
        const result = getConstituencyByParish(parish);
        expect(result).toHaveLength(expected_count);

        if (expected_names) {
          const names = result.map((c) => c.name).sort();
          expect(names).toEqual([...expected_names].sort());
        }
      },
    );

    it.each(vectors.parish_case_insensitive)(
      'case-insensitive: "$input" -> $expected_count',
      ({ input, expected_count }: any) => {
        expect(getConstituencyByParish(input)).toHaveLength(expected_count);
      },
    );

    it.each(vectors.parish_no_results)(
      'returns empty array for "%s"',
      (parish: string) => {
        expect(getConstituencyByParish(parish)).toEqual([]);
      },
    );

    it('returns new array (defensive copy)', () => {
      const a = getConstituencyByParish('Kingston');
      const b = getConstituencyByParish('Kingston');
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });

    it('all returned constituencies belong to the requested parish', () => {
      const result = getConstituencyByParish('St. Andrew');
      for (const c of result) {
        expect(c.parish).toBe('St. Andrew');
      }
    });
  });

  // -------------------------------------------------------------------------
  // searchConstituencies
  // -------------------------------------------------------------------------
  describe('searchConstituencies', () => {
    it.each(
      vectors.search_tests.filter((t: any) => t.expected_contains != null),
    )(
      'search "$query" contains "$expected_contains"',
      ({ query, expected_contains }: any) => {
        const results = searchConstituencies(query);
        const names = results.map((c) => c.name);
        expect(names).toContain(expected_contains);
      },
    );

    it.each(
      vectors.search_tests.filter((t: any) => t.expected_count != null),
    )(
      'search "$query" returns exactly $expected_count results',
      ({ query, expected_count }: any) => {
        expect(searchConstituencies(query)).toHaveLength(expected_count);
      },
    );

    it.each(
      vectors.search_tests.filter((t: any) => t.expected_min_count != null),
    )(
      'search "$query" returns at least $expected_min_count results',
      ({ query, expected_min_count }: any) => {
        expect(searchConstituencies(query).length).toBeGreaterThanOrEqual(
          expected_min_count,
        );
      },
    );

    it('is case-insensitive', () => {
      const lower = searchConstituencies('kingston');
      const upper = searchConstituencies('KINGSTON');
      const mixed = searchConstituencies('Kingston');
      expect(lower).toEqual(upper);
      expect(lower).toEqual(mixed);
    });

    it('returns new objects', () => {
      const a = searchConstituencies('Kingston Central');
      const b = searchConstituencies('Kingston Central');
      expect(a).not.toBe(b);
      expect(a[0]).not.toBe(b[0]);
      expect(a[0]).toEqual(b[0]);
    });
  });

  // -------------------------------------------------------------------------
  // getConstituencyCountByParish
  // -------------------------------------------------------------------------
  describe('getConstituencyCountByParish', () => {
    it('returns correct counts for every parish', () => {
      const counts = getConstituencyCountByParish();
      for (const [parish, expected] of Object.entries(
        vectors.constituency_count_by_parish,
      )) {
        expect(counts[parish]).toBe(expected);
      }
    });

    it('has exactly 14 parishes', () => {
      const counts = getConstituencyCountByParish();
      expect(Object.keys(counts)).toHaveLength(vectors.counts.total_parishes);
    });

    it('parish counts sum to 63', () => {
      const counts = getConstituencyCountByParish();
      const sum = Object.values(counts).reduce((a, b) => a + b, 0);
      expect(sum).toBe(vectors.counts.total_constituencies);
    });
  });

  // -------------------------------------------------------------------------
  // Data integrity
  // -------------------------------------------------------------------------
  describe('data integrity', () => {
    it('every constituency has a non-empty name', () => {
      for (const c of getConstituencies()) {
        expect(c.name.length).toBeGreaterThan(0);
      }
    });

    it('every constituency has a non-empty parish', () => {
      for (const c of getConstituencies()) {
        expect(c.parish.length).toBeGreaterThan(0);
      }
    });

    it('all constituency names are unique', () => {
      const names = getConstituencies().map((c) => c.name);
      expect(new Set(names).size).toBe(names.length);
    });

    it('all 14 parishes are represented', () => {
      const parishes = getParishes();
      expect(parishes).toHaveLength(14);
      for (const expected of vectors.parishes_sorted) {
        expect(parishes).toContain(expected);
      }
    });

    it('St. Andrew has the most constituencies (12)', () => {
      const counts = getConstituencyCountByParish();
      const max = Math.max(...Object.values(counts));
      expect(max).toBe(12);
      expect(counts['St. Andrew']).toBe(12);
      expect(counts['St. Catherine']).toBe(11);
    });

    it('Kingston has the fewest constituencies among its group (3)', () => {
      const counts = getConstituencyCountByParish();
      expect(counts['Kingston']).toBe(3);
    });
  });
});
