"""Jamaica Tax Registration Number (TRN) validator and formatter.

A TRN is a 9-digit number used for tax identification in Jamaica.
Format: NNN-NNN-NNN (display) or NNNNNNNNN (raw).
The 9th digit is a check digit computed using a weighted sum mod 11 algorithm.
"""

from __future__ import annotations

import random
import re

__all__ = [
    "is_valid_trn",
    "format_trn",
    "unformat_trn",
    "generate_test_trn",
    "get_trn_check_digit",
]

_WEIGHTS = (3, 7, 1, 3, 7, 1, 3, 7)
_RAW_PATTERN = re.compile(r"^\d{9}$")
_EIGHT_DIGITS = re.compile(r"^\d{8}$")


def unformat_trn(trn: str) -> str:
    """Strip a TRN string to its raw 9-digit form.

    Removes dashes and leading/trailing whitespace. If the input is already a
    raw 9-digit string it is returned unchanged (after trimming).

    Args:
        trn: A TRN string in any accepted format.

    Returns:
        The raw 9-digit string with all dashes and whitespace removed.
    """
    return trn.strip().replace("-", "")


def format_trn(trn: str) -> str:
    """Format a TRN as NNN-NNN-NNN.

    Accepts either a raw 9-digit string or an already-formatted string (with
    optional surrounding whitespace). The output is always in NNN-NNN-NNN form.

    Args:
        trn: A TRN string in any accepted format.

    Returns:
        The TRN formatted as NNN-NNN-NNN.

    Raises:
        ValueError: If the input does not contain exactly 9 digits.
    """
    raw = unformat_trn(trn)
    if not _RAW_PATTERN.match(raw):
        raise ValueError(f'Cannot format invalid TRN: "{trn}"')
    return f"{raw[:3]}-{raw[3:6]}-{raw[6:9]}"


def get_trn_check_digit(digits: str) -> int | None:
    """Calculate the check digit for a TRN given its first 8 digits.

    The algorithm multiplies each of the 8 digits by the corresponding weight
    [3, 7, 1, 3, 7, 1, 3, 7], sums the products, and takes the remainder
    mod 11. If the remainder is 0 the check digit is 0; otherwise the check
    digit is 11 minus the remainder. If the computed check digit is 10, the
    combination is invalid and ``None`` is returned.

    Args:
        digits: A string of exactly 8 numeric characters.

    Returns:
        The check digit (0--9), or ``None`` if the input is invalid or the
        computed check digit is 10.
    """
    if not _EIGHT_DIGITS.match(digits):
        return None

    total = sum(int(d) * w for d, w in zip(digits, _WEIGHTS))
    remainder = total % 11
    check = 0 if remainder == 0 else 11 - remainder

    return None if check == 10 else check


def is_valid_trn(trn: str) -> bool:
    """Validate a Jamaica TRN.

    Accepts both raw (``NNNNNNNNN``) and formatted (``NNN-NNN-NNN``) forms,
    with optional surrounding whitespace. Validation checks:

    1. The input contains exactly 9 digits (after stripping dashes/whitespace).
    2. The 9th digit matches the computed check digit.

    Args:
        trn: The TRN string to validate.

    Returns:
        ``True`` if the TRN is valid, ``False`` otherwise.
    """
    raw = unformat_trn(trn)

    if not _RAW_PATTERN.match(raw):
        return False

    prefix = raw[:8]
    provided = int(raw[8])
    expected = get_trn_check_digit(prefix)

    return expected is not None and provided == expected


def generate_test_trn() -> str:
    """Generate a random valid TRN for development and testing purposes.

    This function creates a random 8-digit prefix, computes the valid check
    digit, and returns the full 9-digit TRN. If the random prefix produces an
    invalid check digit (10), a new prefix is generated automatically.

    Warning:
        These TRNs are syntactically valid but are not real registered numbers.
        Do not use them for production data.

    Returns:
        A valid 9-digit TRN string.
    """
    check: int | None = None
    prefix = ""

    while check is None:
        prefix = "".join(str(random.randint(0, 9)) for _ in range(8))
        check = get_trn_check_digit(prefix)

    return f"{prefix}{check}"
