/**
 * Jamaica Developer Toolkit
 *
 * The complete toolkit for building Jamaica-focused applications.
 * Provides utilities for TRN validation, parish data, phone numbers,
 * currency formatting, government fees, address parsing, holidays,
 * and country constants.
 *
 * @example
 * ```typescript
 * // Flat imports (most common functions)
 * import { formatTRN, getAllParishes, formatJMD } from 'jamaica';
 *
 * // Namespaced imports (avoids collisions)
 * import { trn, parishes, currency } from 'jamaica';
 *
 * // Sub-path imports (tree-shakeable)
 * import { formatTRN } from 'jamaica/trn';
 * ```
 *
 * @packageDocumentation
 */

// ── Namespaced re-exports ────────────────────────────────────────────────
export * as trn from 'jamaica-trn';
export * as parishes from 'jamaica-parishes';
export * as phone from 'jamaica-phone';
export * as currency from 'jamaica-currency';
export * as fees from 'jamaica-gov-fees';
export * as addresses from 'jamaica-addresses';
export * as constants from 'jamaica-constants';
export * as holidays from 'jamaica-holidays';
export * as tax from 'jamaica-tax';
export * as schools from 'jamaica-schools';
export * as health from 'jamaica-health';
export * as banks from 'jamaica-banks';
export * as constituencies from 'jamaica-constituencies';
export * as transport from 'jamaica-transport';
export * as emergency from 'jamaica-emergency';
export * as places from 'jamaica-places';
export * as boj from 'jamaica-boj';
export * as openData from 'jamaica-open-data';

// ── Flat convenience re-exports ──────────────────────────────────────────

// TRN
export {
  isValidTRN,
  formatTRN,
  unformatTRN,
  generateTestTRN,
  getTRNCheckDigit,
} from 'jamaica-trn';

// Parishes
export {
  getAllParishes,
  getParish,
  getParishByName,
  getParishesWithService,
  getDistanceKm,
  getNearestParishWithNLA,
  getTotalPopulation,
  PARISH_CODES,
} from 'jamaica-parishes';
export type { Parish, ParishCode, ServiceType } from 'jamaica-parishes';

// Phone
export {
  isValidJamaicanNumber,
  parsePhone,
  formatLocal,
  formatNational,
  formatE164,
  formatInternational,
  getCarrier,
  isAreaCode876,
  isAreaCode658,
  isMobile,
} from 'jamaica-phone';
export type { ParsedPhone, Carrier } from 'jamaica-phone';

// Currency
export {
  formatJMD,
  parseJMD,
  formatUSD,
  jmdToUSD,
  usdToJMD,
  addGCT,
  removeGCT,
  addTelecomGCT,
  formatWithGCT,
  GCT_RATE,
  TELECOM_GCT_RATE,
  DEFAULT_EXCHANGE_RATE,
} from 'jamaica-currency';
export type { FormatOptions, GCTBreakdown } from 'jamaica-currency';

// Government Fees
export {
  getAgencies,
  getAgency,
  getPassportFee,
  getVehicleRegistrationFee,
  getCertificateOfFitnessFee,
  getDriversLicenceFee,
  getBusinessRegistrationFee,
  getVitalRecordFee,
  getPoliceRecordFee,
  getAllFees,
  searchFees,
} from 'jamaica-gov-fees';
export type { Agency, AgencyId, ServiceFee } from 'jamaica-gov-fees';

// Addresses
export {
  parseAddress,
  normalizeAddress,
  extractParish,
  isKingstonAddress,
  getKingstonSector,
  formatAddress,
  KINGSTON_SECTORS,
  PARISH_NAMES,
  PARISH_ALIASES,
} from 'jamaica-addresses';
export type { ParsedAddress, NormalizedAddress } from 'jamaica-addresses';

// Constants
export {
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
} from 'jamaica-constants';

// Holidays
export {
  getHolidays,
  isPublicHoliday,
  getNextHoliday,
  isBusinessDay,
  getWorkingDays,
  getEasterSunday,
} from 'jamaica-holidays';
export type { Holiday } from 'jamaica-holidays';

