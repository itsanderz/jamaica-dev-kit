import { describe, it, expect } from 'vitest';
import {
  getPlaces,
  getPlacesByParish,
  getPlacesByType,
  getPlace,
  getTowns,
  getCommunities,
  searchPlaces,
  getPlaceCount,
  getPlaceCountByParish,
  type Place,
  type PlaceType,
} from '../index';

// ---------------------------------------------------------------------------
// All 14 parishes of Jamaica
// ---------------------------------------------------------------------------
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
] as const;

// ---------------------------------------------------------------------------
// getPlaces
// ---------------------------------------------------------------------------
describe('getPlaces', () => {
  it('returns a non-empty array', () => {
    const places = getPlaces();
    expect(places.length).toBeGreaterThan(0);
  });

  it('returns at least 200 places', () => {
    expect(getPlaces().length).toBeGreaterThanOrEqual(200);
  });

  it('returns a new array each time (not the internal reference)', () => {
    const a = getPlaces();
    const b = getPlaces();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('every place has the required fields', () => {
    for (const place of getPlaces()) {
      expect(place.name).toBeTruthy();
      expect(place.type).toBeTruthy();
      expect(place.parish).toBeTruthy();
      expect(['city', 'town', 'community', 'district', 'village']).toContain(place.type);
    }
  });
});

// ---------------------------------------------------------------------------
// getPlacesByParish
// ---------------------------------------------------------------------------
describe('getPlacesByParish', () => {
  it('returns places for a valid parish', () => {
    const kingston = getPlacesByParish('Kingston');
    expect(kingston.length).toBeGreaterThan(0);
    expect(kingston.every((p) => p.parish === 'Kingston')).toBe(true);
  });

  it('is case-insensitive', () => {
    const a = getPlacesByParish('st. andrew');
    const b = getPlacesByParish('St. Andrew');
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('returns empty array for unknown parish', () => {
    expect(getPlacesByParish('Atlantis')).toEqual([]);
  });

  it('all 14 parishes have at least 7 places', () => {
    for (const parish of ALL_PARISHES) {
      const places = getPlacesByParish(parish);
      expect(places.length).toBeGreaterThanOrEqual(7);
    }
  });
});

// ---------------------------------------------------------------------------
// getPlacesByType
// ---------------------------------------------------------------------------
describe('getPlacesByType', () => {
  it('returns only cities when type is city', () => {
    const cities = getPlacesByType('city');
    expect(cities.length).toBeGreaterThanOrEqual(1);
    expect(cities.every((p) => p.type === 'city')).toBe(true);
  });

  it('returns towns', () => {
    const towns = getPlacesByType('town');
    expect(towns.length).toBeGreaterThan(10);
    expect(towns.every((p) => p.type === 'town')).toBe(true);
  });

  it('returns communities', () => {
    const communities = getPlacesByType('community');
    expect(communities.length).toBeGreaterThan(50);
    expect(communities.every((p) => p.type === 'community')).toBe(true);
  });

  it('returns villages', () => {
    const villages = getPlacesByType('village');
    expect(villages.length).toBeGreaterThanOrEqual(1);
    expect(villages.every((p) => p.type === 'village')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getPlace
// ---------------------------------------------------------------------------
describe('getPlace', () => {
  it('finds Kingston', () => {
    const place = getPlace('Kingston');
    expect(place).not.toBeNull();
    expect(place!.name).toBe('Kingston');
    expect(place!.type).toBe('city');
    expect(place!.parish).toBe('Kingston');
    expect(place!.population).toBe(89057);
  });

  it('is case-insensitive', () => {
    expect(getPlace('montego bay')).not.toBeNull();
    expect(getPlace('MONTEGO BAY')).not.toBeNull();
    expect(getPlace('Montego Bay')!.parish).toBe('St. James');
  });

  it('returns null for non-existent place', () => {
    expect(getPlace('Hogwarts')).toBeNull();
  });

  it('finds Spanish Town', () => {
    const place = getPlace('Spanish Town');
    expect(place).not.toBeNull();
    expect(place!.parish).toBe('St. Catherine');
    expect(place!.type).toBe('town');
  });

  it('finds Mandeville', () => {
    const place = getPlace('Mandeville');
    expect(place).not.toBeNull();
    expect(place!.parish).toBe('Manchester');
  });

  it('finds Port Antonio', () => {
    const place = getPlace('Port Antonio');
    expect(place).not.toBeNull();
    expect(place!.parish).toBe('Portland');
  });

  it('finds Falmouth', () => {
    const place = getPlace('Falmouth');
    expect(place).not.toBeNull();
    expect(place!.parish).toBe('Trelawny');
  });

  it('finds Morant Bay', () => {
    const place = getPlace('Morant Bay');
    expect(place).not.toBeNull();
    expect(place!.parish).toBe('St. Thomas');
    expect(place!.description).toContain('Paul Bogle');
  });
});

// ---------------------------------------------------------------------------
// getTowns
// ---------------------------------------------------------------------------
describe('getTowns', () => {
  it('returns cities and towns', () => {
    const towns = getTowns();
    expect(towns.length).toBeGreaterThan(15);
    expect(towns.every((p) => p.type === 'town' || p.type === 'city')).toBe(true);
  });

  it('includes Kingston (city) and Montego Bay (town)', () => {
    const names = getTowns().map((p) => p.name);
    expect(names).toContain('Kingston');
    expect(names).toContain('Montego Bay');
  });

  it('does not include communities', () => {
    const towns = getTowns();
    expect(towns.some((p) => p.type === 'community')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getCommunities
// ---------------------------------------------------------------------------
describe('getCommunities', () => {
  it('returns community names for Kingston', () => {
    const communities = getCommunities('Kingston');
    expect(communities.length).toBeGreaterThan(5);
    expect(communities).toContain('New Kingston');
    expect(communities).toContain('Port Royal');
  });

  it('is case-insensitive', () => {
    const a = getCommunities('kingston');
    const b = getCommunities('Kingston');
    expect(a).toEqual(b);
  });

  it('returns string array, not Place array', () => {
    const communities = getCommunities('St. Andrew');
    expect(communities.length).toBeGreaterThan(0);
    expect(typeof communities[0]).toBe('string');
  });

  it('does not include towns', () => {
    const communities = getCommunities('St. Andrew');
    expect(communities).not.toContain('Half Way Tree');
    expect(communities).not.toContain('Stony Hill');
  });

  it('returns empty for unknown parish', () => {
    expect(getCommunities('Narnia')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// searchPlaces
// ---------------------------------------------------------------------------
describe('searchPlaces', () => {
  it('finds places by partial name', () => {
    const results = searchPlaces('bay');
    expect(results.length).toBeGreaterThan(3);
    expect(results.every((p) => p.name.toLowerCase().includes('bay'))).toBe(true);
  });

  it('is case-insensitive', () => {
    const a = searchPlaces('port');
    const b = searchPlaces('PORT');
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(3);
  });

  it('returns empty array when nothing matches', () => {
    expect(searchPlaces('xyzzyplugh')).toEqual([]);
  });

  it('finds places with "town" in the name', () => {
    const results = searchPlaces('town');
    expect(results.length).toBeGreaterThan(5);
  });

  it('finds New Kingston', () => {
    const results = searchPlaces('New Kingston');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].name).toBe('New Kingston');
  });
});

// ---------------------------------------------------------------------------
// getPlaceCount
// ---------------------------------------------------------------------------
describe('getPlaceCount', () => {
  it('returns total count matching getPlaces length', () => {
    expect(getPlaceCount()).toBe(getPlaces().length);
  });

  it('is at least 200', () => {
    expect(getPlaceCount()).toBeGreaterThanOrEqual(200);
  });
});

// ---------------------------------------------------------------------------
// getPlaceCountByParish
// ---------------------------------------------------------------------------
describe('getPlaceCountByParish', () => {
  it('has entries for all 14 parishes', () => {
    const counts = getPlaceCountByParish();
    for (const parish of ALL_PARISHES) {
      expect(counts[parish]).toBeDefined();
      expect(counts[parish]).toBeGreaterThan(0);
    }
  });

  it('counts sum to total place count', () => {
    const counts = getPlaceCountByParish();
    const sum = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(sum).toBe(getPlaceCount());
  });

  it('each parish has at least 7 places', () => {
    const counts = getPlaceCountByParish();
    for (const count of Object.values(counts)) {
      expect(count).toBeGreaterThanOrEqual(7);
    }
  });
});

// ---------------------------------------------------------------------------
// Data integrity
// ---------------------------------------------------------------------------
describe('data integrity', () => {
  it('Kingston is the only city', () => {
    const cities = getPlacesByType('city');
    expect(cities).toHaveLength(1);
    expect(cities[0].name).toBe('Kingston');
  });

  it('every parish capital town exists', () => {
    const parishCapitals: Record<string, string> = {
      'Kingston': 'Kingston',
      'St. Andrew': 'Half Way Tree',
      'St. Catherine': 'Spanish Town',
      'Clarendon': 'May Pen',
      'Manchester': 'Mandeville',
      'St. Elizabeth': 'Black River',
      'Westmoreland': 'Savanna-la-Mar',
      'Hanover': 'Lucea',
      'St. James': 'Montego Bay',
      'Trelawny': 'Falmouth',
      'St. Ann': "St. Ann's Bay",
      'St. Mary': 'Port Maria',
      'Portland': 'Port Antonio',
      'St. Thomas': 'Morant Bay',
    };

    for (const [parish, capital] of Object.entries(parishCapitals)) {
      const place = getPlace(capital);
      expect(place).not.toBeNull();
      expect(place!.parish).toBe(parish);
    }
  });

  it('Portmore is the largest dormitory city', () => {
    const portmore = getPlace('Portmore');
    expect(portmore).not.toBeNull();
    expect(portmore!.population).toBe(182000);
  });

  it('only valid place types are used', () => {
    const validTypes: PlaceType[] = ['city', 'town', 'community', 'district', 'village'];
    for (const place of getPlaces()) {
      expect(validTypes).toContain(place.type);
    }
  });

  it('no duplicate name+parish combinations', () => {
    const seen = new Set<string>();
    for (const place of getPlaces()) {
      const key = `${place.name.toLowerCase()}|${place.parish.toLowerCase()}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('population values are positive when present', () => {
    for (const place of getPlaces()) {
      if (place.population !== undefined) {
        expect(place.population).toBeGreaterThan(0);
      }
    }
  });
});
