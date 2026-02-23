"""Simple forward geocoder for Jamaican addresses.

This module provides a best-effort lookup for well-known Jamaican locations
(parish capitals, major towns, landmarks, and Kingston sectors).  It is
intentionally offline and self-contained so the API can run without external
service dependencies.

Future iterations will integrate:
* NSPIT WFS (National Spatial Plan Infrastructure and Technology)
* OpenStreetMap Nominatim
* STATIN enumeration-district centroids
"""

from __future__ import annotations

import re
from typing import Any

# ---------------------------------------------------------------------------
# Canonical parish name aliases (subset used for parsing)
# ---------------------------------------------------------------------------

_PARISH_ALIASES: dict[str, str] = {
    "kingston": "Kingston",
    "kgn": "Kingston",
    "st. andrew": "St. Andrew",
    "st andrew": "St. Andrew",
    "saint andrew": "St. Andrew",
    "st. catherine": "St. Catherine",
    "st catherine": "St. Catherine",
    "saint catherine": "St. Catherine",
    "clarendon": "Clarendon",
    "manchester": "Manchester",
    "st. elizabeth": "St. Elizabeth",
    "st elizabeth": "St. Elizabeth",
    "saint elizabeth": "St. Elizabeth",
    "westmoreland": "Westmoreland",
    "hanover": "Hanover",
    "st. james": "St. James",
    "st james": "St. James",
    "saint james": "St. James",
    "trelawny": "Trelawny",
    "st. ann": "St. Ann",
    "st ann": "St. Ann",
    "saint ann": "St. Ann",
    "st. mary": "St. Mary",
    "st mary": "St. Mary",
    "saint mary": "St. Mary",
    "portland": "Portland",
    "st. thomas": "St. Thomas",
    "st thomas": "St. Thomas",
    "saint thomas": "St. Thomas",
}

# ---------------------------------------------------------------------------
# Known location database
# ---------------------------------------------------------------------------

# Each entry: (canonical_name, lat, lng, parish, type)
# Coordinates sourced from OpenStreetMap / public domain gazetteers.

