/**
 * Jamaica Parishes Toolkit
 *
 * Provides data for Jamaica's 14 parishes including names, codes, populations,
 * coordinates, service center availability, and utility functions for distance
 * calculations and lookups.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ServiceCenter {
  nla: boolean;
  taj: boolean;
  pica: boolean;
  coj: boolean;
  taj_offices: number;
  nla_distance_km: number;
  pica_distance_km: number;
}

export interface Internet {
  broadband_level: string;
  fibre_connected: boolean;
  usf_hotspots: boolean;
  providers: string[];
}

export interface MobileCoverage {
  flow_4g: boolean;
  digicel_4g: boolean;
  quality: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Parish {
  name: string;
  code: ParishCode;
  capital: string;
  population: number;
  area_km2: number;
  density_per_km2: number;
  urban_pct: number;
  coordinates: Coordinates;
  internet: Internet;
  mobile_coverage: MobileCoverage;
  service_centers: ServiceCenter;
  economy: string[];
  bpo_presence: string;
  financial_inclusion: string;
  hurricane_melissa_damage: string;
  hospitals: string[];
}

export type ParishCode =
  | 'KIN'
  | 'SAN'
  | 'SCA'
  | 'CLA'
  | 'MAN'
  | 'SEL'
  | 'WES'
  | 'HAN'
  | 'SJA'
  | 'TRE'
  | 'SAN2'
  | 'SMA'
  | 'POR'
  | 'STH';

// ---------------------------------------------------------------------------
// Embedded parish data
// ---------------------------------------------------------------------------

const PARISHES: readonly Parish[] = [
  {
    name: 'Kingston',
    code: 'KIN',
    capital: 'Kingston',
    population: 89186,
    area_km2: 22,
    density_per_km2: 4054.8,
    urban_pct: 100,
    coordinates: { lat: 17.9714, lng: -76.792 },
    internet: {
      broadband_level: 'highest',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'excellent' },
    service_centers: {
      nla: true,
      taj: true,
      pica: true,
      coj: true,
      taj_offices: 6,
      nla_distance_km: 0,
      pica_distance_km: 0,
    },
    economy: ['government', 'financial_services', 'port', 'bpo', 'professional_services', 'tourism'],
    bpo_presence: 'major',
    financial_inclusion: 'highest',
    hurricane_melissa_damage: 'low-moderate',
    hospitals: ['Kingston Public Hospital', 'UHWI', 'Victoria Jubilee Hospital', 'Bustamante Hospital for Children'],
  },
  {
    name: 'St. Andrew',
    code: 'SAN',
    capital: 'Half Way Tree',
    population: 583718,
    area_km2: 435,
    density_per_km2: 1341.2,
    urban_pct: 90,
    coordinates: { lat: 18.0179, lng: -76.7674 },
    internet: {
      broadband_level: 'very_high',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'excellent' },
    service_centers: {
      nla: true,
      taj: true,
      pica: true,
      coj: true,
      taj_offices: 2,
      nla_distance_km: 0,
      pica_distance_km: 0,
    },
    economy: ['commercial_hub', 'banking', 'university', 'tech_startups', 'retail'],
    bpo_presence: 'major',
    financial_inclusion: 'very_high',
    hurricane_melissa_damage: 'low-moderate',
    hospitals: ['UHWI'],
  },
  {
    name: 'St. Catherine',
    code: 'SCA',
    capital: 'Spanish Town',
    population: 542763,
    area_km2: 1194,
    density_per_km2: 454.8,
    urban_pct: 71,
    coordinates: { lat: 18.0092, lng: -76.954 },
    internet: {
      broadband_level: 'high',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'good' },
    service_centers: {
      nla: false,
      taj: true,
      pica: true,
      coj: true,
      taj_offices: 4,
      nla_distance_km: 14,
      pica_distance_km: 0,
    },
    economy: ['government_services', 'dormitory_suburb', 'agriculture', 'manufacturing', 'bpo'],
    bpo_presence: 'emerging',
    financial_inclusion: 'good',
    hurricane_melissa_damage: 'moderate',
    hospitals: ['Spanish Town Hospital', 'Linstead Hospital'],
  },
  {
    name: 'Clarendon',
    code: 'CLA',
    capital: 'May Pen',
    population: 258643,
    area_km2: 1198,
    density_per_km2: 215.8,
    urban_pct: 30,
    coordinates: { lat: 17.9613, lng: -77.2386 },
    internet: {
      broadband_level: 'moderate',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'moderate' },
    service_centers: {
      nla: false,
      taj: true,
      pica: true,
      coj: true,
      taj_offices: 3,
      nla_distance_km: 60,
      pica_distance_km: 0,
    },
    economy: ['agriculture', 'bauxite_mining', 'government_services', 'commerce'],
    bpo_presence: 'minimal',
    financial_inclusion: 'moderate',
    hurricane_melissa_damage: 'moderate',
    hospitals: ['May Pen Hospital', 'Lionel Town Hospital'],
  },
  {
    name: 'Manchester',
    code: 'MAN',
    capital: 'Mandeville',
    population: 193694,
    area_km2: 837,
    density_per_km2: 231.3,
    urban_pct: 50,
    coordinates: { lat: 18.0418, lng: -77.505 },
    internet: {
      broadband_level: 'moderate_high',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'good' },
    service_centers: {
      nla: true,
      taj: true,
      pica: true,
      coj: true,
      taj_offices: 2,
      nla_distance_km: 0,
      pica_distance_km: 0,
    },
    economy: ['bauxite_alumina', 'agriculture', 'bpo', 'education', 'professional_services'],
    bpo_presence: 'emerging',
    financial_inclusion: 'good',
    hurricane_melissa_damage: 'moderate-severe',
    hospitals: ['Mandeville Hospital', 'Hargreaves Memorial Hospital', 'Percy Junior Hospital'],
  },
  {
    name: 'St. Elizabeth',
    code: 'SEL',
    capital: 'Black River',
    population: 153201,
    area_km2: 1204,
    density_per_km2: 127.3,
    urban_pct: 30,
    coordinates: { lat: 18.0069, lng: -77.7586 },
    internet: {
      broadband_level: 'low',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'poor_to_moderate' },
    service_centers: {
      nla: false,
      taj: true,
      pica: true,
      coj: true,
      taj_offices: 2,
      nla_distance_km: 45,
      pica_distance_km: 0,
    },
    economy: ['agriculture', 'bauxite', 'tourism', 'fishing'],
    bpo_presence: 'none',
    financial_inclusion: 'low',
    hurricane_melissa_damage: 'severe',
    hospitals: ['Black River Hospital'],
  },
  {
    name: 'Westmoreland',
    code: 'WES',
    capital: 'Savanna-la-Mar',
    population: 148627,
    area_km2: 807,
    density_per_km2: 184.2,
    urban_pct: 35,
    coordinates: { lat: 18.2117, lng: -78.1339 },
    internet: {
      broadband_level: 'moderate',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'good' },
    service_centers: {
      nla: false,
      taj: true,
      pica: true,
      coj: true,
      taj_offices: 2,
      nla_distance_km: 80,
      pica_distance_km: 0,
    },
    economy: ['tourism', 'agriculture', 'sugar', 'fishing'],
    bpo_presence: 'minimal',
    financial_inclusion: 'moderate',
    hurricane_melissa_damage: 'catastrophic',
    hospitals: ['Savanna-la-Mar Hospital'],
  },
  {
    name: 'Hanover',
    code: 'HAN',
    capital: 'Lucea',
    population: 71074,
    area_km2: 449,
    density_per_km2: 158.3,
    urban_pct: 25,
    coordinates: { lat: 18.4508, lng: -78.1702 },
    internet: {
      broadband_level: 'moderate',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'good' },
    service_centers: {
      nla: false,
      taj: true,
      pica: false,
      coj: true,
      taj_offices: 1,
      nla_distance_km: 30,
      pica_distance_km: 30,
    },
    economy: ['tourism', 'agriculture', 'sugar'],
    bpo_presence: 'none',
    financial_inclusion: 'low',
    hurricane_melissa_damage: 'catastrophic',
    hospitals: ['Noel Holmes Hospital'],
  },
  {
    name: 'St. James',
    code: 'SJA',
    capital: 'Montego Bay',
    population: 193322,
    area_km2: 595,
    density_per_km2: 324.9,
    urban_pct: 65,
    coordinates: { lat: 18.4762, lng: -77.9236 },
    internet: {
      broadband_level: 'high',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'excellent' },
    service_centers: {
      nla: true,
      taj: true,
      pica: true,
      coj: true,
      taj_offices: 2,
      nla_distance_km: 0,
      pica_distance_km: 0,
    },
    economy: ['tourism', 'bpo', 'port', 'retail', 'financial_services'],
    bpo_presence: 'major',
    financial_inclusion: 'good',
    hurricane_melissa_damage: 'severe',
    hospitals: ['Cornwall Regional Hospital'],
  },
  {
    name: 'Trelawny',
    code: 'TRE',
    capital: 'Falmouth',
    population: 79374,
    area_km2: 875,
    density_per_km2: 90.7,
    urban_pct: 25,
    coordinates: { lat: 18.4944, lng: -77.6553 },
    internet: {
      broadband_level: 'moderate',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'moderate' },
    service_centers: {
      nla: false,
      taj: true,
      pica: false,
      coj: true,
      taj_offices: 1,
      nla_distance_km: 30,
      pica_distance_km: 30,
    },
    economy: ['tourism', 'agriculture', 'cruise_port'],
    bpo_presence: 'none',
    financial_inclusion: 'low',
    hurricane_melissa_damage: 'severe',
    hospitals: ['Falmouth Hospital'],
  },
  {
    name: 'St. Ann',
    code: 'SAN2',
    capital: "St. Ann's Bay",
    population: 182808,
    area_km2: 1213,
    density_per_km2: 150.7,
    urban_pct: 40,
    coordinates: { lat: 18.4325, lng: -77.2006 },
    internet: {
      broadband_level: 'moderate',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'good' },
    service_centers: {
      nla: false,
      taj: true,
      pica: true,
      coj: true,
      taj_offices: 2,
      nla_distance_km: 50,
      pica_distance_km: 0,
    },
    economy: ['tourism', 'agriculture', 'bauxite', 'retail'],
    bpo_presence: 'minimal',
    financial_inclusion: 'moderate',
    hurricane_melissa_damage: 'moderate-severe',
    hospitals: ["St. Ann's Bay Hospital"],
  },
  {
    name: 'St. Mary',
    code: 'SMA',
    capital: 'Port Maria',
    population: 118760,
    area_km2: 611,
    density_per_km2: 194.4,
    urban_pct: 30,
    coordinates: { lat: 18.3697, lng: -76.9167 },
    internet: {
      broadband_level: 'low_moderate',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'moderate' },
    service_centers: {
      nla: false,
      taj: true,
      pica: false,
      coj: true,
      taj_offices: 1,
      nla_distance_km: 60,
      pica_distance_km: 50,
    },
    economy: ['agriculture', 'tourism', 'fishing'],
    bpo_presence: 'none',
    financial_inclusion: 'low',
    hurricane_melissa_damage: 'moderate',
    hospitals: ['Port Maria Hospital', 'Annotto Bay Hospital'],
  },
  {
    name: 'Portland',
    code: 'POR',
    capital: 'Port Antonio',
    population: 83374,
    area_km2: 814,
    density_per_km2: 102.4,
    urban_pct: 25,
    coordinates: { lat: 18.1789, lng: -76.4506 },
    internet: {
      broadband_level: 'low',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'moderate' },
    service_centers: {
      nla: false,
      taj: true,
      pica: false,
      coj: true,
      taj_offices: 1,
      nla_distance_km: 100,
      pica_distance_km: 100,
    },
    economy: ['agriculture', 'tourism', 'fishing'],
    bpo_presence: 'none',
    financial_inclusion: 'low',
    hurricane_melissa_damage: 'severe',
    hospitals: ['Port Antonio Hospital'],
  },
  {
    name: 'St. Thomas',
    code: 'STH',
    capital: 'Morant Bay',
    population: 97994,
    area_km2: 743,
    density_per_km2: 131.9,
    urban_pct: 25,
    coordinates: { lat: 17.8883, lng: -76.3508 },
    internet: {
      broadband_level: 'low',
      fibre_connected: true,
      usf_hotspots: true,
      providers: ['Flow', 'Digicel'],
    },
    mobile_coverage: { flow_4g: true, digicel_4g: true, quality: 'moderate' },
    service_centers: {
      nla: false,
      taj: true,
      pica: false,
      coj: true,
      taj_offices: 1,
      nla_distance_km: 50,
      pica_distance_km: 50,
    },
    economy: ['agriculture', 'fishing', 'light_manufacturing'],
    bpo_presence: 'none',
    financial_inclusion: 'lowest',
    hurricane_melissa_damage: 'moderate-severe',
    hospitals: ['Princess Margaret Hospital'],
  },
] as const;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** All valid parish codes */
export const PARISH_CODES: readonly ParishCode[] = [
  'KIN', 'SAN', 'SCA', 'CLA', 'MAN', 'SEL', 'WES', 'HAN',
  'SJA', 'TRE', 'SAN2', 'SMA', 'POR', 'STH',
] as const;

