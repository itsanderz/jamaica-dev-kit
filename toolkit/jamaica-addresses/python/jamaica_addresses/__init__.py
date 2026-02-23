"""Jamaica address parser and normalizer for informal addressing systems.

Jamaica has no functional postal code system (suspended in 2007). Kingston uses
1-2 digit sector codes (e.g. "Kingston 10"). Rural addresses use descriptive
locations with landmarks and districts.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Optional

__all__ = [
    "ParsedAddress",
    "NormalizedAddress",
    "parse_address",
    "normalize_address",
    "extract_parish",
    "is_kingston_address",
    "get_kingston_sector",
    "format_address",
    "to_normalized_address",
    "KINGSTON_SECTORS",
    "PARISH_NAMES",
    "PARISH_ALIASES",
]

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

KINGSTON_SECTORS: tuple[int, ...] = tuple(range(1, 21))
"""Valid Kingston sector numbers (1-20)."""

PARISH_NAMES: tuple[str, ...] = (
    "Kingston",
    "St. Andrew",
    "St. Catherine",
    "Clarendon",
    "Manchester",
    "St. Elizabeth",
    "Westmoreland",
    "Hanover",
    "St. James",
    "Trelawny",
    "St. Ann",
    "St. Mary",
    "Portland",
    "St. Thomas",
)
"""All 14 Jamaican parish names in canonical form."""

PARISH_ALIASES: dict[str, str] = {
    # Kingston
    "kgn": "Kingston",
    "kng": "Kingston",
    "kingston": "Kingston",
    # St. Andrew
    "st andrew": "St. Andrew",
    "saint andrew": "St. Andrew",
    "st. andrew": "St. Andrew",
    # St. Catherine
    "st catherine": "St. Catherine",
    "saint catherine": "St. Catherine",
    "st. catherine": "St. Catherine",
    # Clarendon
    "clarendon": "Clarendon",
    # Manchester
    "manchester": "Manchester",
    # St. Elizabeth
    "st elizabeth": "St. Elizabeth",
    "saint elizabeth": "St. Elizabeth",
    "st. elizabeth": "St. Elizabeth",
    # Westmoreland
    "westmoreland": "Westmoreland",
    # Hanover
    "hanover": "Hanover",
    # St. James (MoBay alias)
    "st james": "St. James",
    "saint james": "St. James",
    "st. james": "St. James",
    "mobay": "St. James",
    "mo bay": "St. James",
    # Trelawny
    "trelawny": "Trelawny",
    # St. Ann (Ochi alias)
    "st ann": "St. Ann",
    "saint ann": "St. Ann",
    "st. ann": "St. Ann",
    "ochi": "St. Ann",
    # St. Mary
    "st mary": "St. Mary",
    "saint mary": "St. Mary",
    "st. mary": "St. Mary",
    # Portland
    "portland": "Portland",
    # St. Thomas
    "st thomas": "St. Thomas",
    "saint thomas": "St. Thomas",
    "st. thomas": "St. Thomas",
    # Savanna-la-Mar alias -> Westmoreland
    "sav": "Westmoreland",
    "savanna-la-mar": "Westmoreland",
}

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------


@dataclass
class ParsedAddress:
    """Structured representation of a parsed Jamaican address."""

    raw: str
    street_number: Optional[str] = None
    street_name: Optional[str] = None
    unit: Optional[str] = None
    community: Optional[str] = None
    district: Optional[str] = None
    parish: Optional[str] = None
    kingston_sector: Optional[int] = None


@dataclass
class NormalizedAddress:
    """A fully normalized Jamaican address."""

    line1: str
    parish: str
    line2: Optional[str] = None
    kingston_sector: Optional[int] = None
    formatted: str = ""


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

_PARISH_LOWER_SET: set[str] = {p.lower() for p in PARISH_NAMES}
_PARISH_LOWER_MAP: dict[str, str] = {p.lower(): p for p in PARISH_NAMES}

_KINGSTON_SECTOR_RE = re.compile(r"\bKingston\s*(\d{1,2})\b", re.IGNORECASE)
_UNIT_RE = re.compile(
    r"^(Lot|Shop|Suite|Apt|Apartment|Unit|Floor|Flat)\s+[\w-]+", re.IGNORECASE
)
_DISTRICT_RE = re.compile(r"^District\s+of\s+(.+)", re.IGNORECASE)
_STREET_NUMBER_RE = re.compile(r"^(\d+[A-Za-z]?)\s+(.+)")


def _normalize_saint_prefix(text: str) -> str:
    """Normalize 'Saint' / 'St ' prefix variants to canonical 'St.' form."""
    return re.sub(r"\b(Saint|St)\s+", "St. ", text, flags=re.IGNORECASE)


def _resolve_parish(text: str) -> Optional[str]:
    """Resolve a parish string (possibly alias or variant) to canonical form."""
    trimmed = text.strip()
    normalized = _normalize_saint_prefix(trimmed)
    lower = normalized.lower()
    if lower in _PARISH_LOWER_SET:
        return _PARISH_LOWER_MAP[lower]
    alias = PARISH_ALIASES.get(trimmed.lower())
    if alias:
        return alias
    return None


def _escape_regex(text: str) -> str:
    return re.escape(text)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def parse_address(raw: str) -> ParsedAddress:
    """Parse a raw informal Jamaican address into structured components.

    Handles patterns such as::

        "123 Main Street, Kingston 10"
        "Lot 5, Rose Hall, St. James"
        "Shop 3, Town Centre Plaza, May Pen, Clarendon"
        "District of Accompong, St. Elizabeth"
        "Half Way Tree, St. Andrew"
        "Apt 4, 20 Barbican Road, Kingston 8"
    """
    result = ParsedAddress(raw=raw)
    trimmed = raw.strip()
    if not trimmed:
        return result

    # Split into comma-separated segments
    segments = [s.strip() for s in trimmed.split(",")]

    # -- Pass 1: extract parish & Kingston sector from the last segments --
    parish_idx = -1
    for i in range(len(segments) - 1, -1, -1):
        seg = segments[i]
        k_match = _KINGSTON_SECTOR_RE.search(seg)
        if k_match:
            sector = int(k_match.group(1))
            if 1 <= sector <= 20:
                result.kingston_sector = sector
            result.parish = "Kingston"
            parish_idx = i
            break
        resolved = _resolve_parish(seg)
        if resolved:
            result.parish = resolved
            parish_idx = i
            break

    # Remaining segments (everything before the parish segment)
    remaining = list(segments[:parish_idx]) if parish_idx >= 0 else list(segments)

    # -- Pass 2: interpret remaining segments --
    if not remaining:
        return result

    # Check first segment for district pattern
    d_match = _DISTRICT_RE.match(remaining[0])
    if d_match:
        result.district = d_match.group(1).strip()
        remaining.pop(0)

    # Check first segment for unit prefix
    if remaining and _UNIT_RE.match(remaining[0]):
        result.unit = remaining.pop(0)

    # Look for street number + street name
    if remaining:
        n_match = _STREET_NUMBER_RE.match(remaining[0])
        if n_match:
            result.street_number = n_match.group(1)
            result.street_name = n_match.group(2).strip()
            remaining.pop(0)

    # Remaining segments become community / street name
    if len(remaining) == 1:
        result.community = remaining[0]
    elif len(remaining) == 2:
        if not result.street_name:
            result.street_name = remaining[0]
        result.community = remaining[1]
    elif len(remaining) > 2:
        if not result.street_name:
            result.street_name = ", ".join(remaining[:-1])
        result.community = remaining[-1]

    return result


def normalize_address(parsed: ParsedAddress) -> str:
    """Normalize a ParsedAddress to a consistent formatted string.

    Output order:
        [unit, ] [streetNumber streetName, ] [community, ] [District of district, ] parish[ sectorNumber]
    """
    parts: list[str] = []

    if parsed.unit:
        parts.append(parsed.unit)

    if parsed.street_number and parsed.street_name:
        parts.append(f"{parsed.street_number} {parsed.street_name}")
    elif parsed.street_name:
        parts.append(parsed.street_name)

    if parsed.community:
        parts.append(parsed.community)

    if parsed.district:
        parts.append(f"District of {parsed.district}")

    if parsed.parish:
        if parsed.kingston_sector:
            parts.append(f"{parsed.parish} {parsed.kingston_sector}")
        else:
            parts.append(parsed.parish)

    return ", ".join(parts)


def extract_parish(address: str) -> Optional[str]:
    """Extract the canonical parish name from any address string.

    Returns ``None`` if no parish is found.
    """
    trimmed = address.strip()
    if not trimmed:
        return None

    # Check for Kingston with sector
    if _KINGSTON_SECTOR_RE.search(trimmed):
        return "Kingston"

    # Split by comma and check each segment from the end
    segments = [s.strip() for s in trimmed.split(",")]
    for seg in reversed(segments):
        resolved = _resolve_parish(seg)
        if resolved:
            return resolved

    # Fallback: scan the entire string for parish names
    lower_addr = trimmed.lower()
    for name in PARISH_NAMES:
        if name.lower() in lower_addr:
            return name

    # Check short aliases that might appear inline
    for alias, canonical in PARISH_ALIASES.items():
        if len(alias) <= 5:
            pattern = re.compile(r"\b" + _escape_regex(alias) + r"\b", re.IGNORECASE)
            if pattern.search(trimmed):
                return canonical

    return None


def is_kingston_address(address: str) -> bool:
    """Check whether an address is in the Kingston Metropolitan Area
    (Kingston parish or St. Andrew).
    """
    parish = extract_parish(address)
    return parish in ("Kingston", "St. Andrew")


def get_kingston_sector(address: str) -> Optional[int]:
    """Extract the Kingston sector number from an address string.

    Returns ``None`` if not a Kingston address, no sector is specified,
    or the sector number is outside the valid range (1-20).
    """
    match = _KINGSTON_SECTOR_RE.search(address)
    if not match:
        return None
    sector = int(match.group(1))
    if sector < 1 or sector > 20:
        return None
    return sector


def to_normalized_address(parsed: ParsedAddress) -> NormalizedAddress:
    """Convert a ParsedAddress into a fully structured NormalizedAddress.

    Produces a structured object with separate ``line1``, ``line2``, ``parish``,
    and ``formatted`` fields.
    """
    parts1: list[str] = []

    if parsed.unit:
        parts1.append(parsed.unit)
    if parsed.street_number and parsed.street_name:
        parts1.append(f"{parsed.street_number} {parsed.street_name}")
    elif parsed.street_name:
        parts1.append(parsed.street_name)

    line1 = ", ".join(parts1) if parts1 else (parsed.community or parsed.raw)

    parts2: list[str] = []
    if parts1 and parsed.community:
        parts2.append(parsed.community)
    if parsed.district:
        parts2.append(f"District of {parsed.district}")
    line2 = ", ".join(parts2) if parts2 else None

    parish = parsed.parish or "Unknown"
    formatted = normalize_address(parsed)

    return NormalizedAddress(
        line1=line1,
        line2=line2,
        parish=parish,
        kingston_sector=parsed.kingston_sector,
        formatted=formatted,
    )


def format_address(parsed: ParsedAddress) -> str:
    """Format a ParsedAddress into a human-readable display string.

    Alias for :func:`normalize_address` with identical output.
    """
    return normalize_address(parsed)
