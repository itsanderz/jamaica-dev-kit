import { describe, it, expect } from 'vitest';
import {
  getAllParishes,
  getParish,
  getParishByName,
  getParishesWithService,
  getDistanceKm,
  getNearestParishWithNLA,
  getTotalPopulation,
  PARISH_CODES,
} from '../index';
import type { Parish, ParishCode } from '../index';

// Load shared test vectors
import vectors from '../../../shared-tests/vectors.json';
const v = vectors.vectors;

describe('jamaica-parishes', () => {
  describe('getAllParishes', () => {
    it('returns exactly 14 parishes', () => {
      expect(getAllParishes()).toHaveLength(v.total_parishes);
    });

    it('returns a new array each time (not the internal reference)', () => {
      const a = getAllParishes();
      const b = getAllParishes();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });
  });

  describe('PARISH_CODES', () => {
    it('contains all 14 codes', () => {
      expect(PARISH_CODES).toHaveLength(14);
    });

    it('matches expected codes from vectors', () => {
      expect([...PARISH_CODES].sort()).toEqual([...v.parish_codes].sort());
    });
  });

  describe('getParish (by code)', () => {
    it.each(v.lookup_by_code.filter((t: any) => t.expected_name !== null))(
      'finds $code -> $expected_name',
      ({ code, expected_name, expected_capital }: any) => {
        const p = getParish(code);
        expect(p).toBeDefined();
        expect(p!.name).toBe(expected_name);
        expect(p!.capital).toBe(expected_capital);
      },
    );

    it('returns undefined for an invalid code', () => {
      expect(getParish('INVALID')).toBeUndefined();
    });

    it('is case-insensitive', () => {
      expect(getParish('kin')).toBeDefined();
      expect(getParish('kin')!.code).toBe('KIN');
    });
  });

  describe('getParishByName (fuzzy)', () => {
    it.each(v.lookup_by_name.filter((t: any) => t.expected_code !== null))(
      'matches "$input" -> $expected_code',
      ({ input, expected_code }: any) => {
        const p = getParishByName(input);
        expect(p).toBeDefined();
        expect(p!.code).toBe(expected_code);
      },
    );

    it('returns undefined for nonexistent name', () => {
      expect(getParishByName('Nonexistent')).toBeUndefined();
    });

    it('handles "Saint" vs "St." equivalence', () => {
      const a = getParishByName('St. Andrew');
      const b = getParishByName('Saint Andrew');
      expect(a).toBeDefined();
      expect(b).toBeDefined();
      expect(a!.code).toBe(b!.code);
    });
  });

  describe('getParishesWithService', () => {
    it('returns 4 parishes with NLA offices', () => {
      const nla = getParishesWithService('nla');
      expect(nla).toHaveLength(v.services.nla.count);
      const codes = nla.map((p) => p.code).sort();
      expect(codes).toEqual([...v.services.nla.parishes_with_service].sort());
    });

    it('returns 14 parishes with TAJ offices', () => {
      expect(getParishesWithService('taj')).toHaveLength(v.services.taj.count);
    });

    it('returns 9 parishes with PICA offices', () => {
      const pica = getParishesWithService('pica');
      expect(pica).toHaveLength(v.services.pica.count);
      const codes = pica.map((p) => p.code).sort();
      expect(codes).toEqual([...v.services.pica.parishes_with_service].sort());
    });

    it('returns 14 parishes with COJ offices', () => {
      expect(getParishesWithService('coj')).toHaveLength(v.services.coj.count);
    });
  });

  describe('getDistanceKm', () => {
    it('returns 0 for same parish', () => {
      expect(getDistanceKm('KIN', 'KIN')).toBe(0);
    });

    it('computes Kingston to Montego Bay within tolerance', () => {
      const d = v.distance.kingston_to_montego_bay;
      const dist = getDistanceKm(d.from as ParishCode, d.to as ParishCode);
      expect(dist).toBeGreaterThan(d.expected_km_approx - d.tolerance_km);
      expect(dist).toBeLessThan(d.expected_km_approx + d.tolerance_km);
    });

    it('computes Kingston to Portland within tolerance', () => {
      const d = v.distance.kingston_to_portland;
      const dist = getDistanceKm(d.from as ParishCode, d.to as ParishCode);
      expect(dist).toBeGreaterThan(d.expected_km_approx - d.tolerance_km);
      expect(dist).toBeLessThan(d.expected_km_approx + d.tolerance_km);
    });

    it('throws for unknown code', () => {
      expect(() => getDistanceKm('ZZZ' as ParishCode, 'KIN')).toThrow();
    });
  });

  describe('getNearestParishWithNLA', () => {
    it('returns Kingston itself when starting from Kingston (distance 0)', () => {
      const result = getNearestParishWithNLA('KIN');
      expect(result.parish.code).toBe('KIN');
      expect(result.distanceKm).toBe(0);
    });

    it('returns Kingston or St. Andrew as nearest NLA for Portland', () => {
      const result = getNearestParishWithNLA('POR');
      // Portland is in the far east; nearest NLA should be Kingston or St. Andrew
      expect(result.parish.code).toBe(v.nearest_nla.from_portland.expected_nearest_code);
    });

    it('finds nearest NLA for St. Catherine within 25 km', () => {
      const result = getNearestParishWithNLA('SCA');
      expect(v.nearest_nla.from_st_catherine.expected_nearest_code_one_of).toContain(
        result.parish.code,
      );
      expect(result.distanceKm).toBeLessThan(
        v.nearest_nla.from_st_catherine.max_distance_km,
      );
    });
  });

  describe('getTotalPopulation', () => {
    it('returns the expected census total', () => {
      expect(getTotalPopulation()).toBe(v.total_population);
    });
  });

  describe('population checks', () => {
    it.each(v.population_checks)(
      '$code has population $population',
      ({ code, population }: any) => {
        const p = getParish(code);
        expect(p).toBeDefined();
        expect(p!.population).toBe(population);
      },
    );
  });

  describe('data integrity', () => {
    it('every parish has valid coordinates', () => {
      for (const p of getAllParishes()) {
        expect(p.coordinates.lat).toBeGreaterThan(17);
        expect(p.coordinates.lat).toBeLessThan(19);
        expect(p.coordinates.lng).toBeGreaterThan(-79);
        expect(p.coordinates.lng).toBeLessThan(-76);
      }
    });

    it('every parish has a non-empty economy array', () => {
      for (const p of getAllParishes()) {
        expect(p.economy.length).toBeGreaterThan(0);
      }
    });

    it('every parish has at least one hospital', () => {
      for (const p of getAllParishes()) {
        expect(p.hospitals.length).toBeGreaterThan(0);
      }
    });

    it('all parish codes are unique', () => {
      const codes = getAllParishes().map((p) => p.code);
      expect(new Set(codes).size).toBe(codes.length);
    });
  });
});
