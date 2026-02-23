import { describe, it, expect } from 'vitest';
import {
  getHealthFacilities,
  getHospitals,
  getHealthCentres,
  getHealthFacilitiesByParish,
  getHospitalsByParish,
  getHealthCentresByParish,
  getHealthFacilitiesByRegion,
  getRegionalAuthorities,
  getRegionalAuthority,
  searchHealthFacilities,
  getNearestFacility,
  getHealthFacilityCount,
} from '../index';
import type { HealthFacility, RegionalHealthAuthority } from '../index';

// ---------------------------------------------------------------------------
// getHealthFacilities
// ---------------------------------------------------------------------------

describe('getHealthFacilities', () => {
  it('returns a non-empty array of all facilities', () => {
    const all = getHealthFacilities();
    expect(all.length).toBeGreaterThan(0);
    expect(all.length).toBe(getHealthFacilityCount());
  });

  it('returns a new array on each call (no mutation leaks)', () => {
    const a = getHealthFacilities();
    const b = getHealthFacilities();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('each facility has the required fields', () => {
    for (const f of getHealthFacilities()) {
      expect(f.name).toBeTruthy();
      expect(['hospital', 'health-centre']).toContain(f.type);
      expect(f.parish).toBeTruthy();
      expect(['nerha', 'wrha', 'srha', 'serha']).toContain(f.region);
    }
  });
});

// ---------------------------------------------------------------------------
// getHospitals / getHealthCentres
// ---------------------------------------------------------------------------

describe('getHospitals', () => {
  it('returns only hospitals', () => {
    const hospitals = getHospitals();
    expect(hospitals.length).toBeGreaterThan(0);
    for (const h of hospitals) {
      expect(h.type).toBe('hospital');
    }
  });

  it('returns 22 hospitals', () => {
    expect(getHospitals().length).toBe(22);
  });
});

describe('getHealthCentres', () => {
  it('returns only health centres', () => {
    const centres = getHealthCentres();
    expect(centres.length).toBeGreaterThan(0);
    for (const c of centres) {
      expect(c.type).toBe('health-centre');
    }
  });

  it('hospitals + health centres = total count', () => {
    expect(getHospitals().length + getHealthCentres().length).toBe(getHealthFacilityCount());
  });
});

// ---------------------------------------------------------------------------
// By parish
// ---------------------------------------------------------------------------

describe('getHealthFacilitiesByParish', () => {
  it('returns facilities for Kingston', () => {
    const kingston = getHealthFacilitiesByParish('Kingston');
    expect(kingston.length).toBeGreaterThan(0);
    for (const f of kingston) {
      expect(f.parish).toBe('Kingston');
    }
  });

  it('is case-insensitive', () => {
    const a = getHealthFacilitiesByParish('kingston');
    const b = getHealthFacilitiesByParish('KINGSTON');
    const c = getHealthFacilitiesByParish('Kingston');
    expect(a).toEqual(b);
    expect(b).toEqual(c);
  });

  it('returns empty array for unknown parish', () => {
    expect(getHealthFacilitiesByParish('Atlantis')).toEqual([]);
  });
});

describe('getHospitalsByParish', () => {
  it('returns only hospitals in Kingston', () => {
    const hospitals = getHospitalsByParish('Kingston');
    expect(hospitals.length).toBeGreaterThan(0);
    for (const h of hospitals) {
      expect(h.type).toBe('hospital');
      expect(h.parish).toBe('Kingston');
    }
  });

  it('Kingston has 4 hospitals', () => {
    expect(getHospitalsByParish('Kingston').length).toBe(4);
  });
});

describe('getHealthCentresByParish', () => {
  it('returns only health centres in St. Ann', () => {
    const centres = getHealthCentresByParish('St. Ann');
    expect(centres.length).toBe(3);
    for (const c of centres) {
      expect(c.type).toBe('health-centre');
      expect(c.parish).toBe('St. Ann');
    }
  });
});

// ---------------------------------------------------------------------------
// By region
// ---------------------------------------------------------------------------

describe('getHealthFacilitiesByRegion', () => {
  it('returns SERHA facilities including Kingston and St. Andrew hospitals', () => {
    const serha = getHealthFacilitiesByRegion('serha');
    expect(serha.length).toBeGreaterThan(0);
    const names = serha.map((f) => f.name);
    expect(names).toContain('Kingston Public Hospital');
    expect(names).toContain('University Hospital of the West Indies');
    expect(names).toContain('Princess Margaret Hospital');
  });

  it('all returned facilities belong to the requested region', () => {
    for (const regionId of ['nerha', 'wrha', 'srha', 'serha'] as const) {
      const facilities = getHealthFacilitiesByRegion(regionId);
      for (const f of facilities) {
        expect(f.region).toBe(regionId);
      }
    }
  });

  it('every parish is covered by exactly one RHA', () => {
    const all = getHealthFacilities();
    const parishRegions = new Map<string, Set<string>>();
    for (const f of all) {
      if (!parishRegions.has(f.parish)) {
        parishRegions.set(f.parish, new Set());
      }
      parishRegions.get(f.parish)!.add(f.region);
    }
    for (const [, regions] of parishRegions) {
      expect(regions.size).toBe(1);
    }
  });
});

// ---------------------------------------------------------------------------
// Regional Authorities
// ---------------------------------------------------------------------------

describe('getRegionalAuthorities', () => {
  it('returns 4 RHAs', () => {
    const rhas = getRegionalAuthorities();
    expect(rhas.length).toBe(4);
  });

  it('each RHA has required fields', () => {
    for (const rha of getRegionalAuthorities()) {
      expect(rha.id).toBeTruthy();
      expect(rha.name).toBeTruthy();
      expect(rha.fullName).toBeTruthy();
      expect(rha.parishes.length).toBeGreaterThan(0);
    }
  });

  it('returns new arrays (immutable)', () => {
    const a = getRegionalAuthorities();
    const b = getRegionalAuthorities();
    expect(a).not.toBe(b);
    expect(a[0]!.parishes).not.toBe(b[0]!.parishes);
  });
});

describe('getRegionalAuthority', () => {
  it('returns SERHA for Kingston', () => {
    const rha = getRegionalAuthority('Kingston');
    expect(rha.id).toBe('serha');
    expect(rha.name).toBe('SERHA');
  });

  it('returns WRHA for St. James', () => {
    const rha = getRegionalAuthority('St. James');
    expect(rha.id).toBe('wrha');
  });

  it('returns NERHA for Portland', () => {
    const rha = getRegionalAuthority('Portland');
    expect(rha.id).toBe('nerha');
  });

  it('returns SRHA for Manchester', () => {
    const rha = getRegionalAuthority('Manchester');
    expect(rha.id).toBe('srha');
  });

  it('is case-insensitive', () => {
    const a = getRegionalAuthority('kingston');
    const b = getRegionalAuthority('KINGSTON');
    expect(a.id).toBe(b.id);
  });

  it('throws for unknown parish', () => {
    expect(() => getRegionalAuthority('Narnia')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

describe('searchHealthFacilities', () => {
  it('finds Kingston Public Hospital with partial match', () => {
    const results = searchHealthFacilities('Kingston');
    const names = results.map((f) => f.name);
    expect(names).toContain('Kingston Public Hospital');
  });

  it('is case-insensitive', () => {
    const a = searchHealthFacilities('cornwall');
    const b = searchHealthFacilities('CORNWALL');
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('returns empty array when no match', () => {
    expect(searchHealthFacilities('xyznonexistent')).toEqual([]);
  });

  it('finds facilities by partial name', () => {
    const results = searchHealthFacilities('Bustamante');
    expect(results.length).toBe(1);
    expect(results[0]!.name).toBe('Bustamante Hospital for Children');
  });

  it('finds multiple matches for "Bay"', () => {
    const results = searchHealthFacilities('Bay');
    expect(results.length).toBeGreaterThan(1);
  });
});

// ---------------------------------------------------------------------------
// getNearestFacility
// ---------------------------------------------------------------------------

describe('getNearestFacility', () => {
  it('finds Bustamante Hospital for Children as nearest to downtown Kingston', () => {
    // Downtown Kingston coordinates — Bustamante is marginally closer than KPH
    const nearest = getNearestFacility(18.015, -76.795);
    expect(nearest).not.toBeNull();
    expect(nearest!.name).toBe('Bustamante Hospital for Children');
  });

  it('finds nearest hospital when type is specified', () => {
    // Near Montego Bay
    const nearest = getNearestFacility(18.47, -77.92, 'hospital');
    expect(nearest).not.toBeNull();
    expect(nearest!.name).toBe('Cornwall Regional Hospital');
    expect(nearest!.type).toBe('hospital');
  });

  it('returns null when no facilities have coordinates and type filter eliminates all', () => {
    // health-centres currently have no coordinates, so this should return null
    const nearest = getNearestFacility(18.0, -76.8, 'health-centre');
    expect(nearest).toBeNull();
  });

  it('returns a new object on each call (no mutation leaks)', () => {
    const a = getNearestFacility(18.015, -76.795);
    const b = getNearestFacility(18.015, -76.795);
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('finds Falmouth Hospital when near Falmouth', () => {
    const nearest = getNearestFacility(18.49, -77.66);
    expect(nearest).not.toBeNull();
    expect(nearest!.name).toBe('Falmouth Hospital');
  });

  it('finds Port Antonio Hospital when in east Portland', () => {
    const nearest = getNearestFacility(18.18, -76.45, 'hospital');
    expect(nearest).not.toBeNull();
    expect(nearest!.name).toBe('Port Antonio Hospital');
  });
});

// ---------------------------------------------------------------------------
// getHealthFacilityCount
// ---------------------------------------------------------------------------

describe('getHealthFacilityCount', () => {
  it('returns a positive number', () => {
    expect(getHealthFacilityCount()).toBeGreaterThan(0);
  });

  it('matches the length of getHealthFacilities', () => {
    expect(getHealthFacilityCount()).toBe(getHealthFacilities().length);
  });

  it('equals hospitals + health centres', () => {
    expect(getHealthFacilityCount()).toBe(getHospitals().length + getHealthCentres().length);
  });
});

// ---------------------------------------------------------------------------
// Cross-cutting: data integrity
// ---------------------------------------------------------------------------

describe('data integrity', () => {
  it('all 14 parishes are represented', () => {
    const parishes = new Set(getHealthFacilities().map((f) => f.parish));
    const expected = [
      'Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon',
      'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover',
      'St. James', 'Trelawny', 'St. Ann', 'St. Mary',
      'Portland', 'St. Thomas',
    ];
    for (const p of expected) {
      expect(parishes.has(p)).toBe(true);
    }
  });

  it('all hospitals have coordinates', () => {
    for (const h of getHospitals()) {
      expect(h.coordinates).toBeDefined();
      expect(h.coordinates!.lat).toBeGreaterThan(17);
      expect(h.coordinates!.lat).toBeLessThan(19);
      expect(h.coordinates!.lng).toBeGreaterThan(-79);
      expect(h.coordinates!.lng).toBeLessThan(-76);
    }
  });

  it('facility regions match parish-to-RHA mapping', () => {
    for (const f of getHealthFacilities()) {
      const rha = getRegionalAuthority(f.parish);
      expect(f.region).toBe(rha.id);
    }
  });

  it('RHA parishes cover all 14 parishes exactly once', () => {
    const rhas = getRegionalAuthorities();
    const allParishes = rhas.flatMap((r) => r.parishes);
    expect(allParishes.length).toBe(14);
    expect(new Set(allParishes).size).toBe(14);
  });
});
