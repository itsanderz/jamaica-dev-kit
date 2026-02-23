import { describe, it, expect } from 'vitest';
import { parseAddress, formatAddress } from 'jamaica-addresses';
import { isValidTRN, formatTRN } from 'jamaica-trn';
import { isValidJamaicanNumber, formatNational } from 'jamaica-phone';
import { formatJMD } from 'jamaica-currency';
import { getHolidays, isBusinessDay } from 'jamaica-holidays';
import { COUNTRY_CODE, EMERGENCY_NUMBER } from 'jamaica-constants';
import { searchFees, getVehicleRegistrationFee } from 'jamaica-gov-fees';
import { getAllParishes } from 'jamaica-parishes';
import { calculatePayroll, getIncomeTaxBrackets } from 'jamaica-tax';
import { getSchools, getUniversities, searchSchools } from 'jamaica-schools';
import { getHospitals, getHealthCentres, getRegionalAuthorities } from 'jamaica-health';
import { getBanks, getSwiftCode, searchBanks } from 'jamaica-banks';
import { getConstituencies, getConstituencyCount } from 'jamaica-constituencies';
import { getAirports, getAirport, getRoadNetwork } from 'jamaica-transport';
import { getEmergencyNumbers, getPoliceStations, getFireStations, getDisasterShelters } from 'jamaica-emergency';
import { getPlaces, getTowns, searchPlaces } from 'jamaica-places';

/**
 * Smoke tests verifying the CLI command logic won't crash.
 * Each test mirrors what the CLI command handler does.
 */
describe('CLI command smoke tests', () => {
  describe('trn commands', () => {
    it('validate accepts valid TRN', () => {
      expect(isValidTRN('123-456-784')).toBe(true);
    });

    it('format returns formatted TRN', () => {
      expect(formatTRN('123456784')).toBe('123-456-784');
    });
  });

  describe('phone commands', () => {
    it('validate accepts valid number', () => {
      expect(isValidJamaicanNumber('8765551234')).toBe(true);
    });

    it('format returns national format', () => {
      expect(formatNational('8765551234')).toBe('(876) 555-1234');
    });
  });

  describe('parish commands', () => {
    it('list returns all 14 parishes', () => {
      expect(getAllParishes()).toHaveLength(14);
    });
  });

  describe('currency commands', () => {
    it('format returns JMD string', () => {
      expect(formatJMD(5000)).toBe('J$5,000.00');
    });
  });

  describe('fees commands', () => {
    it('search finds passport fees', () => {
      const results = searchFees('passport');
      expect(results.length).toBeGreaterThan(0);
    });

    it('getVehicleRegistrationFee throws on negative cc', () => {
      expect(() => getVehicleRegistrationFee(-1)).toThrow();
    });
  });

  describe('address commands', () => {
    it('parse then format does not crash (bug fix verification)', () => {
      const parsed = parseAddress('123 Main Street, Kingston 10');
      const formatted = formatAddress(parsed);
      expect(formatted).toContain('Kingston 10');
      expect(formatted).toContain('123 Main Street');
    });
  });

  describe('holidays commands', () => {
    it('list returns 10 holidays', () => {
      expect(getHolidays(2025)).toHaveLength(10);
    });

    it('check identifies business days', () => {
      expect(isBusinessDay('2025-01-02')).toBe(true);
      expect(isBusinessDay('2025-01-01')).toBe(false);
    });

    it('Sunday substitution: 2022-12-26 is not a business day', () => {
      expect(isBusinessDay('2022-12-26')).toBe(false);
    });
  });

  describe('constants commands', () => {
    it('exports country code', () => {
      expect(COUNTRY_CODE).toBe('JM');
    });

    it('exports emergency number', () => {
      expect(EMERGENCY_NUMBER).toBe('119');
    });
  });

  describe('tax commands', () => {
    it('returns 3 income tax brackets', () => {
      expect(getIncomeTaxBrackets()).toHaveLength(3);
    });
    it('calculates payroll for monthly salary', () => {
      const result = calculatePayroll(200000);
      expect(result.netPay).toBeLessThan(200000);
      expect(result.netPay).toBeGreaterThan(0);
    });
  });

  describe('schools commands', () => {
    it('returns schools', () => {
      expect(getSchools().length).toBeGreaterThan(50);
    });
    it('returns universities', () => {
      expect(getUniversities().length).toBeGreaterThanOrEqual(5);
    });
    it('search finds schools', () => {
      expect(searchSchools('Kingston').length).toBeGreaterThan(0);
    });
  });

  describe('health commands', () => {
    it('returns hospitals', () => {
      expect(getHospitals().length).toBeGreaterThan(10);
    });
    it('returns health centres', () => {
      expect(getHealthCentres().length).toBeGreaterThan(20);
    });
    it('returns 4 regional health authorities', () => {
      expect(getRegionalAuthorities()).toHaveLength(4);
    });
  });

  describe('banks commands', () => {
    it('returns banks', () => {
      expect(getBanks().length).toBeGreaterThan(10);
    });
    it('finds NCB SWIFT code', () => {
      expect(getSwiftCode('ncb')).toBeTruthy();
    });
    it('search finds banks', () => {
      expect(searchBanks('national').length).toBeGreaterThan(0);
    });
  });

  describe('constituencies commands', () => {
    it('returns exactly 63 constituencies', () => {
      expect(getConstituencyCount()).toBe(63);
    });
    it('returns all constituencies', () => {
      expect(getConstituencies()).toHaveLength(63);
    });
  });

  describe('transport commands', () => {
    it('returns airports', () => {
      expect(getAirports().length).toBeGreaterThanOrEqual(4);
    });
    it('finds Norman Manley by IATA', () => {
      const airport = getAirport('KIN');
      expect(airport).not.toBeNull();
      expect(airport!.name).toContain('Norman Manley');
    });
    it('road network has valid totals', () => {
      const rn = getRoadNetwork();
      expect(rn.totalKm).toBeGreaterThan(10000);
    });
  });

  describe('emergency commands', () => {
    it('returns correct emergency numbers', () => {
      const numbers = getEmergencyNumbers();
      expect(numbers.police).toBe('119');
      expect(numbers.fire).toBe('110');
    });
    it('returns police stations', () => {
      expect(getPoliceStations().length).toBeGreaterThan(10);
    });
    it('returns fire stations', () => {
      expect(getFireStations().length).toBeGreaterThan(10);
    });
    it('returns disaster shelters', () => {
      expect(getDisasterShelters().length).toBeGreaterThan(10);
    });
  });

  describe('places commands', () => {
    it('returns 200+ places', () => {
      expect(getPlaces().length).toBeGreaterThanOrEqual(200);
    });
    it('returns towns', () => {
      expect(getTowns().length).toBeGreaterThan(10);
    });
    it('search finds Montego Bay', () => {
      const results = searchPlaces('Montego Bay');
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
