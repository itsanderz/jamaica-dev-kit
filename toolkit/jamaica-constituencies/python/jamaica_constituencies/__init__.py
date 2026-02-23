"""Jamaica electoral constituencies.

All 63 constituencies of Jamaica's House of Representatives with parish mapping.
Based on the Electoral Commission of Jamaica's official constituency boundaries
used in the 2025 general election.
"""

from __future__ import annotations

from dataclasses import dataclass

__all__ = [
    "Constituency",
    "get_constituencies",
    "get_constituency_by_parish",
    "get_constituency",
    "search_constituencies",
    "get_constituency_count",
    "get_constituency_count_by_parish",
    "get_parishes",
]

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------


@dataclass(frozen=True, slots=True)
class Constituency:
    """A Jamaican parliamentary constituency."""

    name: str
    parish: str


# ---------------------------------------------------------------------------
# Data — 63 constituencies across 14 parishes
# ---------------------------------------------------------------------------

_CONSTITUENCIES: tuple[Constituency, ...] = (
    # Kingston (3)
    Constituency(name="Kingston Central", parish="Kingston"),
    Constituency(name="Kingston East and Port Royal", parish="Kingston"),
    Constituency(name="Kingston Western", parish="Kingston"),
    # St. Andrew (12)
    Constituency(name="St. Andrew East Central", parish="St. Andrew"),
    Constituency(name="St. Andrew East Rural", parish="St. Andrew"),
    Constituency(name="St. Andrew Eastern", parish="St. Andrew"),
    Constituency(name="St. Andrew North Central", parish="St. Andrew"),
    Constituency(name="St. Andrew North Eastern", parish="St. Andrew"),
    Constituency(name="St. Andrew North Western", parish="St. Andrew"),
    Constituency(name="St. Andrew South Eastern", parish="St. Andrew"),
    Constituency(name="St. Andrew South Western", parish="St. Andrew"),
    Constituency(name="St. Andrew Southern", parish="St. Andrew"),
    Constituency(name="St. Andrew West Central", parish="St. Andrew"),
    Constituency(name="St. Andrew West Rural", parish="St. Andrew"),
    Constituency(name="St. Andrew Western", parish="St. Andrew"),
    # St. Catherine (11)
    Constituency(name="St. Catherine Central", parish="St. Catherine"),
    Constituency(name="St. Catherine East Central", parish="St. Catherine"),
    Constituency(name="St. Catherine Eastern", parish="St. Catherine"),
    Constituency(name="St. Catherine North Central", parish="St. Catherine"),
    Constituency(name="St. Catherine North Eastern", parish="St. Catherine"),
    Constituency(name="St. Catherine North Western", parish="St. Catherine"),
    Constituency(name="St. Catherine South Central", parish="St. Catherine"),
    Constituency(name="St. Catherine South Eastern", parish="St. Catherine"),
    Constituency(name="St. Catherine South Western", parish="St. Catherine"),
    Constituency(name="St. Catherine Southern", parish="St. Catherine"),
    Constituency(name="St. Catherine West Central", parish="St. Catherine"),
    # St. Thomas (2)
    Constituency(name="St. Thomas Eastern", parish="St. Thomas"),
    Constituency(name="St. Thomas Western", parish="St. Thomas"),
    # Portland (2)
    Constituency(name="Portland Eastern", parish="Portland"),
    Constituency(name="Portland Western", parish="Portland"),
    # St. Mary (3)
    Constituency(name="St. Mary Central", parish="St. Mary"),
    Constituency(name="St. Mary South Eastern", parish="St. Mary"),
    Constituency(name="St. Mary Western", parish="St. Mary"),
    # St. Ann (4)
    Constituency(name="St. Ann North Eastern", parish="St. Ann"),
    Constituency(name="St. Ann North Western", parish="St. Ann"),
    Constituency(name="St. Ann South Eastern", parish="St. Ann"),
    Constituency(name="St. Ann South Western", parish="St. Ann"),
    # Trelawny (2)
    Constituency(name="Trelawny Northern", parish="Trelawny"),
    Constituency(name="Trelawny Southern", parish="Trelawny"),
    # St. James (5)
    Constituency(name="St. James Central", parish="St. James"),
    Constituency(name="St. James East Central", parish="St. James"),
    Constituency(name="St. James North Western", parish="St. James"),
    Constituency(name="St. James Southern", parish="St. James"),
    Constituency(name="St. James West Central", parish="St. James"),
    # Hanover (2)
    Constituency(name="Hanover Eastern", parish="Hanover"),
    Constituency(name="Hanover Western", parish="Hanover"),
    # Clarendon (6)
    Constituency(name="Clarendon Central", parish="Clarendon"),
    Constituency(name="Clarendon North Central", parish="Clarendon"),
    Constituency(name="Clarendon North Western", parish="Clarendon"),
    Constituency(name="Clarendon Northern", parish="Clarendon"),
    Constituency(name="Clarendon South Eastern", parish="Clarendon"),
    Constituency(name="Clarendon South Western", parish="Clarendon"),
    # Manchester (4)
    Constituency(name="Manchester Central", parish="Manchester"),
    Constituency(name="Manchester North Eastern", parish="Manchester"),
    Constituency(name="Manchester North Western", parish="Manchester"),
    Constituency(name="Manchester Southern", parish="Manchester"),
    # St. Elizabeth (4)
    Constituency(name="St. Elizabeth North Eastern", parish="St. Elizabeth"),
    Constituency(name="St. Elizabeth North Western", parish="St. Elizabeth"),
    Constituency(name="St. Elizabeth South Eastern", parish="St. Elizabeth"),
    Constituency(name="St. Elizabeth South Western", parish="St. Elizabeth"),
    # Westmoreland (3)
    Constituency(name="Westmoreland Central", parish="Westmoreland"),
    Constituency(name="Westmoreland Eastern", parish="Westmoreland"),
    Constituency(name="Westmoreland Western", parish="Westmoreland"),
)