// Pre-built lookup maps for O(1) access
const byCode = new Map<string, Parish>(PARISHES.map((p) => [p.code, p]));
const byNameNormalized = new Map<string, Parish>(
  PARISHES.map((p) => [normalizeName(p.name), p]),
);

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Normalize a parish name for fuzzy matching.
 * Handles "St." vs "Saint", case, and extra whitespace.
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\bsaint\b/g, 'st.')
    .replace(/\bst\b(?!\.)/g, 'st.')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Convert degrees to radians */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine distance between two lat/lng points.
 * Returns distance in kilometres.
 */
function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return a shallow copy of the full parish array.
 */
export function getAllParishes(): Parish[] {
  return [...PARISHES];
}

/**
 * Look up a parish by its three-letter code (case-insensitive).
 */
export function getParish(code: string): Parish | undefined {
  return byCode.get(code.toUpperCase());
}

/**
 * Fuzzy lookup by parish name.
 * Handles "St." vs "Saint", case differences, etc.
 */
export function getParishByName(name: string): Parish | undefined {
  return byNameNormalized.get(normalizeName(name));
}

/** Service type key for filtering */
export type ServiceType = 'nla' | 'taj' | 'pica' | 'coj';

/**
 * Return all parishes that have a given government service center.
 */
export function getParishesWithService(service: ServiceType): Parish[] {
  return PARISHES.filter((p) => p.service_centers[service]);
}

