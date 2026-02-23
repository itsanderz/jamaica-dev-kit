"""Thin wrapper around the ``openlocationcode`` library.

Provides convenience functions for encoding, decoding, validating, shortening,
and recovering Google Plus Codes with consistent typing and error handling.
"""

from __future__ import annotations

from openlocationcode import openlocationcode as olc


def encode(lat: float, lng: float, code_length: int = 10) -> str:
    """Encode a latitude / longitude pair into a full Plus Code.

    Parameters
    ----------
    lat:
        Latitude in decimal degrees (-90 to 90).
    lng:
        Longitude in decimal degrees (-180 to 180).
    code_length:
        Desired Plus Code length.  Defaults to 10 (approximately 14 x 14 m
        precision).

    Returns
    -------
    str
        A full Plus Code such as ``"77MQPXJF+QQ"``.
    """
    return olc.encode(lat, lng, code_length)


def decode(code: str) -> tuple[float, float]:
    """Decode a Plus Code and return its center point.

    Parameters
    ----------
    code:
        A valid full Plus Code.

    Returns
    -------
    tuple[float, float]
        ``(latitude, longitude)`` of the code area's center.
    """
    area = olc.decode(code)
    center_lat = area.latitudeCenter
    center_lng = area.longitudeCenter
    return (center_lat, center_lng)


def is_valid(code: str) -> bool:
    """Return ``True`` if *code* is a syntactically valid Plus Code."""
    return olc.isValid(code)


def is_full(code: str) -> bool:
    """Return ``True`` if *code* is a full (not short) Plus Code."""
    return olc.isFull(code)


def shorten(code: str, lat: float, lng: float) -> str:
    """Shorten a full Plus Code relative to a nearby reference point.

    Parameters
    ----------
    code:
        A full Plus Code to shorten.
    lat:
        Reference latitude.
    lng:
        Reference longitude.

    Returns
    -------
    str
        A shortened Plus Code, or the original if shortening is not possible.
    """
    return olc.shorten(code, lat, lng)


def recover(short_code: str, lat: float, lng: float) -> str:
    """Recover a full Plus Code from a short code and a reference point.

    Parameters
    ----------
    short_code:
        A short Plus Code.
    lat:
        Reference latitude.
    lng:
        Reference longitude.

    Returns
    -------
    str
        The recovered full Plus Code.
    """
    return olc.recoverNearest(short_code, lat, lng)
