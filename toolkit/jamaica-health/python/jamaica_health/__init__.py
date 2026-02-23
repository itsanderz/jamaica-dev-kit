"""Jamaica health facilities directory.

Hospitals, health centres, and regional health authorities.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Literal

__all__ = [
    # Types
    "FacilityType",
    "RegionId",
    "Coordinates",
    "HealthFacility",
    "RegionalHealthAuthority",
    # Functions
    "get_health_facilities",
    "get_hospitals",
    "get_health_centres",
    "get_health_facilities_by_parish",
    "get_hospitals_by_parish",
    "get_health_centres_by_parish",
    "get_health_facilities_by_region",
    "get_regional_authorities",
    "get_regional_authority",
    "search_health_facilities",
    "get_nearest_facility",
    "get_health_facility_count",
]

# ---------------------------------------------------------------------------
# Type aliases
# ---------------------------------------------------------------------------

FacilityType = Literal["hospital", "health-centre"]
RegionId = Literal["nerha", "wrha", "srha", "serha"]

# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class Coordinates:
    """Geographic coordinates (WGS-84)."""

    lat: float
    lng: float


@dataclass(frozen=True)
class HealthFacility:
    """A hospital or health centre in Jamaica."""

    name: str
    type: FacilityType
    parish: str
    region: RegionId
    address: str | None = None
    phone: str | None = None
    coordinates: Coordinates | None = None
    specialization: str | None = None


@dataclass(frozen=True)
class RegionalHealthAuthority:
    """One of Jamaica's four Regional Health Authorities."""

    id: RegionId
    name: str
    full_name: str
    parishes: tuple[str, ...]


# ---------------------------------------------------------------------------
# Regional Health Authorities
# ---------------------------------------------------------------------------

_REGIONAL_AUTHORITIES: tuple[RegionalHealthAuthority, ...] = (
    RegionalHealthAuthority(
        id="nerha",
        name="NERHA",
        full_name="North East Regional Health Authority",
        parishes=("St. Ann", "St. Mary", "Portland"),
    ),
    RegionalHealthAuthority(
        id="wrha",
        name="WRHA",
        full_name="Western Regional Health Authority",
        parishes=("St. James", "Trelawny", "Hanover", "Westmoreland"),
    ),
    RegionalHealthAuthority(
        id="srha",
        name="SRHA",
        full_name="Southern Regional Health Authority",
        parishes=("Clarendon", "Manchester", "St. Elizabeth", "St. Catherine"),
    ),
    RegionalHealthAuthority(
        id="serha",
        name="SERHA",
        full_name="South East Regional Health Authority",
        parishes=("Kingston", "St. Andrew", "St. Thomas"),
    ),
)

# ---------------------------------------------------------------------------
# Parish-to-region lookup
# ---------------------------------------------------------------------------

_PARISH_REGION_MAP: dict[str, RegionId] = {}
for _rha in _REGIONAL_AUTHORITIES:
    for _parish in _rha.parishes:
        _PARISH_REGION_MAP[_parish.lower()] = _rha.id


def _region_for_parish(parish: str) -> RegionId:
    key = parish.lower()
    if key not in _PARISH_REGION_MAP:
        raise ValueError(f"Unknown parish: {parish}")
    return _PARISH_REGION_MAP[key]


# ---------------------------------------------------------------------------
# Facility data
# ---------------------------------------------------------------------------

