"""Tests for the jamaica-currency Python package.

Test vectors are loaded from the shared-tests/vectors.json file that is
also consumed by the TypeScript test suite, ensuring cross-language parity.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import pytest

from jamaica_currency import (
    GCT_RATE,
    TELECOM_GCT_RATE,
    DEFAULT_EXCHANGE_RATE,
    FormatOptions,
    format_jmd,
    parse_jmd,
    format_usd,
    jmd_to_usd,
    usd_to_jmd,
    add_gct,
    remove_gct,
    add_telecom_gct,
    format_with_gct,
)

# ---------------------------------------------------------------------------
# Load shared test vectors
# ---------------------------------------------------------------------------

_VECTORS_PATH = Path(__file__).resolve().parent.parent.parent / "shared-tests" / "vectors.json"
with open(_VECTORS_PATH, encoding="utf-8") as _f:
    VECTORS: dict = json.load(_f)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------


class TestConstants:
    def test_gct_rate(self) -> None:
        assert GCT_RATE == 0.15

    def test_telecom_gct_rate(self) -> None:
        assert TELECOM_GCT_RATE == 0.25

    def test_default_exchange_rate(self) -> None:
        assert DEFAULT_EXCHANGE_RATE == 155.47


# ---------------------------------------------------------------------------
# format_jmd
# ---------------------------------------------------------------------------


class TestFormatJMD:
    @pytest.mark.parametrize(
        "vector",
        VECTORS["formatJMD"],
        ids=[
            f"format_jmd({v['input']}, {v.get('options', '')})"
            for v in VECTORS["formatJMD"]
        ],
    )
    def test_vectors(self, vector: dict) -> None:
        raw_opts = vector.get("options")
        if raw_opts is not None:
            opts = FormatOptions(
                show_symbol=raw_opts.get("showSymbol", True),
                decimals=raw_opts.get("decimals", 2),
                use_grouping=raw_opts.get("useGrouping", True),
            )
        else:
            opts = None
        assert format_jmd(vector["input"], opts) == vector["expected"]

    def test_defaults_to_two_decimals(self) -> None:
        assert format_jmd(5) == "J$5.00"


# ---------------------------------------------------------------------------
# parse_jmd
# ---------------------------------------------------------------------------


class TestParseJMD:
    @pytest.mark.parametrize(
        "vector",
        VECTORS["parseJMD"],
        ids=[f"parse_jmd({v['input']!r})" for v in VECTORS["parseJMD"]],
    )
    def test_vectors(self, vector: dict) -> None:
        result = parse_jmd(vector["input"])
        expected = vector["expected"]
        if expected is None:
            assert result is None
        else:
            assert result == pytest.approx(expected)

    def test_none_input(self) -> None:
        assert parse_jmd(None) is None  # type: ignore[arg-type]


# ---------------------------------------------------------------------------
# format_usd
# ---------------------------------------------------------------------------


class TestFormatUSD:
    @pytest.mark.parametrize(
        "vector",
        VECTORS["formatUSD"],
        ids=[f"format_usd({v['input']})" for v in VECTORS["formatUSD"]],
    )
    def test_vectors(self, vector: dict) -> None:
        assert format_usd(vector["input"]) == vector["expected"]


# ---------------------------------------------------------------------------
# jmd_to_usd
# ---------------------------------------------------------------------------


class TestJmdToUsd:
    @pytest.mark.parametrize(
        "vector",
        VECTORS["jmdToUSD"],
        ids=[
            v.get("comment", f"jmd_to_usd({v['jmd']}, {v.get('rate', 'default')})")
            for v in VECTORS["jmdToUSD"]
        ],
    )
    def test_vectors(self, vector: dict) -> None:
        if "comment" in vector:
            result = jmd_to_usd(vector["jmd"])
            assert isinstance(result, float) or isinstance(result, int)
            assert result == pytest.approx(vector["jmd"] / DEFAULT_EXCHANGE_RATE, abs=0.01)
        else:
            result = jmd_to_usd(vector["jmd"], vector["rate"])
            assert result == pytest.approx(vector["expected"], abs=0.001)


# ---------------------------------------------------------------------------
# usd_to_jmd
# ---------------------------------------------------------------------------


class TestUsdToJmd:
    @pytest.mark.parametrize(
        "vector",
        VECTORS["usdToJMD"],
        ids=[
            v.get("comment", f"usd_to_jmd({v['usd']}, {v.get('rate', 'default')})")
            for v in VECTORS["usdToJMD"]
        ],
    )
    def test_vectors(self, vector: dict) -> None:
        if "comment" in vector:
            result = usd_to_jmd(vector["usd"])
            assert isinstance(result, (float, int))
            assert result == pytest.approx(vector["usd"] * DEFAULT_EXCHANGE_RATE, abs=0.1)
        else:
            result = usd_to_jmd(vector["usd"], vector["rate"])
            assert result == pytest.approx(vector["expected"], abs=0.01)


# ---------------------------------------------------------------------------
# GCT functions
# ---------------------------------------------------------------------------


class TestAddGCT:
    @pytest.mark.parametrize(
        "vector",
        VECTORS["addGCT"],
        ids=[
            f"add_gct({v['amount']}, {v.get('rate', 'default')})"
            for v in VECTORS["addGCT"]
        ],
    )
    def test_vectors(self, vector: dict) -> None:
        if "rate" in vector:
            result = add_gct(vector["amount"], vector["rate"])
        else:
            result = add_gct(vector["amount"])
        assert result == pytest.approx(vector["expected"], abs=1e-4)


class TestRemoveGCT:
    @pytest.mark.parametrize(
        "vector",
        VECTORS["removeGCT"],
        ids=[
            f"remove_gct({v['amountWithGCT']}, {v.get('rate', 'default')})"
            for v in VECTORS["removeGCT"]
        ],
    )
    def test_vectors(self, vector: dict) -> None:
        if "rate" in vector:
            result = remove_gct(vector["amountWithGCT"], vector["rate"])
        else:
            result = remove_gct(vector["amountWithGCT"])
        assert result == pytest.approx(vector["expected"], abs=1e-4)

    def test_roundtrip(self) -> None:
        original = 1234.56
        assert remove_gct(add_gct(original)) == pytest.approx(original, abs=1e-10)


class TestAddTelecomGCT:
    @pytest.mark.parametrize(
        "vector",
        VECTORS["addTelecomGCT"],
        ids=[f"add_telecom_gct({v['amount']})" for v in VECTORS["addTelecomGCT"]],
    )
    def test_vectors(self, vector: dict) -> None:
        assert add_telecom_gct(vector["amount"]) == pytest.approx(
            vector["expected"], abs=1e-4
        )


# ---------------------------------------------------------------------------
# format_with_gct
# ---------------------------------------------------------------------------


class TestFormatWithGCT:
    @pytest.mark.parametrize(
        "vector",
        VECTORS["formatWithGCT"],
        ids=[f"format_with_gct({v['amount']})" for v in VECTORS["formatWithGCT"]],
    )
    def test_vectors(self, vector: dict) -> None:
        result = format_with_gct(vector["amount"])
        assert result.base == vector["expected"]["base"]
        assert result.gct == vector["expected"]["gct"]
        assert result.total == vector["expected"]["total"]
