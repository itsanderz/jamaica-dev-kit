"""Parish boundary detection using nearest-parish-center heuristic.

Loads parish data from the shared ``data/parishes.json`` file and exposes
helpers that resolve a geographic coordinate to its nearest Jamaican parish.

The approach uses haversine distance from each parish's published centre
coordinate.  This is a pragmatic approximation -- a full polygon-based
point-in-polygon check can be layered in later when authoritative boundary
GeoJSON becomes available from the National Spatial Data Management Division.
"""

from __future__ import annotations

import json
import math
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.config import get_settings

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

_EARTH_RADIUS_KM = 6_371.0

# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------


@lru_cache(maxsize=1)
def _load_parishes() -> list[dict[str, Any]]:
    """Load and cache parish records from ``parishes.json``."""
    data_dir: Path = get_settings().DATA_DIR
    parishes_path = data_dir / "parishes.json"
    with parishes_path.open(encoding="utf-8") as fh:
        data = json.load(fh)
    return data["parishes"]


# ---------------------------------------------------------------------------
# Haversine distance
# ---------------------------------------------------------------------------


def _haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Return the great-circle distance in kilometres between two points."""
    lat1_r, lat2_r = math.radians(lat1), math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_r) * math.cos(lat2_r) * math.sin(dlng / 2) ** 2
    )
    return _EARTH_RADIUS_KM * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def find_parish(lat: float, lng: float) -> dict[str, Any] | None:
    """Find the nearest parish for a given coordinate pair.

    Uses haversine distance from the coordinate to each parish's center point.
    Returns the full parish record dict (from ``parishes.json``) for the
    closest match, or ``None`` if the coordinate is clearly outside Jamaica
    (more than 150 km from any parish center).

    Parameters
    ----------
    lat:
        Latitude in decimal degrees.
    lng:
        Longitude in decimal degrees.

    Returns
    -------
    dict | None
        The parish dict, or ``None`` if no parish is close enough.
    """
    parishes = _load_parishes()
    best: dict[str, Any] | None = None
    best_dist = float("inf")

    for parish in parishes:
        coords = parish["coordinates"]
        dist = _haversine(lat, lng, coords["lat"], coords["lng"])
        if dist < best_dist:
            best_dist = dist
            best = parish

    # Reject matches that are unreasonably far from any parish center.
    # Jamaica is roughly 235 km long and 82 km wide; 150 km is a generous
    # upper bound to accommodate coordinates near the coast.
    if best_dist > 150:
        return None

    return best


def get_parish_by_code(code: str) -> dict[str, Any] | None:
    """Look up a parish by its three-letter code (case-insensitive).

    Parameters
    ----------
    code:
        Parish code such as ``"KIN"`` or ``"SJA"``.

    Returns
    -------
    dict | None
        The parish dict, or ``None`` if not found.
    """
    code_upper = code.upper()
    for parish in _load_parishes():
        if parish["code"].upper() == code_upper:
            return parish
    return None


def get_all_parishes() -> list[dict[str, Any]]:
    """Return the complete list of 14 parish records."""
    return _load_parishes()
