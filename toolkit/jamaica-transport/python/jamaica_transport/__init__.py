"""Jamaica transport infrastructure — airports, seaports, vehicle classifications, and road network."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

__all__ = [
    # Types
    "Coordinates",
    "AirportType",
    "SeaportType",
    "HighwayStatus",
    "Airport",
    "Seaport",
    "VehicleClass",
    "Highway",
    "RoadNetwork",
    "LicencePlatePrefix",
    # Functions — Airports
    "get_airports",
    "get_airport",
    "get_international_airports",
    "get_domestic_airports",
    "search_airports",
    # Functions — Seaports
    "get_seaports",
    "get_seaport",
    # Functions — Vehicle Classes
    "get_vehicle_classes",
    "get_vehicle_class",
    # Functions — Road Network
    "get_road_network",
    "get_highways",
    # Functions — Licence Plates
    "get_licence_plate_prefixes",
]

# ---------------------------------------------------------------------------
# Type aliases
# ---------------------------------------------------------------------------

AirportType = Literal["international", "domestic"]
SeaportType = Literal["cargo", "cruise", "cruise/cargo", "fishing/cargo"]
HighwayStatus = Literal["operational", "toll", "proposed"]

# ---------------------------------------------------------------------------
# Dataclasses
# ---------------------------------------------------------------------------


@dataclass(frozen=True, slots=True)
class Coordinates:
    """Geographic coordinates (WGS-84)."""

    lat: float
    lng: float


@dataclass(frozen=True, slots=True)
class Airport:
    """A Jamaican airport or aerodrome."""

    name: str
    iata: str
    icao: str
    parish: str
    type: AirportType
    coordinates: Coordinates


@dataclass(frozen=True, slots=True)
class Seaport:
    """A Jamaican seaport."""

    name: str
    parish: str
    type: SeaportType
    operator: str | None = None


@dataclass(frozen=True, slots=True)
class VehicleClass:
    """A vehicle classification for registration and insurance."""

    code: str
    name: str
    description: str
    plate_prefix: str | None = None


@dataclass(frozen=True, slots=True)
class Highway:
    """A major highway in Jamaica."""

    name: str
    segments: tuple[str, ...]
    total_km: int
    status: HighwayStatus


@dataclass(frozen=True, slots=True)
class RoadNetwork:
    """Summary of Jamaica's road network."""

    total_km: int
    paved_km: int
    unpaved_km: int
    main_roads_km: int
    parochial_roads_km: int
    highways: tuple[Highway, ...]


@dataclass(frozen=True, slots=True)
class LicencePlatePrefix:
    """A licence plate prefix and its associated vehicle type."""

    prefix: str
    vehicle_type: str
    description: str


# ---------------------------------------------------------------------------
# Data — Airports
# ---------------------------------------------------------------------------

_AIRPORTS: tuple[Airport, ...] = (
    Airport(
        name="Norman Manley International Airport",
        iata="KIN",
        icao="MKJP",
        parish="Kingston",
        type="international",
        coordinates=Coordinates(lat=17.9357, lng=-76.7875),
    ),
    Airport(
        name="Sangster International Airport",
        iata="MBJ",
        icao="MKJS",
        parish="St. James",
        type="international",
        coordinates=Coordinates(lat=18.5037, lng=-77.9133),
    ),
    Airport(
        name="Ian Fleming International Airport",
        iata="OCJ",
        icao="MKBS",
        parish="St. Mary",
        type="international",
        coordinates=Coordinates(lat=18.4042, lng=-76.9690),
    ),
    Airport(
        name="Tinson Pen Aerodrome",
        iata="KTP",
        icao="MKTP",
        parish="Kingston",
        type="domestic",
        coordinates=Coordinates(lat=17.9886, lng=-76.8238),
    ),
    Airport(
        name="Ken Jones Aerodrome",
        iata="POT",
        icao="MKKJ",
        parish="Portland",
        type="domestic",
        coordinates=Coordinates(lat=18.1988, lng=-76.5345),
    ),
    Airport(
        name="Negril Aerodrome",
        iata="NEG",
        icao="MKNG",
        parish="Westmoreland",
        type="domestic",
        coordinates=Coordinates(lat=18.3428, lng=-78.3321),
    ),
)

