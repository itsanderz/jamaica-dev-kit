// jamaica-transport — Jamaica transport infrastructure data
// Airports, seaports, vehicle classifications, road network, and licence plates

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Coordinates {
  lat: number;
  lng: number;
}

export type AirportType = 'international' | 'domestic';
export type SeaportType = 'cargo' | 'cruise' | 'cruise/cargo' | 'fishing/cargo';
export type HighwayStatus = 'operational' | 'toll' | 'proposed';

export interface Airport {
  name: string;
  iata: string;
  icao: string;
  parish: string;
  type: AirportType;
  coordinates: Coordinates;
}

export interface Seaport {
  name: string;
  parish: string;
  type: SeaportType;
  operator?: string;
}

export interface VehicleClass {
  code: string;
  name: string;
  description: string;
  platePrefix?: string;
}

export interface Highway {
  name: string;
  segments: string[];
  totalKm: number;
  status: HighwayStatus;
}

export interface RoadNetwork {
  totalKm: number;
  pavedKm: number;
  unpavedKm: number;
  mainRoadsKm: number;
  parochialRoadsKm: number;
  highways: Highway[];
}

export interface LicencePlatePrefix {
  prefix: string;
  vehicleType: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Data — Airports
// ---------------------------------------------------------------------------

const AIRPORTS: readonly Airport[] = Object.freeze([
  {
    name: 'Norman Manley International Airport',
    iata: 'KIN',
    icao: 'MKJP',
    parish: 'Kingston',
    type: 'international' as const,
    coordinates: { lat: 17.9357, lng: -76.7875 },
  },
  {
    name: 'Sangster International Airport',
    iata: 'MBJ',
    icao: 'MKJS',
    parish: 'St. James',
    type: 'international' as const,
    coordinates: { lat: 18.5037, lng: -77.9133 },
  },
  {
    name: 'Ian Fleming International Airport',
    iata: 'OCJ',
    icao: 'MKBS',
    parish: 'St. Mary',
    type: 'international' as const,
    coordinates: { lat: 18.4042, lng: -76.9690 },
  },
  {
    name: 'Tinson Pen Aerodrome',
    iata: 'KTP',
    icao: 'MKTP',
    parish: 'Kingston',
    type: 'domestic' as const,
    coordinates: { lat: 17.9886, lng: -76.8238 },
  },
  {
    name: 'Ken Jones Aerodrome',
    iata: 'POT',
    icao: 'MKKJ',
    parish: 'Portland',
    type: 'domestic' as const,
    coordinates: { lat: 18.1988, lng: -76.5345 },
  },
  {
    name: 'Negril Aerodrome',
    iata: 'NEG',
    icao: 'MKNG',
    parish: 'Westmoreland',
    type: 'domestic' as const,
    coordinates: { lat: 18.3428, lng: -78.3321 },
  },
]);

// ---------------------------------------------------------------------------
// Data — Seaports
// ---------------------------------------------------------------------------

const SEAPORTS: readonly Seaport[] = Object.freeze([
  {
    name: 'Kingston Container Terminal',
    parish: 'Kingston',
    type: 'cargo' as const,
    operator: 'Kingston Freeport Terminal Limited',
  },
  {
    name: 'Port of Montego Bay',
    parish: 'St. James',
    type: 'cruise/cargo' as const,
  },
  {
    name: 'Port of Ocho Rios',
    parish: 'St. Ann',
    type: 'cruise' as const,
  },
  {
    name: 'Port of Falmouth',
    parish: 'Trelawny',
    type: 'cruise' as const,
  },
  {
    name: 'Port of Port Antonio',
    parish: 'Portland',
    type: 'cargo' as const,
  },
  {
    name: 'Rocky Point',
    parish: 'Clarendon',
    type: 'fishing/cargo' as const,
  },
]);

// ---------------------------------------------------------------------------
// Data — Vehicle Classifications
// ---------------------------------------------------------------------------

const VEHICLE_CLASSES: readonly VehicleClass[] = Object.freeze([
  {
    code: 'PMC',
    name: 'Private Motor Car',
    description: 'Privately owned motor car for personal use',
    platePrefix: undefined,
  },
  {
    code: 'CMC',
    name: 'Commercial Motor Car',
    description: 'Taxi, hire car, or other commercial passenger vehicle',
    platePrefix: 'PP',
  },
  {
    code: 'MC',
    name: 'Motorcycle',
    description: 'Two-wheeled motorized vehicle',
    platePrefix: 'MC',
  },
  {
    code: 'MT',
    name: 'Motor Truck',
    description: 'Goods vehicle used for transporting cargo',
    platePrefix: 'C',
  },
  {
    code: 'MB',
    name: 'Motor Bus',
    description: 'Route taxi, minibus, or bus for public transportation',
    platePrefix: 'PP',
  },
  {
    code: 'TR',
    name: 'Trailer',
    description: 'Non-motorized vehicle towed by a motor vehicle',
    platePrefix: 'C',
  },
  {
    code: 'AV',
    name: 'Agricultural Vehicle',
    description: 'Vehicle used primarily for agricultural purposes',
    platePrefix: undefined,
  },
  {
    code: 'SPV',
    name: 'Special Purpose Vehicle',
    description: 'Vehicle designed for a specific non-standard purpose',
    platePrefix: undefined,
  },
  {
    code: 'GV',
    name: 'Government Vehicle',
    description: 'Vehicle owned and operated by the Government of Jamaica',
    platePrefix: 'G',
  },
  {
    code: 'DV',
    name: 'Diplomatic Vehicle',
    description: 'Vehicle registered to a diplomatic mission',
    platePrefix: 'D',
  },
]);

// ---------------------------------------------------------------------------
// Data — Road Network
// ---------------------------------------------------------------------------

const HIGHWAYS: readonly Highway[] = Object.freeze([
  {
    name: 'Highway 2000',
    segments: [
      'Kingston to May Pen (Leg 1)',
      'May Pen to Williamsfield (Leg 2)',
    ],
    totalKm: 67,
    status: 'toll' as const,
  },
  {
    name: 'North-South Highway',
    segments: ['Caymanas to Ocho Rios'],
    totalKm: 66,
    status: 'toll' as const,
  },
  {
    name: 'East-West Highway',
    segments: ['Harbour View to Port Antonio (proposed)'],
    totalKm: 85,
    status: 'proposed' as const,
  },
]);

const ROAD_NETWORK: RoadNetwork = Object.freeze({
  totalKm: 22_121,
  pavedKm: 15_462,
  unpavedKm: 6_659,
  mainRoadsKm: 4_895,
  parochialRoadsKm: 10_567,
  highways: [...HIGHWAYS],
});

// ---------------------------------------------------------------------------
// Data — Licence Plate Prefixes
// ---------------------------------------------------------------------------

const LICENCE_PLATE_PREFIXES: readonly LicencePlatePrefix[] = Object.freeze([
  {
    prefix: '',
    vehicleType: 'Private',
    description: 'Private vehicle — no prefix, numbers only',
  },
  {
    prefix: 'PP',
    vehicleType: 'Public Passenger Vehicle',
    description: 'Public Passenger Vehicle (PPV) — taxis, route taxis, hire cars',
  },
  {
    prefix: 'C',
    vehicleType: 'Commercial',
    description: 'Commercial vehicle — goods transport',
  },
  {
    prefix: 'G',
    vehicleType: 'Government',
    description: 'Government-owned vehicle',
  },
  {
    prefix: 'D',
    vehicleType: 'Diplomatic',
    description: 'Diplomatic mission vehicle',
  },
  {
    prefix: 'MC',
    vehicleType: 'Motorcycle',
    description: 'Motorcycle — may also use CY prefix',
  },
  {
    prefix: 'CY',
    vehicleType: 'Motorcycle',
    description: 'Motorcycle — alternate prefix (cycle)',
  },
  {
    prefix: 'R',
    vehicleType: 'Rental',
    description: 'Rental vehicle',
  },
]);

// ---------------------------------------------------------------------------
// Functions — Airports
// ---------------------------------------------------------------------------

/** Returns all airports in Jamaica. */
export function getAirports(): Airport[] {
  return [...AIRPORTS];
}

/** Looks up a single airport by IATA or ICAO code (case-insensitive). */
export function getAirport(iataOrIcao: string): Airport | null {
  const code = iataOrIcao.toUpperCase();
  return (
    AIRPORTS.find((a) => a.iata === code || a.icao === code) ?? null
  );
}

/** Returns only international airports. */
export function getInternationalAirports(): Airport[] {
  return AIRPORTS.filter((a) => a.type === 'international');
}

/** Returns only domestic airports/aerodromes. */
export function getDomesticAirports(): Airport[] {
  return AIRPORTS.filter((a) => a.type === 'domestic');
}

/** Searches airports by name, IATA, ICAO, or parish (case-insensitive substring match). */
export function searchAirports(query: string): Airport[] {
  const q = query.toLowerCase();
  return AIRPORTS.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.iata.toLowerCase().includes(q) ||
      a.icao.toLowerCase().includes(q) ||
      a.parish.toLowerCase().includes(q),
  );
}

