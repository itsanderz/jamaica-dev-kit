"""
jamaica-phone

Validates and formats Jamaican phone numbers.
Jamaica is part of the NANP (country code +1) with area codes 876 and 658.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Literal

__all__ = [
    "Carrier",
    "ParsedPhone",
    "is_valid_jamaican_number",
    "parse_phone",
    "format_local",
    "format_national",
    "format_e164",
    "format_international",
    "get_carrier",
    "is_area_code_876",
    "is_area_code_658",
    "is_mobile",
]

# ── Types ──────────────────────────────────────────────────────────────────

Carrier = Literal["flow", "digicel", "landline", "unknown"]


@dataclass(frozen=True, slots=True)
class ParsedPhone:
    """Structured representation of a parsed Jamaican phone number."""

    country_code: str
    """NANP country code, always ``"1"``."""

    area_code: str
    """Jamaican area code: ``"876"`` or ``"658"``."""

    local_number: str
    """Seven-digit local subscriber number (no separators)."""

    is_valid: bool
    """Whether the number passed all validation checks."""


# ── Constants ──────────────────────────────────────────────────────────────

_VALID_AREA_CODES = frozenset({"876", "658"})
_NON_DIGIT_RE = re.compile(r"\D")

# ── Internal helpers ───────────────────────────────────────────────────────


def _strip_to_digits(phone: str) -> tuple[str, bool]:
    """Return (digits_only, had_leading_plus)."""
    trimmed = phone.strip()
    has_plus = trimmed.startswith("+")
    digits = _NON_DIGIT_RE.sub("", trimmed)
    return digits, has_plus


def _extract_ten_digits(phone: str) -> str | None:
    """
    Attempt to extract a 10-digit Jamaican number (area code + 7 local
    digits) from a raw input string.  Returns ``None`` if the input cannot
    be interpreted as a Jamaican number.
    """
    digits, has_plus = _strip_to_digits(phone)

    ten: str | None = None

    if has_plus:
        # Must start with "1" (country code) followed by 10 digits
        if len(digits) == 11 and digits.startswith("1"):
            ten = digits[1:]
    elif len(digits) == 10:
        ten = digits
    elif len(digits) == 11 and digits.startswith("1"):
        ten = digits[1:]

    if ten is None:
        return None

    area_code = ten[:3]
    if area_code not in _VALID_AREA_CODES:
        return None

    # NXX validation: the first digit of the 7-digit local portion must be 2-9
    exchange_digit = ten[3]
    if exchange_digit < "2" or exchange_digit > "9":
        return None

    return ten


# ── Public API ─────────────────────────────────────────────────────────────


def is_valid_jamaican_number(phone: str) -> bool:
    """
    Return ``True`` if *phone* can be interpreted as a valid Jamaican phone
    number in any common format.
    """
    return _extract_ten_digits(phone) is not None


def parse_phone(phone: str) -> ParsedPhone | None:
    """
    Parse a phone string into a structured :class:`ParsedPhone` object.

    Returns ``None`` when the input cannot be interpreted as a valid Jamaican
    number.
    """
    ten = _extract_ten_digits(phone)
    if ten is None:
        return None

    return ParsedPhone(
        country_code="1",
        area_code=ten[:3],
        local_number=ten[3:],
        is_valid=True,
    )


def format_local(phone: str) -> str:
    """
    Format as a 7-digit local number: ``NXX-XXXX``.

    Raises :class:`ValueError` if the input is invalid.
    """
    parsed = parse_phone(phone)
    if parsed is None:
        raise ValueError(f"Invalid Jamaican phone number: {phone}")
    ln = parsed.local_number
    return f"{ln[:3]}-{ln[3:]}"


def format_national(phone: str) -> str:
    """
    Format in national style: ``(876) NXX-XXXX``.

    Raises :class:`ValueError` if the input is invalid.
    """
    parsed = parse_phone(phone)
    if parsed is None:
        raise ValueError(f"Invalid Jamaican phone number: {phone}")
    ln = parsed.local_number
    return f"({parsed.area_code}) {ln[:3]}-{ln[3:]}"


def format_e164(phone: str) -> str:
    """
    Format in E.164: ``+1876NXXXXXX`` (no spaces or punctuation).

    Raises :class:`ValueError` if the input is invalid.
    """
    parsed = parse_phone(phone)
    if parsed is None:
        raise ValueError(f"Invalid Jamaican phone number: {phone}")
    return f"+{parsed.country_code}{parsed.area_code}{parsed.local_number}"


def format_international(phone: str) -> str:
    """
    Format in international style: ``+1 (876) NXX-XXXX``.

    Raises :class:`ValueError` if the input is invalid.
    """
    parsed = parse_phone(phone)
    if parsed is None:
        raise ValueError(f"Invalid Jamaican phone number: {phone}")
    ln = parsed.local_number
    return f"+{parsed.country_code} ({parsed.area_code}) {ln[:3]}-{ln[3:]}"


def get_carrier(phone: str) -> Carrier:
    """Best-guess carrier identification based on known prefix patterns.

    .. warning::
        **Unreliable since May 2015.** Jamaica introduced number
        portability, so subscribers can keep their number when switching
        carriers. This function uses original allocation prefixes only and
        should be treated as a rough heuristic. Do NOT use for billing,
        routing, or any decision requiring accurate carrier information.
        Use an HLR/MNP lookup service for production carrier detection.

    Heuristics (approximate, based on original allocations):

    * **Flow mobile:**    876-3[0-4]x, 876-4xx, 876-5xx
    * **Digicel mobile:** 876-2xx, 876-3[5-9]x, 876-8xx
    * **Landline:**       876-6xx, 876-7xx, 876-9xx
    * **658 area code:**  ``"unknown"`` (too new to map reliably)
    """
    parsed = parse_phone(phone)
    if parsed is None:
        return "unknown"

    # 658 overlay area code -- carrier mapping is not well established
    if parsed.area_code == "658":
        return "unknown"

    exchange = int(parsed.local_number[:3])
    first_digit = exchange // 100

    # Landline ranges: 6xx, 7xx, 9xx
    if first_digit in (6, 7, 9):
        return "landline"

    # Digicel ranges: 2xx, 8xx, 3[5-9]x
    if first_digit in (2, 8):
        return "digicel"

    if first_digit == 3:
        second_digit = (exchange % 100) // 10
        if second_digit >= 5:
            return "digicel"
        return "flow"

    # Flow ranges: 4xx, 5xx
    if first_digit in (4, 5):
        return "flow"

    return "unknown"


def is_area_code_876(phone: str) -> bool:
    """Return ``True`` if the number uses the original 876 area code."""
    parsed = parse_phone(phone)
    return parsed is not None and parsed.area_code == "876"


def is_area_code_658(phone: str) -> bool:
    """Return ``True`` if the number uses the newer 658 overlay area code."""
    parsed = parse_phone(phone)
    return parsed is not None and parsed.area_code == "658"


def is_mobile(phone: str) -> bool:
    """Best-guess mobile detection. Uses :func:`get_carrier` heuristics.

    .. warning::
        **Unreliable since May 2015** due to number portability.
        See :func:`get_carrier` for details.
    """
    carrier = get_carrier(phone)
    if carrier in ("flow", "digicel"):
        return True

    parsed = parse_phone(phone)
    if parsed is None:
        return False

    # 658 numbers are predominantly mobile
    if parsed.area_code == "658":
        return True

    return False
