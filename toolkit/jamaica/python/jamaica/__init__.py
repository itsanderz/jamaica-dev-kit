"""Jamaica Developer Toolkit.

The complete toolkit for building Jamaica-focused applications.

Usage::

    # Flat imports
    from jamaica import format_trn, get_all_parishes, format_jmd

    # Namespaced imports
    from jamaica import trn, parishes, currency
"""

from __future__ import annotations

# ── Namespace sub-module access ──────────────────────────────────────────
import jamaica_trn as trn
import jamaica_parishes as parishes
import jamaica_phone as phone
import jamaica_currency as currency
import jamaica_gov_fees as fees
import jamaica_addresses as addresses
import jamaica_constants as constants
import jamaica_holidays as holidays
import jamaica_tax as tax
import jamaica_schools as schools
import jamaica_health as health
import jamaica_banks as banks
import jamaica_constituencies as constituencies
import jamaica_transport as transport
import jamaica_emergency as emergency
import jamaica_places as places

# ── Flat convenience re-exports ──────────────────────────────────────────

# TRN
from jamaica_trn import (
    is_valid_trn,
    format_trn,
    unformat_trn,
    generate_test_trn,
    get_trn_check_digit,
)

# Parishes
from jamaica_parishes import (
    get_all_parishes,
    get_parish,
    get_parish_by_name,
    get_parishes_with_service,
    get_distance_km,
    get_nearest_parish_with_nla,
    get_total_population,
    PARISH_CODES,
)

# Phone
from jamaica_phone import (
    is_valid_jamaican_number,
    parse_phone,
    format_local,
    format_national,
    format_e164,
    format_international,
    get_carrier,
    is_area_code_876,
    is_area_code_658,
    is_mobile,
)

# Currency
from jamaica_currency import (
    format_jmd,
    parse_jmd,
    format_usd,
    jmd_to_usd,
    usd_to_jmd,
    add_gct,
    remove_gct,
    add_telecom_gct,
    format_with_gct,
    GCT_RATE,
    TELECOM_GCT_RATE,
    DEFAULT_EXCHANGE_RATE,
)

# Government Fees
from jamaica_gov_fees import (
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

# Addresses
from jamaica_addresses import (
    parse_address,
    normalize_address,
    extract_parish,
    is_kingston_address,
    get_kingston_sector,
    format_address,
    KINGSTON_SECTORS,
    PARISH_NAMES,
    PARISH_ALIASES,
)

# Constants
from jamaica_constants import (
    COUNTRY_CODE,
    ISO_ALPHA3,
    ISO_NUMERIC,
    CALLING_CODE,
    AREA_CODES,
    CURRENCY_CODE,
    CURRENCY_SYMBOL,
    TIMEZONE,
    UTC_OFFSET,
    OBSERVES_DST,
    LOCALE,
    LANGUAGES,
    TLD,
    CAPITAL,
    TOTAL_PARISHES,
    AREA_KM2,
    COORDINATES,
    BOUNDING_BOX,
    DRIVING_SIDE,
    EMERGENCY_NUMBER,
    AMBULANCE_NUMBER,
    FIRE_NUMBER,
    MOTTO,
    NATIONAL_FLOWER,
    NATIONAL_BIRD,
    NATIONAL_FRUIT,
    NATIONAL_TREE,
    NATIONAL_DISH,
    INDEPENDENCE_DATE,
    EMANCIPATION_DATE,
    FLAG_COLORS,
    HEAD_OF_STATE,
    GOVERNMENT_TYPE,
    UN_MEMBER_SINCE,
    CARICOM_MEMBER,
)

# Holidays
from jamaica_holidays import (
    get_holidays,
    is_public_holiday,
    get_next_holiday,
    is_business_day,
    get_working_days,
    get_easter_sunday,
)

# Tax
from jamaica_tax import (
    TAX_YEAR,
    ANNUAL_THRESHOLD,
    MONTHLY_THRESHOLD,
    NIS_EMPLOYEE_RATE,
    NIS_EMPLOYER_RATE,
    NHT_EMPLOYEE_RATE,
    NHT_EMPLOYER_RATE,
    EDUCATION_TAX_EMPLOYEE_RATE,
    EDUCATION_TAX_EMPLOYER_RATE,
    HEART_NTA_RATE,
    get_income_tax_brackets,
    get_tax_threshold,
    calculate_income_tax,
    calculate_nis,
    calculate_nht,
    calculate_education_tax,
    calculate_heart,
    calculate_payroll,
)

# Schools
from jamaica_schools import (
    get_schools,
    get_schools_by_parish,
    get_schools_by_type,
    get_schools_by_level,
    get_schools_by_ownership,
    get_school,
    get_universities,
    search_schools,
    get_school_count,
    get_school_count_by_parish,
)

# Health
from jamaica_health import (
    get_health_facilities,
    get_hospitals,
    get_health_centres,
    get_health_facilities_by_parish,
    get_hospitals_by_parish,
    get_health_centres_by_parish,
    get_health_facilities_by_region,
    get_regional_authorities,
    get_regional_authority,
    search_health_facilities,
    get_nearest_facility,
    get_health_facility_count,
)

# Banks
from jamaica_banks import (
    get_banks,
    get_bank,
    get_banks_by_type,
    get_commercial_banks,
    get_branches,
    get_bank_branches,
    get_branches_by_parish,
    get_swift_code,
    search_banks,
    get_bank_count,
    get_branch_count,
)

# Constituencies
from jamaica_constituencies import (
    get_constituencies,
    get_constituency_by_parish,
    get_constituency,
    search_constituencies,
    get_constituency_count,
    get_constituency_count_by_parish,
)

# Transport
from jamaica_transport import (
    get_airports,
    get_airport,
    get_international_airports,
    get_domestic_airports,
    get_seaports,
    get_seaport,
    get_vehicle_classes,
    get_vehicle_class,
    get_road_network,
    get_highways,
    get_licence_plate_prefixes,
    search_airports,
)

# Emergency
from jamaica_emergency import (
    get_emergency_numbers,
    get_police_stations,
    get_police_stations_by_parish,
    get_fire_stations,
    get_fire_stations_by_parish,
    get_stations,
    get_stations_by_parish,
    get_disaster_shelters,
    get_shelters_by_parish,
    search_stations,
    search_shelters,
    get_station_count,
    get_shelter_count,
)

# Places
from jamaica_places import (
    get_places,
    get_places_by_parish,
    get_places_by_type,
    get_place,
    get_towns,
    get_communities,
    search_places,
    get_place_count,
    get_place_count_by_parish,
)

__version__ = "0.1.0"
