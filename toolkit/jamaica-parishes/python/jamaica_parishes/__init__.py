"""
Jamaica Parishes Toolkit

Provides data for Jamaica's 14 parishes including names, codes, populations,
coordinates, service center availability, and utility functions for distance
calculations and lookups.
"""

from __future__ import annotations

import math
import re
from dataclasses import dataclass, field
from typing import Literal


# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------

ServiceType = Literal["nla", "taj", "pica", "coj"]

ParishCode = Literal[
    "KIN", "SAN", "SCA", "CLA", "MAN", "SEL", "WES", "HAN",
    "SJA", "TRE", "SAN2", "SMA", "POR", "STH",
]


@dataclass(frozen=True)
class Coordinates:
    lat: float
    lng: float


@dataclass(frozen=True)
class Internet:
    broadband_level: str
    fibre_connected: bool
    usf_hotspots: bool
    providers: tuple[str, ...]


@dataclass(frozen=True)
class MobileCoverage:
    flow_4g: bool
    digicel_4g: bool
    quality: str


@dataclass(frozen=True)
class ServiceCenter:
    nla: bool
    taj: bool
    pica: bool
    coj: bool
    taj_offices: int
    nla_distance_km: int
    pica_distance_km: int


@dataclass(frozen=True)
class Parish:
    name: str
    code: str
    capital: str
    population: int
    area_km2: int
    density_per_km2: float
    urban_pct: int
    coordinates: Coordinates
    internet: Internet
    mobile_coverage: MobileCoverage
    service_centers: ServiceCenter
    economy: tuple[str, ...]
    bpo_presence: str
    financial_inclusion: str
    hurricane_melissa_damage: str
    hospitals: tuple[str, ...]


# ---------------------------------------------------------------------------
# Embedded parish data
# ---------------------------------------------------------------------------

