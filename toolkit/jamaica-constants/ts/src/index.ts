// ISO codes
export const COUNTRY_CODE = 'JM';
export const ISO_ALPHA3 = 'JAM';
export const ISO_NUMERIC = '388';

// Telecommunications
export const CALLING_CODE = '+1';
export const AREA_CODES = ['876', '658'] as const;
export type AreaCode = (typeof AREA_CODES)[number];

// Currency
export const CURRENCY_CODE = 'JMD';
export const CURRENCY_SYMBOL = 'J$';

// Time
export const TIMEZONE = 'America/Jamaica';
export const UTC_OFFSET = -5;
export const OBSERVES_DST = false;

// Locale
export const LOCALE = 'en-JM';
export const LANGUAGES = ['en'] as const;

// Internet
export const TLD = '.jm';

// Geography
export const CAPITAL = 'Kingston';
export const TOTAL_PARISHES = 14;
/** Official total land area. Individual parish estimates (rounded) sum to ~10,997. */
export const AREA_KM2 = 10991;
export const COORDINATES = { lat: 18.1096, lng: -77.2975 } as const;
export const BOUNDING_BOX = {
  north: 18.525,
  south: 17.703,
  east: -76.183,
  west: -78.369,
} as const;

// Driving
export const DRIVING_SIDE = 'left' as const;

// Emergency
export const EMERGENCY_NUMBER = '119';
export const AMBULANCE_NUMBER = '110';
export const FIRE_NUMBER = '110';

// National symbols
export const MOTTO = 'Out of Many, One People';
export const NATIONAL_FLOWER = 'Lignum Vitae';
export const NATIONAL_BIRD = 'Doctor Bird';
export const NATIONAL_FRUIT = 'Ackee';
export const NATIONAL_TREE = 'Blue Mahoe';
export const NATIONAL_DISH = 'Ackee and Saltfish';

// Key dates
export const INDEPENDENCE_DATE = '1962-08-06';
export const EMANCIPATION_DATE = '1838-08-01';

// Flag colors (hex)
export const FLAG_COLORS = {
  green: '#009B3A',
  gold: '#FED100',
  black: '#000000',
} as const;

// Government
export const HEAD_OF_STATE = 'Constitutional Monarchy';
export const GOVERNMENT_TYPE = 'Parliamentary Democracy';
export const UN_MEMBER_SINCE = 1962;
export const CARICOM_MEMBER = true;
