"""Pydantic request / response models for the addressing API."""

from __future__ import annotations

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------


class EncodeRequest(BaseModel):
    """Request body for encoding a coordinate pair into a Plus Code."""

    lat: float = Field(..., ge=-90, le=90, description="Latitude in decimal degrees")
    lng: float = Field(..., ge=-180, le=180, description="Longitude in decimal degrees")


class DecodeRequest(BaseModel):
    """Request body for decoding a Plus Code into coordinates."""

    plus_code: str = Field(
        ..., min_length=4, max_length=15, description="Full or short Plus Code"
    )


class GeocodeRequest(BaseModel):
    """Request body for forward-geocoding a Jamaican address string."""

    address: str = Field(
        ..., min_length=1, max_length=500, description="Jamaican address to geocode"
    )


class ReverseRequest(BaseModel):
    """Request body for reverse-geocoding coordinates into an address."""

    lat: float = Field(..., ge=-90, le=90, description="Latitude in decimal degrees")
    lng: float = Field(..., ge=-180, le=180, description="Longitude in decimal degrees")


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------


class LocationResponse(BaseModel):
    """Unified location response returned by encode, decode, geocode, and reverse endpoints."""

    lat: float = Field(..., description="Latitude in decimal degrees")
    lng: float = Field(..., description="Longitude in decimal degrees")
    plus_code: str = Field(..., description="Google Plus Code for this location")
    parish_name: str | None = Field(
        default=None, description="Parish the coordinate falls within"
    )
    parish_code: str | None = Field(
        default=None, description="Three-letter parish code"
    )
    formatted_address: str | None = Field(
        default=None, description="Human-readable formatted address"
    )


class ParishCoordinates(BaseModel):
    """Geographic center-point for a parish."""

    lat: float
    lng: float


class ParishResponse(BaseModel):
    """Detailed information about a single Jamaican parish."""

    code: str = Field(..., description="Three-letter parish code")
    name: str = Field(..., description="Canonical parish name")
    capital: str = Field(..., description="Parish capital / chief town")
    population: int = Field(..., description="Population (2022 census)")
    coordinates: ParishCoordinates = Field(
        ..., description="Geographic center-point of the parish"
    )
    area_km2: int = Field(..., description="Parish area in square kilometres")


class GeocodeResponse(LocationResponse):
    """Extended response for forward geocoding that includes a confidence score."""

    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence score for the geocode result"
    )


class ErrorResponse(BaseModel):
    """Standard error envelope."""

    detail: str
