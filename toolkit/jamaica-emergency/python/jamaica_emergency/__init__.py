"""Jamaica emergency services directory — police stations, fire stations, and disaster shelters."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

__all__ = [
    # Types
    "StationType",
    "EmergencyNumbers",
    "Station",
    "Shelter",
    # Functions
    "get_emergency_numbers",
    "get_police_stations",
    "get_police_stations_by_parish",
    "get_fire_stations",
    "get_fire_stations_by_parish",
    "get_stations",
    "get_stations_by_parish",
    "get_disaster_shelters",
    "get_shelters_by_parish",
    "search_stations",
    "search_shelters",
    "get_station_count",
    "get_shelter_count",
]

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------

StationType = Literal["police", "fire"]


@dataclass(frozen=True)
class EmergencyNumbers:
    """Jamaica emergency telephone numbers."""

    police: str
    ambulance: str
    fire: str
    disaster_preparedness: str
    coast_guard: str


@dataclass(frozen=True)
class Station:
    """A police or fire station."""

    name: str
    type: StationType
    parish: str
    division: str | None = None
    address: str | None = None
    phone: str | None = None


@dataclass(frozen=True)
class Shelter:
    """A disaster shelter (school, community centre, sports facility, etc.)."""

    name: str
    parish: str
    type: Literal["school", "community-centre", "sports-facility", "other"]
    capacity: int | None = None


# ---------------------------------------------------------------------------
# Data — Emergency Numbers
# ---------------------------------------------------------------------------

_EMERGENCY_NUMBERS = EmergencyNumbers(
    police="119",
    ambulance="110",
    fire="110",
    disaster_preparedness="116",
    coast_guard="(876) 967-8191",
)

# ---------------------------------------------------------------------------
# Data — Police Stations (Jamaica Constabulary Force)
# ---------------------------------------------------------------------------

_POLICE_STATIONS: tuple[Station, ...] = (
    # Area 1 — Kingston & St. Andrew
    Station(name="Half Way Tree Police Station", type="police", parish="St. Andrew", division="St. Andrew Central"),
    Station(name="Constant Spring Police Station", type="police", parish="St. Andrew", division="St. Andrew North"),
    Station(name="Matilda's Corner Police Station", type="police", parish="St. Andrew", division="St. Andrew South"),
    Station(name="Elletson Road Police Station", type="police", parish="Kingston", division="Kingston Central"),
    Station(name="Hunts Bay Police Station", type="police", parish="Kingston", division="Kingston Western"),
    Station(name="Rockfort Police Station", type="police", parish="Kingston", division="Kingston Eastern"),
    # Area 2 — St. Catherine & Clarendon
    Station(name="Spanish Town Police Station", type="police", parish="St. Catherine", division="St. Catherine North"),
    Station(name="Old Harbour Police Station", type="police", parish="St. Catherine", division="St. Catherine South"),
    Station(name="Portmore Police Station", type="police", parish="St. Catherine", division="St. Catherine South"),
    Station(name="May Pen Police Station", type="police", parish="Clarendon", division="Clarendon"),
    Station(name="Chapelton Police Station", type="police", parish="Clarendon", division="Clarendon"),
    # Area 3 — Manchester, St. Elizabeth, Westmoreland, Hanover
    Station(name="Mandeville Police Station", type="police", parish="Manchester", division="Manchester"),
    Station(name="Black River Police Station", type="police", parish="St. Elizabeth", division="St. Elizabeth"),
    Station(name="Savanna-la-Mar Police Station", type="police", parish="Westmoreland", division="Westmoreland"),
    Station(name="Lucea Police Station", type="police", parish="Hanover", division="Hanover"),
    # Area 4 — St. James, Trelawny
    Station(name="Montego Bay Police Station", type="police", parish="St. James", division="St. James"),
    Station(name="Freeport Police Station", type="police", parish="St. James", division="St. James"),
    Station(name="Falmouth Police Station", type="police", parish="Trelawny", division="Trelawny"),
    # Area 5 — St. Ann, St. Mary, Portland, St. Thomas
    Station(name="Ocho Rios Police Station", type="police", parish="St. Ann", division="St. Ann"),
    Station(name="St. Ann's Bay Police Station", type="police", parish="St. Ann", division="St. Ann"),
    Station(name="Port Maria Police Station", type="police", parish="St. Mary", division="St. Mary"),
    Station(name="Port Antonio Police Station", type="police", parish="Portland", division="Portland"),
    Station(name="Morant Bay Police Station", type="police", parish="St. Thomas", division="St. Thomas"),
)

# ---------------------------------------------------------------------------
# Data — Fire Stations (Jamaica Fire Brigade)
# ---------------------------------------------------------------------------

_FIRE_STATIONS: tuple[Station, ...] = (
    Station(name="York Park Fire Station", type="fire", parish="Kingston"),
    Station(name="Half Way Tree Fire Station", type="fire", parish="St. Andrew"),
    Station(name="Stony Hill Fire Station", type="fire", parish="St. Andrew"),
    Station(name="Spanish Town Fire Station", type="fire", parish="St. Catherine"),
    Station(name="Portmore Fire Station", type="fire", parish="St. Catherine"),
    Station(name="May Pen Fire Station", type="fire", parish="Clarendon"),
    Station(name="Mandeville Fire Station", type="fire", parish="Manchester"),
    Station(name="Black River Fire Station", type="fire", parish="St. Elizabeth"),
    Station(name="Savanna-la-Mar Fire Station", type="fire", parish="Westmoreland"),
    Station(name="Lucea Fire Station", type="fire", parish="Hanover"),
    Station(name="Montego Bay Fire Station", type="fire", parish="St. James"),
    Station(name="Falmouth Fire Station", type="fire", parish="Trelawny"),
    Station(name="St. Ann's Bay Fire Station", type="fire", parish="St. Ann"),
    Station(name="Ocho Rios Fire Station", type="fire", parish="St. Ann"),
    Station(name="Port Maria Fire Station", type="fire", parish="St. Mary"),
    Station(name="Port Antonio Fire Station", type="fire", parish="Portland"),
    Station(name="Morant Bay Fire Station", type="fire", parish="St. Thomas"),
)

# ---------------------------------------------------------------------------
# Data — Disaster Shelters
# ---------------------------------------------------------------------------

_DISASTER_SHELTERS: tuple[Shelter, ...] = (
    Shelter(name="National Arena", parish="Kingston", type="sports-facility"),
    Shelter(name="National Indoor Sports Centre", parish="Kingston", type="sports-facility"),
    Shelter(name="Excelsior High School", parish="St. Andrew", type="school"),
    Shelter(name="Wolmer's Boys' School", parish="Kingston", type="school"),
    Shelter(name="Spanish Town High School", parish="St. Catherine", type="school"),
    Shelter(name="Portmore Community Centre", parish="St. Catherine", type="community-centre"),
    Shelter(name="May Pen High School", parish="Clarendon", type="school"),
    Shelter(name="Mandeville Primary School", parish="Manchester", type="school"),
    Shelter(name="Black River High School", parish="St. Elizabeth", type="school"),
    Shelter(name="Manning's School", parish="Westmoreland", type="school"),
    Shelter(name="Rusea's High School", parish="Hanover", type="school"),
    Shelter(name="Cornwall College", parish="St. James", type="school"),
    Shelter(name="Falmouth All-Age School", parish="Trelawny", type="school"),
    Shelter(name="St. Hilda's High School", parish="St. Ann", type="school"),
    Shelter(name="Port Maria Civic Centre", parish="St. Mary", type="community-centre"),
    Shelter(name="Titchfield High School", parish="Portland", type="school"),
    Shelter(name="Morant Bay High School", parish="St. Thomas", type="school"),
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _normalise(s: str) -> str:
    return s.lower().strip()


def _match_parish(parish: str, target: str) -> bool:
    return _normalise(parish) == _normalise(target)


def _match_query(text: str, query: str) -> bool:
    return _normalise(query) in _normalise(text)


# ---------------------------------------------------------------------------
# Public API — Emergency Numbers
# ---------------------------------------------------------------------------


def get_emergency_numbers() -> EmergencyNumbers:
    """Return Jamaica's emergency telephone numbers."""
    return _EMERGENCY_NUMBERS


