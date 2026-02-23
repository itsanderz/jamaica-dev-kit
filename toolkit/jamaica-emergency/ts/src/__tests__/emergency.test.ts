import { describe, it, expect } from 'vitest';
import {
  getEmergencyNumbers,
  getPoliceStations,
  getPoliceStationsByParish,
  getFireStations,
  getFireStationsByParish,
  getStations,
  getStationsByParish,
  getDisasterShelters,
  getSheltersByParish,
  searchStations,
  searchShelters,
  getStationCount,
  getShelterCount,
} from '../index';
import type { EmergencyNumbers, Station, Shelter } from '../index';

// All 14 parishes of Jamaica
const ALL_PARISHES = [
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
];

// ---------------------------------------------------------------------------
// Emergency Numbers
// ---------------------------------------------------------------------------

describe('getEmergencyNumbers', () => {
  it('returns all emergency numbers', () => {
    const nums = getEmergencyNumbers();
    expect(nums.police).toBe('119');
    expect(nums.ambulance).toBe('110');
    expect(nums.fire).toBe('110');
    expect(nums.disasterPreparedness).toBe('116');
    expect(nums.coastGuard).toBe('(876) 967-8191');
  });

  it('returns a copy, not the original object', () => {
    const a = getEmergencyNumbers();
    const b = getEmergencyNumbers();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
  });
});

// ---------------------------------------------------------------------------
// Police Stations
// ---------------------------------------------------------------------------

describe('getPoliceStations', () => {
  it('returns 23 police stations', () => {
    expect(getPoliceStations()).toHaveLength(23);
  });

  it('all have type "police"', () => {
    for (const s of getPoliceStations()) {
      expect(s.type).toBe('police');
    }
  });

  it('all have a division', () => {
    for (const s of getPoliceStations()) {
      expect(s.division).toBeDefined();
      expect(s.division!.length).toBeGreaterThan(0);
    }
  });

  it('returns copies', () => {
    const a = getPoliceStations();
    const b = getPoliceStations();
    expect(a).toEqual(b);
    expect(a[0]).not.toBe(b[0]);
  });
});

describe('getPoliceStationsByParish', () => {
  it('returns correct stations for Kingston', () => {
    const stations = getPoliceStationsByParish('Kingston');
    expect(stations.length).toBeGreaterThanOrEqual(1);
    for (const s of stations) {
      expect(s.parish).toBe('Kingston');
      expect(s.type).toBe('police');
    }
  });

  it('is case-insensitive', () => {
    const a = getPoliceStationsByParish('kingston');
    const b = getPoliceStationsByParish('KINGSTON');
    expect(a).toEqual(b);
  });

  it('returns empty for non-existent parish', () => {
    expect(getPoliceStationsByParish('Nonexistent')).toHaveLength(0);
  });

  it('covers all 14 parishes', () => {
    for (const parish of ALL_PARISHES) {
      expect(
        getPoliceStationsByParish(parish).length,
        `Expected police station in ${parish}`,
      ).toBeGreaterThanOrEqual(1);
    }
  });
});

// ---------------------------------------------------------------------------
// Fire Stations
// ---------------------------------------------------------------------------

describe('getFireStations', () => {
  it('returns 17 fire stations', () => {
    expect(getFireStations()).toHaveLength(17);
  });

  it('all have type "fire"', () => {
    for (const s of getFireStations()) {
      expect(s.type).toBe('fire');
    }
  });

  it('none have a division', () => {
    for (const s of getFireStations()) {
      expect(s.division).toBeUndefined();
    }
  });
});

describe('getFireStationsByParish', () => {
  it('returns correct stations for St. Catherine', () => {
    const stations = getFireStationsByParish('St. Catherine');
    expect(stations.length).toBe(2);
    for (const s of stations) {
      expect(s.parish).toBe('St. Catherine');
    }
  });

  it('is case-insensitive', () => {
    const a = getFireStationsByParish('st. catherine');
    const b = getFireStationsByParish('ST. CATHERINE');
    expect(a).toEqual(b);
  });

  it('covers all 14 parishes', () => {
    for (const parish of ALL_PARISHES) {
      expect(
        getFireStationsByParish(parish).length,
        `Expected fire station in ${parish}`,
      ).toBeGreaterThanOrEqual(1);
    }
  });
});

// ---------------------------------------------------------------------------
// Combined Stations
// ---------------------------------------------------------------------------

describe('getStations', () => {
  it('returns all police + fire stations', () => {
    const all = getStations();
    const count = getStationCount();
    expect(all).toHaveLength(count.total);
    expect(all).toHaveLength(23 + 17);
  });
});

