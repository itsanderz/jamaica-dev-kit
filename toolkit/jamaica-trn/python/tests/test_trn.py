"""Tests for jamaica_trn, driven by shared test vectors."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from jamaica_trn import (
    format_trn,
    generate_test_trn,
    get_trn_check_digit,
    is_valid_trn,
    unformat_trn,
)

VECTORS_PATH = Path(__file__).resolve().parent.parent.parent / "shared-tests" / "vectors.json"
VECTORS = json.loads(VECTORS_PATH.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# is_valid_trn
# ---------------------------------------------------------------------------


class TestIsValidTRN:
    """Validation of raw and formatted TRNs."""

    @pytest.mark.parametrize(
        "vector",
        VECTORS["valid"],
        ids=[v["description"] for v in VECTORS["valid"]],
    )
    def test_valid_raw(self, vector: dict) -> None:
        assert is_valid_trn(vector["raw"]) is True

    @pytest.mark.parametrize(
        "vector",
        VECTORS["valid"],
        ids=[v["description"] for v in VECTORS["valid"]],
    )
    def test_valid_formatted(self, vector: dict) -> None:
        assert is_valid_trn(vector["formatted"]) is True

    @pytest.mark.parametrize(
        "vector",
        VECTORS["invalid"],
        ids=[v["reason"] for v in VECTORS["invalid"]],
    )
    def test_invalid(self, vector: dict) -> None:
        assert is_valid_trn(vector["input"]) is False


# ---------------------------------------------------------------------------
# format_trn
# ---------------------------------------------------------------------------


class TestFormatTRN:
    """Formatting TRNs into NNN-NNN-NNN."""

    @pytest.mark.parametrize(
        "vector",
        VECTORS["formatting"],
        ids=[v["input"].strip() for v in VECTORS["formatting"]],
    )
    def test_format(self, vector: dict) -> None:
        assert format_trn(vector["input"]) == vector["formatted"]

    def test_format_raises_on_invalid(self) -> None:
        with pytest.raises(ValueError):
            format_trn("12345")


# ---------------------------------------------------------------------------
# unformat_trn
# ---------------------------------------------------------------------------


class TestUnformatTRN:
    """Stripping TRNs to raw 9-digit form."""

    @pytest.mark.parametrize(
        "vector",
        VECTORS["unformatting"],
        ids=[v["input"].strip() for v in VECTORS["unformatting"]],
    )
    def test_unformat(self, vector: dict) -> None:
        assert unformat_trn(vector["input"]) == vector["raw"]


# ---------------------------------------------------------------------------
# get_trn_check_digit
# ---------------------------------------------------------------------------


class TestGetTRNCheckDigit:
    """Check digit calculation."""

    @pytest.mark.parametrize(
        "vector",
        VECTORS["checkDigit"],
        ids=[v.get("description", v["digits"]) for v in VECTORS["checkDigit"]],
    )
    def test_check_digit(self, vector: dict) -> None:
        assert get_trn_check_digit(vector["digits"]) == vector["expected"]


# ---------------------------------------------------------------------------
# generate_test_trn
# ---------------------------------------------------------------------------


class TestGenerateTestTRN:
    """Random TRN generation."""

    def test_generates_valid_trn(self) -> None:
        trn = generate_test_trn()
        assert len(trn) == 9
        assert trn.isdigit()
        assert is_valid_trn(trn) is True

    def test_generates_different_trns(self) -> None:
        trns = {generate_test_trn() for _ in range(20)}
        # With 20 random TRNs the probability of all being identical is negligible
        assert len(trns) > 1
