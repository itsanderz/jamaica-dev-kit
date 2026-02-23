"""Digital Addressing System API for Jamaica.

A geocoding and addressing API built on Google Plus Codes (Open Location Code)
with parish boundary lookups and reverse geocoding.  Designed to provide a
functional addressing layer for a country without a standardised postal-code
system.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import plus_codes
from app.config import get_settings
from app.geocoder import geocode_address
from app.models import (
    DecodeRequest,
    EncodeRequest,
    ErrorResponse,
    GeocodeRequest,
    GeocodeResponse,
    LocationResponse,
    ParishCoordinates,
    ParishResponse,
    ReverseRequest,
)
from app.parish_lookup import find_parish, get_all_parishes, get_parish_by_code


# ---------------------------------------------------------------------------
# Lifespan -- eagerly validate that the data directory exists
# ---------------------------------------------------------------------------


@asynccontextmanager
async def _lifespan(app: FastAPI):  # noqa: ANN001
    settings = get_settings()
    parishes_path = settings.DATA_DIR / "parishes.json"
    if not parishes_path.exists():
        raise RuntimeError(
            f"parishes.json not found at {parishes_path}.  "
            f"Check the DATA_DIR setting (currently {settings.DATA_DIR})."
        )
    yield


# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Jamaica Digital Addressing System",
    description=(
        "Geocoding and digital addressing API for Jamaica using Google Plus "
        "Codes, with parish boundary lookups and reverse geocoding."
    ),
    version="0.1.0",
    lifespan=_lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _parish_dict_to_response(parish: dict[str, Any]) -> ParishResponse:
    """Map a raw parish dict from ``parishes.json`` into a ``ParishResponse``."""
    return ParishResponse(
        code=parish["code"],
        name=parish["name"],
        capital=parish["capital"],
        population=parish["population"],
        coordinates=ParishCoordinates(**parish["coordinates"]),
        area_km2=parish["area_km2"],
    )


def _build_location_response(
    lat: float,
    lng: float,
    *,
    formatted_address: str | None = None,
) -> LocationResponse:
    """Encode coordinates, look up the parish, and return a ``LocationResponse``."""
    code = plus_codes.encode(lat, lng)
    parish = find_parish(lat, lng)
    return LocationResponse(
        lat=lat,
        lng=lng,
        plus_code=code,
        parish_name=parish["name"] if parish else None,
        parish_code=parish["code"] if parish else None,
        formatted_address=formatted_address,
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/health", tags=["system"])
async def health_check() -> dict[str, str]:
    """Liveness / readiness probe."""
    return {"status": "healthy", "service": "addressing-api"}


# -- Encode ----------------------------------------------------------------


@app.post(
    "/encode",
    response_model=LocationResponse,
    tags=["plus-codes"],
    summary="Encode coordinates to a Plus Code",
    responses={400: {"model": ErrorResponse}},
)
async def encode_location(body: EncodeRequest) -> LocationResponse:
    """Accept a latitude / longitude pair and return the corresponding Plus Code
    together with the detected parish."""
    return _build_location_response(body.lat, body.lng)


# -- Decode ----------------------------------------------------------------


@app.post(
    "/decode",
    response_model=LocationResponse,
    tags=["plus-codes"],
    summary="Decode a Plus Code to coordinates",
    responses={400: {"model": ErrorResponse}},
)
async def decode_location(body: DecodeRequest) -> LocationResponse:
    """Accept a Plus Code and return its center-point coordinates and parish."""
    if not plus_codes.is_valid(body.plus_code):
        raise HTTPException(status_code=400, detail="Invalid Plus Code")

    code = body.plus_code
    # If the code is not a full code, attempt recovery near Kingston (default)
    if not plus_codes.is_full(code):
        code = plus_codes.recover(code, 18.0, -76.8)

    lat, lng = plus_codes.decode(code)
    return _build_location_response(lat, lng)


# -- Geocode ---------------------------------------------------------------


@app.post(
    "/geocode",
    response_model=GeocodeResponse,
    tags=["geocoding"],
    summary="Forward-geocode a Jamaican address",
    responses={404: {"model": ErrorResponse}},
)
async def geocode(body: GeocodeRequest) -> GeocodeResponse:
    """Parse and geocode a human-readable Jamaican address string into
    coordinates, a Plus Code, and parish information."""
    result = geocode_address(body.address)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Could not geocode address: {body.address!r}",
        )

    lat: float = result["lat"]
    lng: float = result["lng"]
    code = plus_codes.encode(lat, lng)
    parish = find_parish(lat, lng)

    return GeocodeResponse(
        lat=lat,
        lng=lng,
        plus_code=code,
        parish_name=parish["name"] if parish else result.get("parish"),
        parish_code=parish["code"] if parish else None,
        formatted_address=result.get("match_name"),
        confidence=result["confidence"],
    )


# -- Reverse geocode -------------------------------------------------------


@app.post(
    "/reverse",
    response_model=LocationResponse,
    tags=["geocoding"],
    summary="Reverse-geocode coordinates to an address description",
)
async def reverse_geocode(body: ReverseRequest) -> LocationResponse:
    """Accept coordinates and return a descriptive address with Plus Code and
    parish information."""
    parish = find_parish(body.lat, body.lng)
    code = plus_codes.encode(body.lat, body.lng)

    # Build a human-readable description from what we know
    parts: list[str] = []
    if parish:
        parts.append(f"Near {parish['capital']}")
        parts.append(parish["name"])
    formatted = ", ".join(parts) if parts else None

    return LocationResponse(
        lat=body.lat,
        lng=body.lng,
        plus_code=code,
        parish_name=parish["name"] if parish else None,
        parish_code=parish["code"] if parish else None,
        formatted_address=formatted,
    )


# -- Parishes --------------------------------------------------------------


@app.get(
    "/parishes",
    response_model=list[ParishResponse],
    tags=["parishes"],
    summary="List all 14 Jamaican parishes",
)
async def list_parishes() -> list[ParishResponse]:
    """Return metadata for all 14 Jamaican parishes."""
    return [_parish_dict_to_response(p) for p in get_all_parishes()]


@app.get(
    "/parishes/{code}",
    response_model=ParishResponse,
    tags=["parishes"],
    summary="Get details for a single parish",
    responses={404: {"model": ErrorResponse}},
)
async def get_parish(code: str) -> ParishResponse:
    """Return detailed information for a single parish identified by its
    three-letter code (e.g. ``KIN``, ``SJA``)."""
    parish = get_parish_by_code(code)
    if parish is None:
        raise HTTPException(
            status_code=404,
            detail=f"Parish with code {code!r} not found",
        )
    return _parish_dict_to_response(parish)
