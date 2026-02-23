"""Jamaica Places Directory.

A comprehensive directory of cities, towns, communities, districts, and
villages across all 14 parishes of Jamaica.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

__all__ = [
    "PlaceType",
    "Place",
    "get_places",
    "get_places_by_parish",
    "get_places_by_type",
    "get_place",
    "get_towns",
    "get_communities",
    "search_places",
    "get_place_count",
    "get_place_count_by_parish",
]

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------

PlaceType = Literal["city", "town", "community", "district", "village"]


@dataclass(frozen=True, slots=True)
class Place:
    """A place in Jamaica."""

    name: str
    type: PlaceType
    parish: str
    population: int | None = None
    description: str | None = None


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------

_PLACES: tuple[Place, ...] = (
    # -- Kingston -------------------------------------------------------------
    Place("Kingston", "city", "Kingston", 89057, "Capital city of Jamaica"),
    Place("Downtown Kingston", "community", "Kingston", description="Historic commercial centre"),
    Place("New Kingston", "community", "Kingston", description="Financial and business district"),
    Place("Cross Roads", "community", "Kingston", description="Major intersection and commercial area"),
    Place("Rae Town", "community", "Kingston"),
    Place("Tivoli Gardens", "community", "Kingston"),
    Place("Denham Town", "community", "Kingston"),
    Place("Port Royal", "community", "Kingston", description="Historic port, former pirate capital"),
    Place("Bournemouth", "community", "Kingston"),
    Place("Rockfort", "community", "Kingston"),
    Place("Newport West", "community", "Kingston"),
    Place("Allman Town", "community", "Kingston"),
    Place("Jones Town", "community", "Kingston"),
    Place("Franklyn Town", "community", "Kingston"),
    Place("Vineyard Town", "community", "Kingston"),
    Place("Fletchers Land", "community", "Kingston"),
    Place("Hannah Town", "community", "Kingston"),

    # -- St. Andrew -----------------------------------------------------------
    Place("Half Way Tree", "town", "St. Andrew", 28000, "Commercial centre and transport hub"),
    Place("Liguanea", "community", "St. Andrew"),
    Place("Mona", "community", "St. Andrew", description="University of the West Indies campus area"),
    Place("Papine", "community", "St. Andrew"),
    Place("Constant Spring", "community", "St. Andrew"),
    Place("Cherry Gardens", "community", "St. Andrew"),
    Place("Stony Hill", "town", "St. Andrew"),
    Place("Red Hills", "community", "St. Andrew"),
    Place("August Town", "community", "St. Andrew"),
    Place("Gordon Town", "community", "St. Andrew"),
    Place("Barbican", "community", "St. Andrew"),
    Place("Hope Pastures", "community", "St. Andrew"),
    Place("Manor Park", "community", "St. Andrew"),
    Place("Norbrook", "community", "St. Andrew"),
    Place("Irish Town", "village", "St. Andrew"),
    Place("Meadowbrook", "community", "St. Andrew"),
    Place("Havendale", "community", "St. Andrew"),
    Place("Beverly Hills", "community", "St. Andrew"),
    Place("Golden Spring", "community", "St. Andrew"),

    # -- St. Catherine --------------------------------------------------------
    Place("Spanish Town", "town", "St. Catherine", 147152, "Former capital of Jamaica"),
    Place("Portmore", "town", "St. Catherine", 182000, "Largest dormitory city"),
    Place("Old Harbour", "town", "St. Catherine", 25000),
    Place("Linstead", "town", "St. Catherine", 30000),
    Place("Bog Walk", "town", "St. Catherine"),
    Place("Ewarton", "town", "St. Catherine"),
    Place("Caymanas", "community", "St. Catherine"),
    Place("Old Harbour Bay", "community", "St. Catherine"),
    Place("Gregory Park", "community", "St. Catherine"),
    Place("Waterford", "community", "St. Catherine"),
    Place("Central Village", "community", "St. Catherine"),
    Place("Twickenham Park", "community", "St. Catherine"),
    Place("Bridgeport", "community", "St. Catherine"),
    Place("Hellshire", "community", "St. Catherine"),
    Place("Point Hill", "community", "St. Catherine"),
    Place("Above Rocks", "community", "St. Catherine"),

    # -- Clarendon ------------------------------------------------------------
    Place("May Pen", "town", "Clarendon", 50000, "Parish capital of Clarendon"),
    Place("Chapelton", "town", "Clarendon"),
    Place("Lionel Town", "town", "Clarendon"),
    Place("Race Course", "community", "Clarendon"),
    Place("Frankfield", "community", "Clarendon"),
    Place("Hayes", "community", "Clarendon"),
    Place("Toll Gate", "community", "Clarendon"),
    Place("Rocky Point", "community", "Clarendon"),
    Place("Milk River", "village", "Clarendon"),
    Place("Four Paths", "community", "Clarendon"),
    Place("Spaldings", "community", "Clarendon"),
    Place("Mitchell Town", "community", "Clarendon"),
    Place("Denbigh", "community", "Clarendon", description="Home of the Denbigh Agricultural Show"),
    Place("Kellits", "community", "Clarendon"),

    # -- Manchester -----------------------------------------------------------
    Place("Mandeville", "town", "Manchester", 47000, "Parish capital, cool highland town"),
    Place("Christiana", "town", "Manchester"),
    Place("Porus", "town", "Manchester"),
    Place("Williamsfield", "community", "Manchester"),
    Place("Mile Gully", "community", "Manchester"),
    Place("Newport", "community", "Manchester"),
    Place("Walderston", "village", "Manchester"),
    Place("Spur Tree", "community", "Manchester"),
    Place("Hatfield", "community", "Manchester"),
    Place("Cross Keys", "community", "Manchester"),
    Place("Gutters", "community", "Manchester"),
    Place("Knockpatrick", "community", "Manchester"),
    Place("Mike Town", "community", "Manchester"),
    Place("Coleyville", "community", "Manchester"),

    # -- St. Elizabeth --------------------------------------------------------
    Place("Black River", "town", "St. Elizabeth", 4000, "Parish capital, Black River safari"),
    Place("Santa Cruz", "town", "St. Elizabeth"),
    Place("Junction", "town", "St. Elizabeth"),
    Place("Treasure Beach", "community", "St. Elizabeth", description="Eco-tourism destination"),
    Place("Malvern", "community", "St. Elizabeth"),
    Place("Lacovia", "community", "St. Elizabeth"),
    Place("Balaclava", "community", "St. Elizabeth"),
    Place("Appleton", "community", "St. Elizabeth", description="Appleton Estate rum distillery"),
    Place("Nain", "community", "St. Elizabeth"),
    Place("Middle Quarters", "community", "St. Elizabeth"),
    Place("Maggotty", "community", "St. Elizabeth"),
    Place("Siloah", "community", "St. Elizabeth"),
    Place("Mountainside", "community", "St. Elizabeth"),
    Place("Braes River", "community", "St. Elizabeth"),

    # -- Westmoreland ---------------------------------------------------------
    Place("Savanna-la-Mar", "town", "Westmoreland", 22000, "Parish capital of Westmoreland"),
    Place("Negril", "town", "Westmoreland", description="Major tourism centre, seven-mile beach"),
    Place("Whitehouse", "community", "Westmoreland"),
    Place("Bluefields", "community", "Westmoreland"),
    Place("Bethel Town", "community", "Westmoreland"),
    Place("Petersfield", "community", "Westmoreland"),
    Place("Frome", "community", "Westmoreland", description="Sugar estate and processing"),
    Place("Darliston", "community", "Westmoreland"),
    Place("Little London", "community", "Westmoreland"),
    Place("Grange Hill", "community", "Westmoreland"),
    Place("Ferris Cross", "community", "Westmoreland"),
    Place("Lenox Bigwoods", "community", "Westmoreland"),
    Place("New Hope", "community", "Westmoreland"),

    # -- Hanover --------------------------------------------------------------
    Place("Lucea", "town", "Hanover", 6000, "Parish capital of Hanover"),
    Place("Green Island", "town", "Hanover"),
    Place("Sandy Bay", "community", "Hanover"),
    Place("Hopewell", "community", "Hanover"),
    Place("Cousins Cove", "community", "Hanover"),
    Place("Cascade", "community", "Hanover"),
    Place("Askenish", "community", "Hanover"),
    Place("Kenilworth", "community", "Hanover"),
    Place("Jericho", "community", "Hanover"),
    Place("Dias", "community", "Hanover"),
    Place("Riverside", "community", "Hanover"),
    Place("Haughton Grove", "community", "Hanover"),

    # -- St. James ------------------------------------------------------------
    Place("Montego Bay", "town", "St. James", 110115, "Second city of Jamaica, tourism capital"),
    Place("Rose Hall", "community", "St. James", description="Great house and resort area"),
    Place("Ironshore", "community", "St. James"),
    Place("Catherine Hall", "community", "St. James"),
    Place("Granville", "community", "St. James"),
    Place("Reading", "community", "St. James"),
    Place("Cambridge", "community", "St. James"),
    Place("Anchovy", "community", "St. James"),
    Place("Adelphi", "community", "St. James"),
    Place("Barrett Town", "community", "St. James"),
    Place("Salt Spring", "community", "St. James"),
    Place("Montpelier", "community", "St. James"),
    Place("Lilliput", "community", "St. James"),

    # -- Trelawny -------------------------------------------------------------
    Place("Falmouth", "town", "Trelawny", 8000, "Parish capital, Georgian architecture, cruise port"),
    Place("Clark's Town", "community", "Trelawny"),
    Place("Duncans", "community", "Trelawny"),
    Place("Albert Town", "community", "Trelawny"),
    Place("Wait-a-Bit", "community", "Trelawny"),
    Place("Stewart Town", "community", "Trelawny"),
    Place("Rio Bueno", "community", "Trelawny"),
    Place("Troy", "community", "Trelawny"),
    Place("Warsop", "community", "Trelawny"),
    Place("Wakefield", "community", "Trelawny"),
    Place("Bunkers Hill", "community", "Trelawny"),
    Place("Ulster Spring", "community", "Trelawny"),
    Place("Sherwood Content", "community", "Trelawny", description="Birthplace of Usain Bolt"),

    # -- St. Ann --------------------------------------------------------------
    Place("St. Ann's Bay", "town", "St. Ann", 13000, "Parish capital, birthplace of Marcus Garvey"),
    Place("Ocho Rios", "town", "St. Ann", description="Major tourism centre and cruise port"),
    Place("Brown's Town", "town", "St. Ann"),
    Place("Discovery Bay", "community", "St. Ann"),
    Place("Runaway Bay", "community", "St. Ann"),
    Place("Claremont", "community", "St. Ann"),
    Place("Moneague", "community", "St. Ann"),
    Place("Priory", "community", "St. Ann"),
    Place("Steer Town", "community", "St. Ann"),
    Place("Alexandria", "community", "St. Ann"),
    Place("Bamboo", "community", "St. Ann"),
    Place("Epworth", "community", "St. Ann"),
    Place("Bensonton", "community", "St. Ann"),
    Place("Nine Mile", "community", "St. Ann", description="Birthplace of Bob Marley"),

    # -- St. Mary -------------------------------------------------------------
    Place("Port Maria", "town", "St. Mary", 7600, "Parish capital of St. Mary"),
    Place("Annotto Bay", "town", "St. Mary"),
    Place("Highgate", "town", "St. Mary"),
    Place("Oracabessa", "town", "St. Mary", description="Inspired Ian Fleming's James Bond"),
    Place("Gayle", "community", "St. Mary"),
    Place("Islington", "community", "St. Mary"),
    Place("Castleton", "community", "St. Mary", description="Castleton Botanical Gardens"),
    Place("Richmond", "community", "St. Mary"),
    Place("Hampstead", "community", "St. Mary"),
    Place("Guy's Hill", "community", "St. Mary"),
    Place("Retreat", "community", "St. Mary"),
    Place("Whitehall", "community", "St. Mary"),
    Place("Boscobel", "community", "St. Mary"),

    # -- Portland -------------------------------------------------------------
    Place("Port Antonio", "town", "Portland", 14000, "Parish capital, eco-tourism hub"),
    Place("Buff Bay", "town", "Portland"),
    Place("Hope Bay", "community", "Portland"),
    Place("Long Bay", "community", "Portland"),
    Place("Boston", "community", "Portland", description="Origin of jerk pork"),
    Place("Manchioneal", "community", "Portland"),
    Place("Moore Town", "community", "Portland", description="Windward Maroon heritage site"),
    Place("Fairy Hill", "community", "Portland"),
    Place("San San", "community", "Portland"),
    Place("Fellowship", "community", "Portland"),
    Place("Orange Bay", "community", "Portland"),
    Place("Drapers", "community", "Portland"),
    Place("Swift River", "community", "Portland"),
    Place("Nonsuch", "community", "Portland"),

    # -- St. Thomas -----------------------------------------------------------
    Place("Morant Bay", "town", "St. Thomas", 10000, "Parish capital, Paul Bogle rebellion site"),
    Place("Yallahs", "community", "St. Thomas"),
    Place("Bath", "community", "St. Thomas", description="Natural hot springs and botanical garden"),
    Place("Seaforth", "community", "St. Thomas"),
    Place("Golden Grove", "community", "St. Thomas"),
    Place("Lyssons", "community", "St. Thomas"),
    Place("Airy Castle", "community", "St. Thomas"),
    Place("Cedar Valley", "community", "St. Thomas"),
    Place("Port Morant", "community", "St. Thomas"),
    Place("White Horses", "community", "St. Thomas"),
    Place("Trinityville", "community", "St. Thomas"),
    Place("Prospect", "community", "St. Thomas"),
    Place("Retreat", "community", "St. Thomas"),
    Place("Leith Hall", "community", "St. Thomas"),
    Place("Dalvey", "community", "St. Thomas"),
    Place("Pamphret", "community", "St. Thomas"),
)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def get_places() -> list[Place]:
    """Return every place in the directory."""
    return list(_PLACES)


def get_places_by_parish(parish: str) -> list[Place]:
    """Return all places belonging to the given parish (case-insensitive)."""
    normalised = parish.lower()
    return [p for p in _PLACES if p.parish.lower() == normalised]


def get_places_by_type(place_type: PlaceType) -> list[Place]:
    """Return all places of the given type."""
    return [p for p in _PLACES if p.type == place_type]


def get_place(name: str) -> Place | None:
    """Look up a single place by exact name (case-insensitive).

    Returns the first match or ``None``.
    """
    normalised = name.lower()
    for p in _PLACES:
        if p.name.lower() == normalised:
            return p
    return None


def get_towns() -> list[Place]:
    """Return all cities and towns (the major urban centres)."""
    return [p for p in _PLACES if p.type in ("town", "city")]


def get_communities(parish: str) -> list[str]:
    """Return a list of community names within the specified parish."""
    normalised = parish.lower()
    return [
        p.name
        for p in _PLACES
        if p.parish.lower() == normalised and p.type == "community"
    ]


def search_places(query: str) -> list[Place]:
    """Search for places whose name contains the query (case-insensitive)."""
    normalised = query.lower()
    return [p for p in _PLACES if normalised in p.name.lower()]


def get_place_count() -> int:
    """Return the total number of places in the directory."""
    return len(_PLACES)


def get_place_count_by_parish() -> dict[str, int]:
    """Return a mapping of each parish name to its place count."""
    counts: dict[str, int] = {}
    for place in _PLACES:
        counts[place.parish] = counts.get(place.parish, 0) + 1
    return counts