_FACILITIES: tuple[HealthFacility, ...] = (
    # ── Hospitals ────────────────────────────────────────────────────────
    # Kingston & St. Andrew (SERHA)
    HealthFacility(name="Kingston Public Hospital", type="hospital", parish="Kingston", region="serha", coordinates=Coordinates(18.0159, -76.7960)),
    HealthFacility(name="University Hospital of the West Indies", type="hospital", parish="St. Andrew", region="serha", coordinates=Coordinates(18.0060, -76.7484)),
    HealthFacility(name="Victoria Jubilee Hospital", type="hospital", parish="Kingston", region="serha", coordinates=Coordinates(18.0175, -76.7957), specialization="maternity"),
    HealthFacility(name="Bustamante Hospital for Children", type="hospital", parish="Kingston", region="serha", coordinates=Coordinates(18.0161, -76.7948)),
    HealthFacility(name="National Chest Hospital", type="hospital", parish="St. Andrew", region="serha", coordinates=Coordinates(18.0127, -76.7800)),
    HealthFacility(name="Bellevue Hospital", type="hospital", parish="Kingston", region="serha", coordinates=Coordinates(18.0082, -76.7718), specialization="psychiatric"),
    # St. Catherine (SRHA)
    HealthFacility(name="Spanish Town Hospital", type="hospital", parish="St. Catherine", region="srha", coordinates=Coordinates(18.0068, -76.9561)),
    HealthFacility(name="Linstead Public Hospital", type="hospital", parish="St. Catherine", region="srha", coordinates=Coordinates(18.1335, -77.0318)),
    # Clarendon (SRHA)
    HealthFacility(name="May Pen Hospital", type="hospital", parish="Clarendon", region="srha", coordinates=Coordinates(17.9600, -77.2450)),
    HealthFacility(name="Lionel Town Hospital", type="hospital", parish="Clarendon", region="srha", coordinates=Coordinates(17.8588, -77.1762)),
    # Manchester (SRHA)
    HealthFacility(name="Mandeville Regional Hospital", type="hospital", parish="Manchester", region="srha", coordinates=Coordinates(18.0440, -77.5090)),
    HealthFacility(name="Percy Junor Hospital", type="hospital", parish="Manchester", region="srha", coordinates=Coordinates(18.0860, -77.5240)),
    # St. Elizabeth (SRHA)
    HealthFacility(name="Black River Hospital", type="hospital", parish="St. Elizabeth", region="srha", coordinates=Coordinates(18.0223, -77.8494)),
    # St. James (WRHA)
    HealthFacility(name="Cornwall Regional Hospital", type="hospital", parish="St. James", region="wrha", coordinates=Coordinates(18.4640, -77.9200)),
    # Trelawny (WRHA)
    HealthFacility(name="Falmouth Hospital", type="hospital", parish="Trelawny", region="wrha", coordinates=Coordinates(18.4910, -77.6560)),
    # Hanover (WRHA)
    HealthFacility(name="Noel Holmes Hospital", type="hospital", parish="Hanover", region="wrha", coordinates=Coordinates(18.4515, -78.1662)),
    # Westmoreland (WRHA)
    HealthFacility(name="Savanna-la-Mar Hospital", type="hospital", parish="Westmoreland", region="wrha", coordinates=Coordinates(18.2170, -78.1300)),
    # St. Ann (NERHA)
    HealthFacility(name="St. Ann's Bay Regional Hospital", type="hospital", parish="St. Ann", region="nerha", coordinates=Coordinates(18.4360, -77.2010)),
    # St. Mary (NERHA)
    HealthFacility(name="Port Maria Hospital", type="hospital", parish="St. Mary", region="nerha", coordinates=Coordinates(18.3740, -76.8890)),
    HealthFacility(name="Annotto Bay Hospital", type="hospital", parish="St. Mary", region="nerha", coordinates=Coordinates(18.2750, -76.7690)),
    # Portland (NERHA)
    HealthFacility(name="Port Antonio Hospital", type="hospital", parish="Portland", region="nerha", coordinates=Coordinates(18.1790, -76.4520)),
    # St. Thomas (SERHA)
    HealthFacility(name="Princess Margaret Hospital", type="hospital", parish="St. Thomas", region="serha", coordinates=Coordinates(17.8860, -76.4160)),

    # ── Health Centres ───────────────────────────────────────────────────
    # Kingston
    HealthFacility(name="Comprehensive Health Centre", type="health-centre", parish="Kingston", region="serha"),
    HealthFacility(name="Windward Road Health Centre", type="health-centre", parish="Kingston", region="serha"),
    # St. Andrew
    HealthFacility(name="Hope Clinic", type="health-centre", parish="St. Andrew", region="serha"),
    HealthFacility(name="Half Way Tree Health Centre", type="health-centre", parish="St. Andrew", region="serha"),
    HealthFacility(name="Hagley Park Health Centre", type="health-centre", parish="St. Andrew", region="serha"),
    # St. Catherine
    HealthFacility(name="Portmore Health Centre", type="health-centre", parish="St. Catherine", region="srha"),
    HealthFacility(name="Old Harbour Health Centre", type="health-centre", parish="St. Catherine", region="srha"),
    HealthFacility(name="Bog Walk Health Centre", type="health-centre", parish="St. Catherine", region="srha"),
    # Clarendon
    HealthFacility(name="May Pen Health Centre", type="health-centre", parish="Clarendon", region="srha"),
    HealthFacility(name="Chapelton Health Centre", type="health-centre", parish="Clarendon", region="srha"),
    # Manchester
    HealthFacility(name="Mandeville Health Centre", type="health-centre", parish="Manchester", region="srha"),
    HealthFacility(name="Christiana Health Centre", type="health-centre", parish="Manchester", region="srha"),
    # St. Elizabeth
    HealthFacility(name="Black River Health Centre", type="health-centre", parish="St. Elizabeth", region="srha"),
    HealthFacility(name="Junction Health Centre", type="health-centre", parish="St. Elizabeth", region="srha"),
    HealthFacility(name="Santa Cruz Health Centre", type="health-centre", parish="St. Elizabeth", region="srha"),
    # Westmoreland
    HealthFacility(name="Savanna-la-Mar Health Centre", type="health-centre", parish="Westmoreland", region="wrha"),
    HealthFacility(name="Darliston Health Centre", type="health-centre", parish="Westmoreland", region="wrha"),
    # Hanover
    HealthFacility(name="Lucea Health Centre", type="health-centre", parish="Hanover", region="wrha"),
    HealthFacility(name="Sandy Bay Health Centre", type="health-centre", parish="Hanover", region="wrha"),
    # St. James
    HealthFacility(name="Montego Bay Health Centre", type="health-centre", parish="St. James", region="wrha"),
    HealthFacility(name="Granville Health Centre", type="health-centre", parish="St. James", region="wrha"),
    HealthFacility(name="Irwin Health Centre", type="health-centre", parish="St. James", region="wrha"),
    # Trelawny
    HealthFacility(name="Falmouth Health Centre", type="health-centre", parish="Trelawny", region="wrha"),
    HealthFacility(name="Clark's Town Health Centre", type="health-centre", parish="Trelawny", region="wrha"),
    # St. Ann
    HealthFacility(name="St. Ann's Bay Health Centre", type="health-centre", parish="St. Ann", region="nerha"),
    HealthFacility(name="Ocho Rios Health Centre", type="health-centre", parish="St. Ann", region="nerha"),
    HealthFacility(name="Brown's Town Health Centre", type="health-centre", parish="St. Ann", region="nerha"),
    # St. Mary
    HealthFacility(name="Port Maria Health Centre", type="health-centre", parish="St. Mary", region="nerha"),
    HealthFacility(name="Highgate Health Centre", type="health-centre", parish="St. Mary", region="nerha"),
    # Portland
    HealthFacility(name="Port Antonio Health Centre", type="health-centre", parish="Portland", region="nerha"),
    HealthFacility(name="Buff Bay Health Centre", type="health-centre", parish="Portland", region="nerha"),
    # St. Thomas
    HealthFacility(name="Morant Bay Health Centre", type="health-centre", parish="St. Thomas", region="serha"),
    HealthFacility(name="Yallahs Health Centre", type="health-centre", parish="St. Thomas", region="serha"),
)

