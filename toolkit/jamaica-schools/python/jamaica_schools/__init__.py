"""Jamaica schools and universities directory.

Search, filter by parish, type, level, and ownership.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------

SchoolType = Literal[
    "infant",
    "primary",
    "all-age",
    "primary-junior-high",
    "secondary",
    "technical",
    "tertiary",
]

SchoolLevel = Literal[
    "early-childhood",
    "primary",
    "secondary",
    "tertiary",
]

SchoolOwnership = Literal[
    "government",
    "government-aided",
    "independent",
    "church",
]

# ---------------------------------------------------------------------------
# School dataclass
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class School:
    """Immutable representation of a Jamaican school."""

    name: str
    type: SchoolType
    level: SchoolLevel
    ownership: SchoolOwnership
    parish: str
    is_university: bool
    address: str | None = None


# ---------------------------------------------------------------------------
# Valid parishes
# ---------------------------------------------------------------------------

PARISHES: tuple[str, ...] = (
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

_PARISH_LOOKUP: dict[str, str] = {p.lower(): p for p in PARISHES}

# ---------------------------------------------------------------------------
# School data
# ---------------------------------------------------------------------------

_SCHOOLS: tuple[School, ...] = (
    # ── Kingston ── Secondary ─────────────────────────────────────────────
    School(name="Kingston Technical High School", type="secondary", level="secondary", ownership="government", parish="Kingston", is_university=False),
    School(name="Kingston College", type="secondary", level="secondary", ownership="government-aided", parish="Kingston", is_university=False),
    School(name="Wolmer's Boys' School", type="secondary", level="secondary", ownership="government-aided", parish="Kingston", is_university=False),
    School(name="Wolmer's Girls' School", type="secondary", level="secondary", ownership="government-aided", parish="Kingston", is_university=False),
    School(name="St Hugh's High School", type="secondary", level="secondary", ownership="government-aided", parish="Kingston", is_university=False),
    School(name="Campion College", type="secondary", level="secondary", ownership="government-aided", parish="Kingston", is_university=False),
    School(name="Immaculate Conception High School", type="secondary", level="secondary", ownership="church", parish="Kingston", is_university=False),
    # ── Kingston ── Primary ───────────────────────────────────────────────
    School(name="Mona Heights Primary School", type="primary", level="primary", ownership="government", parish="Kingston", is_university=False),
    # ── Kingston ── Tertiary / Universities ───────────────────────────────
    School(name="University of the West Indies, Mona", type="tertiary", level="tertiary", ownership="government", parish="Kingston", is_university=True),
    School(name="University of Technology, Jamaica", type="tertiary", level="tertiary", ownership="government", parish="Kingston", is_university=True),
    School(name="Caribbean Maritime University", type="tertiary", level="tertiary", ownership="government", parish="Kingston", is_university=True),
    School(name="The Mico University College", type="tertiary", level="tertiary", ownership="government-aided", parish="Kingston", is_university=True),
    School(name="Edna Manley College of the Visual and Performing Arts", type="tertiary", level="tertiary", ownership="government", parish="Kingston", is_university=True),
    School(name="University of the Commonwealth Caribbean", type="tertiary", level="tertiary", ownership="independent", parish="Kingston", is_university=True),
    # ── St. Andrew ── Secondary ───────────────────────────────────────────
    School(name="Jamaica College", type="secondary", level="secondary", ownership="government-aided", parish="St. Andrew", is_university=False),
    School(name="St. Andrew High School for Girls", type="secondary", level="secondary", ownership="government-aided", parish="St. Andrew", is_university=False),
    School(name="Ardenne High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Andrew", is_university=False),
    School(name="Meadowbrook High School", type="secondary", level="secondary", ownership="government", parish="St. Andrew", is_university=False),
    School(name="Holy Trinity High School", type="secondary", level="secondary", ownership="church", parish="St. Andrew", is_university=False),
    School(name="Alpha Academy", type="secondary", level="secondary", ownership="church", parish="St. Andrew", is_university=False),
    School(name="Excelsior High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Andrew", is_university=False),
    # ── St. Andrew ── Primary ─────────────────────────────────────────────
    School(name="Half Way Tree Primary School", type="primary", level="primary", ownership="government", parish="St. Andrew", is_university=False),
    # ── St. Catherine ── Secondary ────────────────────────────────────────
    School(name="St. Jago High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Catherine", is_university=False),
    School(name="St. Catherine High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Catherine", is_university=False),
    School(name="Charlemont High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Catherine", is_university=False),
    School(name="Old Harbour High School", type="secondary", level="secondary", ownership="government", parish="St. Catherine", is_university=False),
    School(name="Glenmuir High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Catherine", is_university=False),
    # ── St. Catherine ── Primary ──────────────────────────────────────────
    School(name="Spanish Town Primary School", type="primary", level="primary", ownership="government", parish="St. Catherine", is_university=False),
    # ── Clarendon ── Secondary ────────────────────────────────────────────
    School(name="Clarendon College", type="secondary", level="secondary", ownership="government-aided", parish="Clarendon", is_university=False),
    School(name="Lennon High School", type="secondary", level="secondary", ownership="government", parish="Clarendon", is_university=False),
    # ── Clarendon ── Primary ──────────────────────────────────────────────
    School(name="Hayes Primary School", type="primary", level="primary", ownership="government", parish="Clarendon", is_university=False),
    School(name="May Pen Primary School", type="primary", level="primary", ownership="government", parish="Clarendon", is_university=False),
    # ── Manchester ── Secondary ───────────────────────────────────────────
    School(name="Manchester High School", type="secondary", level="secondary", ownership="government-aided", parish="Manchester", is_university=False),
    School(name="deCarteret College", type="secondary", level="secondary", ownership="government-aided", parish="Manchester", is_university=False),
    School(name="Belair High School", type="secondary", level="secondary", ownership="government-aided", parish="Manchester", is_university=False),
    # ── Manchester ── Primary ─────────────────────────────────────────────
    School(name="Mandeville Primary School", type="primary", level="primary", ownership="government", parish="Manchester", is_university=False),
    # ── Manchester ── Tertiary ────────────────────────────────────────────
    School(name="Northern Caribbean University", type="tertiary", level="tertiary", ownership="church", parish="Manchester", is_university=True),
    # ── St. Elizabeth ── Secondary ────────────────────────────────────────
    School(name="Munro College", type="secondary", level="secondary", ownership="government-aided", parish="St. Elizabeth", is_university=False),
    School(name="Hampton School", type="secondary", level="secondary", ownership="government-aided", parish="St. Elizabeth", is_university=False),
    School(name="Lacovia High School", type="secondary", level="secondary", ownership="government", parish="St. Elizabeth", is_university=False),
    # ── St. Elizabeth ── Primary ──────────────────────────────────────────
    School(name="Black River Primary School", type="primary", level="primary", ownership="government", parish="St. Elizabeth", is_university=False),
    # ── Westmoreland ── Secondary ─────────────────────────────────────────
    School(name="Manning's School", type="secondary", level="secondary", ownership="government-aided", parish="Westmoreland", is_university=False),
    School(name="Godfrey Stewart High School", type="secondary", level="secondary", ownership="government", parish="Westmoreland", is_university=False),
    # ── Westmoreland ── Primary ───────────────────────────────────────────
    School(name="Savanna-la-Mar Primary School", type="primary", level="primary", ownership="government", parish="Westmoreland", is_university=False),
    # ── Hanover ── Secondary ──────────────────────────────────────────────
    School(name="Rusea's High School", type="secondary", level="secondary", ownership="government-aided", parish="Hanover", is_university=False),
    School(name="Green Island High School", type="secondary", level="secondary", ownership="government", parish="Hanover", is_university=False),
    # ── Hanover ── Primary ────────────────────────────────────────────────
    School(name="Lucea Primary School", type="primary", level="primary", ownership="government", parish="Hanover", is_university=False),
    # ── St. James ── Secondary ────────────────────────────────────────────
    School(name="Cornwall College", type="secondary", level="secondary", ownership="government-aided", parish="St. James", is_university=False),
    School(name="Montego Bay High School", type="secondary", level="secondary", ownership="government-aided", parish="St. James", is_university=False),
    School(name="Herbert Morrison Technical High School", type="secondary", level="secondary", ownership="government", parish="St. James", is_university=False),
    School(name="Mount Alvernia High School", type="secondary", level="secondary", ownership="church", parish="St. James", is_university=False),
    # ── St. James ── Primary ──────────────────────────────────────────────
    School(name="Montego Bay Primary School", type="primary", level="primary", ownership="government", parish="St. James", is_university=False),
    # ── Trelawny ── Secondary ─────────────────────────────────────────────
    School(name="William Knibb Memorial High School", type="secondary", level="secondary", ownership="government-aided", parish="Trelawny", is_university=False),
    School(name="Albert Town High School", type="secondary", level="secondary", ownership="government", parish="Trelawny", is_university=False),
    # ── Trelawny ── All-Age ───────────────────────────────────────────────
    School(name="Falmouth All-Age School", type="all-age", level="primary", ownership="government", parish="Trelawny", is_university=False),
    # ── Trelawny ── Primary ───────────────────────────────────────────────
    School(name="Falmouth Primary School", type="primary", level="primary", ownership="government", parish="Trelawny", is_university=False),
    # ── St. Ann ── Secondary ──────────────────────────────────────────────
    School(name="St. Hilda's Diocesan High School", type="secondary", level="secondary", ownership="church", parish="St. Ann", is_university=False),
    School(name="York Castle High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Ann", is_university=False),
    School(name="Marcus Garvey Technical High School", type="secondary", level="secondary", ownership="government", parish="St. Ann", is_university=False),
    School(name="Brown's Town High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Ann", is_university=False),
    # ── St. Ann ── Primary ────────────────────────────────────────────────
    School(name="St. Ann's Bay Primary School", type="primary", level="primary", ownership="government", parish="St. Ann", is_university=False),
    # ── St. Mary ── Secondary ─────────────────────────────────────────────
    School(name="St. Mary High School", type="secondary", level="secondary", ownership="government", parish="St. Mary", is_university=False),
    School(name="Port Maria High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Mary", is_university=False),
    School(name="Carron Hall High School", type="secondary", level="secondary", ownership="church", parish="St. Mary", is_university=False),
    # ── St. Mary ── Primary ───────────────────────────────────────────────
    School(name="Port Maria Primary School", type="primary", level="primary", ownership="government", parish="St. Mary", is_university=False),
    # ── Portland ── Secondary ─────────────────────────────────────────────
    School(name="Titchfield High School", type="secondary", level="secondary", ownership="government-aided", parish="Portland", is_university=False),
    School(name="Happy Grove High School", type="secondary", level="secondary", ownership="government-aided", parish="Portland", is_university=False),
    School(name="Port Antonio High School", type="secondary", level="secondary", ownership="government", parish="Portland", is_university=False),
    # ── Portland ── Primary ───────────────────────────────────────────────
    School(name="Port Antonio Primary School", type="primary", level="primary", ownership="government", parish="Portland", is_university=False),
    # ── Portland ── Tertiary ──────────────────────────────────────────────
    School(name="College of Agriculture, Science and Education", type="tertiary", level="tertiary", ownership="government", parish="Portland", is_university=True),
    # ── St. Thomas ── Secondary ───────────────────────────────────────────
    School(name="Morant Bay High School", type="secondary", level="secondary", ownership="government-aided", parish="St. Thomas", is_university=False),
    School(name="Seaforth High School", type="secondary", level="secondary", ownership="government", parish="St. Thomas", is_university=False),
    School(name="St. Thomas Technical High School", type="secondary", level="secondary", ownership="government", parish="St. Thomas", is_university=False),
    # ── St. Thomas ── Primary ─────────────────────────────────────────────
    School(name="Morant Bay Primary School", type="primary", level="primary", ownership="government", parish="St. Thomas", is_university=False),
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _resolve_parish(parish: str) -> str:
    """Resolve a parish name case-insensitively.

    Returns the canonical parish name.
    Raises ``ValueError`` if the parish is not valid.
    """
    canonical = _PARISH_LOOKUP.get(parish.lower())
    if canonical is None:
        raise ValueError(
            f"Invalid parish: {parish!r}. "
            f"Valid parishes are: {', '.join(PARISHES)}"
        )
    return canonical


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def get_schools() -> list[School]:
    """Return a list of every school in the directory."""
    return list(_SCHOOLS)


def get_schools_by_parish(parish: str) -> list[School]:
    """Return all schools in the given parish.

    Parish matching is case-insensitive.
    Raises ``ValueError`` for invalid parish names.
    """
    canonical = _resolve_parish(parish)
    return [s for s in _SCHOOLS if s.parish == canonical]


def get_schools_by_type(school_type: SchoolType) -> list[School]:
    """Return all schools of the given type."""
    return [s for s in _SCHOOLS if s.type == school_type]


def get_schools_by_level(level: SchoolLevel) -> list[School]:
    """Return all schools at the given level."""
    return [s for s in _SCHOOLS if s.level == level]


def get_schools_by_ownership(ownership: SchoolOwnership) -> list[School]:
    """Return all schools with the given ownership."""
    return [s for s in _SCHOOLS if s.ownership == ownership]


def get_school(name: str) -> School | None:
    """Find a single school by name.

    First tries an exact case-insensitive match, then falls back to the first
    partial (substring) match.  Returns ``None`` when no school matches.
    """
    lower = name.lower()

    # Exact match first
    for s in _SCHOOLS:
        if s.name.lower() == lower:
            return s

    # Partial match
    for s in _SCHOOLS:
        if lower in s.name.lower():
            return s

    return None


def get_universities() -> list[School]:
    """Return all universities (schools where ``is_university`` is ``True``)."""
    return [s for s in _SCHOOLS if s.is_university]


def search_schools(query: str) -> list[School]:
    """Search schools by name (case-insensitive substring match).

    Returns all matching schools.
    """
    lower = query.lower()
    return [s for s in _SCHOOLS if lower in s.name.lower()]


def get_school_count() -> int:
    """Return the total number of schools in the directory."""
    return len(_SCHOOLS)


def get_school_count_by_parish() -> dict[str, int]:
    """Return a mapping of parish name to school count."""
    counts: dict[str, int] = {}
    for s in _SCHOOLS:
        counts[s.parish] = counts.get(s.parish, 0) + 1
    return counts


# ---------------------------------------------------------------------------
# __all__
# ---------------------------------------------------------------------------

__all__ = [
    # Types
    "SchoolType",
    "SchoolLevel",
    "SchoolOwnership",
    "School",
    # Constants
    "PARISHES",
    # Functions
    "get_schools",
    "get_schools_by_parish",
    "get_schools_by_type",
    "get_schools_by_level",
    "get_schools_by_ownership",
    "get_school",
    "get_universities",
    "search_schools",
    "get_school_count",
    "get_school_count_by_parish",
]
