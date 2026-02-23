"""jamaica-currency - JMD currency formatting, parsing, and conversion utilities."""

from __future__ import annotations

import math
import re
from dataclasses import dataclass

__all__ = [
    "GCT_RATE",
    "TELECOM_GCT_RATE",
    "DEFAULT_EXCHANGE_RATE",
    "FormatOptions",
    "GCTBreakdown",
    "format_jmd",
    "parse_jmd",
    "format_usd",
    "jmd_to_usd",
    "usd_to_jmd",
    "add_gct",
    "remove_gct",
    "add_telecom_gct",
    "format_with_gct",
]

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

GCT_RATE: float = 0.15
"""Standard General Consumption Tax rate (15%)."""

TELECOM_GCT_RATE: float = 0.25
"""Telecom-specific GCT rate (25%)."""

DEFAULT_EXCHANGE_RATE: float = 155.47
"""Default JMD-to-USD exchange rate (approx. Feb 2026).

**For development and testing only.** For production applications, always
fetch the current exchange rate from the Bank of Jamaica (BOJ) or a
reliable FX API. The JMD/USD rate fluctuates daily.
"""

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class FormatOptions:
    """Options accepted by :func:`format_jmd`."""

    show_symbol: bool = True
    """Whether to include the ``J$`` symbol prefix."""

    decimals: int = 2
    """Number of decimal places."""

    use_grouping: bool = True
    """Whether to use comma grouping (e.g. ``1,000``)."""


@dataclass(frozen=True)
class GCTBreakdown:
    """Breakdown returned by :func:`format_with_gct`."""

    base: str
    """Formatted base amount before GCT."""

    gct: str
    """Formatted GCT amount."""

    total: str
    """Formatted total (base + GCT)."""


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _round_to(value: float, decimals: int) -> float:
    """Round using 'round half away from zero' to match JS Math.round behaviour."""
    if decimals < 0:
        raise ValueError("decimals must be >= 0")
    factor = 10 ** decimals
    return math.floor(value * factor + 0.5) / factor


def _format_absolute(abs_value: float, decimals: int, use_grouping: bool) -> str:
    """Format an absolute numeric value with optional grouping and fixed decimals."""
    rounded = _round_to(abs_value, decimals)
    fixed = f"{rounded:.{decimals}f}"

    if not use_grouping:
        return fixed

    int_part, *dec_parts = fixed.split(".")
    # Add comma grouping to integer part
    grouped = ""
    for i, ch in enumerate(reversed(int_part)):
        if i > 0 and i % 3 == 0:
            grouped = "," + grouped
        grouped = ch + grouped

    if dec_parts:
        return f"{grouped}.{dec_parts[0]}"
    return grouped


# ---------------------------------------------------------------------------
# Formatting
# ---------------------------------------------------------------------------

def format_jmd(amount: float, options: FormatOptions | None = None) -> str:
    """Format a numeric amount as a JMD currency string.

    Examples::

        >>> format_jmd(1234.56)
        'J$1,234.56'
        >>> format_jmd(1234.56, FormatOptions(show_symbol=False))
        '1,234.56'
        >>> format_jmd(1234.56, FormatOptions(decimals=0))
        'J$1,235'
    """
    if options is None:
        options = FormatOptions()

    is_negative = amount < 0
    abs_val = abs(amount)
    formatted = _format_absolute(abs_val, options.decimals, options.use_grouping)
    symbol = "J$" if options.show_symbol else ""

    sign = "-" if is_negative else ""
    return f"{sign}{symbol}{formatted}"


def parse_jmd(formatted: str) -> float | None:
    """Parse a JMD-formatted string back into a number.

    Accepts strings like ``"J$1,234.56"``, ``"1234.56"``, ``"-J$500.75"``,
    and strings with surrounding whitespace. Returns ``None`` when the input
    cannot be parsed into a meaningful number.
    """
    if formatted is None:
        return None

    s = formatted.strip()
    if not s:
        return None

    # Detect and remove leading negative sign
    negative = False
    if s.startswith("-"):
        negative = True
        s = s[1:].strip()

    # Remove "J$" prefix (with optional space after)
    if s.startswith("J$"):
        s = s[2:].strip()

    # After stripping symbol there must be something left
    if not s:
        return None

    # Remove commas
    s = s.replace(",", "")

    # Validate remaining is a well-formed number
    if not re.match(r"^\d+(\.\d+)?$", s):
        return None

    try:
        value = float(s)
    except ValueError:
        return None

    return -value if negative else value


def format_usd(amount: float) -> str:
    """Format a numeric amount as a USD currency string.

    Example::

        >>> format_usd(1234.56)
        'US$1,234.56'
    """
    is_negative = amount < 0
    abs_val = abs(amount)
    formatted = _format_absolute(abs_val, 2, True)
    sign = "-" if is_negative else ""
    return f"{sign}US${formatted}"


# ---------------------------------------------------------------------------
# Conversion
# ---------------------------------------------------------------------------

def jmd_to_usd(jmd: float, rate: float = DEFAULT_EXCHANGE_RATE) -> float:
    """Convert a JMD amount to USD.

    Args:
        jmd: Amount in Jamaican dollars.
        rate: Exchange rate (JMD per 1 USD).

    Returns:
        Equivalent amount in US dollars (rounded to 3 decimal places).
    """
    return _round_to(jmd / rate, 3)


def usd_to_jmd(usd: float, rate: float = DEFAULT_EXCHANGE_RATE) -> float:
    """Convert a USD amount to JMD.

    Args:
        usd: Amount in US dollars.
        rate: Exchange rate (JMD per 1 USD).

    Returns:
        Equivalent amount in Jamaican dollars (rounded to 2 decimal places).
    """
    return _round_to(usd * rate, 2)


# ---------------------------------------------------------------------------
# GCT (General Consumption Tax)
# ---------------------------------------------------------------------------

def add_gct(amount: float, rate: float = GCT_RATE) -> float:
    """Add GCT to a base amount.

    Args:
        amount: Base amount before tax.
        rate: GCT rate as a decimal (e.g. 0.15 for 15%).
    """
    return amount * (1 + rate)


def remove_gct(amount_with_gct: float, rate: float = GCT_RATE) -> float:
    """Remove GCT from a tax-inclusive amount to recover the base price.

    Args:
        amount_with_gct: Total amount inclusive of GCT.
        rate: GCT rate as a decimal.
    """
    return amount_with_gct / (1 + rate)


def add_telecom_gct(amount: float) -> float:
    """Add the telecom-specific GCT (25%) to a base amount."""
    return amount * (1 + TELECOM_GCT_RATE)


def format_with_gct(amount: float) -> GCTBreakdown:
    """Return a formatted breakdown of an amount with standard GCT applied.

    Example::

        >>> format_with_gct(1000)
        GCTBreakdown(base='J$1,000.00', gct='J$150.00', total='J$1,150.00')
    """
    gct_amount = _round_to(amount * GCT_RATE, 2)
    total = _round_to(amount + gct_amount, 2)
    return GCTBreakdown(
        base=format_jmd(amount),
        gct=format_jmd(gct_amount),
        total=format_jmd(total),
    )
