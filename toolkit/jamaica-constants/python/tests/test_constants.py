"""Tests for jamaica-constants."""

from __future__ import annotations

import json
from pathlib import Path

import jamaica_constants as jc

VECTORS = json.loads(
    (Path(__file__).resolve().parent.parent.parent / "shared-tests" / "vectors.json").read_text()
)


def test_all_exports_present():
    for key in VECTORS["expected_exports"]:
        assert hasattr(jc, key), f"Missing export: {key}"


def test_iso_codes():
    assert jc.COUNTRY_CODE == VECTORS["iso"]["alpha2"]
    assert jc.ISO_ALPHA3 == VECTORS["iso"]["alpha3"]
    assert jc.ISO_NUMERIC == VECTORS["iso"]["numeric"]


def test_timezone():
    assert jc.TIMEZONE == VECTORS["timezone"]["name"]
    assert jc.UTC_OFFSET == VECTORS["timezone"]["utc_offset"]
    assert jc.OBSERVES_DST == VECTORS["timezone"]["observes_dst"]


def test_currency():
    assert jc.CURRENCY_CODE == VECTORS["currency"]["code"]
    assert jc.CURRENCY_SYMBOL == VECTORS["currency"]["symbol"]


def test_telecom():
    assert jc.CALLING_CODE == VECTORS["telecom"]["calling_code"]
    assert list(jc.AREA_CODES) == VECTORS["telecom"]["area_codes"]


def test_geography():
    assert jc.CAPITAL == VECTORS["geography"]["capital"]
    assert jc.TOTAL_PARISHES == VECTORS["geography"]["total_parishes"]
    assert jc.AREA_KM2 == VECTORS["geography"]["area_km2"]
    assert jc.DRIVING_SIDE == VECTORS["geography"]["driving_side"]


def test_emergency():
    assert jc.EMERGENCY_NUMBER == VECTORS["emergency"]["police"]
    assert jc.AMBULANCE_NUMBER == VECTORS["emergency"]["ambulance"]
    assert jc.FIRE_NUMBER == VECTORS["emergency"]["fire"]


def test_flag_colors():
    assert jc.FLAG_COLORS == VECTORS["flag_colors"]
