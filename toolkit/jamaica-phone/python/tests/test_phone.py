"""Tests for jamaica_phone, driven by the shared test vectors."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from jamaica_phone import (
    format_e164,
    format_international,
    format_local,
    format_national,
    get_carrier,
    is_area_code_658,
    is_area_code_876,
    is_mobile,
    is_valid_jamaican_number,
    parse_phone,
)

# ── Load shared test vectors ───────────────────────────────────────────────

_VECTORS_PATH = Path(__file__).resolve().parent.parent.parent / "shared-tests" / "vectors.json"
_VECTORS = json.loads(_VECTORS_PATH.read_text(encoding="utf-8"))


# ── Validation ─────────────────────────────────────────────────────────────


class TestIsValidJamaicanNumber:
    @pytest.mark.parametrize(
        "vector",
        _VECTORS["valid_numbers"],
        ids=[v["description"] for v in _VECTORS["valid_numbers"]],
    )
    def test_valid_numbers(self, vector: dict) -> None:
        expected = vector["expected"]["isValid"]
        assert is_valid_jamaican_number(vector["input"]) is expected

    @pytest.mark.parametrize(
        "vector",
        _VECTORS["invalid_numbers"],
        ids=[v["description"] for v in _VECTORS["invalid_numbers"]],
    )
    def test_invalid_numbers(self, vector: dict) -> None:
        assert is_valid_jamaican_number(vector["input"]) is False


# ── Parsing ────────────────────────────────────────────────────────────────


class TestParsePhone:
    @pytest.mark.parametrize(
        "vector",
        [v for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
        ids=[v["description"] for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
    )
    def test_parse_valid(self, vector: dict) -> None:
        result = parse_phone(vector["input"])
        assert result is not None
        assert result.country_code == vector["expected"]["countryCode"]
        assert result.area_code == vector["expected"]["areaCode"]
        assert result.local_number == vector["expected"]["localNumber"]
        assert result.is_valid is True

    def test_parse_invalid_returns_none(self) -> None:
        assert parse_phone("not-a-number") is None


# ── Formatting ─────────────────────────────────────────────────────────────


class TestFormatLocal:
    @pytest.mark.parametrize(
        "vector",
        [v for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
        ids=[v["description"] for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
    )
    def test_format(self, vector: dict) -> None:
        assert format_local(vector["input"]) == vector["expected"]["local"]

    def test_raises_for_invalid(self) -> None:
        with pytest.raises(ValueError):
            format_local("invalid")


class TestFormatNational:
    @pytest.mark.parametrize(
        "vector",
        [v for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
        ids=[v["description"] for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
    )
    def test_format(self, vector: dict) -> None:
        assert format_national(vector["input"]) == vector["expected"]["national"]


class TestFormatE164:
    @pytest.mark.parametrize(
        "vector",
        [v for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
        ids=[v["description"] for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
    )
    def test_format(self, vector: dict) -> None:
        assert format_e164(vector["input"]) == vector["expected"]["e164"]


class TestFormatInternational:
    @pytest.mark.parametrize(
        "vector",
        [v for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
        ids=[v["description"] for v in _VECTORS["valid_numbers"] if v["expected"]["isValid"]],
    )
    def test_format(self, vector: dict) -> None:
        assert format_international(vector["input"]) == vector["expected"]["international"]


# ── Carrier detection ─────────────────────────────────────────────────────


class TestGetCarrier:
    @pytest.mark.parametrize(
        "vector",
        _VECTORS["carrier_detection"],
        ids=[v["description"] for v in _VECTORS["carrier_detection"]],
    )
    def test_carrier(self, vector: dict) -> None:
        assert get_carrier(vector["input"]) == vector["expected_carrier"]

    def test_unknown_for_invalid(self) -> None:
        assert get_carrier("invalid") == "unknown"


# ── Area code helpers ──────────────────────────────────────────────────────


class TestAreaCode:
    @pytest.mark.parametrize(
        "vector",
        _VECTORS["area_code_tests"],
        ids=[v["input"] for v in _VECTORS["area_code_tests"]],
    )
    def test_area_code(self, vector: dict) -> None:
        assert is_area_code_876(vector["input"]) is vector["is876"]
        assert is_area_code_658(vector["input"]) is vector["is658"]

    def test_invalid_returns_false(self) -> None:
        assert is_area_code_876("invalid") is False
        assert is_area_code_658("invalid") is False


# ── Mobile detection ──────────────────────────────────────────────────────


class TestIsMobile:
    @pytest.mark.parametrize(
        "vector",
        _VECTORS["mobile_detection"],
        ids=[v["description"] for v in _VECTORS["mobile_detection"]],
    )
    def test_mobile(self, vector: dict) -> None:
        assert is_mobile(vector["input"]) is vector["isMobile"]

    def test_invalid_returns_false(self) -> None:
        assert is_mobile("invalid") is False
