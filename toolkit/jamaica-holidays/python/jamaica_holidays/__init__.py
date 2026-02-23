"""Jamaica public holidays and business day utilities.

Covers all gazetted public holidays including moveable feasts
(Easter-dependent) and fixed observances.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Sequence


@dataclass(frozen=True)
class Holiday:
    """A Jamaican public holiday."""

    date: str
    name: str
    moveable: bool
    note: str | None = None


# ---------------------------------------------------------------------------
# Easter (Anonymous Gregorian algorithm / Computus)
# ---------------------------------------------------------------------------


def _compute_easter_sunday(year: int) -> date:
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return date(year, month, day)


def _nth_weekday(year: int, month: int, weekday: int, n: int) -> date:
    """Return the *n*-th occurrence of *weekday* in *month*/*year*.

    *weekday*: 0 = Monday … 6 = Sunday (ISO convention).
    """
    first = date(year, month, 1)
    day = 1 + ((weekday - first.weekday()) % 7)
    day += (n - 1) * 7
    return date(year, month, day)


def _fmt(d: date) -> str:
    return d.isoformat()


def _parse(s: str) -> date:
    return date.fromisoformat(s)


# ---------------------------------------------------------------------------
# Holiday definitions
# ---------------------------------------------------------------------------


def _fixed_holidays(year: int) -> list[Holiday]:
    return [
        Holiday(f"{year}-01-01", "New Year's Day", moveable=False),
        Holiday(f"{year}-05-23", "Labour Day", moveable=False),
        Holiday(f"{year}-08-01", "Emancipation Day", moveable=False),
        Holiday(f"{year}-08-06", "Independence Day", moveable=False),
        Holiday(f"{year}-12-25", "Christmas Day", moveable=False),
        Holiday(f"{year}-12-26", "Boxing Day", moveable=False),
    ]


def _moveable_holidays(year: int) -> list[Holiday]:
    easter = _compute_easter_sunday(year)
    ash_wednesday = easter - timedelta(days=46)
    good_friday = easter - timedelta(days=2)
    easter_monday = easter + timedelta(days=1)
    heroes_day = _nth_weekday(year, 10, 0, 3)  # 3rd Monday of October

    return [
        Holiday(_fmt(ash_wednesday), "Ash Wednesday", moveable=True),
        Holiday(_fmt(good_friday), "Good Friday", moveable=True),
        Holiday(_fmt(easter_monday), "Easter Monday", moveable=True),
        Holiday(
            _fmt(heroes_day),
            "National Heroes Day",
            moveable=True,
            note="Third Monday of October",
        ),
    ]


# ---------------------------------------------------------------------------
# Sunday substitution rule
# ---------------------------------------------------------------------------


def _apply_sunday_substitution(holidays: list[Holiday]) -> list[Holiday]:
    """Apply Jamaica's Sunday-shift rule.

    When a fixed holiday falls on Sunday, the following Monday is observed.
    If a substitute displaces another holiday (e.g. Christmas Sun->Mon pushes
    Boxing Day Mon->Tue), the displaced holiday shifts to the next available day.
    """
    sorted_holidays = sorted(holidays, key=lambda h: h.date)
    observed_dates: set[str] = set()
    result: list[Holiday] = []

    for h in sorted_holidays:
        d = _parse(h.date)
        target_date = h.date

        if d.weekday() == 6:  # Sunday (ISO: Monday=0 ... Sunday=6)
            substitute = d + timedelta(days=1)
            while _fmt(substitute) in observed_dates:
                substitute += timedelta(days=1)
            target_date = _fmt(substitute)
            result.append(Holiday(
                date=target_date,
                name=h.name,
                moveable=h.moveable,
                note=f"Observed (substitute for {h.date})",
            ))
        elif h.date in observed_dates:
            # Date already taken by a prior substitute — shift forward
            substitute = d + timedelta(days=1)
            while _fmt(substitute) in observed_dates:
                substitute += timedelta(days=1)
            target_date = _fmt(substitute)
            result.append(Holiday(
                date=target_date,
                name=h.name,
                moveable=h.moveable,
                note=f"Observed (shifted due to conflict on {h.date})",
            ))
        else:
            result.append(h)

        observed_dates.add(target_date)

    return result


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def get_holidays(year: int) -> list[Holiday]:
    """Return all public holidays for *year*, sorted by date.

    Fixed holidays that fall on Sunday are shifted to Monday (Jamaica law).
    """
    fixed = _apply_sunday_substitution(_fixed_holidays(year))
    moveable = _moveable_holidays(year)
    all_holidays = fixed + moveable
    return sorted(all_holidays, key=lambda h: h.date)


def is_public_holiday(d: date | str) -> bool:
    """Return ``True`` if *d* is a Jamaican public holiday."""
    if isinstance(d, str):
        d = _parse(d)
    ds = _fmt(d)
    return any(h.date == ds for h in get_holidays(d.year))


def get_next_holiday(from_date: date | str | None = None) -> Holiday | None:
    """Return the next upcoming holiday after *from_date*."""
    if from_date is None:
        from_date = date.today()
    elif isinstance(from_date, str):
        from_date = _parse(from_date)

    ds = _fmt(from_date)
    for h in get_holidays(from_date.year):
        if h.date > ds:
            return h
    # Wrap to next year
    next_year = get_holidays(from_date.year + 1)
    return next_year[0] if next_year else None


def is_business_day(d: date | str) -> bool:
    """Return ``True`` if *d* is a business day (weekday and not a holiday)."""
    if isinstance(d, str):
        d = _parse(d)
    if d.weekday() >= 5:  # Saturday=5, Sunday=6
        return False
    return not is_public_holiday(d)


def get_working_days(from_date: date | str, to_date: date | str) -> int:
    """Count business days from *from_date* (inclusive) to *to_date* (exclusive)."""
    if isinstance(from_date, str):
        from_date = _parse(from_date)
    if isinstance(to_date, str):
        to_date = _parse(to_date)

    count = 0
    current = from_date
    while current < to_date:
        if is_business_day(current):
            count += 1
        current += timedelta(days=1)
    return count


def get_easter_sunday(year: int) -> str:
    """Return the date of Easter Sunday for *year* as ``YYYY-MM-DD``."""
    return _fmt(_compute_easter_sunday(year))