/**
 * Compute the haversine (great-circle) distance in km between two parishes
 * identified by their codes.
 *
 * Throws if either code is invalid.
 */
export function getDistanceKm(from: ParishCode, to: ParishCode): number {
  const a = byCode.get(from);
  const b = byCode.get(to);
  if (!a) throw new Error(`Unknown parish code: ${from}`);
  if (!b) throw new Error(`Unknown parish code: ${to}`);
  return haversine(
    a.coordinates.lat,
    a.coordinates.lng,
    b.coordinates.lat,
    b.coordinates.lng,
  );
}

/**
 * Find the nearest parish that has an NLA (National Land Agency) office,
 * measured by haversine distance from the given parish code.
 *
 * Throws if the code is invalid.
 */
export function getNearestParishWithNLA(
  code: ParishCode,
): { parish: Parish; distanceKm: number } {
  const origin = byCode.get(code);
  if (!origin) throw new Error(`Unknown parish code: ${code}`);

  const nlaParishes = PARISHES.filter((p) => p.service_centers.nla);

  let nearest: Parish = nlaParishes[0];
  let minDist = haversine(
    origin.coordinates.lat,
    origin.coordinates.lng,
    nearest.coordinates.lat,
    nearest.coordinates.lng,
  );

  for (let i = 1; i < nlaParishes.length; i++) {
    const d = haversine(
      origin.coordinates.lat,
      origin.coordinates.lng,
      nlaParishes[i].coordinates.lat,
      nlaParishes[i].coordinates.lng,
    );
    if (d < minDist) {
      minDist = d;
      nearest = nlaParishes[i];
    }
  }

  return { parish: nearest, distanceKm: minDist };
}

/**
 * Sum of all parish populations (2022 census).
 */
export function getTotalPopulation(): number {
  return PARISHES.reduce((sum, p) => sum + p.population, 0);
}
