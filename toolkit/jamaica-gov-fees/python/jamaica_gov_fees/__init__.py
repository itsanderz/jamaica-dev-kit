"""Jamaica government service fees database.

Provides a queryable, in-memory database of official government service fees
for Jamaica -- passports, vital records, vehicle registration, driver's
licences, business registration, police records, and more.

Data compiled: 2026-02-22.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

EXCHANGE_RATE: float = 155.47
"""JMD-to-USD exchange rate when the data was compiled.
For production use, fetch the current rate from the Bank of Jamaica (BOJ)."""

DATA_DATE: str = "2026-02-22"
"""ISO date string indicating when the fee data was last verified."""

GCT_RATE: float = 0.15
"""General Consumption Tax rate (15 %)."""

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------

AgencyId = Literal[
    "pica", "nira", "taj", "ita", "coj", "nla", "nepa", "police", "trade_board", "labour"
]


@dataclass(frozen=True)
class Agency:
    id: str
    name: str
    acronym: str | None = None


@dataclass(frozen=True)
class ServiceFee:
    agency: str
    agency_name: str
    service: str
    description: str
    jmd: float
    note: str | None = None


@dataclass(frozen=True)
class PassportFee:
    type: str  # "standard" | "rush"
    days: int
    jmd: int
    office: str  # "kingston" | "regional"


@dataclass(frozen=True)
class VehicleFee:
    type: str
    jmd: int


# ---------------------------------------------------------------------------
# Embedded data
# ---------------------------------------------------------------------------

_AGENCIES: dict[str, dict] = {
    "pica": {"name": "Passport, Immigration and Citizenship Agency", "acronym": "PICA"},
    "nira": {"name": "National Identification and Registration Authority", "acronym": "NIRA"},
    "taj": {"name": "Tax Administration Jamaica", "acronym": "TAJ"},
    "ita": {"name": "Island Traffic Authority", "acronym": "ITA"},
    "coj": {"name": "Companies Office of Jamaica", "acronym": "COJ"},
    "nla": {"name": "National Land Agency", "acronym": "NLA"},
    "nepa": {"name": "National Environment and Planning Agency", "acronym": "NEPA"},
    "police": {"name": "Jamaica Constabulary Force", "acronym": "JCF"},
    "trade_board": {"name": "Trade Board Limited"},
    "labour": {"name": "Ministry of Labour and Social Security"},
}

# -- PICA passport fees (JMD) --

_PASSPORT_FEES: dict[str, list[PassportFee]] = {
    "adult_new": [
        PassportFee("standard", 7, 6500, "kingston"),
        PassportFee("rush", 3, 9500, "kingston"),
        PassportFee("rush", 1, 11500, "kingston"),
        PassportFee("rush", 0, 16500, "kingston"),
        PassportFee("standard", 7, 9500, "regional"),
        PassportFee("standard", 5, 11500, "regional"),
    ],
    "adult_replacement": [
        PassportFee("standard", 7, 11500, "kingston"),
        PassportFee("rush", 3, 14500, "kingston"),
        PassportFee("rush", 1, 16500, "kingston"),
        PassportFee("rush", 0, 21500, "kingston"),
    ],
    "minor_new": [
        PassportFee("standard", 7, 4000, "kingston"),
        PassportFee("rush", 3, 6000, "kingston"),
        PassportFee("rush", 1, 7000, "kingston"),
        PassportFee("rush", 0, 9000, "kingston"),
        PassportFee("standard", 7, 6000, "regional"),
        PassportFee("standard", 5, 7000, "regional"),
    ],
    "minor_replacement": [
        PassportFee("standard", 7, 7000, "kingston"),
        PassportFee("rush", 3, 9000, "kingston"),
        PassportFee("rush", 1, 10000, "kingston"),
        PassportFee("rush", 0, 12000, "kingston"),
    ],
}

# -- NIRA vital-records fees (JMD) --

_VITAL_RECORD_FEES: dict[str, dict[str, int]] = {
    "birth": {"same_day": 7500, "next_day": 6000},
    "death": {"same_day": 7500, "next_day": 6000},
    "marriage": {"same_day": 7500, "next_day": 6000},
}

# -- TAJ vehicle registration (24-month, JMD) --

_VEHICLE_REGISTRATION_FEES: list[VehicleFee] = [
    VehicleFee("motor_car_up_to_1199cc", 18480),
    VehicleFee("motor_car_1200_2999cc", 25200),
    VehicleFee("motor_car_3000_3999cc", 57600),
    VehicleFee("motor_car_4000cc_plus", 87650),
    VehicleFee("electric_motor_car", 9240),
    VehicleFee("motorcycle_up_to_125cc", 3690),
    VehicleFee("motorcycle_126_500cc", 5580),
    VehicleFee("motorcycle_500cc_plus", 8550),
]

# -- TAJ certificate-of-fitness fees (JMD) --

_FITNESS_FEES: dict[str, int] = {
    "private_motor_vehicle": 4500,
    "motorcycle": 4500,
    "trailer_tractor": 5400,
    "ppv_l_form": 3240,
    "public_commercial": 5400,
}

# -- ITA driver's licence fees (JMD) --

_DRIVERS_LICENCE_FEES: dict[str, int] = {
    "private": 5400,
    "general": 7200,
    "motorcycle": 4140,
}

# -- COJ business registration fees (JMD) --

_BUSINESS_REGISTRATION_FEES: dict[str, int] = {
    "sole_trader": 2500,
    "partnership_small": 2500,
    "partnership_large": 5000,
    "company": 27000,
}

# -- Police record fees (JMD) --

_POLICE_RECORD_FEES: dict[str, int] = {
    "regular": 3000,
    "express": 6000,
}

# -- Speed-to-days mapping for passports --

_SPEED_TO_DAYS: dict[str, int] = {
    "standard": 7,
    "rush_3day": 3,
    "rush_1day": 1,
    "same_day": 0,
}


# ---------------------------------------------------------------------------
# Agency helpers
# ---------------------------------------------------------------------------


def get_agencies() -> list[Agency]:
    """Return all government agencies in the database."""
    return [
        Agency(id=aid, name=info["name"], acronym=info.get("acronym"))
        for aid, info in _AGENCIES.items()
    ]


def get_agency(agency_id: str) -> Agency | None:
    """Look up a single agency by its short identifier."""
    info = _AGENCIES.get(agency_id)
    if info is None:
        return None
    return Agency(id=agency_id, name=info["name"], acronym=info.get("acronym"))


# ---------------------------------------------------------------------------
# Passport fees
# ---------------------------------------------------------------------------


def get_passport_fee(
    *,
    type: Literal["new", "replacement"],
    age: Literal["adult", "minor"],
    speed: Literal["standard", "rush_3day", "rush_1day", "same_day"],
    office: Literal["kingston", "regional"] = "kingston",
) -> int:
    """Look up a passport fee by type, age category, processing speed, and office.

    Raises:
        ValueError: When no matching fee is found.
    """
    key = f"{age}_{type}"
    fee_list = _PASSPORT_FEES.get(key)
    if fee_list is None:
        raise ValueError(f"Unknown passport category: {age} {type}")

    days = _SPEED_TO_DAYS.get(speed)
    if days is None:
        raise ValueError(f"Unknown speed: {speed}")

    # Replacements only have kingston data
    effective_office = "kingston" if type == "replacement" else office

    for f in fee_list:
        if f.days == days and f.office == effective_office:
            return f.jmd

    raise ValueError(
        f"No passport fee found for {age} {type}, speed={speed}, office={effective_office}"
    )


# ---------------------------------------------------------------------------
# Vehicle fees
# ---------------------------------------------------------------------------


def get_vehicle_registration_fee(engine_cc: int) -> int:
    """Look up the 24-month vehicle registration fee by engine displacement in cc.

    Raises:
        ValueError: When engine_cc is negative.
    """
    if engine_cc < 0:
        raise ValueError(f"Invalid engine displacement: {engine_cc}cc (must be non-negative)")
    if engine_cc <= 1199:
        return 18480
    if engine_cc <= 2999:
        return 25200
    if engine_cc <= 3999:
        return 57600
    return 87650


def get_certificate_of_fitness_fee(vehicle_type: str) -> int:
    """Look up the certificate-of-fitness inspection fee for a vehicle type.

    Raises:
        ValueError: When the vehicle type is not recognised.
    """
    fee = _FITNESS_FEES.get(vehicle_type)
    if fee is None:
        raise ValueError(f"Unknown vehicle type for fitness fee: {vehicle_type}")
    return fee


# ---------------------------------------------------------------------------
# Driver's licence
# ---------------------------------------------------------------------------


def get_drivers_licence_fee(type: Literal["private", "general", "motorcycle"]) -> int:
    """Look up the driver's licence fee by licence type.

    Raises:
        ValueError: When the licence type is not recognised.
    """
    fee = _DRIVERS_LICENCE_FEES.get(type)
    if fee is None:
        raise ValueError(f"Unknown licence type: {type}")
    return fee


# ---------------------------------------------------------------------------
# Business registration
# ---------------------------------------------------------------------------


def get_business_registration_fee(
    type: Literal["sole_trader", "partnership_small", "partnership_large", "company"],
) -> int:
    """Look up the business registration fee by business type.

    Raises:
        ValueError: When the business type is not recognised.
    """
    fee = _BUSINESS_REGISTRATION_FEES.get(type)
    if fee is None:
        raise ValueError(f"Unknown business type: {type}")
    return fee


# ---------------------------------------------------------------------------
# Vital records
# ---------------------------------------------------------------------------


def get_vital_record_fee(
    type: Literal["birth", "death", "marriage"],
    speed: Literal["same_day", "next_day"],
) -> int:
    """Look up a vital-record certificate fee.

    Raises:
        ValueError: When the record type or speed is not recognised.
    """
    record = _VITAL_RECORD_FEES.get(type)
    if record is None:
        raise ValueError(f"Unknown vital record type: {type}")
    fee = record.get(speed)
    if fee is None:
        raise ValueError(f"Unknown speed for vital record: {speed}")
    return fee


# ---------------------------------------------------------------------------
# Police record
# ---------------------------------------------------------------------------


def get_police_record_fee(speed: Literal["regular", "express"]) -> int:
    """Look up the police record (criminal background check) fee.

    Raises:
        ValueError: When the speed is not recognised.
    """
    fee = _POLICE_RECORD_FEES.get(speed)
    if fee is None:
        raise ValueError(f"Unknown police record speed: {speed}")
    return fee


# ---------------------------------------------------------------------------
# Search / list
# ---------------------------------------------------------------------------


def get_all_fees() -> list[ServiceFee]:
    """Build the complete flat list of all fees in the database."""
    fees: list[ServiceFee] = []

    # PICA -- passports
    for category, fee_list in _PASSPORT_FEES.items():
        for item in fee_list:
            fees.append(
                ServiceFee(
                    agency="pica",
                    agency_name=_AGENCIES["pica"]["name"],
                    service=f"passport_{category}",
                    description=(
                        f"Passport ({category.replace('_', ' ')}) - "
                        f"{item.type} {item.days}d - {item.office}"
                    ),
                    jmd=item.jmd,
                )
            )

    # NIRA -- vital records
    for record_type, speeds in _VITAL_RECORD_FEES.items():
        for speed_name, amount in speeds.items():
            fees.append(
                ServiceFee(
                    agency="nira",
                    agency_name=_AGENCIES["nira"]["name"],
                    service=f"{record_type}_certificate",
                    description=(
                        f"{record_type.capitalize()} certificate - {speed_name.replace('_', ' ')}"
                    ),
                    jmd=amount,
                )
            )
    fees.append(
        ServiceFee(
            agency="nira",
            agency_name=_AGENCIES["nira"]["name"],
            service="additional_copy",
            description="Additional copy at time of application",
            jmd=500,
            note="at time of application",
        )
    )

    # TAJ -- TRN and TCC (free)
    fees.append(
        ServiceFee(
            agency="taj",
            agency_name=_AGENCIES["taj"]["name"],
            service="trn_application",
            description="TRN application",
            jmd=0,
            note="Free - online or in person",
        )
    )
    fees.append(
        ServiceFee(
            agency="taj",
            agency_name=_AGENCIES["taj"]["name"],
            service="tcc",
            description="Tax Compliance Certificate",
            jmd=0,
            note="Free - available online via eServices",
        )
    )

    # TAJ -- vehicle registration
    for vf in _VEHICLE_REGISTRATION_FEES:
        fees.append(
            ServiceFee(
                agency="taj",
                agency_name=_AGENCIES["taj"]["name"],
                service="vehicle_registration_24mo",
                description=f"Vehicle registration 24 months - {vf.type.replace('_', ' ')}",
                jmd=vf.jmd,
            )
        )

    # TAJ -- certificate of fitness
    for vtype, amount in _FITNESS_FEES.items():
        fees.append(
            ServiceFee(
                agency="taj",
                agency_name=_AGENCIES["taj"]["name"],
                service="certificate_of_fitness",
                description=f"Certificate of fitness - {vtype.replace('_', ' ')}",
                jmd=amount,
            )
        )

    # TAJ -- property transfer stamp duty
    fees.append(
        ServiceFee(
            agency="taj",
            agency_name=_AGENCIES["taj"]["name"],
            service="property_transfer_stamp_duty",
            description="Property transfer stamp duty",
            jmd=5000,
        )
    )

    # ITA -- driver's licence
    fees.append(
        ServiceFee(
            agency="ita",
            agency_name=_AGENCIES["ita"]["name"],
            service="learners_permit_1yr",
            description="Learner's permit (1 year)",
            jmd=1800,
        )
    )
    fees.append(
        ServiceFee(
            agency="ita",
            agency_name=_AGENCIES["ita"]["name"],
            service="drivers_licence_exam",
            description="Driver's licence examination",
            jmd=3240,
        )
    )
    for ltype, amount in _DRIVERS_LICENCE_FEES.items():
        fees.append(
            ServiceFee(
                agency="ita",
                agency_name=_AGENCIES["ita"]["name"],
                service=f"{ltype}_drivers_licence",
                description=f"Driver's licence - {ltype}",
                jmd=amount,
            )
        )
    fees.append(
        ServiceFee(
            agency="ita",
            agency_name=_AGENCIES["ita"]["name"],
            service="road_code_test",
            description="Road code test",
            jmd=0,
            note="Free",
        )
    )

    # COJ -- business registration
    fees.append(
        ServiceFee(
            agency="coj",
            agency_name=_AGENCIES["coj"]["name"],
            service="name_search",
            description="Business name search",
            jmd=500,
        )
    )
    fees.append(
        ServiceFee(
            agency="coj",
            agency_name=_AGENCIES["coj"]["name"],
            service="name_reservation",
            description="Business name reservation",
            jmd=3000,
        )
    )
    fees.append(
        ServiceFee(
            agency="coj",
            agency_name=_AGENCIES["coj"]["name"],
            service="sole_trader_registration",
            description="Sole trader registration",
            jmd=2500,
        )
    )
    fees.append(
        ServiceFee(
            agency="coj",
            agency_name=_AGENCIES["coj"]["name"],
            service="partnership_2_5",
            description="Partnership registration (2-5 partners)",
            jmd=2500,
        )
    )
    fees.append(
        ServiceFee(
            agency="coj",
            agency_name=_AGENCIES["coj"]["name"],
            service="partnership_6_20",
            description="Partnership registration (6-20 partners)",
            jmd=5000,
        )
    )
    fees.append(
        ServiceFee(
            agency="coj",
            agency_name=_AGENCIES["coj"]["name"],
            service="trade_name_corporation",
            description="Trade name registration for corporation",
            jmd=3000,
        )
    )
    fees.append(
        ServiceFee(
            agency="coj",
            agency_name=_AGENCIES["coj"]["name"],
            service="company_incorporation",
            description="Company incorporation",
            jmd=27000,
        )
    )
    fees.append(
        ServiceFee(
            agency="coj",
            agency_name=_AGENCIES["coj"]["name"],
            service="stamping",
            description="Stamping fee (minimum)",
            jmd=500,
            note="minimum",
        )
    )

    # NLA
    fees.append(
        ServiceFee(
            agency="nla",
            agency_name=_AGENCIES["nla"]["name"],
            service="title_search_basic",
            description="Basic title search",
            jmd=0,
            note="Free online",
        )
    )
    fees.append(
        ServiceFee(
            agency="nla",
            agency_name=_AGENCIES["nla"]["name"],
            service="note_change_name",
            description="Note change of name on title",
            jmd=100,
        )
    )
    fees.append(
        ServiceFee(
            agency="nla",
            agency_name=_AGENCIES["nla"]["name"],
            service="name_amendment_on_title",
            description="Name amendment on title (minimum)",
            jmd=500,
            note="minimum",
        )
    )

    # NEPA
    fees.append(
        ServiceFee(
            agency="nepa",
            agency_name=_AGENCIES["nepa"]["name"],
            service="application_fee",
            description="NEPA application fee",
            jmd=2000,
            note="non-refundable",
        )
    )
    fees.append(
        ServiceFee(
            agency="nepa",
            agency_name=_AGENCIES["nepa"]["name"],
            service="environmental_permit",
            description="Environmental permit (typical range J$15,000-25,000)",
            jmd=15000,
            note="lower end of range; upper end is J$25,000",
        )
    )
    fees.append(
        ServiceFee(
            agency="nepa",
            agency_name=_AGENCIES["nepa"]["name"],
            service="environmental_licence",
            description="Environmental licence",
            jmd=7500,
        )
    )

    # Police
    for speed_name, amount in _POLICE_RECORD_FEES.items():
        fees.append(
            ServiceFee(
                agency="police",
                agency_name=_AGENCIES["police"]["name"],
                service=f"police_record_{speed_name}",
                description=f"Police record - {speed_name}",
                jmd=amount,
            )
        )
    fees.append(
        ServiceFee(
            agency="police",
            agency_name=_AGENCIES["police"]["name"],
            service="fingerprinting_overseas",
            description="Fingerprinting for overseas use",
            jmd=1500,
        )
    )
    fees.append(
        ServiceFee(
            agency="police",
            agency_name=_AGENCIES["police"]["name"],
            service="accident_report",
            description="Accident report",
            jmd=3000,
        )
    )

    # Trade Board
    fees.append(
        ServiceFee(
            agency="trade_board",
            agency_name=_AGENCIES["trade_board"]["name"],
            service="motor_vehicle_import_permit",
            description="Motor vehicle import permit",
            jmd=6325,
        )
    )
    fees.append(
        ServiceFee(
            agency="trade_board",
            agency_name=_AGENCIES["trade_board"]["name"],
            service="amendment_fee",
            description="Import permit amendment fee",
            jmd=2875.5,
        )
    )
    fees.append(
        ServiceFee(
            agency="trade_board",
            agency_name=_AGENCIES["trade_board"]["name"],
            service="permit_printout",
            description="Permit printout",
            jmd=1150,
        )
    )

    # Labour
    fees.append(
        ServiceFee(
            agency="labour",
            agency_name=_AGENCIES["labour"]["name"],
            service="work_permit_processing",
            description="Work permit processing fee",
            jmd=17250,
            note="non-refundable",
        )
    )
    fees.append(
        ServiceFee(
            agency="labour",
            agency_name=_AGENCIES["labour"]["name"],
            service="work_permit_quarterly",
            description="Work permit quarterly fee",
            jmd=48875,
        )
    )
    fees.append(
        ServiceFee(
            agency="labour",
            agency_name=_AGENCIES["labour"]["name"],
            service="work_permit_annual",
            description="Work permit annual fee",
            jmd=195500,
        )
    )

    return fees


def search_fees(query: str) -> list[ServiceFee]:
    """Full-text search across all fees (case-insensitive).

    Matches against service name, description, agency name, and agency ID.
    """
    q = query.lower()
    results: list[ServiceFee] = []
    for fee in get_all_fees():
        haystack = " ".join(
            [fee.agency, fee.agency_name, fee.service, fee.description, fee.note or ""]
        ).lower()
        if q in haystack:
            results.append(fee)
    return results


__all__ = [
    "EXCHANGE_RATE",
    "DATA_DATE",
    "GCT_RATE",
    "AgencyId",
    "Agency",
    "ServiceFee",
    "PassportFee",
    "VehicleFee",
    "get_agencies",
    "get_agency",
    "get_passport_fee",
    "get_vehicle_registration_fee",
    "get_certificate_of_fitness_fee",
    "get_drivers_licence_fee",
    "get_business_registration_fee",
    "get_vital_record_fee",
    "get_police_record_fee",
    "get_all_fees",
    "search_fees",
]
