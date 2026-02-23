"""Tests for jamaica-holidays."""

from __future__ import annotations

import json
from pathlib import Path

import jamaica_holidays as jh

VECTORS = json.loads(
    (Path(__file__).resolve().parent.parent.parent / "shared-tests" / "vectors.json").read_text()
)


def test_easter_dates():
    for vec in VECTORS["easter_dates"]:
        assert jh.get_easter_sunday(vec["year"]) == vec["date"], f"Easter {vec['year']}"


def test_holidays_count():
    holidays = jh.get_holidays(2025)
    assert len(holidays) == 10


def test_holidays_sorted():
    holidays = jh.get_holidays(2025)
    dates = [h.date for h in holidays]
    assert dates == sorted(dates)


def test_holidays_by_year():
    for vec in VECTORS["holidays_by_year"]:
        holidays = jh.get_holidays(vec["year"])
        dates = [h.date for h in holidays]
        for expected in vec["expected_dates"]:
            assert expected["date"] in dates, (
                f"Missing {expected['name']} ({expected['date']}) in {vec['year']}"
            )


def test_is_public_holiday():
    assert jh.is_public_holiday("2025-01-01") is True
    assert jh.is_public_holiday("2025-08-06") is True
    assert jh.is_public_holiday("2025-12-25") is True
    assert jh.is_public_holiday("2025-03-15") is False
    assert jh.is_public_holiday("2025-07-04") is False


def test_is_business_day():
    assert jh.is_business_day("2025-01-04") is False  # Saturday
    assert jh.is_business_day("2025-01-05") is False  # Sunday
    assert jh.is_business_day("2025-01-01") is False  # Holiday
    assert jh.is_business_day("2025-01-02") is True   # Thursday
    assert jh.is_business_day("2025-01-03") is True   # Friday


def test_working_days():
    for vec in VECTORS["working_days"]:
        result = jh.get_working_days(vec["from"], vec["to"])
        assert result == vec["expected"], (
            f"{vec['from']} to {vec['to']}: expected {vec['expected']}, got {result}"
        )


def test_get_next_holiday():
    holiday = jh.get_next_holiday("2025-01-02")
    assert holiday is not None
    assert holiday.date > "2025-01-02"

    holiday = jh.get_next_holiday("2025-12-27")
    assert holiday is not None
    assert holiday.date.startswith("2026")
