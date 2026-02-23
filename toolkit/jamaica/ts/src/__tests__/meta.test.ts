import { describe, it, expect } from 'vitest';
import * as jamaica from '../index';

describe('jamaica meta-package', () => {
  describe('namespaced exports', () => {
    it('exports trn namespace', () => {
      expect(jamaica.trn).toBeDefined();
      expect(typeof jamaica.trn.isValidTRN).toBe('function');
      expect(typeof jamaica.trn.formatTRN).toBe('function');
    });

    it('exports parishes namespace', () => {
      expect(jamaica.parishes).toBeDefined();
      expect(typeof jamaica.parishes.getAllParishes).toBe('function');
    });

    it('exports phone namespace', () => {
      expect(jamaica.phone).toBeDefined();
      expect(typeof jamaica.phone.isValidJamaicanNumber).toBe('function');
    });

    it('exports currency namespace', () => {
      expect(jamaica.currency).toBeDefined();
      expect(typeof jamaica.currency.formatJMD).toBe('function');
    });

    it('exports fees namespace', () => {
      expect(jamaica.fees).toBeDefined();
      expect(typeof jamaica.fees.getAllFees).toBe('function');
    });

    it('exports addresses namespace', () => {
      expect(jamaica.addresses).toBeDefined();
      expect(typeof jamaica.addresses.parseAddress).toBe('function');
    });

    it('exports constants namespace', () => {
      expect(jamaica.constants).toBeDefined();
      expect(jamaica.constants.COUNTRY_CODE).toBe('JM');
    });

    it('exports holidays namespace', () => {
      expect(jamaica.holidays).toBeDefined();
      expect(typeof jamaica.holidays.getHolidays).toBe('function');
    });
  });

  describe('flat convenience exports', () => {
    // TRN
    it('exports TRN functions', () => {
      expect(typeof jamaica.isValidTRN).toBe('function');
      expect(typeof jamaica.formatTRN).toBe('function');
      expect(typeof jamaica.generateTestTRN).toBe('function');
    });

    // Parishes
    it('exports parish functions', () => {
      expect(typeof jamaica.getAllParishes).toBe('function');
      expect(typeof jamaica.getParish).toBe('function');
      expect(typeof jamaica.getDistanceKm).toBe('function');
      expect(jamaica.PARISH_CODES).toBeDefined();
    });

    // Phone
    it('exports phone functions', () => {
      expect(typeof jamaica.isValidJamaicanNumber).toBe('function');
      expect(typeof jamaica.parsePhone).toBe('function');
      expect(typeof jamaica.formatE164).toBe('function');
    });

    // Currency
    it('exports currency functions', () => {
      expect(typeof jamaica.formatJMD).toBe('function');
      expect(typeof jamaica.parseJMD).toBe('function');
      expect(typeof jamaica.addGCT).toBe('function');
      expect(jamaica.GCT_RATE).toBe(0.15);
    });

    // Fees
    it('exports fee functions', () => {
      expect(typeof jamaica.getAllFees).toBe('function');
      expect(typeof jamaica.searchFees).toBe('function');
      expect(typeof jamaica.getPassportFee).toBe('function');
    });

    // Addresses
    it('exports address functions', () => {
      expect(typeof jamaica.parseAddress).toBe('function');
      expect(typeof jamaica.extractParish).toBe('function');
      expect(jamaica.PARISH_NAMES).toBeDefined();
    });

    // Constants
    it('exports constants', () => {
      expect(jamaica.COUNTRY_CODE).toBe('JM');
      expect(jamaica.TIMEZONE).toBe('America/Jamaica');
      expect(jamaica.CURRENCY_CODE).toBe('JMD');
      expect(jamaica.CAPITAL).toBe('Kingston');
    });

    // Holidays
    it('exports holiday functions', () => {
      expect(typeof jamaica.getHolidays).toBe('function');
      expect(typeof jamaica.isPublicHoliday).toBe('function');
      expect(typeof jamaica.isBusinessDay).toBe('function');
    });
  });

  describe('functional integration', () => {
    it('can validate a TRN', () => {
      const trn = jamaica.generateTestTRN();
      expect(jamaica.isValidTRN(trn)).toBe(true);
    });

    it('can format currency', () => {
      expect(jamaica.formatJMD(1500)).toBe('J$1,500.00');
    });

    it('can get parishes', () => {
      const parishes = jamaica.getAllParishes();
      expect(parishes).toHaveLength(14);
    });

    it('can check holidays', () => {
      expect(jamaica.isPublicHoliday('2025-12-25')).toBe(true);
    });

    it('can get fees', () => {
      const fees = jamaica.getAllFees();
      expect(fees.length).toBeGreaterThan(0);
    });

    it('can parse addresses', () => {
      const result = jamaica.parseAddress('123 Hope Road, Kingston 6');
      expect(result.parish).toBe('Kingston');
    });
  });
});