# ---------------------------------------------------------------------------
# Data — Seaports
# ---------------------------------------------------------------------------

_SEAPORTS: tuple[Seaport, ...] = (
    Seaport(
        name="Kingston Container Terminal",
        parish="Kingston",
        type="cargo",
        operator="Kingston Freeport Terminal Limited",
    ),
    Seaport(
        name="Port of Montego Bay",
        parish="St. James",
        type="cruise/cargo",
    ),
    Seaport(
        name="Port of Ocho Rios",
        parish="St. Ann",
        type="cruise",
    ),
    Seaport(
        name="Port of Falmouth",
        parish="Trelawny",
        type="cruise",
    ),
    Seaport(
        name="Port of Port Antonio",
        parish="Portland",
        type="cargo",
    ),
    Seaport(
        name="Rocky Point",
        parish="Clarendon",
        type="fishing/cargo",
    ),
)

# ---------------------------------------------------------------------------
# Data — Vehicle Classifications
# ---------------------------------------------------------------------------

_VEHICLE_CLASSES: tuple[VehicleClass, ...] = (
    VehicleClass(
        code="PMC",
        name="Private Motor Car",
        description="Privately owned motor car for personal use",
        plate_prefix=None,
    ),
    VehicleClass(
        code="CMC",
        name="Commercial Motor Car",
        description="Taxi, hire car, or other commercial passenger vehicle",
        plate_prefix="PP",
    ),
    VehicleClass(
        code="MC",
        name="Motorcycle",
        description="Two-wheeled motorized vehicle",
        plate_prefix="MC",
    ),
    VehicleClass(
        code="MT",
        name="Motor Truck",
        description="Goods vehicle used for transporting cargo",
        plate_prefix="C",
    ),
    VehicleClass(
        code="MB",
        name="Motor Bus",
        description="Route taxi, minibus, or bus for public transportation",
        plate_prefix="PP",
    ),
    VehicleClass(
        code="TR",
        name="Trailer",
        description="Non-motorized vehicle towed by a motor vehicle",
        plate_prefix="C",
    ),
    VehicleClass(
        code="AV",
        name="Agricultural Vehicle",
        description="Vehicle used primarily for agricultural purposes",
        plate_prefix=None,
    ),
    VehicleClass(
        code="SPV",
        name="Special Purpose Vehicle",
        description="Vehicle designed for a specific non-standard purpose",
        plate_prefix=None,
    ),
    VehicleClass(
        code="GV",
        name="Government Vehicle",
        description="Vehicle owned and operated by the Government of Jamaica",
        plate_prefix="G",
    ),
    VehicleClass(
        code="DV",
        name="Diplomatic Vehicle",
        description="Vehicle registered to a diplomatic mission",
        plate_prefix="D",
    ),
)

# ---------------------------------------------------------------------------
# Data — Road Network / Highways
# ---------------------------------------------------------------------------

_HIGHWAYS: tuple[Highway, ...] = (
    Highway(
        name="Highway 2000",
        segments=(
            "Kingston to May Pen (Leg 1)",
            "May Pen to Williamsfield (Leg 2)",
        ),
        total_km=67,
        status="toll",
    ),
    Highway(
        name="North-South Highway",
        segments=("Caymanas to Ocho Rios",),
        total_km=66,
        status="toll",
    ),
    Highway(
        name="East-West Highway",
        segments=("Harbour View to Port Antonio (proposed)",),
        total_km=85,
        status="proposed",
    ),
)

_ROAD_NETWORK = RoadNetwork(
    total_km=22_121,
    paved_km=15_462,
    unpaved_km=6_659,
    main_roads_km=4_895,
    parochial_roads_km=10_567,
    highways=_HIGHWAYS,
)

# ---------------------------------------------------------------------------
# Data — Licence Plate Prefixes
# ---------------------------------------------------------------------------

