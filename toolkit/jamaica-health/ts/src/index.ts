// jamaica-health — Jamaica health facilities directory
// Hospitals, health centres, and regional health authorities

export type FacilityType = 'hospital' | 'health-centre';
export type RegionId = 'nerha' | 'wrha' | 'srha' | 'serha';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface HealthFacility {
  name: string;
  type: FacilityType;
  parish: string;
  region: RegionId;
  address?: string;
  phone?: string;
  coordinates?: Coordinates;
  specialization?: string;
}

export interface RegionalHealthAuthority {
  id: RegionId;
  name: string;
  fullName: string;
  parishes: string[];
}

// ---------------------------------------------------------------------------
// Regional Health Authorities
// ---------------------------------------------------------------------------

const REGIONAL_AUTHORITIES: RegionalHealthAuthority[] = [
  {
    id: 'nerha',
    name: 'NERHA',
    fullName: 'North East Regional Health Authority',
    parishes: ['St. Ann', 'St. Mary', 'Portland'],
  },
  {
    id: 'wrha',
    name: 'WRHA',
    fullName: 'Western Regional Health Authority',
    parishes: ['St. James', 'Trelawny', 'Hanover', 'Westmoreland'],
  },
  {
    id: 'srha',
    name: 'SRHA',
    fullName: 'Southern Regional Health Authority',
    parishes: ['Clarendon', 'Manchester', 'St. Elizabeth', 'St. Catherine'],
  },
  {
    id: 'serha',
    name: 'SERHA',
    fullName: 'South East Regional Health Authority',
    parishes: ['Kingston', 'St. Andrew', 'St. Thomas'],
  },
];

// ---------------------------------------------------------------------------
// Parish-to-region lookup (case-insensitive)
// ---------------------------------------------------------------------------

function buildParishRegionMap(): Map<string, RegionId> {
  const map = new Map<string, RegionId>();
  for (const rha of REGIONAL_AUTHORITIES) {
    for (const parish of rha.parishes) {
      map.set(parish.toLowerCase(), rha.id);
    }
  }
  return map;
}

const PARISH_REGION_MAP = buildParishRegionMap();

function regionForParish(parish: string): RegionId {
  const region = PARISH_REGION_MAP.get(parish.toLowerCase());
  if (!region) {
    throw new Error(`Unknown parish: ${parish}`);
  }
  return region;
}

// ---------------------------------------------------------------------------
// Facility data
// ---------------------------------------------------------------------------