_KNOWN_LOCATIONS: list[tuple[str, float, float, str, str]] = [
    # Parish capitals
    ("Kingston", 17.9714, -76.7920, "Kingston", "capital"),
    ("Half Way Tree", 18.0106, -76.7860, "St. Andrew", "capital"),
    ("Spanish Town", 18.0093, -76.9553, "St. Catherine", "capital"),
    ("May Pen", 17.9658, -77.2425, "Clarendon", "capital"),
    ("Mandeville", 18.0432, -77.5033, "Manchester", "capital"),
    ("Black River", 18.0269, -77.8483, "St. Elizabeth", "capital"),
    ("Savanna-la-Mar", 18.2169, -78.1342, "Westmoreland", "capital"),
    ("Lucea", 18.4511, -78.1733, "Hanover", "capital"),
    ("Montego Bay", 18.4762, -77.9236, "St. James", "capital"),
    ("Falmouth", 18.4939, -77.6556, "Trelawny", "capital"),
    ("St. Ann's Bay", 18.4342, -77.2003, "St. Ann", "capital"),
    ("Port Maria", 18.3697, -76.9167, "St. Mary", "capital"),
    ("Port Antonio", 18.1789, -76.4506, "Portland", "capital"),
    ("Morant Bay", 17.8817, -76.4083, "St. Thomas", "capital"),
    # Major towns and well-known locations
    ("Ocho Rios", 18.4085, -77.1050, "St. Ann", "town"),
    ("Negril", 18.2681, -78.3478, "Westmoreland", "town"),
    ("Portmore", 17.9539, -76.8875, "St. Catherine", "town"),
    ("Linstead", 18.1333, -77.0333, "St. Catherine", "town"),
    ("Old Harbour", 17.9417, -77.1069, "St. Catherine", "town"),
    ("Christiana", 18.1833, -77.4833, "Manchester", "town"),
    ("Bull Savanna", 17.8833, -77.5833, "St. Elizabeth", "town"),
    ("Bog Walk", 18.1000, -76.9833, "St. Catherine", "town"),
    ("Ewarton", 18.1833, -77.0833, "St. Catherine", "town"),
    ("Lionel Town", 17.8375, -77.1486, "Clarendon", "town"),
    ("Chapelton", 18.0833, -77.2833, "Clarendon", "town"),
    ("Annotto Bay", 18.2672, -76.7681, "St. Mary", "town"),
    ("Buff Bay", 18.2333, -76.6500, "Portland", "town"),
    ("Yallahs", 17.8833, -76.5500, "St. Thomas", "town"),
    ("Rose Hall", 18.5053, -77.8531, "St. James", "town"),
    ("Whitehouse", 18.0442, -77.8764, "Westmoreland", "town"),
    ("Discovery Bay", 18.4703, -77.4097, "St. Ann", "town"),
    ("Runaway Bay", 18.4589, -77.3308, "St. Ann", "town"),
    ("Brown's Town", 18.3917, -77.2833, "St. Ann", "town"),
    ("Stony Hill", 18.0536, -76.7689, "St. Andrew", "town"),
    ("Papine", 18.0186, -76.7456, "St. Andrew", "town"),
    ("Cross Roads", 18.0053, -76.7856, "St. Andrew", "town"),
    ("Liguanea", 18.0172, -76.7669, "St. Andrew", "town"),
    ("Constant Spring", 18.0306, -76.7900, "St. Andrew", "town"),
    ("Hope Pastures", 18.0225, -76.7561, "St. Andrew", "town"),
    ("Mona", 18.0156, -76.7472, "St. Andrew", "town"),
    ("Red Hills", 18.0533, -76.8278, "St. Andrew", "town"),
    ("Barbican", 18.0250, -76.7667, "St. Andrew", "town"),
    # Kingston landmarks
    ("Devon House", 18.0114, -76.7772, "St. Andrew", "landmark"),
    ("Bob Marley Museum", 18.0131, -76.7744, "St. Andrew", "landmark"),
    ("Emancipation Park", 18.0075, -76.7842, "St. Andrew", "landmark"),
    ("National Heroes Park", 17.9933, -76.7961, "Kingston", "landmark"),
    ("Victoria Crafts Market", 17.9703, -76.7939, "Kingston", "landmark"),
    ("Ward Theatre", 17.9739, -76.7953, "Kingston", "landmark"),
    ("Institute of Jamaica", 17.9719, -76.7931, "Kingston", "landmark"),
    ("Gordon House", 17.9703, -76.7944, "Kingston", "landmark"),
    ("Coronation Market", 17.9764, -76.8000, "Kingston", "landmark"),
    ("University of the West Indies", 18.0050, -76.7494, "St. Andrew", "landmark"),
    ("UWI Mona", 18.0050, -76.7494, "St. Andrew", "landmark"),
    ("Norman Manley International Airport", 17.9356, -76.7875, "Kingston", "landmark"),
    ("Sangster International Airport", 18.5037, -77.9133, "St. James", "landmark"),
    ("Dunn's River Falls", 18.4108, -77.1347, "St. Ann", "landmark"),
    ("Blue Mountains", 18.1683, -76.5856, "Portland", "landmark"),
    ("Port Royal", 17.9369, -76.8411, "Kingston", "landmark"),
    ("Fort Charles", 17.9361, -76.8408, "Kingston", "landmark"),
    ("Hope Botanical Gardens", 18.0131, -76.7500, "St. Andrew", "landmark"),
    ("Hellshire Beach", 17.8872, -76.8892, "St. Catherine", "landmark"),
    ("Lime Cay", 17.8975, -76.8367, "Kingston", "landmark"),
    ("YS Falls", 18.1722, -77.7500, "St. Elizabeth", "landmark"),
    ("Bamboo Avenue", 18.0833, -77.6167, "St. Elizabeth", "landmark"),
    ("Treasure Beach", 17.8639, -77.7628, "St. Elizabeth", "landmark"),
    ("Frenchman's Cove", 18.1911, -76.4094, "Portland", "landmark"),
    ("Boston Bay", 18.1889, -76.3794, "Portland", "landmark"),
    ("Reach Falls", 18.1300, -76.3353, "Portland", "landmark"),
    ("Blue Lagoon", 18.1914, -76.4236, "Portland", "landmark"),
    ("Firefly", 18.3833, -76.9000, "St. Mary", "landmark"),
    ("Rio Grande", 18.1808, -76.4461, "Portland", "landmark"),
    ("Martha Brae River", 18.4978, -77.6589, "Trelawny", "landmark"),
    ("Green Grotto Caves", 18.4389, -77.3419, "St. Ann", "landmark"),
    ("Mystic Mountain", 18.4117, -77.1064, "St. Ann", "landmark"),
    # Kingston sector reference points
    ("Kingston 1", 17.9750, -76.7950, "Kingston", "sector"),
    ("Kingston 2", 17.9761, -76.7900, "Kingston", "sector"),
    ("Kingston 3", 17.9767, -76.7867, "Kingston", "sector"),
    ("Kingston 4", 17.9775, -76.7833, "Kingston", "sector"),
    ("Kingston 5", 17.9944, -76.7872, "Kingston", "sector"),
    ("Kingston 6", 18.0072, -76.7700, "Kingston", "sector"),
    ("Kingston 7", 18.0197, -76.7797, "St. Andrew", "sector"),
    ("Kingston 8", 18.0250, -76.7667, "St. Andrew", "sector"),
    ("Kingston 9", 18.0350, -76.7800, "St. Andrew", "sector"),
    ("Kingston 10", 18.0100, -76.8042, "St. Andrew", "sector"),
    ("Kingston 11", 17.9917, -76.8094, "Kingston", "sector"),
    ("Kingston 12", 17.9750, -76.8056, "Kingston", "sector"),
    ("Kingston 13", 17.9861, -76.7703, "Kingston", "sector"),
    ("Kingston 14", 17.9953, -76.7606, "Kingston", "sector"),
    ("Kingston 15", 17.9833, -76.7533, "Kingston", "sector"),
    ("Kingston 16", 17.9683, -76.7467, "Kingston", "sector"),
    ("Kingston 17", 17.9606, -76.7878, "Kingston", "sector"),
    ("Kingston 19", 18.0386, -76.8153, "St. Andrew", "sector"),
    ("Kingston 20", 18.0467, -76.7633, "St. Andrew", "sector"),
]

