// jamaica-emergency — Jamaica emergency services directory
// Police stations, fire stations, and disaster shelters

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StationType = 'police' | 'fire';

export interface EmergencyNumbers {
  police: string;
  ambulance: string;
  fire: string;
  disasterPreparedness: string;
  coastGuard: string;
}

export interface Station {
  name: string;
  type: StationType;
  parish: string;
  division?: string;
  address?: string;
  phone?: string;
}

export interface Shelter {
  name: string;
  parish: string;
  type: 'school' | 'community-centre' | 'sports-facility' | 'other';
  capacity?: number;
}

// ---------------------------------------------------------------------------
// Data — Emergency Numbers
// ---------------------------------------------------------------------------

const EMERGENCY_NUMBERS: EmergencyNumbers = {
  police: '119',
  ambulance: '110',
  fire: '110',
  disasterPreparedness: '116',
  coastGuard: '(876) 967-8191',
};

// ---------------------------------------------------------------------------
// Data — Police Stations (Jamaica Constabulary Force)
// ---------------------------------------------------------------------------

const POLICE_STATIONS: Station[] = [
  // Area 1 — Kingston & St. Andrew
  { name: 'Half Way Tree Police Station', type: 'police', parish: 'St. Andrew', division: 'St. Andrew Central' },
  { name: 'Constant Spring Police Station', type: 'police', parish: 'St. Andrew', division: 'St. Andrew North' },
  { name: "Matilda's Corner Police Station", type: 'police', parish: 'St. Andrew', division: 'St. Andrew South' },
  { name: 'Elletson Road Police Station', type: 'police', parish: 'Kingston', division: 'Kingston Central' },
  { name: 'Hunts Bay Police Station', type: 'police', parish: 'Kingston', division: 'Kingston Western' },
  { name: 'Rockfort Police Station', type: 'police', parish: 'Kingston', division: 'Kingston Eastern' },

  // Area 2 — St. Catherine & Clarendon
  { name: 'Spanish Town Police Station', type: 'police', parish: 'St. Catherine', division: 'St. Catherine North' },
  { name: 'Old Harbour Police Station', type: 'police', parish: 'St. Catherine', division: 'St. Catherine South' },
  { name: 'Portmore Police Station', type: 'police', parish: 'St. Catherine', division: 'St. Catherine South' },
  { name: 'May Pen Police Station', type: 'police', parish: 'Clarendon', division: 'Clarendon' },
  { name: 'Chapelton Police Station', type: 'police', parish: 'Clarendon', division: 'Clarendon' },

  // Area 3 — Manchester, St. Elizabeth, Westmoreland, Hanover
  { name: 'Mandeville Police Station', type: 'police', parish: 'Manchester', division: 'Manchester' },
  { name: 'Black River Police Station', type: 'police', parish: 'St. Elizabeth', division: 'St. Elizabeth' },
  { name: 'Savanna-la-Mar Police Station', type: 'police', parish: 'Westmoreland', division: 'Westmoreland' },
  { name: 'Lucea Police Station', type: 'police', parish: 'Hanover', division: 'Hanover' },

  // Area 4 — St. James, Trelawny
  { name: 'Montego Bay Police Station', type: 'police', parish: 'St. James', division: 'St. James' },
  { name: 'Freeport Police Station', type: 'police', parish: 'St. James', division: 'St. James' },
  { name: 'Falmouth Police Station', type: 'police', parish: 'Trelawny', division: 'Trelawny' },

  // Area 5 — St. Ann, St. Mary, Portland, St. Thomas
  { name: 'Ocho Rios Police Station', type: 'police', parish: 'St. Ann', division: 'St. Ann' },
  { name: "St. Ann's Bay Police Station", type: 'police', parish: 'St. Ann', division: 'St. Ann' },
  { name: 'Port Maria Police Station', type: 'police', parish: 'St. Mary', division: 'St. Mary' },
  { name: 'Port Antonio Police Station', type: 'police', parish: 'Portland', division: 'Portland' },
  { name: 'Morant Bay Police Station', type: 'police', parish: 'St. Thomas', division: 'St. Thomas' },
];

// ---------------------------------------------------------------------------
// Data — Fire Stations (Jamaica Fire Brigade)
// ---------------------------------------------------------------------------

const FIRE_STATIONS: Station[] = [
  { name: 'York Park Fire Station', type: 'fire', parish: 'Kingston' },
  { name: 'Half Way Tree Fire Station', type: 'fire', parish: 'St. Andrew' },
  { name: 'Stony Hill Fire Station', type: 'fire', parish: 'St. Andrew' },
  { name: 'Spanish Town Fire Station', type: 'fire', parish: 'St. Catherine' },
  { name: 'Portmore Fire Station', type: 'fire', parish: 'St. Catherine' },
  { name: 'May Pen Fire Station', type: 'fire', parish: 'Clarendon' },
  { name: 'Mandeville Fire Station', type: 'fire', parish: 'Manchester' },
  { name: 'Black River Fire Station', type: 'fire', parish: 'St. Elizabeth' },
  { name: 'Savanna-la-Mar Fire Station', type: 'fire', parish: 'Westmoreland' },
  { name: 'Lucea Fire Station', type: 'fire', parish: 'Hanover' },
  { name: 'Montego Bay Fire Station', type: 'fire', parish: 'St. James' },
  { name: 'Falmouth Fire Station', type: 'fire', parish: 'Trelawny' },
  { name: "St. Ann's Bay Fire Station", type: 'fire', parish: 'St. Ann' },
  { name: 'Ocho Rios Fire Station', type: 'fire', parish: 'St. Ann' },
  { name: 'Port Maria Fire Station', type: 'fire', parish: 'St. Mary' },
  { name: 'Port Antonio Fire Station', type: 'fire', parish: 'Portland' },
  { name: 'Morant Bay Fire Station', type: 'fire', parish: 'St. Thomas' },
];