const FACILITIES: HealthFacility[] = [
  // ── Hospitals ────────────────────────────────────────────────────────

  // Kingston & St. Andrew (SERHA)
  { name: 'Kingston Public Hospital', type: 'hospital', parish: 'Kingston', region: 'serha', coordinates: { lat: 18.0159, lng: -76.7960 } },
  { name: 'University Hospital of the West Indies', type: 'hospital', parish: 'St. Andrew', region: 'serha', coordinates: { lat: 18.0060, lng: -76.7484 } },
  { name: 'Victoria Jubilee Hospital', type: 'hospital', parish: 'Kingston', region: 'serha', coordinates: { lat: 18.0175, lng: -76.7957 }, specialization: 'maternity' },
  { name: 'Bustamante Hospital for Children', type: 'hospital', parish: 'Kingston', region: 'serha', coordinates: { lat: 18.0161, lng: -76.7948 } },
  { name: 'National Chest Hospital', type: 'hospital', parish: 'St. Andrew', region: 'serha', coordinates: { lat: 18.0127, lng: -76.7800 } },
  { name: 'Bellevue Hospital', type: 'hospital', parish: 'Kingston', region: 'serha', coordinates: { lat: 18.0082, lng: -76.7718 }, specialization: 'psychiatric' },

  // St. Catherine (SRHA)
  { name: 'Spanish Town Hospital', type: 'hospital', parish: 'St. Catherine', region: 'srha', coordinates: { lat: 18.0068, lng: -76.9561 } },
  { name: 'Linstead Public Hospital', type: 'hospital', parish: 'St. Catherine', region: 'srha', coordinates: { lat: 18.1335, lng: -77.0318 } },

  // Clarendon (SRHA)
  { name: 'May Pen Hospital', type: 'hospital', parish: 'Clarendon', region: 'srha', coordinates: { lat: 17.9600, lng: -77.2450 } },
  { name: 'Lionel Town Hospital', type: 'hospital', parish: 'Clarendon', region: 'srha', coordinates: { lat: 17.8588, lng: -77.1762 } },

  // Manchester (SRHA)
  { name: 'Mandeville Regional Hospital', type: 'hospital', parish: 'Manchester', region: 'srha', coordinates: { lat: 18.0440, lng: -77.5090 } },
  { name: 'Percy Junor Hospital', type: 'hospital', parish: 'Manchester', region: 'srha', coordinates: { lat: 18.0860, lng: -77.5240 } },

  // St. Elizabeth (SRHA)
  { name: 'Black River Hospital', type: 'hospital', parish: 'St. Elizabeth', region: 'srha', coordinates: { lat: 18.0223, lng: -77.8494 } },

  // St. James (WRHA)
  { name: 'Cornwall Regional Hospital', type: 'hospital', parish: 'St. James', region: 'wrha', coordinates: { lat: 18.4640, lng: -77.9200 } },

  // Trelawny (WRHA)
  { name: 'Falmouth Hospital', type: 'hospital', parish: 'Trelawny', region: 'wrha', coordinates: { lat: 18.4910, lng: -77.6560 } },

  // Hanover (WRHA)
  { name: 'Noel Holmes Hospital', type: 'hospital', parish: 'Hanover', region: 'wrha', coordinates: { lat: 18.4515, lng: -78.1662 } },

  // Westmoreland (WRHA)
  { name: 'Savanna-la-Mar Hospital', type: 'hospital', parish: 'Westmoreland', region: 'wrha', coordinates: { lat: 18.2170, lng: -78.1300 } },

  // St. Ann (NERHA)
  { name: "St. Ann's Bay Regional Hospital", type: 'hospital', parish: 'St. Ann', region: 'nerha', coordinates: { lat: 18.4360, lng: -77.2010 } },

  // St. Mary (NERHA)
  { name: 'Port Maria Hospital', type: 'hospital', parish: 'St. Mary', region: 'nerha', coordinates: { lat: 18.3740, lng: -76.8890 } },
  { name: 'Annotto Bay Hospital', type: 'hospital', parish: 'St. Mary', region: 'nerha', coordinates: { lat: 18.2750, lng: -76.7690 } },

  // Portland (NERHA)
  { name: 'Port Antonio Hospital', type: 'hospital', parish: 'Portland', region: 'nerha', coordinates: { lat: 18.1790, lng: -76.4520 } },

  // St. Thomas (SERHA)
  { name: 'Princess Margaret Hospital', type: 'hospital', parish: 'St. Thomas', region: 'serha', coordinates: { lat: 17.8860, lng: -76.4160 } },

  // ── Health Centres ───────────────────────────────────────────────────

  // Kingston
  { name: 'Comprehensive Health Centre', type: 'health-centre', parish: 'Kingston', region: 'serha' },
  { name: 'Windward Road Health Centre', type: 'health-centre', parish: 'Kingston', region: 'serha' },

  // St. Andrew
  { name: 'Hope Clinic', type: 'health-centre', parish: 'St. Andrew', region: 'serha' },
  { name: 'Half Way Tree Health Centre', type: 'health-centre', parish: 'St. Andrew', region: 'serha' },
  { name: 'Hagley Park Health Centre', type: 'health-centre', parish: 'St. Andrew', region: 'serha' },

  // St. Catherine
  { name: 'Portmore Health Centre', type: 'health-centre', parish: 'St. Catherine', region: 'srha' },
  { name: 'Old Harbour Health Centre', type: 'health-centre', parish: 'St. Catherine', region: 'srha' },
  { name: 'Bog Walk Health Centre', type: 'health-centre', parish: 'St. Catherine', region: 'srha' },

  // Clarendon
  { name: 'May Pen Health Centre', type: 'health-centre', parish: 'Clarendon', region: 'srha' },
  { name: 'Chapelton Health Centre', type: 'health-centre', parish: 'Clarendon', region: 'srha' },

  // Manchester
  { name: 'Mandeville Health Centre', type: 'health-centre', parish: 'Manchester', region: 'srha' },
  { name: 'Christiana Health Centre', type: 'health-centre', parish: 'Manchester', region: 'srha' },

  // St. Elizabeth
  { name: 'Black River Health Centre', type: 'health-centre', parish: 'St. Elizabeth', region: 'srha' },
  { name: 'Junction Health Centre', type: 'health-centre', parish: 'St. Elizabeth', region: 'srha' },
  { name: 'Santa Cruz Health Centre', type: 'health-centre', parish: 'St. Elizabeth', region: 'srha' },

  // Westmoreland
  { name: 'Savanna-la-Mar Health Centre', type: 'health-centre', parish: 'Westmoreland', region: 'wrha' },
  { name: 'Darliston Health Centre', type: 'health-centre', parish: 'Westmoreland', region: 'wrha' },

  // Hanover
  { name: 'Lucea Health Centre', type: 'health-centre', parish: 'Hanover', region: 'wrha' },
  { name: 'Sandy Bay Health Centre', type: 'health-centre', parish: 'Hanover', region: 'wrha' },

  // St. James
  { name: 'Montego Bay Health Centre', type: 'health-centre', parish: 'St. James', region: 'wrha' },
  { name: 'Granville Health Centre', type: 'health-centre', parish: 'St. James', region: 'wrha' },
  { name: 'Irwin Health Centre', type: 'health-centre', parish: 'St. James', region: 'wrha' },

  // Trelawny
  { name: 'Falmouth Health Centre', type: 'health-centre', parish: 'Trelawny', region: 'wrha' },
  { name: "Clark's Town Health Centre", type: 'health-centre', parish: 'Trelawny', region: 'wrha' },

  // St. Ann
  { name: "St. Ann's Bay Health Centre", type: 'health-centre', parish: 'St. Ann', region: 'nerha' },
  { name: 'Ocho Rios Health Centre', type: 'health-centre', parish: 'St. Ann', region: 'nerha' },
  { name: "Brown's Town Health Centre", type: 'health-centre', parish: 'St. Ann', region: 'nerha' },

  // St. Mary
  { name: 'Port Maria Health Centre', type: 'health-centre', parish: 'St. Mary', region: 'nerha' },
  { name: 'Highgate Health Centre', type: 'health-centre', parish: 'St. Mary', region: 'nerha' },

  // Portland
  { name: 'Port Antonio Health Centre', type: 'health-centre', parish: 'Portland', region: 'nerha' },
  { name: 'Buff Bay Health Centre', type: 'health-centre', parish: 'Portland', region: 'nerha' },

  // St. Thomas
  { name: 'Morant Bay Health Centre', type: 'health-centre', parish: 'St. Thomas', region: 'serha' },
  { name: 'Yallahs Health Centre', type: 'health-centre', parish: 'St. Thomas', region: 'serha' },
];