// ---------------------------------------------------------------------------
// Functions — Seaports
// ---------------------------------------------------------------------------

/** Returns all seaports in Jamaica. */
export function getSeaports(): Seaport[] {
  return [...SEAPORTS];
}

/** Looks up a single seaport by name (case-insensitive substring match). */
export function getSeaport(name: string): Seaport | null {
  const n = name.toLowerCase();
  return SEAPORTS.find((s) => s.name.toLowerCase().includes(n)) ?? null;
}

// ---------------------------------------------------------------------------
// Functions — Vehicle Classes
// ---------------------------------------------------------------------------

/** Returns all vehicle classifications. */
export function getVehicleClasses(): VehicleClass[] {
  return [...VEHICLE_CLASSES];
}

/** Looks up a single vehicle class by its code (case-insensitive). */
export function getVehicleClass(code: string): VehicleClass | null {
  const c = code.toUpperCase();
  return VEHICLE_CLASSES.find((v) => v.code === c) ?? null;
}

// ---------------------------------------------------------------------------
// Functions — Road Network
// ---------------------------------------------------------------------------

/** Returns the full road network summary for Jamaica. */
export function getRoadNetwork(): RoadNetwork {
  return { ...ROAD_NETWORK, highways: [...ROAD_NETWORK.highways] };
}

/** Returns all highways. */
export function getHighways(): Highway[] {
  return [...HIGHWAYS];
}

// ---------------------------------------------------------------------------
// Functions — Licence Plates
// ---------------------------------------------------------------------------

/** Returns all licence plate prefixes and their vehicle type associations. */
export function getLicencePlatePrefixes(): LicencePlatePrefix[] {
  return [...LICENCE_PLATE_PREFIXES];
}