// Tax
export {
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
  getIncomeTaxBrackets,
  getTaxThreshold,
  calculateIncomeTax,
  calculateNIS,
  calculateNHT,
  calculateEducationTax,
  calculateHEART,
  calculatePayroll,
} from 'jamaica-tax';
export type { TaxBracket, IncomeTaxBreakdown, PayrollBreakdown, NISContribution } from 'jamaica-tax';

// Schools
export {
  getSchools,
  getSchoolsByParish,
  getSchoolsByType,
  getSchoolsByLevel,
  getSchoolsByOwnership,
  getSchool,
  getUniversities,
  searchSchools,
  getSchoolCount,
  getSchoolCountByParish,
} from 'jamaica-schools';
export type { School, SchoolType, SchoolLevel, SchoolOwnership } from 'jamaica-schools';

// Health
export {
  getHealthFacilities,
  getHospitals,
  getHealthCentres,
  getHealthFacilitiesByParish,
  getHospitalsByParish,
  getHealthCentresByParish,
  getHealthFacilitiesByRegion,
  getRegionalAuthorities,
  getRegionalAuthority,
  searchHealthFacilities,
  getNearestFacility,
  getHealthFacilityCount,
} from 'jamaica-health';
export type { HealthFacility, RegionalHealthAuthority, FacilityType, RegionId } from 'jamaica-health';

// Banks
export {
  getBanks,
  getBank,
  getBanksByType,
  getCommercialBanks,
  getBranches,
  getBankBranches,
  getBranchesByParish,
  getSwiftCode,
  searchBanks,
  getBankCount,
  getBranchCount,
} from 'jamaica-banks';
export type { Bank, Branch, BankType } from 'jamaica-banks';

// Constituencies
export {
  getConstituencies,
  getConstituencyByParish,
  getConstituency,
  searchConstituencies,
  getConstituencyCount,
  getConstituencyCountByParish,
} from 'jamaica-constituencies';
export type { Constituency } from 'jamaica-constituencies';

// Transport
export {
  getAirports,
  getAirport,
  getInternationalAirports,
  getDomesticAirports,
  getSeaports,
  getSeaport,
  getVehicleClasses,
  getVehicleClass,
  getRoadNetwork,
  getHighways,
  getLicencePlatePrefixes,
  searchAirports,
} from 'jamaica-transport';
export type { Airport, Seaport, VehicleClass, Highway, RoadNetwork, LicencePlatePrefix, AirportType, SeaportType, HighwayStatus } from 'jamaica-transport';

// Emergency
export {
  getEmergencyNumbers,
  getPoliceStations,
  getPoliceStationsByParish,
  getFireStations,
  getFireStationsByParish,
  getStations,
  getStationsByParish,
  getDisasterShelters,
  getSheltersByParish,
  searchStations,
  searchShelters,
  getStationCount,
  getShelterCount,
} from 'jamaica-emergency';
export type { EmergencyNumbers, Station, Shelter, StationType } from 'jamaica-emergency';

// Places
export {
  getPlaces,
  getPlacesByParish,
  getPlacesByType,
  getPlace,
  getTowns,
  getCommunities,
  searchPlaces,
  getPlaceCount,
  getPlaceCountByParish,
} from 'jamaica-places';
export type { Place, PlaceType } from 'jamaica-places';

// BOJ Exchange Rates
export {
  parseCounterRatesHtml,
  createBOJClient,
  getExchangeRates,
  getExchangeRate,
  convertFromJMD,
  convertToJMD,
  getFallbackRates,
  getFallbackRate,
  getSupportedCurrencies,
  clearCache as clearBOJCache,
} from 'jamaica-boj';
export type { ExchangeRate, ExchangeRateResponse, HistoricalRate, BOJClientOptions, CurrencyCode } from 'jamaica-boj';

// Open Data
export {
  DATASETS,
  RESOURCES,
  createOpenDataClient,
  listDatasets,
  getDataset,
  searchDatastore,
  fetchAllRecords,
  getHealthCentres as getOpenDataHealthCentres,
} from 'jamaica-open-data';
export type { Dataset, Resource as DataResource, Tag, Organization, DatastoreSearchResult, DatastoreField, SearchOptions, ClientOptions as OpenDataClientOptions, HealthCentreRecord } from 'jamaica-open-data';