// ---------------------------------------------------------------------------
// Haversine helper
// ---------------------------------------------------------------------------

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculate the Haversine distance between two points in kilometres.
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ---------------------------------------------------------------------------
// Case-insensitive parish normalisation
// ---------------------------------------------------------------------------

function normalizeParish(parish: string): string {
  return parish.toLowerCase();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return all health facilities (hospitals and health centres).
 */
export function getHealthFacilities(): HealthFacility[] {
  return FACILITIES.map((f) => ({ ...f }));
}

/**
 * Return all hospitals.
 */
export function getHospitals(): HealthFacility[] {
  return FACILITIES.filter((f) => f.type === 'hospital').map((f) => ({ ...f }));
}

/**
 * Return all health centres.
 */
export function getHealthCentres(): HealthFacility[] {
  return FACILITIES.filter((f) => f.type === 'health-centre').map((f) => ({ ...f }));
}

/**
 * Return all health facilities in a given parish (case-insensitive).
 */
export function getHealthFacilitiesByParish(parish: string): HealthFacility[] {
  const key = normalizeParish(parish);
  return FACILITIES.filter((f) => normalizeParish(f.parish) === key).map((f) => ({ ...f }));
}

/**
 * Return all hospitals in a given parish (case-insensitive).
 */
export function getHospitalsByParish(parish: string): HealthFacility[] {
  const key = normalizeParish(parish);
  return FACILITIES.filter(
    (f) => f.type === 'hospital' && normalizeParish(f.parish) === key,
  ).map((f) => ({ ...f }));
}

/**
 * Return all health centres in a given parish (case-insensitive).
 */
export function getHealthCentresByParish(parish: string): HealthFacility[] {
  const key = normalizeParish(parish);
  return FACILITIES.filter(
    (f) => f.type === 'health-centre' && normalizeParish(f.parish) === key,
  ).map((f) => ({ ...f }));
}

/**
 * Return all health facilities managed by a given regional health authority.
 */
export function getHealthFacilitiesByRegion(region: RegionId): HealthFacility[] {
  return FACILITIES.filter((f) => f.region === region).map((f) => ({ ...f }));
}

/**
 * Return all four Regional Health Authorities.
 */
export function getRegionalAuthorities(): RegionalHealthAuthority[] {
  return REGIONAL_AUTHORITIES.map((r) => ({ ...r, parishes: [...r.parishes] }));
}

/**
 * Given a parish name, return the Regional Health Authority that manages it.
 */
export function getRegionalAuthority(parish: string): RegionalHealthAuthority {
  const regionId = regionForParish(parish);
  const rha = REGIONAL_AUTHORITIES.find((r) => r.id === regionId);
  if (!rha) {
    throw new Error(`No regional authority found for parish: ${parish}`);
  }
  return { ...rha, parishes: [...rha.parishes] };
}

/**
 * Case-insensitive search for health facilities by name.
 */
export function searchHealthFacilities(query: string): HealthFacility[] {
  const q = query.toLowerCase();
  return FACILITIES.filter((f) => f.name.toLowerCase().includes(q)).map((f) => ({ ...f }));
}

/**
 * Find the nearest health facility to the given coordinates using the
 * Haversine formula.  Optionally filter by facility type.
 * Only considers facilities that have coordinates defined.
 */
export function getNearestFacility(
  lat: number,
  lng: number,
  type?: FacilityType,
): HealthFacility | null {
  let candidates = FACILITIES.filter((f) => f.coordinates !== undefined);
  if (type) {
    candidates = candidates.filter((f) => f.type === type);
  }
  if (candidates.length === 0) {
    return null;
  }

  let nearest = candidates[0]!;
  let minDist = haversineDistance(lat, lng, nearest.coordinates!.lat, nearest.coordinates!.lng);

  for (let i = 1; i < candidates.length; i++) {
    const f = candidates[i]!;
    const d = haversineDistance(lat, lng, f.coordinates!.lat, f.coordinates!.lng);
    if (d < minDist) {
      minDist = d;
      nearest = f;
    }
  }

  return { ...nearest };
}

/**
 * Return the total number of health facilities.
 */
export function getHealthFacilityCount(): number {
  return FACILITIES.length;
}