describe('getStationsByParish', () => {
  it('returns both police and fire stations for a parish', () => {
    const stations = getStationsByParish('Kingston');
    const types = new Set(stations.map((s) => s.type));
    expect(types.has('police')).toBe(true);
    expect(types.has('fire')).toBe(true);
  });

  it('returns empty for non-existent parish', () => {
    expect(getStationsByParish('Mars')).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Disaster Shelters
// ---------------------------------------------------------------------------

describe('getDisasterShelters', () => {
  it('returns 17 shelters', () => {
    expect(getDisasterShelters()).toHaveLength(17);
  });

  it('all have a valid type', () => {
    const validTypes = ['school', 'community-centre', 'sports-facility', 'other'];
    for (const s of getDisasterShelters()) {
      expect(validTypes).toContain(s.type);
    }
  });

  it('returns copies', () => {
    const a = getDisasterShelters();
    const b = getDisasterShelters();
    expect(a).toEqual(b);
    expect(a[0]).not.toBe(b[0]);
  });
});

describe('getSheltersByParish', () => {
  it('returns correct shelters for Kingston', () => {
    const shelters = getSheltersByParish('Kingston');
    expect(shelters.length).toBeGreaterThanOrEqual(1);
    for (const s of shelters) {
      expect(s.parish).toBe('Kingston');
    }
  });

  it('is case-insensitive', () => {
    const a = getSheltersByParish('kingston');
    const b = getSheltersByParish('KINGSTON');
    expect(a).toEqual(b);
  });

  it('covers all 14 parishes', () => {
    for (const parish of ALL_PARISHES) {
      expect(
        getSheltersByParish(parish).length,
        `Expected shelter in ${parish}`,
      ).toBeGreaterThanOrEqual(1);
    }
  });
});

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

describe('searchStations', () => {
  it('finds stations by name fragment', () => {
    const results = searchStations('Montego');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((s) => s.name.includes('Montego Bay'))).toBe(true);
  });

  it('finds stations by parish', () => {
    const results = searchStations('Portland');
    expect(results.length).toBeGreaterThanOrEqual(1);
    for (const s of results) {
      expect(s.parish).toBe('Portland');
    }
  });

  it('finds stations by type', () => {
    const results = searchStations('fire');
    expect(results.length).toBe(17);
    for (const s of results) {
      expect(s.type).toBe('fire');
    }
  });

  it('finds stations by division', () => {
    const results = searchStations('Kingston Central');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((s) => s.division === 'Kingston Central')).toBe(true);
  });

  it('is case-insensitive', () => {
    const a = searchStations('montego');
    const b = searchStations('MONTEGO');
    expect(a).toEqual(b);
  });

  it('returns empty for no match', () => {
    expect(searchStations('zzzzz_no_match')).toHaveLength(0);
  });
});

describe('searchShelters', () => {
  it('finds shelters by name fragment', () => {
    const results = searchShelters('Arena');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((s) => s.name.includes('National Arena'))).toBe(true);
  });

  it('finds shelters by parish', () => {
    const results = searchShelters('Trelawny');
    expect(results.length).toBeGreaterThanOrEqual(1);
    for (const s of results) {
      expect(s.parish).toBe('Trelawny');
    }
  });

  it('finds shelters by type', () => {
    const results = searchShelters('sports-facility');
    expect(results.length).toBe(2);
    for (const s of results) {
      expect(s.type).toBe('sports-facility');
    }
  });

  it('is case-insensitive', () => {
    const a = searchShelters('arena');
    const b = searchShelters('ARENA');
    expect(a).toEqual(b);
  });

  it('returns empty for no match', () => {
    expect(searchShelters('zzzzz_no_match')).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Counts
// ---------------------------------------------------------------------------

describe('getStationCount', () => {
  it('returns correct counts', () => {
    const count = getStationCount();
    expect(count.police).toBe(23);
    expect(count.fire).toBe(17);
    expect(count.total).toBe(40);
  });
});

describe('getShelterCount', () => {
  it('returns correct count', () => {
    expect(getShelterCount()).toBe(17);
  });
});

// ---------------------------------------------------------------------------
// Cross-cutting: parish coverage
// ---------------------------------------------------------------------------

describe('parish coverage', () => {
  it('every parish has at least one police station, one fire station, and one shelter', () => {
    for (const parish of ALL_PARISHES) {
      expect(getPoliceStationsByParish(parish).length, `police in ${parish}`).toBeGreaterThanOrEqual(1);
      expect(getFireStationsByParish(parish).length, `fire in ${parish}`).toBeGreaterThanOrEqual(1);
      expect(getSheltersByParish(parish).length, `shelter in ${parish}`).toBeGreaterThanOrEqual(1);
    }
  });
});
