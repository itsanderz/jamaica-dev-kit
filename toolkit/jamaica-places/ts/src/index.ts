/**
 * Jamaica Places Directory
 *
 * A comprehensive directory of cities, towns, communities, districts, and
 * villages across all 14 parishes of Jamaica.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PlaceType = 'city' | 'town' | 'community' | 'district' | 'village';

export interface Place {
  name: string;
  type: PlaceType;
  parish: string;
  population?: number;
  description?: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PLACES: readonly Place[] = Object.freeze([
  // ── Kingston ──────────────────────────────────────────────────────────
  { name: 'Kingston', type: 'city', parish: 'Kingston', population: 89057, description: 'Capital city of Jamaica' },
  { name: 'Downtown Kingston', type: 'community', parish: 'Kingston', description: 'Historic commercial centre' },
  { name: 'New Kingston', type: 'community', parish: 'Kingston', description: 'Financial and business district' },
  { name: 'Cross Roads', type: 'community', parish: 'Kingston', description: 'Major intersection and commercial area' },
  { name: 'Rae Town', type: 'community', parish: 'Kingston' },
  { name: 'Tivoli Gardens', type: 'community', parish: 'Kingston' },
  { name: 'Denham Town', type: 'community', parish: 'Kingston' },
  { name: 'Port Royal', type: 'community', parish: 'Kingston', description: 'Historic port, former pirate capital' },
  { name: 'Bournemouth', type: 'community', parish: 'Kingston' },
  { name: 'Rockfort', type: 'community', parish: 'Kingston' },
  { name: 'Newport West', type: 'community', parish: 'Kingston' },
  { name: 'Allman Town', type: 'community', parish: 'Kingston' },
  { name: 'Jones Town', type: 'community', parish: 'Kingston' },
  { name: 'Franklyn Town', type: 'community', parish: 'Kingston' },
  { name: 'Vineyard Town', type: 'community', parish: 'Kingston' },
  { name: 'Fletchers Land', type: 'community', parish: 'Kingston' },
  { name: 'Hannah Town', type: 'community', parish: 'Kingston' },

  // ── St. Andrew ────────────────────────────────────────────────────────
  { name: 'Half Way Tree', type: 'town', parish: 'St. Andrew', population: 28000, description: 'Commercial centre and transport hub' },
  { name: 'Liguanea', type: 'community', parish: 'St. Andrew' },
  { name: 'Mona', type: 'community', parish: 'St. Andrew', description: 'University of the West Indies campus area' },
  { name: 'Papine', type: 'community', parish: 'St. Andrew' },
  { name: 'Constant Spring', type: 'community', parish: 'St. Andrew' },
  { name: 'Cherry Gardens', type: 'community', parish: 'St. Andrew' },
  { name: 'Stony Hill', type: 'town', parish: 'St. Andrew' },
  { name: 'Red Hills', type: 'community', parish: 'St. Andrew' },
  { name: 'August Town', type: 'community', parish: 'St. Andrew' },
  { name: 'Gordon Town', type: 'community', parish: 'St. Andrew' },
  { name: 'Barbican', type: 'community', parish: 'St. Andrew' },
  { name: 'Hope Pastures', type: 'community', parish: 'St. Andrew' },
  { name: 'Manor Park', type: 'community', parish: 'St. Andrew' },
  { name: 'Norbrook', type: 'community', parish: 'St. Andrew' },
  { name: 'Irish Town', type: 'village', parish: 'St. Andrew' },
  { name: 'Meadowbrook', type: 'community', parish: 'St. Andrew' },
  { name: 'Havendale', type: 'community', parish: 'St. Andrew' },
  { name: 'Beverly Hills', type: 'community', parish: 'St. Andrew' },
  { name: 'Golden Spring', type: 'community', parish: 'St. Andrew' },

  // ── St. Catherine ─────────────────────────────────────────────────────
  { name: 'Spanish Town', type: 'town', parish: 'St. Catherine', population: 147152, description: 'Former capital of Jamaica' },
  { name: 'Portmore', type: 'town', parish: 'St. Catherine', population: 182000, description: 'Largest dormitory city' },
  { name: 'Old Harbour', type: 'town', parish: 'St. Catherine', population: 25000 },
  { name: 'Linstead', type: 'town', parish: 'St. Catherine', population: 30000 },
  { name: 'Bog Walk', type: 'town', parish: 'St. Catherine' },
  { name: 'Ewarton', type: 'town', parish: 'St. Catherine' },
  { name: 'Caymanas', type: 'community', parish: 'St. Catherine' },
  { name: 'Old Harbour Bay', type: 'community', parish: 'St. Catherine' },
  { name: 'Gregory Park', type: 'community', parish: 'St. Catherine' },
  { name: 'Waterford', type: 'community', parish: 'St. Catherine' },
  { name: 'Central Village', type: 'community', parish: 'St. Catherine' },
  { name: 'Twickenham Park', type: 'community', parish: 'St. Catherine' },
  { name: 'Bridgeport', type: 'community', parish: 'St. Catherine' },
  { name: 'Hellshire', type: 'community', parish: 'St. Catherine' },
  { name: 'Point Hill', type: 'community', parish: 'St. Catherine' },
  { name: 'Above Rocks', type: 'community', parish: 'St. Catherine' },

  // ── Clarendon ─────────────────────────────────────────────────────────
  { name: 'May Pen', type: 'town', parish: 'Clarendon', population: 50000, description: 'Parish capital of Clarendon' },
  { name: 'Chapelton', type: 'town', parish: 'Clarendon' },
  { name: 'Lionel Town', type: 'town', parish: 'Clarendon' },
  { name: 'Race Course', type: 'community', parish: 'Clarendon' },
  { name: 'Frankfield', type: 'community', parish: 'Clarendon' },
  { name: 'Hayes', type: 'community', parish: 'Clarendon' },
  { name: 'Toll Gate', type: 'community', parish: 'Clarendon' },
  { name: 'Rocky Point', type: 'community', parish: 'Clarendon' },
  { name: 'Milk River', type: 'village', parish: 'Clarendon' },
  { name: 'Four Paths', type: 'community', parish: 'Clarendon' },
  { name: 'Spaldings', type: 'community', parish: 'Clarendon' },
  { name: 'Mitchell Town', type: 'community', parish: 'Clarendon' },
  { name: 'Denbigh', type: 'community', parish: 'Clarendon', description: 'Home of the Denbigh Agricultural Show' },
  { name: 'Kellits', type: 'community', parish: 'Clarendon' },

  // ── Manchester ────────────────────────────────────────────────────────
  { name: 'Mandeville', type: 'town', parish: 'Manchester', population: 47000, description: 'Parish capital, cool highland town' },
  { name: 'Christiana', type: 'town', parish: 'Manchester' },
  { name: 'Porus', type: 'town', parish: 'Manchester' },
  { name: 'Williamsfield', type: 'community', parish: 'Manchester' },
  { name: 'Mile Gully', type: 'community', parish: 'Manchester' },
  { name: 'Newport', type: 'community', parish: 'Manchester' },
  { name: 'Walderston', type: 'village', parish: 'Manchester' },
  { name: 'Spur Tree', type: 'community', parish: 'Manchester' },
  { name: 'Hatfield', type: 'community', parish: 'Manchester' },
  { name: 'Cross Keys', type: 'community', parish: 'Manchester' },
  { name: 'Gutters', type: 'community', parish: 'Manchester' },
  { name: 'Knockpatrick', type: 'community', parish: 'Manchester' },
  { name: 'Mike Town', type: 'community', parish: 'Manchester' },
  { name: 'Coleyville', type: 'community', parish: 'Manchester' },

  // ── St. Elizabeth ─────────────────────────────────────────────────────
  { name: 'Black River', type: 'town', parish: 'St. Elizabeth', population: 4000, description: 'Parish capital, Black River safari' },
  { name: 'Santa Cruz', type: 'town', parish: 'St. Elizabeth' },
  { name: 'Junction', type: 'town', parish: 'St. Elizabeth' },
  { name: 'Treasure Beach', type: 'community', parish: 'St. Elizabeth', description: 'Eco-tourism destination' },
  { name: 'Malvern', type: 'community', parish: 'St. Elizabeth' },
  { name: 'Lacovia', type: 'community', parish: 'St. Elizabeth' },
  { name: 'Balaclava', type: 'community', parish: 'St. Elizabeth' },
  { name: 'Appleton', type: 'community', parish: 'St. Elizabeth', description: 'Appleton Estate rum distillery' },
  { name: 'Nain', type: 'community', parish: 'St. Elizabeth' },
  { name: 'Middle Quarters', type: 'community', parish: 'St. Elizabeth' },
  { name: 'Maggotty', type: 'community', parish: 'St. Elizabeth' },
  { name: 'Siloah', type: 'community', parish: 'St. Elizabeth' },
  { name: 'Mountainside', type: 'community', parish: 'St. Elizabeth' },
  { name: 'Braes River', type: 'community', parish: 'St. Elizabeth' },

  // ── Westmoreland ──────────────────────────────────────────────────────
  { name: 'Savanna-la-Mar', type: 'town', parish: 'Westmoreland', population: 22000, description: 'Parish capital of Westmoreland' },
  { name: 'Negril', type: 'town', parish: 'Westmoreland', description: 'Major tourism centre, seven-mile beach' },
  { name: 'Whitehouse', type: 'community', parish: 'Westmoreland' },
  { name: 'Bluefields', type: 'community', parish: 'Westmoreland' },
  { name: 'Bethel Town', type: 'community', parish: 'Westmoreland' },
  { name: 'Petersfield', type: 'community', parish: 'Westmoreland' },
  { name: 'Frome', type: 'community', parish: 'Westmoreland', description: 'Sugar estate and processing' },
  { name: 'Darliston', type: 'community', parish: 'Westmoreland' },
  { name: 'Little London', type: 'community', parish: 'Westmoreland' },
  { name: 'Grange Hill', type: 'community', parish: 'Westmoreland' },
  { name: 'Ferris Cross', type: 'community', parish: 'Westmoreland' },
  { name: 'Lenox Bigwoods', type: 'community', parish: 'Westmoreland' },
  { name: 'New Hope', type: 'community', parish: 'Westmoreland' },

  // ── Hanover ───────────────────────────────────────────────────────────
  { name: 'Lucea', type: 'town', parish: 'Hanover', population: 6000, description: 'Parish capital of Hanover' },
  { name: 'Green Island', type: 'town', parish: 'Hanover' },
  { name: 'Sandy Bay', type: 'community', parish: 'Hanover' },
  { name: 'Hopewell', type: 'community', parish: 'Hanover' },
  { name: 'Cousins Cove', type: 'community', parish: 'Hanover' },
  { name: 'Cascade', type: 'community', parish: 'Hanover' },
  { name: 'Askenish', type: 'community', parish: 'Hanover' },
  { name: 'Kenilworth', type: 'community', parish: 'Hanover' },
  { name: 'Jericho', type: 'community', parish: 'Hanover' },
  { name: 'Dias', type: 'community', parish: 'Hanover' },
  { name: 'Riverside', type: 'community', parish: 'Hanover' },
  { name: 'Haughton Grove', type: 'community', parish: 'Hanover' },

  // ── St. James ─────────────────────────────────────────────────────────
  { name: 'Montego Bay', type: 'town', parish: 'St. James', population: 110115, description: 'Second city of Jamaica, tourism capital' },
  { name: 'Rose Hall', type: 'community', parish: 'St. James', description: 'Great house and resort area' },
  { name: 'Ironshore', type: 'community', parish: 'St. James' },
  { name: 'Catherine Hall', type: 'community', parish: 'St. James' },
  { name: 'Granville', type: 'community', parish: 'St. James' },
  { name: 'Reading', type: 'community', parish: 'St. James' },
  { name: 'Cambridge', type: 'community', parish: 'St. James' },
  { name: 'Anchovy', type: 'community', parish: 'St. James' },
  { name: 'Adelphi', type: 'community', parish: 'St. James' },
  { name: 'Barrett Town', type: 'community', parish: 'St. James' },
  { name: 'Salt Spring', type: 'community', parish: 'St. James' },
  { name: 'Montpelier', type: 'community', parish: 'St. James' },
  { name: 'Lilliput', type: 'community', parish: 'St. James' },

  // ── Trelawny ──────────────────────────────────────────────────────────
  { name: 'Falmouth', type: 'town', parish: 'Trelawny', population: 8000, description: 'Parish capital, Georgian architecture, cruise port' },
  { name: "Clark's Town", type: 'community', parish: 'Trelawny' },
  { name: 'Duncans', type: 'community', parish: 'Trelawny' },
  { name: 'Albert Town', type: 'community', parish: 'Trelawny' },
  { name: 'Wait-a-Bit', type: 'community', parish: 'Trelawny' },
  { name: 'Stewart Town', type: 'community', parish: 'Trelawny' },
  { name: 'Rio Bueno', type: 'community', parish: 'Trelawny' },
  { name: 'Troy', type: 'community', parish: 'Trelawny' },
  { name: 'Warsop', type: 'community', parish: 'Trelawny' },
  { name: 'Wakefield', type: 'community', parish: 'Trelawny' },
  { name: 'Bunkers Hill', type: 'community', parish: 'Trelawny' },
  { name: 'Ulster Spring', type: 'community', parish: 'Trelawny' },
  { name: 'Sherwood Content', type: 'community', parish: 'Trelawny', description: 'Birthplace of Usain Bolt' },

  // ── St. Ann ───────────────────────────────────────────────────────────
  { name: "St. Ann's Bay", type: 'town', parish: 'St. Ann', population: 13000, description: 'Parish capital, birthplace of Marcus Garvey' },
  { name: 'Ocho Rios', type: 'town', parish: 'St. Ann', description: 'Major tourism centre and cruise port' },
  { name: "Brown's Town", type: 'town', parish: 'St. Ann' },
  { name: 'Discovery Bay', type: 'community', parish: 'St. Ann' },
  { name: 'Runaway Bay', type: 'community', parish: 'St. Ann' },
  { name: 'Claremont', type: 'community', parish: 'St. Ann' },
  { name: 'Moneague', type: 'community', parish: 'St. Ann' },
  { name: 'Priory', type: 'community', parish: 'St. Ann' },
  { name: 'Steer Town', type: 'community', parish: 'St. Ann' },
  { name: 'Alexandria', type: 'community', parish: 'St. Ann' },
  { name: 'Bamboo', type: 'community', parish: 'St. Ann' },
  { name: 'Epworth', type: 'community', parish: 'St. Ann' },
  { name: 'Bensonton', type: 'community', parish: 'St. Ann' },
  { name: 'Nine Mile', type: 'community', parish: 'St. Ann', description: 'Birthplace of Bob Marley' },

  // ── St. Mary ──────────────────────────────────────────────────────────
  { name: 'Port Maria', type: 'town', parish: 'St. Mary', population: 7600, description: 'Parish capital of St. Mary' },
  { name: 'Annotto Bay', type: 'town', parish: 'St. Mary' },
  { name: 'Highgate', type: 'town', parish: 'St. Mary' },
  { name: 'Oracabessa', type: 'town', parish: 'St. Mary', description: 'Inspired Ian Fleming\'s James Bond' },
  { name: 'Gayle', type: 'community', parish: 'St. Mary' },
  { name: 'Islington', type: 'community', parish: 'St. Mary' },
  { name: 'Castleton', type: 'community', parish: 'St. Mary', description: 'Castleton Botanical Gardens' },
  { name: 'Richmond', type: 'community', parish: 'St. Mary' },
  { name: 'Hampstead', type: 'community', parish: 'St. Mary' },
  { name: "Guy's Hill", type: 'community', parish: 'St. Mary' },
  { name: 'Retreat', type: 'community', parish: 'St. Mary' },
  { name: 'Whitehall', type: 'community', parish: 'St. Mary' },
  { name: 'Boscobel', type: 'community', parish: 'St. Mary' },

  // ── Portland ──────────────────────────────────────────────────────────
  { name: 'Port Antonio', type: 'town', parish: 'Portland', population: 14000, description: 'Parish capital, eco-tourism hub' },
  { name: 'Buff Bay', type: 'town', parish: 'Portland' },
  { name: 'Hope Bay', type: 'community', parish: 'Portland' },
  { name: 'Long Bay', type: 'community', parish: 'Portland' },
  { name: 'Boston', type: 'community', parish: 'Portland', description: 'Origin of jerk pork' },
  { name: 'Manchioneal', type: 'community', parish: 'Portland' },
  { name: 'Moore Town', type: 'community', parish: 'Portland', description: 'Windward Maroon heritage site' },
  { name: 'Fairy Hill', type: 'community', parish: 'Portland' },
  { name: 'San San', type: 'community', parish: 'Portland' },
  { name: 'Fellowship', type: 'community', parish: 'Portland' },
  { name: 'Orange Bay', type: 'community', parish: 'Portland' },
  { name: 'Drapers', type: 'community', parish: 'Portland' },
  { name: 'Swift River', type: 'community', parish: 'Portland' },
  { name: 'Nonsuch', type: 'community', parish: 'Portland' },

  // ── St. Thomas ────────────────────────────────────────────────────────
  { name: 'Morant Bay', type: 'town', parish: 'St. Thomas', population: 10000, description: 'Parish capital, Paul Bogle rebellion site' },
  { name: 'Yallahs', type: 'community', parish: 'St. Thomas' },
  { name: 'Bath', type: 'community', parish: 'St. Thomas', description: 'Natural hot springs and botanical garden' },
  { name: 'Seaforth', type: 'community', parish: 'St. Thomas' },
  { name: 'Golden Grove', type: 'community', parish: 'St. Thomas' },
  { name: 'Lyssons', type: 'community', parish: 'St. Thomas' },
  { name: 'Airy Castle', type: 'community', parish: 'St. Thomas' },
  { name: 'Cedar Valley', type: 'community', parish: 'St. Thomas' },
  { name: 'Port Morant', type: 'community', parish: 'St. Thomas' },
  { name: 'White Horses', type: 'community', parish: 'St. Thomas' },
  { name: 'Trinityville', type: 'community', parish: 'St. Thomas' },
  { name: 'Prospect', type: 'community', parish: 'St. Thomas' },
  { name: 'Retreat', type: 'community', parish: 'St. Thomas' },
  { name: 'Leith Hall', type: 'community', parish: 'St. Thomas' },
  { name: 'Dalvey', type: 'community', parish: 'St. Thomas' },
  { name: 'Pamphret', type: 'community', parish: 'St. Thomas' },
]) as Place[];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns every place in the directory.
 */