_PARISHES: tuple[Parish, ...] = (
    Parish(
        name="Kingston",
        code="KIN",
        capital="Kingston",
        population=89186,
        area_km2=22,
        density_per_km2=4054.8,
        urban_pct=100,
        coordinates=Coordinates(lat=17.9714, lng=-76.7920),
        internet=Internet(
            broadband_level="highest",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="excellent"),
        service_centers=ServiceCenter(
            nla=True, taj=True, pica=True, coj=True,
            taj_offices=6, nla_distance_km=0, pica_distance_km=0,
        ),
        economy=("government", "financial_services", "port", "bpo", "professional_services", "tourism"),
        bpo_presence="major",
        financial_inclusion="highest",
        hurricane_melissa_damage="low-moderate",
        hospitals=("Kingston Public Hospital", "UHWI", "Victoria Jubilee Hospital", "Bustamante Hospital for Children"),
    ),
    Parish(
        name="St. Andrew",
        code="SAN",
        capital="Half Way Tree",
        population=583718,
        area_km2=435,
        density_per_km2=1341.2,
        urban_pct=90,
        coordinates=Coordinates(lat=18.0179, lng=-76.7674),
        internet=Internet(
            broadband_level="very_high",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="excellent"),
        service_centers=ServiceCenter(
            nla=True, taj=True, pica=True, coj=True,
            taj_offices=2, nla_distance_km=0, pica_distance_km=0,
        ),
        economy=("commercial_hub", "banking", "university", "tech_startups", "retail"),
        bpo_presence="major",
        financial_inclusion="very_high",
        hurricane_melissa_damage="low-moderate",
        hospitals=("UHWI",),
    ),
    Parish(
        name="St. Catherine",
        code="SCA",
        capital="Spanish Town",
        population=542763,
        area_km2=1194,
        density_per_km2=454.8,
        urban_pct=71,
        coordinates=Coordinates(lat=18.0092, lng=-76.9540),
        internet=Internet(
            broadband_level="high",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="good"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=True, coj=True,
            taj_offices=4, nla_distance_km=14, pica_distance_km=0,
        ),
        economy=("government_services", "dormitory_suburb", "agriculture", "manufacturing", "bpo"),
        bpo_presence="emerging",
        financial_inclusion="good",
        hurricane_melissa_damage="moderate",
        hospitals=("Spanish Town Hospital", "Linstead Hospital"),
    ),
    Parish(
        name="Clarendon",
        code="CLA",
        capital="May Pen",
        population=258643,
        area_km2=1198,
        density_per_km2=215.8,
        urban_pct=30,
        coordinates=Coordinates(lat=17.9613, lng=-77.2386),
        internet=Internet(
            broadband_level="moderate",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="moderate"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=True, coj=True,
            taj_offices=3, nla_distance_km=60, pica_distance_km=0,
        ),
        economy=("agriculture", "bauxite_mining", "government_services", "commerce"),
        bpo_presence="minimal",
        financial_inclusion="moderate",
        hurricane_melissa_damage="moderate",
        hospitals=("May Pen Hospital", "Lionel Town Hospital"),
    ),
    Parish(
        name="Manchester",
        code="MAN",
        capital="Mandeville",
        population=193694,
        area_km2=837,
        density_per_km2=231.3,
        urban_pct=50,
        coordinates=Coordinates(lat=18.0418, lng=-77.5050),
        internet=Internet(
            broadband_level="moderate_high",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="good"),
        service_centers=ServiceCenter(
            nla=True, taj=True, pica=True, coj=True,
            taj_offices=2, nla_distance_km=0, pica_distance_km=0,
        ),
        economy=("bauxite_alumina", "agriculture", "bpo", "education", "professional_services"),
        bpo_presence="emerging",
        financial_inclusion="good",
        hurricane_melissa_damage="moderate-severe",
        hospitals=("Mandeville Hospital", "Hargreaves Memorial Hospital", "Percy Junior Hospital"),
    ),
    Parish(
        name="St. Elizabeth",
        code="SEL",
        capital="Black River",
        population=153201,
        area_km2=1204,
        density_per_km2=127.3,
        urban_pct=30,
        coordinates=Coordinates(lat=18.0069, lng=-77.7586),
        internet=Internet(
            broadband_level="low",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="poor_to_moderate"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=True, coj=True,
            taj_offices=2, nla_distance_km=45, pica_distance_km=0,
        ),
        economy=("agriculture", "bauxite", "tourism", "fishing"),
        bpo_presence="none",
        financial_inclusion="low",
        hurricane_melissa_damage="severe",
        hospitals=("Black River Hospital",),
    ),
    Parish(
        name="Westmoreland",
        code="WES",
        capital="Savanna-la-Mar",
        population=148627,
        area_km2=807,
        density_per_km2=184.2,
        urban_pct=35,
        coordinates=Coordinates(lat=18.2117, lng=-78.1339),
        internet=Internet(
            broadband_level="moderate",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="good"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=True, coj=True,
            taj_offices=2, nla_distance_km=80, pica_distance_km=0,
        ),
        economy=("tourism", "agriculture", "sugar", "fishing"),
        bpo_presence="minimal",
        financial_inclusion="moderate",
        hurricane_melissa_damage="catastrophic",
        hospitals=("Savanna-la-Mar Hospital",),
    ),
    Parish(
        name="Hanover",
        code="HAN",
        capital="Lucea",
        population=71074,
        area_km2=449,
        density_per_km2=158.3,
        urban_pct=25,
        coordinates=Coordinates(lat=18.4508, lng=-78.1702),
        internet=Internet(
            broadband_level="moderate",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="good"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=False, coj=True,
            taj_offices=1, nla_distance_km=30, pica_distance_km=30,
        ),
        economy=("tourism", "agriculture", "sugar"),
        bpo_presence="none",
        financial_inclusion="low",
        hurricane_melissa_damage="catastrophic",
        hospitals=("Noel Holmes Hospital",),
    ),
    Parish(
        name="St. James",
        code="SJA",
        capital="Montego Bay",
        population=193322,
        area_km2=595,
        density_per_km2=324.9,
        urban_pct=65,
        coordinates=Coordinates(lat=18.4762, lng=-77.9236),
        internet=Internet(
            broadband_level="high",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="excellent"),
        service_centers=ServiceCenter(
            nla=True, taj=True, pica=True, coj=True,
            taj_offices=2, nla_distance_km=0, pica_distance_km=0,
        ),
        economy=("tourism", "bpo", "port", "retail", "financial_services"),
        bpo_presence="major",
        financial_inclusion="good",
        hurricane_melissa_damage="severe",
        hospitals=("Cornwall Regional Hospital",),
    ),
    Parish(
        name="Trelawny",
        code="TRE",
        capital="Falmouth",
        population=79374,
        area_km2=875,
        density_per_km2=90.7,
        urban_pct=25,
        coordinates=Coordinates(lat=18.4944, lng=-77.6553),
        internet=Internet(
            broadband_level="moderate",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="moderate"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=False, coj=True,
            taj_offices=1, nla_distance_km=30, pica_distance_km=30,
        ),
        economy=("tourism", "agriculture", "cruise_port"),
        bpo_presence="none",
        financial_inclusion="low",
        hurricane_melissa_damage="severe",
        hospitals=("Falmouth Hospital",),
    ),
    Parish(
        name="St. Ann",
        code="SAN2",
        capital="St. Ann's Bay",
        population=182808,
        area_km2=1213,
        density_per_km2=150.7,
        urban_pct=40,
        coordinates=Coordinates(lat=18.4325, lng=-77.2006),
        internet=Internet(
            broadband_level="moderate",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="good"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=True, coj=True,
            taj_offices=2, nla_distance_km=50, pica_distance_km=0,
        ),
        economy=("tourism", "agriculture", "bauxite", "retail"),
        bpo_presence="minimal",
        financial_inclusion="moderate",
        hurricane_melissa_damage="moderate-severe",
        hospitals=("St. Ann's Bay Hospital",),
    ),
    Parish(
        name="St. Mary",
        code="SMA",
        capital="Port Maria",
        population=118760,
        area_km2=611,
        density_per_km2=194.4,
        urban_pct=30,
        coordinates=Coordinates(lat=18.3697, lng=-76.9167),
        internet=Internet(
            broadband_level="low_moderate",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="moderate"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=False, coj=True,
            taj_offices=1, nla_distance_km=60, pica_distance_km=50,
        ),
        economy=("agriculture", "tourism", "fishing"),
        bpo_presence="none",
        financial_inclusion="low",
        hurricane_melissa_damage="moderate",
        hospitals=("Port Maria Hospital", "Annotto Bay Hospital"),
    ),
    Parish(
        name="Portland",
        code="POR",
        capital="Port Antonio",
        population=83374,
        area_km2=814,
        density_per_km2=102.4,
        urban_pct=25,
        coordinates=Coordinates(lat=18.1789, lng=-76.4506),
        internet=Internet(
            broadband_level="low",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="moderate"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=False, coj=True,
            taj_offices=1, nla_distance_km=100, pica_distance_km=100,
        ),
        economy=("agriculture", "tourism", "fishing"),
        bpo_presence="none",
        financial_inclusion="low",
        hurricane_melissa_damage="severe",
        hospitals=("Port Antonio Hospital",),
    ),
    Parish(
        name="St. Thomas",
        code="STH",
        capital="Morant Bay",
        population=97994,
        area_km2=743,
        density_per_km2=131.9,
        urban_pct=25,
        coordinates=Coordinates(lat=17.8883, lng=-76.3508),
        internet=Internet(
            broadband_level="low",
            fibre_connected=True,
            usf_hotspots=True,
            providers=("Flow", "Digicel"),
        ),
        mobile_coverage=MobileCoverage(flow_4g=True, digicel_4g=True, quality="moderate"),
        service_centers=ServiceCenter(
            nla=False, taj=True, pica=False, coj=True,
            taj_offices=1, nla_distance_km=50, pica_distance_km=50,
        ),
        economy=("agriculture", "fishing", "light_manufacturing"),
        bpo_presence="none",
        financial_inclusion="lowest",
        hurricane_melissa_damage="moderate-severe",
        hospitals=("Princess Margaret Hospital",),
    ),
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

PARISH_CODES: tuple[str, ...] = (
    "KIN", "SAN", "SCA", "CLA", "MAN", "SEL", "WES", "HAN",
    "SJA", "TRE", "SAN2", "SMA", "POR", "STH",
)

# Pre-built lookup dicts for O(1) access
_by_code: dict[str, Parish] = {p.code: p for p in _PARISHES}
_by_name_normalized: dict[str, Parish] = {}


def _normalize_name(name: str) -> str:
    """
    Normalize a parish name for fuzzy matching.
    Handles "St." vs "Saint", case, and extra whitespace.
    """
    s = name.lower()
    s = re.sub(r"\bsaint\b", "st.", s)
    s = re.sub(r"\bst\b(?!\.)", "st.", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


# Build the normalized-name lookup
for _p in _PARISHES:
    _by_name_normalized[_normalize_name(_p.name)] = _p


def _to_rad(deg: float) -> float:
    """Convert degrees to radians."""
    return deg * math.pi / 180.0


def _haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Haversine distance between two lat/lng points.
    Returns distance in kilometres.
    """
    R = 6371.0  # Earth radius in km
    d_lat = _to_rad(lat2 - lat1)
    d_lng = _to_rad(lng2 - lng1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(_to_rad(lat1)) * math.cos(_to_rad(lat2)) * math.sin(d_lng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def get_all_parishes() -> list[Parish]:
    """Return a copy of the full parish list."""
    return list(_PARISHES)


def get_parish(code: str) -> Parish | None:
    """Look up a parish by its code (case-insensitive)."""
    return _by_code.get(code.upper())


def get_parish_by_name(name: str) -> Parish | None:
    """
    Fuzzy lookup by parish name.
    Handles "St." vs "Saint", case differences, etc.
    """
    return _by_name_normalized.get(_normalize_name(name))


def get_parishes_with_service(service: ServiceType) -> list[Parish]:
    """Return all parishes that have a given government service center."""
    return [p for p in _PARISHES if getattr(p.service_centers, service)]


def get_distance_km(from_code: str, to_code: str) -> float:
    """
    Compute the haversine (great-circle) distance in km between two parishes
    identified by their codes.

    Raises ValueError if either code is invalid.
    """
    a = _by_code.get(from_code.upper())
    b = _by_code.get(to_code.upper())
    if a is None:
        raise ValueError(f"Unknown parish code: {from_code}")
    if b is None:
        raise ValueError(f"Unknown parish code: {to_code}")
    return _haversine(
        a.coordinates.lat, a.coordinates.lng,
        b.coordinates.lat, b.coordinates.lng,
    )


def get_nearest_parish_with_nla(code: str) -> dict[str, Parish | float]:
    """
    Find the nearest parish that has an NLA (National Land Agency) office,
    measured by haversine distance from the given parish code.

    Returns a dict with keys 'parish' (Parish) and 'distance_km' (float).
    Raises ValueError if the code is invalid.
    """
    origin = _by_code.get(code.upper())
    if origin is None:
        raise ValueError(f"Unknown parish code: {code}")

    nla_parishes = [p for p in _PARISHES if p.service_centers.nla]

    nearest = nla_parishes[0]
    min_dist = _haversine(
        origin.coordinates.lat, origin.coordinates.lng,
        nearest.coordinates.lat, nearest.coordinates.lng,
    )

    for p in nla_parishes[1:]:
        d = _haversine(
            origin.coordinates.lat, origin.coordinates.lng,
            p.coordinates.lat, p.coordinates.lng,
        )
        if d < min_dist:
            min_dist = d
            nearest = p

    return {"parish": nearest, "distance_km": min_dist}


def get_total_population() -> int:
    """Sum of all parish populations (2022 census)."""
    return sum(p.population for p in _PARISHES)


__all__ = [
    # Types / dataclasses
    "Parish",
    "ParishCode",
    "ServiceCenter",
    "ServiceType",
    "Coordinates",
    "Internet",
    "MobileCoverage",
    # Constants
    "PARISH_CODES",
    # Functions
    "get_all_parishes",
    "get_parish",
    "get_parish_by_name",
    "get_parishes_with_service",
    "get_distance_km",
    "get_nearest_parish_with_nla",
    "get_total_population",
]
