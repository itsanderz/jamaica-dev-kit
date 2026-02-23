"""Jamaica banking institutions directory.

Commercial banks, building societies, credit unions, and branches.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

__all__ = [
    "BankType",
    "Bank",
    "Branch",
    "get_banks",
    "get_bank",
    "get_banks_by_type",
    "get_commercial_banks",
    "get_branches",
    "get_bank_branches",
    "get_branches_by_parish",
    "get_swift_code",
    "search_banks",
    "get_bank_count",
    "get_branch_count",
]

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------

BankType = Literal["commercial", "merchant", "building-society", "credit-union"]


@dataclass(frozen=True, slots=True)
class Bank:
    """A Jamaican banking institution."""

    id: str
    name: str
    abbreviation: str
    type: BankType
    swift: str | None = None
    website: str | None = None


@dataclass(frozen=True, slots=True)
class Branch:
    """A physical branch location."""

    name: str
    bank_id: str
    parish: str
    address: str | None = None


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------

_BANKS: tuple[Bank, ...] = (
    # Commercial Banks (Bank of Jamaica Licensed)
    Bank(
        id="ncb",
        name="National Commercial Bank",
        abbreviation="NCB",
        type="commercial",
        swift="JABORJMK",
        website="https://www.jncb.com",
    ),
    Bank(
        id="scotiabank",
        name="Scotiabank Jamaica",
        abbreviation="Scotia",
        type="commercial",
        swift="NOSCJMKN",
        website="https://www.scotiabank.com/jm",
    ),
    Bank(
        id="jmmb",
        name="JMMB Bank (Jamaica)",
        abbreviation="JMMB",
        type="commercial",
        swift="JMMBKMKN",
        website="https://www.jmmb.com",
    ),
    Bank(
        id="sagicor",
        name="Sagicor Bank Jamaica",
        abbreviation="Sagicor",
        type="commercial",
        swift="SAJAJMKN",
        website="https://www.sagicorbank.com",
    ),
    Bank(
        id="fgb",
        name="First Global Bank",
        abbreviation="FGB",
        type="commercial",
        swift="FGBLJMKN",
        website="https://www.firstglobal-bank.com",
    ),
    Bank(
        id="citibank",
        name="Citibank N.A.",
        abbreviation="Citi",
        type="commercial",
        swift="CITIJMKX",
        website="https://www.citibank.com",
    ),
    Bank(
        id="bns",
        name="Bank of Nova Scotia Jamaica",
        abbreviation="BNS",
        type="commercial",
        swift="NOSCJMKN",
    ),
    # Merchant Banks
    Bank(
        id="jn",
        name="JN Bank",
        abbreviation="JN",
        type="merchant",
        swift="JNBSJMKN",
        website="https://www.jnbank.com",
    ),
    # Building Societies
    Bank(
        id="vm",
        name="VM Building Society",
        abbreviation="VM",
        type="building-society",
        website="https://www.vmbs.com",
    ),
    Bank(
        id="jnbs",
        name="Jamaica National Building Society",
        abbreviation="JNBS",
        type="building-society",
        website="https://www.jnbs.com",
    ),
    # Credit Unions
    Bank(
        id="cok",
        name="COK Sodality Co-operative Credit Union",
        abbreviation="COK",
        type="credit-union",
        website="https://www.caborja.com",
    ),
    Bank(
        id="jtaccu",
        name="Jamaica Teachers' Association Co-operative Credit Union",
        abbreviation="JTACCU",
        type="credit-union",
    ),
    Bank(
        id="churches",
        name="Churches Co-operative Credit Union",
        abbreviation="Churches",
        type="credit-union",
    ),
    Bank(
        id="cwj",
        name="C&WJ Co-operative Credit Union",
        abbreviation="C&WJ",
        type="credit-union",
    ),
)

_BRANCHES: tuple[Branch, ...] = (
    # NCB Branches
    Branch(name="NCB Half Way Tree", bank_id="ncb", parish="St. Andrew", address="Half Way Tree Road, Kingston 10"),
    Branch(name="NCB New Kingston", bank_id="ncb", parish="St. Andrew", address="2 Knutsford Boulevard, Kingston 5"),
    Branch(name="NCB King Street", bank_id="ncb", parish="Kingston", address="1-7 King Street, Kingston"),
    Branch(name="NCB Spanish Town", bank_id="ncb", parish="St. Catherine", address="Burke Road, Spanish Town"),
    Branch(name="NCB Montego Bay", bank_id="ncb", parish="St. James", address="Sam Sharpe Square, Montego Bay"),
    Branch(name="NCB May Pen", bank_id="ncb", parish="Clarendon", address="Main Street, May Pen"),
    Branch(name="NCB Mandeville", bank_id="ncb", parish="Manchester", address="Manchester Shopping Centre, Mandeville"),
    Branch(name="NCB Ocho Rios", bank_id="ncb", parish="St. Ann", address="Main Street, Ocho Rios"),
    Branch(name="NCB Savanna-la-Mar", bank_id="ncb", parish="Westmoreland", address="Great George Street, Savanna-la-Mar"),
    Branch(name="NCB Port Antonio", bank_id="ncb", parish="Portland", address="West Street, Port Antonio"),
    # Scotiabank Branches
    Branch(name="Scotiabank Half Way Tree", bank_id="scotiabank", parish="St. Andrew", address="Half Way Tree Road, Kingston 10"),
    Branch(name="Scotiabank Duke Street", bank_id="scotiabank", parish="Kingston", address="Duke Street, Kingston"),
    Branch(name="Scotiabank Liguanea", bank_id="scotiabank", parish="St. Andrew", address="125-127 Old Hope Road, Kingston 6"),
    Branch(name="Scotiabank Portmore", bank_id="scotiabank", parish="St. Catherine", address="Portmore Town Centre"),
    Branch(name="Scotiabank Montego Bay", bank_id="scotiabank", parish="St. James", address="6 Sam Sharpe Square, Montego Bay"),
    Branch(name="Scotiabank Mandeville", bank_id="scotiabank", parish="Manchester", address="9 Manchester Road, Mandeville"),
    Branch(name="Scotiabank Ocho Rios", bank_id="scotiabank", parish="St. Ann", address="Main Street, Ocho Rios"),
    # JN Bank Branches
    Branch(name="JN Half Way Tree", bank_id="jn", parish="St. Andrew", address="2 Belmont Road, Kingston 5"),
    Branch(name="JN Duke Street", bank_id="jn", parish="Kingston", address="Duke Street, Kingston"),
    Branch(name="JN Portmore", bank_id="jn", parish="St. Catherine", address="Portmore Town Centre"),
    Branch(name="JN Montego Bay", bank_id="jn", parish="St. James", address="Montego Bay"),
    Branch(name="JN Mandeville", bank_id="jn", parish="Manchester", address="Mandeville"),
)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def get_banks() -> list[Bank]:
    """Return all banks."""
    return list(_BANKS)


def get_bank(id_or_name: str) -> Bank | None:
    """Look up a bank by its id or name (case-insensitive).

    Returns ``None`` when not found.
    """
    needle = id_or_name.lower()
    for bank in _BANKS:
        if bank.id == needle or bank.name.lower() == needle:
            return bank
    return None


def get_banks_by_type(bank_type: BankType) -> list[Bank]:
    """Return all banks of the given type."""
    return [b for b in _BANKS if b.type == bank_type]


def get_commercial_banks() -> list[Bank]:
    """Shorthand for ``get_banks_by_type('commercial')``."""
    return get_banks_by_type("commercial")


def get_branches() -> list[Branch]:
    """Return all branches across all banks."""
    return list(_BRANCHES)


def get_bank_branches(bank_id: str) -> list[Branch]:
    """Return branches belonging to a specific bank."""
    bid = bank_id.lower()
    return [b for b in _BRANCHES if b.bank_id == bid]


def get_branches_by_parish(parish: str) -> list[Branch]:
    """Return branches located in the given parish (case-insensitive)."""
    needle = parish.lower()
    return [b for b in _BRANCHES if b.parish.lower() == needle]


def get_swift_code(bank_id: str) -> str | None:
    """Return the SWIFT / BIC code for a bank, or ``None`` if unavailable."""
    bank = get_bank(bank_id)
    if bank is None:
        return None
    return bank.swift


def search_banks(query: str) -> list[Bank]:
    """Case-insensitive search across bank name, abbreviation, and id."""
    needle = query.lower()
    return [
        b
        for b in _BANKS
        if needle in b.name.lower()
        or needle in b.abbreviation.lower()
        or needle in b.id
    ]


def get_bank_count() -> int:
    """Return the total number of banks in the directory."""
    return len(_BANKS)


def get_branch_count() -> int:
    """Return the total number of branches in the directory."""
    return len(_BRANCHES)