_LICENCE_PLATE_PREFIXES: tuple[LicencePlatePrefix, ...] = (
    LicencePlatePrefix(
        prefix="",
        vehicle_type="Private",
        description="Private vehicle \u2014 no prefix, numbers only",
    ),
    LicencePlatePrefix(
        prefix="PP",
        vehicle_type="Public Passenger Vehicle",
        description="Public Passenger Vehicle (PPV) \u2014 taxis, route taxis, hire cars",
    ),
    LicencePlatePrefix(
        prefix="C",
        vehicle_type="Commercial",
        description="Commercial vehicle \u2014 goods transport",
    ),
    LicencePlatePrefix(
        prefix="G",
        vehicle_type="Government",
        description="Government-owned vehicle",
    ),
    LicencePlatePrefix(
        prefix="D",
        vehicle_type="Diplomatic",
        description="Diplomatic mission vehicle",
    ),
    LicencePlatePrefix(
        prefix="MC",
        vehicle_type="Motorcycle",
        description="Motorcycle \u2014 may also use CY prefix",
    ),
    LicencePlatePrefix(
        prefix="CY",
        vehicle_type="Motorcycle",
        description="Motorcycle \u2014 alternate prefix (cycle)",
    ),
    LicencePlatePrefix(
        prefix="R",
        vehicle_type="Rental",
        description="Rental vehicle",
    ),
)


# ---------------------------------------------------------------------------
# Functions — Airports
# ---------------------------------------------------------------------------


def get_airports() -> list[Airport]:
    """Return all airports in Jamaica."""
    return list(_AIRPORTS)


def get_airport(iata_or_icao: str) -> Airport | None:
    """Look up a single airport by IATA or ICAO code (case-insensitive)."""
    code = iata_or_icao.upper()
    for airport in _AIRPORTS:
        if airport.iata == code or airport.icao == code:
            return airport
    return None


def get_international_airports() -> list[Airport]:
    """Return only international airports."""
    return [a for a in _AIRPORTS if a.type == "international"]


def get_domestic_airports() -> list[Airport]:
    """Return only domestic airports/aerodromes."""
    return [a for a in _AIRPORTS if a.type == "domestic"]


def search_airports(query: str) -> list[Airport]:
    """Search airports by name, IATA, ICAO, or parish (case-insensitive substring match)."""
    q = query.lower()
    return [
        a
        for a in _AIRPORTS
        if q in a.name.lower()
        or q in a.iata.lower()
        or q in a.icao.lower()
        or q in a.parish.lower()
    ]


# ---------------------------------------------------------------------------
# Functions — Seaports
# ---------------------------------------------------------------------------


def get_seaports() -> list[Seaport]:
    """Return all seaports in Jamaica."""
    return list(_SEAPORTS)


def get_seaport(name: str) -> Seaport | None:
    """Look up a single seaport by name (case-insensitive substring match)."""
    n = name.lower()
    for seaport in _SEAPORTS:
        if n in seaport.name.lower():
            return seaport
    return None


# ---------------------------------------------------------------------------
# Functions — Vehicle Classes
# ---------------------------------------------------------------------------


def get_vehicle_classes() -> list[VehicleClass]:
    """Return all vehicle classifications."""
    return list(_VEHICLE_CLASSES)


def get_vehicle_class(code: str) -> VehicleClass | None:
    """Look up a single vehicle class by its code (case-insensitive)."""
    c = code.upper()
    for vc in _VEHICLE_CLASSES:
        if vc.code == c:
            return vc
    return None


# ---------------------------------------------------------------------------
# Functions — Road Network
# ---------------------------------------------------------------------------


def get_road_network() -> RoadNetwork:
    """Return the full road network summary for Jamaica."""
    return _ROAD_NETWORK


def get_highways() -> list[Highway]:
    """Return all highways."""
    return list(_HIGHWAYS)


# ---------------------------------------------------------------------------
# Functions — Licence Plates
# ---------------------------------------------------------------------------


def get_licence_plate_prefixes() -> list[LicencePlatePrefix]:
    """Return all licence plate prefixes and their vehicle type associations."""
    return list(_LICENCE_PLATE_PREFIXES)
