"""Tests for jamaica-parishes package using shared test vectors."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from jamaica_parishes import (
    PARISH_CODES,
    get_all_parishes,
    get_distance_km,
    get_nearest_parish_with_nla,
    get_parish,
    get_parish_by_name,
    get_parishes_with_service,
    get_total_population,
)

# Load shared test vectors
_VECTORS_PATH = Path(__file__).resolve().parent.parent.parent / "shared-tests" / "vectors.json"
with open(_VECTORS_PATH, encoding="utf-8") as f:
    _V = json.load(f)["vectors"]


# ---------------------------------------------------------------------------
# get_all_parishes
# ---------------------------------------------------------------------------

class TestGetAllParishes:
    def test_returns_14_parishes(self):
        assert len(get_all_parishes()) == _V["total_parishes"]

    def test_returns_new_list_each_time(self):
        a = get_all_parishes()
        b = get_all_parishes()
        assert a is not b
        assert a == b


# ---------------------------------------------------------------------------
# PARISH_CODES
# ---------------------------------------------------------------------------

class TestParishCodes:
    def test_contains_14_codes(self):
        assert len(PARISH_CODES) == 14

    def test_matches_expected_codes(self):
        assert sorted(PARISH_CODES) == sorted(_V["parish_codes"])


# ---------------------------------------------------------------------------
# get_parish (by code)
# ---------------------------------------------------------------------------

class TestGetParish:
    @pytest.mark.parametrize(
        "case",
        [c for c in _V["lookup_by_code"] if c["expected_name"] is not None],
        ids=lambda c: c["code"],
    )
    def test_finds_by_code(self, case):
        p = get_parish(case["code"])
        assert p is not None
        assert p.name == case["expected_name"]
        assert p.capital == case["expected_capital"]

    def test_returns_none_for_invalid_code(self):
        assert get_parish("INVALID") is None

    def test_case_insensitive(self):
        p = get_parish("kin")
        assert p is not None
        assert p.code == "KIN"


# ---------------------------------------------------------------------------
# get_parish_by_name (fuzzy)
# ---------------------------------------------------------------------------

class TestGetParishByName:
    @pytest.mark.parametrize(
        "case",
        [c for c in _V["lookup_by_name"] if c["expected_code"] is not None],
        ids=lambda c: c["input"],
    )
    def test_fuzzy_name_match(self, case):
        p = get_parish_by_name(case["input"])
        assert p is not None
        assert p.code == case["expected_code"]

    def test_returns_none_for_nonexistent(self):
        assert get_parish_by_name("Nonexistent") is None

    def test_saint_vs_st_equivalence(self):
        a = get_parish_by_name("St. Andrew")
        b = get_parish_by_name("Saint Andrew")
        assert a is not None
        assert b is not None
        assert a.code == b.code


# ---------------------------------------------------------------------------
# get_parishes_with_service
# ---------------------------------------------------------------------------

class TestGetParishesWithService:
    def test_nla_count(self):
        nla = get_parishes_with_service("nla")
        assert len(nla) == _V["services"]["nla"]["count"]
        codes = sorted(p.code for p in nla)
        assert codes == sorted(_V["services"]["nla"]["parishes_with_service"])

    def test_taj_count(self):
        assert len(get_parishes_with_service("taj")) == _V["services"]["taj"]["count"]

    def test_pica_count(self):
        pica = get_parishes_with_service("pica")
        assert len(pica) == _V["services"]["pica"]["count"]
        codes = sorted(p.code for p in pica)
        assert codes == sorted(_V["services"]["pica"]["parishes_with_service"])

    def test_coj_count(self):
        assert len(get_parishes_with_service("coj")) == _V["services"]["coj"]["count"]


# ---------------------------------------------------------------------------
# get_distance_km
# ---------------------------------------------------------------------------

class TestGetDistanceKm:
    def test_same_parish_is_zero(self):
        assert get_distance_km("KIN", "KIN") == 0.0

    def test_kingston_to_montego_bay(self):
        d = _V["distance"]["kingston_to_montego_bay"]
        dist = get_distance_km(d["from"], d["to"])
        assert d["expected_km_approx"] - d["tolerance_km"] < dist < d["expected_km_approx"] + d["tolerance_km"]

    def test_kingston_to_portland(self):
        d = _V["distance"]["kingston_to_portland"]
        dist = get_distance_km(d["from"], d["to"])
        assert d["expected_km_approx"] - d["tolerance_km"] < dist < d["expected_km_approx"] + d["tolerance_km"]

    def test_raises_for_unknown_code(self):
        with pytest.raises(ValueError):
            get_distance_km("ZZZ", "KIN")


# ---------------------------------------------------------------------------
# get_nearest_parish_with_nla
# ---------------------------------------------------------------------------

class TestGetNearestParishWithNLA:
    def test_kingston_returns_self(self):
        result = get_nearest_parish_with_nla("KIN")
        assert result["parish"].code == "KIN"
        assert result["distance_km"] == 0.0

    def test_portland_nearest_is_kingston(self):
        result = get_nearest_parish_with_nla("POR")
        expected = _V["nearest_nla"]["from_portland"]["expected_nearest_code"]
        assert result["parish"].code == expected

    def test_st_catherine_nearest_within_range(self):
        result = get_nearest_parish_with_nla("SCA")
        expected_codes = _V["nearest_nla"]["from_st_catherine"]["expected_nearest_code_one_of"]
        max_dist = _V["nearest_nla"]["from_st_catherine"]["max_distance_km"]
        assert result["parish"].code in expected_codes
        assert result["distance_km"] < max_dist


# ---------------------------------------------------------------------------
# get_total_population
# ---------------------------------------------------------------------------

class TestGetTotalPopulation:
    def test_returns_expected_total(self):
        assert get_total_population() == _V["total_population"]


# ---------------------------------------------------------------------------
# Population spot checks
# ---------------------------------------------------------------------------

class TestPopulationChecks:
    @pytest.mark.parametrize(
        "case",
        _V["population_checks"],
        ids=lambda c: c["code"],
    )
    def test_individual_population(self, case):
        p = get_parish(case["code"])
        assert p is not None
        assert p.population == case["population"]


# ---------------------------------------------------------------------------
# Data integrity
# ---------------------------------------------------------------------------

class TestDataIntegrity:
    def test_valid_coordinates(self):
        for p in get_all_parishes():
            assert 17 < p.coordinates.lat < 19, f"{p.code} lat out of range"
            assert -79 < p.coordinates.lng < -76, f"{p.code} lng out of range"

    def test_non_empty_economy(self):
        for p in get_all_parishes():
            assert len(p.economy) > 0, f"{p.code} has empty economy"

    def test_at_least_one_hospital(self):
        for p in get_all_parishes():
            assert len(p.hospitals) > 0, f"{p.code} has no hospitals"

    def test_unique_codes(self):
        codes = [p.code for p in get_all_parishes()]
        assert len(set(codes)) == len(codes)
