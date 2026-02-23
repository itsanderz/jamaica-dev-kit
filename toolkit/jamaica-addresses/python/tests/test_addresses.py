"""Tests for jamaica_addresses package."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from jamaica_addresses import (
    KINGSTON_SECTORS,
    PARISH_ALIASES,
    PARISH_NAMES,
    ParsedAddress,
    extract_parish,
    format_address,
    get_kingston_sector,
    is_kingston_address,
    normalize_address,
    parse_address,
)

# ---------------------------------------------------------------------------
# Load shared test vectors
# ---------------------------------------------------------------------------

_VECTORS_PATH = Path(__file__).resolve().parent.parent.parent / "shared-tests" / "vectors.json"
_VECTORS = json.loads(_VECTORS_PATH.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# Helper to map JS-style camelCase keys to Python snake_case
# ---------------------------------------------------------------------------

_KEY_MAP = {
    "streetNumber": "street_number",
    "streetName": "street_name",
    "unit": "unit",
    "community": "community",
    "district": "district",
    "parish": "parish",
    "kingstonSector": "kingston_sector",
    "raw": "raw",
}


def _to_snake(d: dict) -> dict:
    return {_KEY_MAP.get(k, k): v for k, v in d.items()}


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------


class TestKingstonSectors:
    def test_length(self) -> None:
        assert len(KINGSTON_SECTORS) == 20

    def test_contains_1_through_20(self) -> None:
        for i in range(1, 21):
            assert i in KINGSTON_SECTORS


class TestParishNames:
    def test_length(self) -> None:
        assert len(PARISH_NAMES) == 14

    def test_contains_all_parishes(self) -> None:
        expected = {
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
        }
        assert set(PARISH_NAMES) == expected


class TestParishAliases:
    def test_kgn(self) -> None:
        assert PARISH_ALIASES["kgn"] == "Kingston"

    def test_mobay(self) -> None:
        assert PARISH_ALIASES["mobay"] == "St. James"

    def test_sav(self) -> None:
        assert PARISH_ALIASES["sav"] == "Westmoreland"

    def test_ochi(self) -> None:
        assert PARISH_ALIASES["ochi"] == "St. Ann"

    def test_saint_variants(self) -> None:
        assert PARISH_ALIASES["saint andrew"] == "St. Andrew"
        assert PARISH_ALIASES["st andrew"] == "St. Andrew"


# ---------------------------------------------------------------------------
# parse_address
# ---------------------------------------------------------------------------


class TestParseAddress:
    def test_always_includes_raw(self) -> None:
        result = parse_address("test input")
        assert result.raw == "test input"

    def test_empty_string(self) -> None:
        result = parse_address("")
        assert result.raw == ""

    @pytest.mark.parametrize(
        "vector",
        _VECTORS["parseAddress"],
        ids=[v["input"] for v in _VECTORS["parseAddress"]],
    )
    def test_shared_vectors(self, vector: dict) -> None:
        result = parse_address(vector["input"])
        expected = _to_snake(vector["expected"])
        for key, value in expected.items():
            assert getattr(result, key) == value, (
                f"Mismatch on '{key}': expected {value!r}, "
                f"got {getattr(result, key)!r}"
            )

    def test_kingston_with_sector(self) -> None:
        result = parse_address("123 Main Street, Kingston 10")
        assert result.street_number == "123"
        assert result.street_name == "Main Street"
        assert result.parish == "Kingston"
        assert result.kingston_sector == 10

    def test_rural_lot(self) -> None:
        result = parse_address("Lot 5, Rose Hall, St. James")
        assert result.unit == "Lot 5"
        assert result.community == "Rose Hall"
        assert result.parish == "St. James"

    def test_commercial(self) -> None:
        result = parse_address("Shop 3, Town Centre Plaza, May Pen, Clarendon")
        assert result.unit == "Shop 3"
        assert result.street_name == "Town Centre Plaza"
        assert result.community == "May Pen"
        assert result.parish == "Clarendon"

    def test_district(self) -> None:
        result = parse_address("District of Accompong, St. Elizabeth")
        assert result.district == "Accompong"
        assert result.parish == "St. Elizabeth"

    def test_landmark_parish(self) -> None:
        result = parse_address("Half Way Tree, St. Andrew")
        assert result.community == "Half Way Tree"
        assert result.parish == "St. Andrew"

    def test_apartment_kingston_sector(self) -> None:
        result = parse_address("Apt 4, 20 Barbican Road, Kingston 8")
        assert result.unit == "Apt 4"
        assert result.street_number == "20"
        assert result.street_name == "Barbican Road"
        assert result.parish == "Kingston"
        assert result.kingston_sector == 8

    def test_normalize_saint(self) -> None:
        result = parse_address("Lot 12, Stony Hill, Saint Andrew")
        assert result.parish == "St. Andrew"


# ---------------------------------------------------------------------------
# normalize_address
# ---------------------------------------------------------------------------


class TestNormalizeAddress:
    @pytest.mark.parametrize(
        "vector",
        _VECTORS["normalizeAddress"],
        ids=[v["expected"] for v in _VECTORS["normalizeAddress"]],
    )
    def test_shared_vectors(self, vector: dict) -> None:
        parsed = ParsedAddress(**_to_snake(vector["input"]))
        result = normalize_address(parsed)
        assert result == vector["expected"]

    def test_kingston_with_sector(self) -> None:
        parsed = ParsedAddress(
            raw="45 Hope Road, Kingston 6",
            street_number="45",
            street_name="Hope Road",
            parish="Kingston",
            kingston_sector=6,
        )
        assert normalize_address(parsed) == "45 Hope Road, Kingston 6"

    def test_without_street_number(self) -> None:
        parsed = ParsedAddress(
            raw="Half Way Tree, St. Andrew",
            community="Half Way Tree",
            parish="St. Andrew",
        )
        assert normalize_address(parsed) == "Half Way Tree, St. Andrew"

    def test_with_unit(self) -> None:
        parsed = ParsedAddress(
            raw="Suite 10, 5 Knutsford Blvd, Kingston 5",
            unit="Suite 10",
            street_number="5",
            street_name="Knutsford Blvd",
            parish="Kingston",
            kingston_sector=5,
        )
        assert normalize_address(parsed) == "Suite 10, 5 Knutsford Blvd, Kingston 5"


# ---------------------------------------------------------------------------
# extract_parish
# ---------------------------------------------------------------------------


class TestExtractParish:
    @pytest.mark.parametrize(
        "vector",
        _VECTORS["extractParish"],
        ids=[v["input"] for v in _VECTORS["extractParish"]],
    )
    def test_shared_vectors(self, vector: dict) -> None:
        assert extract_parish(vector["input"]) == vector["expected"]

    def test_empty_string(self) -> None:
        assert extract_parish("") is None

    def test_saint_variant(self) -> None:
        assert extract_parish("Saint James") == "St. James"


# ---------------------------------------------------------------------------
# is_kingston_address
# ---------------------------------------------------------------------------


class TestIsKingstonAddress:
    @pytest.mark.parametrize(
        "vector",
        _VECTORS["isKingstonAddress"],
        ids=[v["input"] for v in _VECTORS["isKingstonAddress"]],
    )
    def test_shared_vectors(self, vector: dict) -> None:
        assert is_kingston_address(vector["input"]) == vector["expected"]


# ---------------------------------------------------------------------------
# get_kingston_sector
# ---------------------------------------------------------------------------


class TestGetKingstonSector:
    @pytest.mark.parametrize(
        "vector",
        _VECTORS["getKingstonSector"],
        ids=[v["input"] for v in _VECTORS["getKingstonSector"]],
    )
    def test_shared_vectors(self, vector: dict) -> None:
        assert get_kingston_sector(vector["input"]) == vector["expected"]

    def test_non_kingston(self) -> None:
        assert get_kingston_sector("Negril, Westmoreland") is None


# ---------------------------------------------------------------------------
# format_address
# ---------------------------------------------------------------------------


class TestFormatAddress:
    def test_same_as_normalize(self) -> None:
        parsed = ParsedAddress(
            raw="7 Church Street, Montego Bay, St. James",
            street_number="7",
            street_name="Church Street",
            community="Montego Bay",
            parish="St. James",
        )
        assert format_address(parsed) == normalize_address(parsed)
