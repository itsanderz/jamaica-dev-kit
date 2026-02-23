import { describe, it, expect } from 'vitest';
import {
  getAirports,
  getAirport,
  getInternationalAirports,
  getDomesticAirports,
  searchAirports,
  getSeaports,
  getSeaport,
  getVehicleClasses,
  getVehicleClass,
  getRoadNetwork,
  getHighways,
  getLicencePlatePrefixes,
} from '../index';

// ---------------------------------------------------------------------------
// Airports
// ---------------------------------------------------------------------------

describe('getAirports', () => {
  it('returns all 6 airports', () => {
    const airports = getAirports();
    expect(airports).toHaveLength(6);
  });

  it('returns a new array each call (no mutation leaks)', () => {
    const a = getAirports();
    const b = getAirports();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

describe('getAirport', () => {
  it('finds Norman Manley by IATA code KIN', () => {
    const airport = getAirport('KIN');
    expect(airport).not.toBeNull();
    expect(airport!.name).toBe('Norman Manley International Airport');
    expect(airport!.icao).toBe('MKJP');
    expect(airport!.parish).toBe('Kingston');
    expect(airport!.type).toBe('international');
    expect(airport!.coordinates.lat).toBeCloseTo(17.9357, 4);
    expect(airport!.coordinates.lng).toBeCloseTo(-76.7875, 4);
  });

  it('finds Sangster by ICAO code MKJS', () => {
    const airport = getAirport('MKJS');
    expect(airport).not.toBeNull();
    expect(airport!.name).toBe('Sangster International Airport');
    expect(airport!.iata).toBe('MBJ');
  });

  it('finds Ian Fleming by IATA code OCJ', () => {
    const airport = getAirport('OCJ');
    expect(airport).not.toBeNull();
    expect(airport!.name).toBe('Ian Fleming International Airport');
    expect(airport!.parish).toBe('St. Mary');
  });

  it('finds Tinson Pen by IATA code KTP', () => {
    const airport = getAirport('KTP');
    expect(airport).not.toBeNull();
    expect(airport!.name).toBe('Tinson Pen Aerodrome');
    expect(airport!.type).toBe('domestic');
  });

  it('finds Ken Jones by ICAO code MKKJ', () => {
    const airport = getAirport('MKKJ');
    expect(airport).not.toBeNull();
    expect(airport!.name).toBe('Ken Jones Aerodrome');
    expect(airport!.parish).toBe('Portland');
  });

  it('finds Negril by IATA code NEG', () => {
    const airport = getAirport('NEG');
    expect(airport).not.toBeNull();
    expect(airport!.name).toBe('Negril Aerodrome');
    expect(airport!.parish).toBe('Westmoreland');
  });

  it('is case-insensitive', () => {
    expect(getAirport('kin')).not.toBeNull();
    expect(getAirport('mkjp')).not.toBeNull();
    expect(getAirport('Mbj')).not.toBeNull();
  });

  it('returns null for unknown code', () => {
    expect(getAirport('XXX')).toBeNull();
    expect(getAirport('')).toBeNull();
  });
});

describe('getInternationalAirports', () => {
  it('returns 3 international airports', () => {
    const airports = getInternationalAirports();
    expect(airports).toHaveLength(3);
    airports.forEach((a) => expect(a.type).toBe('international'));
  });

  it('includes KIN, MBJ, OCJ', () => {
    const codes = getInternationalAirports().map((a) => a.iata);
    expect(codes).toContain('KIN');
    expect(codes).toContain('MBJ');
    expect(codes).toContain('OCJ');
  });
});

describe('getDomesticAirports', () => {
  it('returns 3 domestic airports', () => {
    const airports = getDomesticAirports();
    expect(airports).toHaveLength(3);
    airports.forEach((a) => expect(a.type).toBe('domestic'));
  });

  it('includes KTP, POT, NEG', () => {
    const codes = getDomesticAirports().map((a) => a.iata);
    expect(codes).toContain('KTP');
    expect(codes).toContain('POT');
    expect(codes).toContain('NEG');
  });
});

describe('searchAirports', () => {
  it('searches by name', () => {
    const results = searchAirports('Norman');
    expect(results).toHaveLength(1);
    expect(results[0]!.iata).toBe('KIN');
  });

  it('searches by parish', () => {
    const results = searchAirports('Kingston');
    expect(results).toHaveLength(2); // Norman Manley + Tinson Pen
  });

  it('searches by IATA code', () => {
    const results = searchAirports('MBJ');
    expect(results).toHaveLength(1);
    expect(results[0]!.name).toBe('Sangster International Airport');
  });

  it('searches by ICAO code', () => {
    const results = searchAirports('MKBS');
    expect(results).toHaveLength(1);
    expect(results[0]!.name).toBe('Ian Fleming International Airport');
  });

  it('is case-insensitive', () => {
    const results = searchAirports('negril');
    expect(results).toHaveLength(1);
    expect(results[0]!.iata).toBe('NEG');
  });

  it('returns empty array for no matches', () => {
    expect(searchAirports('nonexistent')).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Seaports
// ---------------------------------------------------------------------------

describe('getSeaports', () => {
  it('returns all 6 seaports', () => {
    const seaports = getSeaports();
    expect(seaports).toHaveLength(6);
  });

  it('returns a new array each call', () => {
    const a = getSeaports();
    const b = getSeaports();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

describe('getSeaport', () => {
  it('finds Kingston Container Terminal', () => {
    const port = getSeaport('Kingston');
    expect(port).not.toBeNull();
    expect(port!.name).toBe('Kingston Container Terminal');
    expect(port!.type).toBe('cargo');
    expect(port!.operator).toBe('Kingston Freeport Terminal Limited');
  });

  it('finds Port of Montego Bay', () => {
    const port = getSeaport('Montego Bay');
    expect(port).not.toBeNull();
    expect(port!.type).toBe('cruise/cargo');
  });

  it('finds Port of Ocho Rios', () => {
    const port = getSeaport('Ocho Rios');
    expect(port).not.toBeNull();
    expect(port!.type).toBe('cruise');
    expect(port!.parish).toBe('St. Ann');
  });

  it('finds Port of Falmouth', () => {
    const port = getSeaport('Falmouth');
    expect(port).not.toBeNull();
    expect(port!.parish).toBe('Trelawny');
    expect(port!.type).toBe('cruise');
  });

  it('finds Port of Port Antonio', () => {
    const port = getSeaport('Port Antonio');
    expect(port).not.toBeNull();
    expect(port!.parish).toBe('Portland');
  });

  it('finds Rocky Point', () => {
    const port = getSeaport('Rocky');
    expect(port).not.toBeNull();
    expect(port!.name).toBe('Rocky Point');
    expect(port!.type).toBe('fishing/cargo');
    expect(port!.parish).toBe('Clarendon');
  });

  it('is case-insensitive', () => {
    expect(getSeaport('kingston')).not.toBeNull();
    expect(getSeaport('FALMOUTH')).not.toBeNull();
  });

  it('returns null for unknown port', () => {
    expect(getSeaport('nonexistent')).toBeNull();
  });

  it('seaports without operator have undefined operator', () => {
    const port = getSeaport('Ocho Rios');
    expect(port!.operator).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Vehicle Classes
// ---------------------------------------------------------------------------

describe('getVehicleClasses', () => {
  it('returns all 10 vehicle classes', () => {
    const classes = getVehicleClasses();
    expect(classes).toHaveLength(10);
  });

  it('returns a new array each call', () => {
    const a = getVehicleClasses();
    const b = getVehicleClasses();
    expect(a).not.toBe(b);
  });
});

describe('getVehicleClass', () => {
  it('finds Private Motor Car by code PMC', () => {
    const vc = getVehicleClass('PMC');
    expect(vc).not.toBeNull();
    expect(vc!.name).toBe('Private Motor Car');
    expect(vc!.platePrefix).toBeUndefined();
  });

  it('finds Commercial Motor Car by code CMC', () => {
    const vc = getVehicleClass('CMC');
    expect(vc).not.toBeNull();
    expect(vc!.name).toBe('Commercial Motor Car');
    expect(vc!.platePrefix).toBe('PP');
  });

  it('finds Motorcycle by code MC', () => {
    const vc = getVehicleClass('MC');
    expect(vc).not.toBeNull();
    expect(vc!.platePrefix).toBe('MC');
  });

  it('finds Motor Truck by code MT', () => {
    const vc = getVehicleClass('MT');
    expect(vc).not.toBeNull();
    expect(vc!.name).toBe('Motor Truck');
    expect(vc!.platePrefix).toBe('C');
  });

  it('finds Motor Bus by code MB', () => {
    const vc = getVehicleClass('MB');
    expect(vc).not.toBeNull();
    expect(vc!.name).toBe('Motor Bus');
    expect(vc!.platePrefix).toBe('PP');
  });

  it('finds Trailer by code TR', () => {
    const vc = getVehicleClass('TR');
    expect(vc).not.toBeNull();
    expect(vc!.platePrefix).toBe('C');
  });

  it('finds Agricultural Vehicle by code AV', () => {
    const vc = getVehicleClass('AV');
    expect(vc).not.toBeNull();
    expect(vc!.name).toBe('Agricultural Vehicle');
  });

  it('finds Special Purpose Vehicle by code SPV', () => {
    const vc = getVehicleClass('SPV');
    expect(vc).not.toBeNull();
  });

  it('finds Government Vehicle by code GV', () => {
    const vc = getVehicleClass('GV');
    expect(vc).not.toBeNull();
    expect(vc!.platePrefix).toBe('G');
  });

  it('finds Diplomatic Vehicle by code DV', () => {
    const vc = getVehicleClass('DV');
    expect(vc).not.toBeNull();
    expect(vc!.platePrefix).toBe('D');
  });

  it('is case-insensitive', () => {
    expect(getVehicleClass('pmc')).not.toBeNull();
    expect(getVehicleClass('gv')).not.toBeNull();
  });

  it('returns null for unknown code', () => {
    expect(getVehicleClass('ZZZ')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Road Network
// ---------------------------------------------------------------------------

describe('getRoadNetwork', () => {
  it('returns correct total km', () => {
    const rn = getRoadNetwork();
    expect(rn.totalKm).toBe(22_121);
  });

  it('returns correct paved km', () => {
    const rn = getRoadNetwork();
    expect(rn.pavedKm).toBe(15_462);
  });

  it('returns correct unpaved km', () => {
    const rn = getRoadNetwork();
    expect(rn.unpavedKm).toBe(6_659);
  });

  it('paved + unpaved equals total', () => {
    const rn = getRoadNetwork();
    expect(rn.pavedKm + rn.unpavedKm).toBe(rn.totalKm);
  });

  it('main roads + parochial roads equals paved total', () => {
    const rn = getRoadNetwork();
    expect(rn.mainRoadsKm + rn.parochialRoadsKm).toBe(rn.pavedKm);
  });

  it('returns correct main roads km', () => {
    const rn = getRoadNetwork();
    expect(rn.mainRoadsKm).toBe(4_895);
  });

  it('returns correct parochial roads km', () => {
    const rn = getRoadNetwork();
    expect(rn.parochialRoadsKm).toBe(10_567);
  });

  it('includes highways', () => {
    const rn = getRoadNetwork();
    expect(rn.highways.length).toBeGreaterThanOrEqual(3);
  });

  it('returns a new object each call (no mutation leaks)', () => {
    const a = getRoadNetwork();
    const b = getRoadNetwork();
    expect(a).not.toBe(b);
    expect(a.highways).not.toBe(b.highways);
  });
});

describe('getHighways', () => {
  it('returns 3 highways', () => {
    const highways = getHighways();
    expect(highways).toHaveLength(3);
  });

  it('includes Highway 2000 as toll', () => {
    const h2k = getHighways().find((h) => h.name === 'Highway 2000');
    expect(h2k).toBeDefined();
    expect(h2k!.status).toBe('toll');
    expect(h2k!.totalKm).toBe(67);
    expect(h2k!.segments).toHaveLength(2);
    expect(h2k!.segments).toContain('Kingston to May Pen (Leg 1)');
    expect(h2k!.segments).toContain('May Pen to Williamsfield (Leg 2)');
  });

  it('includes North-South Highway as toll', () => {
    const nsh = getHighways().find((h) => h.name === 'North-South Highway');
    expect(nsh).toBeDefined();
    expect(nsh!.status).toBe('toll');
    expect(nsh!.totalKm).toBe(66);
    expect(nsh!.segments).toContain('Caymanas to Ocho Rios');
  });

  it('includes East-West Highway as proposed', () => {
    const ewh = getHighways().find((h) => h.name === 'East-West Highway');
    expect(ewh).toBeDefined();
    expect(ewh!.status).toBe('proposed');
    expect(ewh!.totalKm).toBe(85);
  });
});

// ---------------------------------------------------------------------------
// Licence Plate Prefixes
// ---------------------------------------------------------------------------

describe('getLicencePlatePrefixes', () => {
  it('returns all 8 licence plate prefixes', () => {
    const prefixes = getLicencePlatePrefixes();
    expect(prefixes).toHaveLength(8);
  });

  it('includes private (empty prefix)', () => {
    const priv = getLicencePlatePrefixes().find((p) => p.vehicleType === 'Private');
    expect(priv).toBeDefined();
    expect(priv!.prefix).toBe('');
  });

  it('includes PPV prefix PP', () => {
    const ppv = getLicencePlatePrefixes().find((p) => p.prefix === 'PP');
    expect(ppv).toBeDefined();
    expect(ppv!.vehicleType).toBe('Public Passenger Vehicle');
  });

  it('includes Commercial prefix C', () => {
    const c = getLicencePlatePrefixes().find((p) => p.prefix === 'C');
    expect(c).toBeDefined();
    expect(c!.vehicleType).toBe('Commercial');
  });

  it('includes Government prefix G', () => {
    const g = getLicencePlatePrefixes().find((p) => p.prefix === 'G');
    expect(g).toBeDefined();
    expect(g!.vehicleType).toBe('Government');
  });

  it('includes Diplomatic prefix D', () => {
    const d = getLicencePlatePrefixes().find((p) => p.prefix === 'D');
    expect(d).toBeDefined();
    expect(d!.vehicleType).toBe('Diplomatic');
  });

  it('includes both MC and CY motorcycle prefixes', () => {
    const prefixes = getLicencePlatePrefixes();
    const mc = prefixes.find((p) => p.prefix === 'MC');
    const cy = prefixes.find((p) => p.prefix === 'CY');
    expect(mc).toBeDefined();
    expect(cy).toBeDefined();
    expect(mc!.vehicleType).toBe('Motorcycle');
    expect(cy!.vehicleType).toBe('Motorcycle');
  });

  it('includes Rental prefix R', () => {
    const r = getLicencePlatePrefixes().find((p) => p.prefix === 'R');
    expect(r).toBeDefined();
    expect(r!.vehicleType).toBe('Rental');
  });

  it('returns a new array each call', () => {
    const a = getLicencePlatePrefixes();
    const b = getLicencePlatePrefixes();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});
