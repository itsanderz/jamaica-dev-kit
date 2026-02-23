"""Jamaica tax calculations -- income tax (PAYE), NIS, NHT, Education Tax, HEART/NTA, and payroll."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

TAX_YEAR: int = 2024
"""Tax year these rates apply to."""

ANNUAL_THRESHOLD: int = 1_500_096
"""Annual income-tax threshold (J$)."""

MONTHLY_THRESHOLD: int = 125_008
"""Monthly income-tax threshold (J$)."""

# NIS
NIS_EMPLOYEE_RATE: float = 0.03
NIS_EMPLOYER_RATE: float = 0.03
NIS_ANNUAL_CEILING: int = 5_000_000
NIS_WEEKLY_CEILING: int = 96_154

# NHT
NHT_EMPLOYEE_RATE: float = 0.02
NHT_EMPLOYER_RATE: float = 0.03

# Education Tax
EDUCATION_TAX_EMPLOYEE_RATE: float = 0.0225
EDUCATION_TAX_EMPLOYER_RATE: float = 0.035

# HEART / NTA
HEART_NTA_RATE: float = 0.03

# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

_PERIODS_PER_YEAR: dict[str, int] = {
    "annual": 1,
    "monthly": 12,
    "fortnightly": 26,
    "weekly": 52,
}


def _round2(value: float) -> float:
    """Round to 2 decimal places."""
    return round(value, 2)


def _assert_non_negative(value: float, name: str) -> None:
    if not isinstance(value, (int, float)) or value != value or value < 0:
        raise ValueError(f"{name} must be a non-negative finite number, got {value}")
    if isinstance(value, float) and (value == float("inf") or value == float("-inf")):
        raise ValueError(f"{name} must be a non-negative finite number, got {value}")


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class TaxBracket:
    """A single income-tax bracket."""

    min: float
    max: float | None
    rate: float
    label: str


@dataclass(frozen=True)
class BracketDetail:
    """Breakdown of tax within a single bracket."""

    bracket: str
    taxable_in_this_bracket: float
    tax: float


@dataclass(frozen=True)
class IncomeTaxBreakdown:
    """Full breakdown of annual income tax."""

    annual_income: float
    threshold: float
    taxable_income: float
    tax: float
    effective_rate: float
    brackets: tuple[BracketDetail, ...]


@dataclass(frozen=True)
class NISContribution:
    """NIS contribution breakdown."""

    employee: float
    employer: float
    total: float
    at_ceiling: bool


@dataclass(frozen=True)
class StatutoryContribution:
    """Generic employee/employer contribution."""

    employee: float
    employer: float
    total: float


@dataclass(frozen=True)
class PayrollBreakdown:
    """Full payroll calculation for a single pay period."""

    period: Literal["monthly", "fortnightly", "weekly", "annual"]
    gross_pay: float
    annualized: float
    # Employee deductions
    income_tax: float
    nis: float
    nht: float
    education_tax: float
    total_deductions: float
    net_pay: float
    # Employer costs
    employer_nis: float
    employer_nht: float
    employer_education_tax: float
    employer_heart: float
    total_employer_contributions: float
    total_cost_to_employer: float


# ---------------------------------------------------------------------------
# Income Tax Brackets
# ---------------------------------------------------------------------------

def get_income_tax_brackets() -> list[TaxBracket]:
    """Return the current income-tax brackets."""
    return [
        TaxBracket(
            min=0,
            max=ANNUAL_THRESHOLD,
            rate=0,
            label=f"0 - {ANNUAL_THRESHOLD:,} (Threshold)",
        ),
        TaxBracket(
            min=ANNUAL_THRESHOLD,
            max=ANNUAL_THRESHOLD + 6_000_000,
            rate=0.25,
            label=f"{ANNUAL_THRESHOLD + 1:,} - {ANNUAL_THRESHOLD + 6_000_000:,} (25%)",
        ),
        TaxBracket(
            min=ANNUAL_THRESHOLD + 6_000_000,
            max=None,
            rate=0.30,
            label=f"Above {ANNUAL_THRESHOLD + 6_000_000:,} (30%)",
        ),
    ]


def get_tax_threshold() -> int:
    """Return the annual income-tax threshold."""
    return ANNUAL_THRESHOLD


# ---------------------------------------------------------------------------
# Income Tax
# ---------------------------------------------------------------------------

def calculate_income_tax(annual_income: float) -> IncomeTaxBreakdown:
    """Calculate income tax for a given annual income."""
    _assert_non_negative(annual_income, "annual_income")

    threshold = ANNUAL_THRESHOLD
    taxable_income = max(0.0, annual_income - threshold)

    bracket_details: list[BracketDetail] = []
    remaining = taxable_income
    total_tax = 0.0

    # First bracket above threshold: up to J$6,000,000 at 25%
    first_bracket_max = 6_000_000
    in_first = min(remaining, first_bracket_max)
    first_tax = _round2(in_first * 0.25)
    if in_first > 0:
        bracket_details.append(
            BracketDetail(bracket="25%", taxable_in_this_bracket=_round2(in_first), tax=first_tax)
        )
    total_tax += first_tax
    remaining -= in_first

    # Second bracket: everything above at 30%
    if remaining > 0:
        second_tax = _round2(remaining * 0.30)
        bracket_details.append(
            BracketDetail(
                bracket="30%", taxable_in_this_bracket=_round2(remaining), tax=second_tax
            )
        )
        total_tax += second_tax

    total_tax = _round2(total_tax)
    effective_rate = _round2(total_tax / annual_income) if annual_income > 0 else 0.0

    return IncomeTaxBreakdown(
        annual_income=_round2(annual_income),
        threshold=threshold,
        taxable_income=_round2(taxable_income),
        tax=total_tax,
        effective_rate=_round2(effective_rate),
        brackets=tuple(bracket_details),
    )


# ---------------------------------------------------------------------------
# NIS
# ---------------------------------------------------------------------------

def calculate_nis(annual_gross: float) -> NISContribution:
    """Calculate NIS contributions for a given annual gross."""
    _assert_non_negative(annual_gross, "annual_gross")

    capped = min(annual_gross, NIS_ANNUAL_CEILING)
    employee = _round2(capped * NIS_EMPLOYEE_RATE)
    employer = _round2(capped * NIS_EMPLOYER_RATE)
    at_ceiling = annual_gross >= NIS_ANNUAL_CEILING

    return NISContribution(
        employee=employee,
        employer=employer,
        total=_round2(employee + employer),
        at_ceiling=at_ceiling,
    )


# ---------------------------------------------------------------------------
# NHT
# ---------------------------------------------------------------------------

def calculate_nht(gross_pay: float) -> StatutoryContribution:
    """Calculate NHT contributions for a given gross pay."""
    _assert_non_negative(gross_pay, "gross_pay")

    employee = _round2(gross_pay * NHT_EMPLOYEE_RATE)
    employer = _round2(gross_pay * NHT_EMPLOYER_RATE)

    return StatutoryContribution(
        employee=employee,
        employer=employer,
        total=_round2(employee + employer),
    )


# ---------------------------------------------------------------------------
# Education Tax
# ---------------------------------------------------------------------------

def calculate_education_tax(gross_pay: float) -> StatutoryContribution:
    """Calculate Education Tax contributions for a given gross pay."""
    _assert_non_negative(gross_pay, "gross_pay")

    employee = _round2(gross_pay * EDUCATION_TAX_EMPLOYEE_RATE)
    employer = _round2(gross_pay * EDUCATION_TAX_EMPLOYER_RATE)

    return StatutoryContribution(
        employee=employee,
        employer=employer,
        total=_round2(employee + employer),
    )


# ---------------------------------------------------------------------------
# HEART / NTA
# ---------------------------------------------------------------------------

def calculate_heart(gross_pay: float) -> float:
    """Calculate HEART/NTA levy (employer only) for a given gross pay."""
    _assert_non_negative(gross_pay, "gross_pay")
    return _round2(gross_pay * HEART_NTA_RATE)


# ---------------------------------------------------------------------------
# Payroll
# ---------------------------------------------------------------------------

def calculate_payroll(
    gross_pay: float,
    period: Literal["monthly", "fortnightly", "weekly", "annual"] = "monthly",
) -> PayrollBreakdown:
    """Calculate full payroll breakdown for a single pay period."""
    _assert_non_negative(gross_pay, "gross_pay")

    periods_per_year = _PERIODS_PER_YEAR[period]
    annualized = _round2(gross_pay * periods_per_year)

    # Income tax (annual then de-annualize)
    it_result = calculate_income_tax(annualized)
    income_tax = _round2(it_result.tax / periods_per_year)

    # NIS (annual then de-annualize)
    nis_result = calculate_nis(annualized)
    nis = _round2(nis_result.employee / periods_per_year)
    employer_nis = _round2(nis_result.employer / periods_per_year)

    # NHT (on period gross -- no ceiling)
    nht_result = calculate_nht(gross_pay)
    nht = nht_result.employee
    employer_nht = nht_result.employer

    # Education Tax (on period gross)
    ed_result = calculate_education_tax(gross_pay)
    education_tax = ed_result.employee
    employer_education_tax = ed_result.employer

    # HEART/NTA (employer only, on period gross)
    employer_heart = calculate_heart(gross_pay)

    total_deductions = _round2(income_tax + nis + nht + education_tax)
    net_pay = _round2(gross_pay - total_deductions)

    total_employer_contributions = _round2(
        employer_nis + employer_nht + employer_education_tax + employer_heart
    )
    total_cost_to_employer = _round2(gross_pay + total_employer_contributions)

    return PayrollBreakdown(
        period=period,
        gross_pay=_round2(gross_pay),
        annualized=annualized,
        income_tax=income_tax,
        nis=nis,
        nht=nht,
        education_tax=education_tax,
        total_deductions=total_deductions,
        net_pay=net_pay,
        employer_nis=employer_nis,
        employer_nht=employer_nht,
        employer_education_tax=employer_education_tax,
        employer_heart=employer_heart,
        total_employer_contributions=total_employer_contributions,
        total_cost_to_employer=total_cost_to_employer,
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

__all__ = [
    # Constants
    "TAX_YEAR",
    "ANNUAL_THRESHOLD",
    "MONTHLY_THRESHOLD",
    "NIS_EMPLOYEE_RATE",
    "NIS_EMPLOYER_RATE",
    "NIS_ANNUAL_CEILING",
    "NIS_WEEKLY_CEILING",
    "NHT_EMPLOYEE_RATE",
    "NHT_EMPLOYER_RATE",
    "EDUCATION_TAX_EMPLOYEE_RATE",
    "EDUCATION_TAX_EMPLOYER_RATE",
    "HEART_NTA_RATE",
    # Types
    "TaxBracket",
    "BracketDetail",
    "IncomeTaxBreakdown",
    "NISContribution",
    "StatutoryContribution",
    "PayrollBreakdown",
    # Functions
    "get_income_tax_brackets",
    "get_tax_threshold",
    "calculate_income_tax",
    "calculate_nis",
    "calculate_nht",
    "calculate_education_tax",
    "calculate_heart",
    "calculate_payroll",
]