# Build a fast lowercase lookup for name matching.
_LOCATION_INDEX: dict[str, tuple[float, float, str, str, str]] = {}
for _name, _lat, _lng, _parish, _type in _KNOWN_LOCATIONS:
    _LOCATION_INDEX[_name.lower()] = (_lat, _lng, _parish, _type, _name)

# ---------------------------------------------------------------------------
# Parish extraction from raw address text
# ---------------------------------------------------------------------------

_KINGSTON_SECTOR_RE = re.compile(r"\bKingston\s*(\d{1,2})\b", re.IGNORECASE)
_SAINT_PREFIX_RE = re.compile(r"\b(Saint|St)\s+", re.IGNORECASE)


def _normalize_saint(text: str) -> str:
    return _SAINT_PREFIX_RE.sub("St. ", text)


def _extract_parish(address: str) -> str | None:
    """Attempt to extract a canonical parish name from an address string."""
    lowered = address.lower()
    for alias, canonical in _PARISH_ALIASES.items():
        if alias in lowered:
            return canonical
    return None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def geocode_address(address: str) -> dict[str, Any] | None:
    """Attempt to forward-geocode a Jamaican address string.

    The geocoder uses a deterministic lookup against a built-in database of
    well-known locations (parish capitals, major towns, landmarks, and
    Kingston sectors).  If no exact or fuzzy match is found the function
    returns ``None``.

    Parameters
    ----------
    address:
        A human-readable Jamaican address string such as
        ``"Devon House, Kingston"`` or ``"Half Way Tree, St. Andrew"``.

    Returns
    -------
    dict | None
        A dict with keys ``lat``, ``lng``, ``confidence``, ``parish``,
        ``match_name``, and ``match_type`` -- or ``None`` if no match.
    """
    cleaned = address.strip()
    if not cleaned:
        return None

    normalized = _normalize_saint(cleaned)

    # ------------------------------------------------------------------
    # 1. Try direct full-string match
    # ------------------------------------------------------------------
    key = normalized.lower()
    if key in _LOCATION_INDEX:
        lat, lng, parish, loc_type, canon = _LOCATION_INDEX[key]
        return {
            "lat": lat,
            "lng": lng,
            "confidence": 1.0,
            "parish": parish,
            "match_name": canon,
            "match_type": loc_type,
        }

    # ------------------------------------------------------------------
    # 2. Try matching Kingston sector pattern (e.g. "Kingston 10")
    # ------------------------------------------------------------------
    sector_match = _KINGSTON_SECTOR_RE.search(normalized)
    if sector_match:
        sector_key = f"kingston {sector_match.group(1)}"
        if sector_key in _LOCATION_INDEX:
            lat, lng, parish, loc_type, canon = _LOCATION_INDEX[sector_key]
            return {
                "lat": lat,
                "lng": lng,
                "confidence": 0.85,
                "parish": parish,
                "match_name": canon,
                "match_type": loc_type,
            }

    # ------------------------------------------------------------------
    # 3. Try matching comma-separated segments against known locations
    # ------------------------------------------------------------------
    segments = [s.strip() for s in normalized.split(",")]
    for segment in segments:
        seg_key = segment.lower()
        if seg_key in _LOCATION_INDEX:
            lat, lng, parish, loc_type, canon = _LOCATION_INDEX[seg_key]
            return {
                "lat": lat,
                "lng": lng,
                "confidence": 0.8,
                "parish": parish,
                "match_name": canon,
                "match_type": loc_type,
            }

    # ------------------------------------------------------------------
    # 4. Substring search -- find the longest known-location name that
    #    appears as a substring within the address.
    # ------------------------------------------------------------------
    best_match: tuple[str, tuple[float, float, str, str, str]] | None = None
    best_len = 0
    lowered_addr = normalized.lower()
    for loc_key, loc_val in _LOCATION_INDEX.items():
        if loc_key in lowered_addr and len(loc_key) > best_len:
            best_len = len(loc_key)
            best_match = (loc_key, loc_val)

    if best_match is not None:
        _, (lat, lng, parish, loc_type, canon) = best_match
        return {
            "lat": lat,
            "lng": lng,
            "confidence": 0.6,
            "parish": parish,
            "match_name": canon,
            "match_type": loc_type,
        }

    # ------------------------------------------------------------------
    # 5. Fall back to parish center if we can at least identify the parish
    # ------------------------------------------------------------------
    parish = _extract_parish(normalized)
    if parish is not None:
        # Find the parish capital entry
        capital_key = None
        for loc_key, loc_val in _LOCATION_INDEX.items():
            if loc_val[2] == parish and loc_val[3] == "capital":
                capital_key = (loc_key, loc_val)
                break
        if capital_key is not None:
            _, (lat, lng, _p, loc_type, canon) = capital_key
            return {
                "lat": lat,
                "lng": lng,
                "confidence": 0.3,
                "parish": parish,
                "match_name": canon,
                "match_type": "parish_fallback",
            }

    return None