# ---------------------------------------------------------------------------
# Pre-built lookup maps
# ---------------------------------------------------------------------------

_BY_NAME_LOWER: dict[str, Constituency] = {
    c.name.lower(): c for c in _CONSTITUENCIES
}

_BY_PARISH_LOWER: dict[str, list[Constituency]] = {}
for _c in _CONSTITUENCIES:
    _key = _c.parish.lower()
    _BY_PARISH_LOWER.setdefault(_key, []).append(_c)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def get_constituencies() -> list[Constituency]:
    """Return all 63 constituencies as a new list."""
    return list(_CONSTITUENCIES)


def get_constituency_by_parish(parish: str) -> list[Constituency]:
    """Return all constituencies within a given parish (case-insensitive).

    Returns an empty list when the parish is not found.
    """
    result = _BY_PARISH_LOWER.get(parish.lower())
    if result is None:
        return []
    return list(result)


def get_constituency(name: str) -> Constituency | None:
    """Look up a single constituency by its exact name (case-insensitive).

    Returns ``None`` when no match is found.
    """
    return _BY_NAME_LOWER.get(name.lower())


def search_constituencies(query: str) -> list[Constituency]:
    """Search constituencies by substring match on the name (case-insensitive).

    Returns a new list of matching constituencies.
    """
    needle = query.lower()
    return [c for c in _CONSTITUENCIES if needle in c.name.lower()]


def get_constituency_count() -> int:
    """Return the total number of constituencies (always 63)."""
    return len(_CONSTITUENCIES)


def get_constituency_count_by_parish() -> dict[str, int]:
    """Return a dict mapping each parish name to its constituency count."""
    result: dict[str, int] = {}
    for c in _CONSTITUENCIES:
        result[c.parish] = result.get(c.parish, 0) + 1
    return result


def get_parishes() -> list[str]:
    """Return the unique list of parishes that have constituencies, in alphabetical order."""
    seen: set[str] = set()
    for c in _CONSTITUENCIES:
        seen.add(c.parish)
    return sorted(seen)
