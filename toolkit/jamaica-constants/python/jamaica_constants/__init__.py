"""Jamaica country constants.

Provides commonly used constants for Jamaica: ISO codes, timezone,
currency, telecommunications, geography, emergency numbers, and
national symbols.
"""

from __future__ import annotations

from typing import Final

# ISO codes
COUNTRY_CODE: Final = "JM"
ISO_ALPHA3: Final = "JAM"
ISO_NUMERIC: Final = "388"

# Telecommunications
CALLING_CODE: Final = "+1"
AREA_CODES: Final = ("876", "658")

# Currency
CURRENCY_CODE: Final = "JMD"
CURRENCY_SYMBOL: Final = "J$"

# Time
TIMEZONE: Final = "America/Jamaica"
UTC_OFFSET: Final = -5
OBSERVES_DST: Final = False

# Locale
LOCALE: Final = "en-JM"
LANGUAGES: Final = ("en",)

# Internet
TLD: Final = ".jm"

# Geography
CAPITAL: Final = "Kingston"
TOTAL_PARISHES: Final = 14
AREA_KM2: Final = 10991  # Official total. Individual parish estimates (rounded) sum to ~10,997.
COORDINATES: Final = {"lat": 18.1096, "lng": -77.2975}
BOUNDING_BOX: Final = {
    "north": 18.525,
    "south": 17.703,
    "east": -76.183,
    "west": -78.369,
}

# Driving
DRIVING_SIDE: Final = "left"

# Emergency
EMERGENCY_NUMBER: Final = "119"
AMBULANCE_NUMBER: Final = "110"
FIRE_NUMBER: Final = "110"

# National symbols
MOTTO: Final = "Out of Many, One People"
NATIONAL_FLOWER: Final = "Lignum Vitae"
NATIONAL_BIRD: Final = "Doctor Bird"
NATIONAL_FRUIT: Final = "Ackee"
NATIONAL_TREE: Final = "Blue Mahoe"
NATIONAL_DISH: Final = "Ackee and Saltfish"

# Key dates
INDEPENDENCE_DATE: Final = "1962-08-06"
EMANCIPATION_DATE: Final = "1838-08-01"

# Flag colors (hex)
FLAG_COLORS: Final = {
    "green": "#009B3A",
    "gold": "#FED100",
    "black": "#000000",
}

# Government
HEAD_OF_STATE: Final = "Constitutional Monarchy"
GOVERNMENT_TYPE: Final = "Parliamentary Democracy"
UN_MEMBER_SINCE: Final = 1962
CARICOM_MEMBER: Final = True