# ---------------------------------------------------------------------------
# Haversine helper
# ---------------------------------------------------------------------------


def _haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Return the Haversine distance in kilometres between two points."""
    R = 6371.0  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def get_health_facilities() -> list[HealthFacility]:
    """Return all health facilities (hospitals and health centres)."""
    return list(_FACILITIES)


def get_hospitals() -> list[HealthFacility]:
    """Return all hospitals."""
    return [f for f in _FACILITIES if f.type == "hospital"]


def get_health_centres() -> list[HealthFacility]:
    """Return all health centres."""
    return [f for f in _FACILITIES if f.type == "health-centre"]


def get_health_facilities_by_parish(parish: str) -> list[HealthFacility]:
    """Return all health facilities in a given parish (case-insensitive)."""
    key = parish.lower()
    return [f for f in _FACILITIES if f.parish.lower() == key]


def get_hospitals_by_parish(parish: str) -> list[HealthFacility]:
    """Return all hospitals in a given parish (case-insensitive)."""
    key = parish.lower()
    return [f for f in _FACILITIES if f.type == "hospital" and f.parish.lower() == key]


def get_health_centres_by_parish(parish: str) -> list[HealthFacility]:
    """Return all health centres in a given parish (case-insensitive)."""
    key = parish.lower()
    return [f for f in _FACILITIES if f.type == "health-centre" and f.parish.lower() == key]


def get_health_facilities_by_region(region: RegionId) -> list[HealthFacility]:
    """Return all health facilities managed by a given regional health authority."""
    return [f for f in _FACILITIES if f.region == region]


def get_regional_authorities() -> list[RegionalHealthAuthority]:
    """Return all four Regional Health Authorities."""
    return list(_REGIONAL_AUTHORITIES)


def get_regional_authority(parish: str) -> RegionalHealthAuthority:
    """Given a parish name, return the Regional Health Authority that manages it.

    Raises ``ValueError`` if the parish is unknown.
    """
    region_id = _region_for_parish(parish)
    for rha in _REGIONAL_AUTHORITIES:
        if rha.id == region_id:
            return rha
    raise ValueError(f"No regional authority found for parish: {parish}")


def search_health_facilities(query: str) -> list[HealthFacility]:
    """Case-insensitive search for health facilities by name."""
    q = query.lower()
    return [f for f in _FACILITIES if q in f.name.lower()]


def get_nearest_facility(
    lat: float,
    lng: float,
    type: FacilityType | None = None,
) -> HealthFacility | None:
    """Find the nearest health facility to the given coordinates.

    Uses the Haversine formula.  Only considers facilities that have
    coordinates defined.  Optionally filter by facility type.
    """
    candidates = [f for f in _FACILITIES if f.coordinates is not None]
    if type is not None:
        candidates = [f for f in candidates if f.type == type]
    if not candidates:
        return None

    nearest = candidates[0]
    assert nearest.coordinates is not None
    min_dist = _haversine_distance(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng)

    for f in candidates[1:]:
        assert f.coordinates is not None
        d = _haversine_distance(lat, lng, f.coordinates.lat, f.coordinates.lng)
        if d < min_dist:
            min_dist = d
            nearest = f

    return nearest


def get_health_facility_count() -> int:
    """Return the total number of health facilities."""
    return len(_FACILITIES)