# ---------------------------------------------------------------------------
# Public API — Police Stations
# ---------------------------------------------------------------------------


def get_police_stations() -> list[Station]:
    """Return all police stations."""
    return list(_POLICE_STATIONS)


def get_police_stations_by_parish(parish: str) -> list[Station]:
    """Return police stations in *parish* (case-insensitive)."""
    return [s for s in _POLICE_STATIONS if _match_parish(s.parish, parish)]


# ---------------------------------------------------------------------------
# Public API — Fire Stations
# ---------------------------------------------------------------------------


def get_fire_stations() -> list[Station]:
    """Return all fire stations."""
    return list(_FIRE_STATIONS)


def get_fire_stations_by_parish(parish: str) -> list[Station]:
    """Return fire stations in *parish* (case-insensitive)."""
    return [s for s in _FIRE_STATIONS if _match_parish(s.parish, parish)]


# ---------------------------------------------------------------------------
# Public API — All Stations (police + fire)
# ---------------------------------------------------------------------------


def get_stations() -> list[Station]:
    """Return all police and fire stations."""
    return list(_POLICE_STATIONS) + list(_FIRE_STATIONS)


def get_stations_by_parish(parish: str) -> list[Station]:
    """Return all police and fire stations in *parish* (case-insensitive)."""
    return get_police_stations_by_parish(parish) + get_fire_stations_by_parish(parish)


# ---------------------------------------------------------------------------
# Public API — Disaster Shelters
# ---------------------------------------------------------------------------


def get_disaster_shelters() -> list[Shelter]:
    """Return all disaster shelters."""
    return list(_DISASTER_SHELTERS)


def get_shelters_by_parish(parish: str) -> list[Shelter]:
    """Return disaster shelters in *parish* (case-insensitive)."""
    return [s for s in _DISASTER_SHELTERS if _match_parish(s.parish, parish)]


# ---------------------------------------------------------------------------
# Public API — Search
# ---------------------------------------------------------------------------


def search_stations(query: str) -> list[Station]:
    """Search all stations by name, parish, type, or division (case-insensitive)."""
    all_stations = list(_POLICE_STATIONS) + list(_FIRE_STATIONS)
    return [
        s
        for s in all_stations
        if _match_query(s.name, query)
        or _match_query(s.parish, query)
        or _match_query(s.type, query)
        or (s.division is not None and _match_query(s.division, query))
    ]


def search_shelters(query: str) -> list[Shelter]:
    """Search shelters by name, parish, or type (case-insensitive)."""
    return [
        s
        for s in _DISASTER_SHELTERS
        if _match_query(s.name, query)
        or _match_query(s.parish, query)
        or _match_query(s.type, query)
    ]


# ---------------------------------------------------------------------------
# Public API — Counts
# ---------------------------------------------------------------------------


def get_station_count() -> dict[str, int]:
    """Return counts of police stations, fire stations, and total."""
    return {
        "police": len(_POLICE_STATIONS),
        "fire": len(_FIRE_STATIONS),
        "total": len(_POLICE_STATIONS) + len(_FIRE_STATIONS),
    }


def get_shelter_count() -> int:
    """Return the number of disaster shelters."""
    return len(_DISASTER_SHELTERS)