export function getPlaces(): Place[] {
  return [...PLACES];
}

/**
 * Returns all places belonging to the given parish (case-insensitive).
 */
export function getPlacesByParish(parish: string): Place[] {
  const normalised = parish.toLowerCase();
  return PLACES.filter((p) => p.parish.toLowerCase() === normalised);
}

/**
 * Returns all places of the given type.
 */
export function getPlacesByType(type: PlaceType): Place[] {
  return PLACES.filter((p) => p.type === type);
}

/**
 * Looks up a single place by exact name (case-insensitive).
 * Returns the first match or `null`.
 */
export function getPlace(name: string): Place | null {
  const normalised = name.toLowerCase();
  return PLACES.find((p) => p.name.toLowerCase() === normalised) ?? null;
}

/**
 * Returns all cities and towns (the major urban centres).
 */
export function getTowns(): Place[] {
  return PLACES.filter((p) => p.type === 'town' || p.type === 'city');
}

/**
 * Returns a list of community names within the specified parish.
 */
export function getCommunities(parish: string): string[] {
  const normalised = parish.toLowerCase();
  return PLACES
    .filter((p) => p.parish.toLowerCase() === normalised && p.type === 'community')
    .map((p) => p.name);
}

/**
 * Searches for places whose name contains the query string (case-insensitive).
 */
export function searchPlaces(query: string): Place[] {
  const normalised = query.toLowerCase();
  return PLACES.filter((p) => p.name.toLowerCase().includes(normalised));
}

/**
 * Returns the total number of places in the directory.
 */
export function getPlaceCount(): number {
  return PLACES.length;
}

/**
 * Returns a record mapping each parish name to its place count.
 */
export function getPlaceCountByParish(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const place of PLACES) {
    counts[place.parish] = (counts[place.parish] ?? 0) + 1;
  }
  return counts;
}
