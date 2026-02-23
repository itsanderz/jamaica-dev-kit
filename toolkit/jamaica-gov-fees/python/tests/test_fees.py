"""Tests for jamaica_gov_fees — driven by shared test vectors."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from jamaica_gov_fees import (
    EXCHANGE_RATE,
    DATA_DATE,
    get_agencies,
    get_agency,
    get_passport_fee,
    get_vehicle_registration_fee,
    get_certificate_of_fitness_fee,
    get_drivers_licence_fee,
    get_business_registration_fee,
    get_vital_record_fee,
    get_police_record_fee,
    get_all_fees,
    search_fees,
)

# Load shared test vectors
_VECTORS_PATH = Path(__file__).resolve().parent.parent.parent / "shared-tests" / "vectors.json"
with open(_VECTORS_PATH) as f:
    _V = json.load(f)["vectors"]


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------


class TestConstants:
    def test_exchange_rate(self):
        assert EXCHANGE_RATE == _V["constants"]["EXCHANGE_RATE"]

    def test_data_date(self):
        assert DATA_DATE == _V["constants"]["DATA_DATE"]


# ---------------------------------------------------------------------------
# Agencies
# ---------------------------------------------------------------------------


class TestGetAgencies:
    def test_count(self):
        agencies = get_agencies()
        assert len(agencies) == _V["getAgencies"]["expected_count"]

    def test_expected_ids(self):
        ids = [a.id for a in get_agencies()]
        for expected_id in _V["getAgencies"]["expected_ids"]:
            assert expected_id in ids


class TestGetAgency:
    @pytest.mark.parametrize("tc", _V["getAgency"], ids=lambda tc: tc["input"])
    def test_lookup(self, tc):
        result = get_agency(tc["input"])
        if tc.get("expected") is None:
            assert result is None
        else:
            assert result is not None
            assert result.name == tc["expected_name"]
            if "expected_acronym" in tc:
                assert result.acronym == tc["expected_acronym"]


# ---------------------------------------------------------------------------
# Passport fees
# ---------------------------------------------------------------------------


class TestGetPassportFee:
    @pytest.mark.parametrize(
        "tc", _V["getPassportFee"], ids=lambda tc: str(tc["input"])
    )
    def test_lookup(self, tc):
        inp = tc["input"]
        kwargs = {
            "type": inp["type"],
            "age": inp["age"],
            "speed": inp["speed"],
        }
        if "office" in inp:
            kwargs["office"] = inp["office"]
        assert get_passport_fee(**kwargs) == tc["expected"]

    def test_invalid_combination_raises(self):
        with pytest.raises(ValueError):
            get_passport_fee(type="new", age="adult", speed="same_day", office="regional")


# ---------------------------------------------------------------------------
# Vehicle registration fees
# ---------------------------------------------------------------------------


class TestGetVehicleRegistrationFee:
    @pytest.mark.parametrize(
        "tc", _V["getVehicleRegistrationFee"], ids=lambda tc: f"{tc['input']}cc"
    )
    def test_lookup(self, tc):
        assert get_vehicle_registration_fee(tc["input"]) == tc["expected"]


# ---------------------------------------------------------------------------
# Certificate of fitness fees
# ---------------------------------------------------------------------------


class TestGetCertificateOfFitnessFee:
    @pytest.mark.parametrize(
        "tc", _V["getCertificateOfFitnessFee"], ids=lambda tc: tc["input"]
    )
    def test_lookup(self, tc):
        assert get_certificate_of_fitness_fee(tc["input"]) == tc["expected"]

    def test_unknown_raises(self):
        with pytest.raises(ValueError):
            get_certificate_of_fitness_fee("spaceship")


# ---------------------------------------------------------------------------
# Driver's licence fees
# ---------------------------------------------------------------------------


class TestGetDriversLicenceFee:
    @pytest.mark.parametrize(
        "tc", _V["getDriversLicenceFee"], ids=lambda tc: tc["input"]
    )
    def test_lookup(self, tc):
        assert get_drivers_licence_fee(tc["input"]) == tc["expected"]


# ---------------------------------------------------------------------------
# Business registration fees
# ---------------------------------------------------------------------------


class TestGetBusinessRegistrationFee:
    @pytest.mark.parametrize(
        "tc", _V["getBusinessRegistrationFee"], ids=lambda tc: tc["input"]
    )
    def test_lookup(self, tc):
        assert get_business_registration_fee(tc["input"]) == tc["expected"]


# ---------------------------------------------------------------------------
# Vital record fees
# ---------------------------------------------------------------------------


class TestGetVitalRecordFee:
    @pytest.mark.parametrize(
        "tc",
        _V["getVitalRecordFee"],
        ids=lambda tc: f"{tc['input']['type']}/{tc['input']['speed']}",
    )
    def test_lookup(self, tc):
        assert get_vital_record_fee(tc["input"]["type"], tc["input"]["speed"]) == tc["expected"]


# ---------------------------------------------------------------------------
# Police record fees
# ---------------------------------------------------------------------------


class TestGetPoliceRecordFee:
    @pytest.mark.parametrize(
        "tc", _V["getPoliceRecordFee"], ids=lambda tc: tc["input"]
    )
    def test_lookup(self, tc):
        assert get_police_record_fee(tc["input"]) == tc["expected"]


# ---------------------------------------------------------------------------
# searchFees
# ---------------------------------------------------------------------------


class TestSearchFees:
    @pytest.mark.parametrize(
        "tc", _V["searchFees"], ids=lambda tc: tc["description"]
    )
    def test_search(self, tc):
        results = search_fees(tc["input"])
        if "expected_count" in tc:
            assert len(results) == tc["expected_count"]
        if "expected_min_results" in tc:
            assert len(results) >= tc["expected_min_results"]


# ---------------------------------------------------------------------------
# getAllFees
# ---------------------------------------------------------------------------


class TestGetAllFees:
    def test_min_count(self):
        fees = get_all_fees()
        assert len(fees) >= _V["getAllFees"]["expected_min_count"]

    def test_required_fields(self):
        for fee in get_all_fees():
            assert fee.agency
            assert fee.agency_name
            assert fee.service
            assert fee.description
            assert isinstance(fee.jmd, (int, float))