// ---------------------------------------------------------------------------
// Data — Disaster Shelters
// ---------------------------------------------------------------------------

const DISASTER_SHELTERS: Shelter[] = [
  { name: 'National Arena', parish: 'Kingston', type: 'sports-facility' },
  { name: 'National Indoor Sports Centre', parish: 'Kingston', type: 'sports-facility' },
  { name: 'Excelsior High School', parish: 'St. Andrew', type: 'school' },
  { name: "Wolmer's Boys' School", parish: 'Kingston', type: 'school' },
  { name: 'Spanish Town High School', parish: 'St. Catherine', type: 'school' },
  { name: 'Portmore Community Centre', parish: 'St. Catherine', type: 'community-centre' },
  { name: 'May Pen High School', parish: 'Clarendon', type: 'school' },
  { name: 'Mandeville Primary School', parish: 'Manchester', type: 'school' },
  { name: 'Black River High School', parish: 'St. Elizabeth', type: 'school' },
  { name: "Manning's School", parish: 'Westmoreland', type: 'school' },
  { name: "Rusea's High School", parish: 'Hanover', type: 'school' },
  { name: 'Cornwall College', parish: 'St. James', type: 'school' },
  { name: 'Falmouth All-Age School', parish: 'Trelawny', type: 'school' },
  { name: "St. Hilda's High School", parish: 'St. Ann', type: 'school' },
  { name: 'Port Maria Civic Centre', parish: 'St. Mary', type: 'community-centre' },
  { name: 'Titchfield High School', parish: 'Portland', type: 'school' },
  { name: 'Morant Bay High School', parish: 'St. Thomas', type: 'school' },
];

// ---------------------------------------------------------------------------
// Helper — case-insensitive match
// ---------------------------------------------------------------------------

function normalise(s: string): string {
  return s.toLowerCase().trim();
}

function matchParish(parish: string, target: string): boolean {
  return normalise(parish) === normalise(target);
}

function matchQuery(text: string, query: string): boolean {
  const q = normalise(query);
  return normalise(text).includes(q);
}

// ---------------------------------------------------------------------------
// Public API — Emergency Numbers
// ---------------------------------------------------------------------------

export function getEmergencyNumbers(): EmergencyNumbers {
  return { ...EMERGENCY_NUMBERS };
}

// ---------------------------------------------------------------------------
// Public API — Police Stations
// ---------------------------------------------------------------------------

export function getPoliceStations(): Station[] {
  return POLICE_STATIONS.map((s) => ({ ...s }));
}

export function getPoliceStationsByParish(parish: string): Station[] {
  return POLICE_STATIONS.filter((s) => matchParish(s.parish, parish)).map((s) => ({ ...s }));
}

// ---------------------------------------------------------------------------
// Public API — Fire Stations
// ---------------------------------------------------------------------------

export function getFireStations(): Station[] {
  return FIRE_STATIONS.map((s) => ({ ...s }));
}

export function getFireStationsByParish(parish: string): Station[] {
  return FIRE_STATIONS.filter((s) => matchParish(s.parish, parish)).map((s) => ({ ...s }));
}

// ---------------------------------------------------------------------------
// Public API — All Stations (police + fire)
// ---------------------------------------------------------------------------

export function getStations(): Station[] {
  return [...getPoliceStations(), ...getFireStations()];
}

export function getStationsByParish(parish: string): Station[] {
  return [...getPoliceStationsByParish(parish), ...getFireStationsByParish(parish)];
}

// ---------------------------------------------------------------------------
// Public API — Disaster Shelters
// ---------------------------------------------------------------------------

export function getDisasterShelters(): Shelter[] {
  return DISASTER_SHELTERS.map((s) => ({ ...s }));
}

export function getSheltersByParish(parish: string): Shelter[] {
  return DISASTER_SHELTERS.filter((s) => matchParish(s.parish, parish)).map((s) => ({ ...s }));
}

// ---------------------------------------------------------------------------
// Public API — Search
// ---------------------------------------------------------------------------

export function searchStations(query: string): Station[] {
  return [...POLICE_STATIONS, ...FIRE_STATIONS]
    .filter(
      (s) =>
        matchQuery(s.name, query) ||
        matchQuery(s.parish, query) ||
        matchQuery(s.type, query) ||
        (s.division != null && matchQuery(s.division, query)),
    )
    .map((s) => ({ ...s }));
}

export function searchShelters(query: string): Shelter[] {
  return DISASTER_SHELTERS.filter(
    (s) => matchQuery(s.name, query) || matchQuery(s.parish, query) || matchQuery(s.type, query),
  ).map((s) => ({ ...s }));
}

// ---------------------------------------------------------------------------
// Public API — Counts
// ---------------------------------------------------------------------------

export function getStationCount(): { police: number; fire: number; total: number } {
  return {
    police: POLICE_STATIONS.length,
    fire: FIRE_STATIONS.length,
    total: POLICE_STATIONS.length + FIRE_STATIONS.length,
  };
}

export function getShelterCount(): number {
  return DISASTER_SHELTERS.length;
}
