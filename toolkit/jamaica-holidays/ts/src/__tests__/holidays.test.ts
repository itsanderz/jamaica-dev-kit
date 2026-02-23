import { describe, it, expect } from 'vitest';
import * as holidays from '../index';
import vectors from '../../../shared-tests/vectors.json';

describe('jamaica-holidays', () => {
  describe('getHolidays', () => {
    it('returns 10 holidays for 2025', () => {
      const result = holidays.getHolidays(2025);
      expect(result).toHaveLength(10);
    });

    it('returns holidays sorted by date', () => {
      const result = holidays.getHolidays(2025);
      for (let i = 1; i < result.length; i++) {
        expect(result[i].date >= result[i - 1].date).toBe(true);
      }
    });

    for (const vec of vectors.holidays_by_year) {
      it(`returns correct holidays for ${vec.year}`, () => {
        const result = holidays.getHolidays(vec.year);
        const dates = result.map((h) => h.date);
        for (const expected of vec.expected_dates) {
          expect(dates).toContain(expected.date);
        }
      });
    }
  });

  describe('getEasterSunday', () => {
    for (const vec of vectors.easter_dates) {
      it(`Easter ${vec.year} = ${vec.date}`, () => {
        expect(holidays.getEasterSunday(vec.year)).toBe(vec.date);
      });
    }
  });

  describe('Sunday substitution rule', () => {
    it('shifts Christmas 2022 (Sunday) to Monday Dec 26', () => {
      const result = holidays.getHolidays(2022);
      const christmas = result.find((h) => h.name === 'Christmas Day');
      expect(christmas?.date).toBe('2022-12-26');
    });

    it('shifts Boxing Day 2022 to Tuesday Dec 27 (displaced by Christmas substitute)', () => {
      const result = holidays.getHolidays(2022);
      const boxing = result.find((h) => h.name === 'Boxing Day');
      expect(boxing?.date).toBe('2022-12-27');
    });

    it('does not shift holidays that fall on Saturday', () => {
      // 2022: New Year (Jan 1) is Saturday — should stay on Jan 1
      const result = holidays.getHolidays(2022);
      const ny = result.find((h) => h.name === "New Year's Day");
      expect(ny?.date).toBe('2022-01-01');
    });

    it('still returns 10 holidays after substitution', () => {
      expect(holidays.getHolidays(2022)).toHaveLength(10);
    });
  });

  describe('isPublicHoliday', () => {
    it('returns true for known holidays', () => {
      expect(holidays.isPublicHoliday('2025-01-01')).toBe(true);
      expect(holidays.isPublicHoliday('2025-08-06')).toBe(true);
      expect(holidays.isPublicHoliday('2025-12-25')).toBe(true);
    });

    it('returns false for non-holidays', () => {
      expect(holidays.isPublicHoliday('2025-03-15')).toBe(false);
      expect(holidays.isPublicHoliday('2025-07-04')).toBe(false);
    });

    it('returns false for raw Sunday date when substituted (2022-12-25)', () => {
      expect(holidays.isPublicHoliday('2022-12-25')).toBe(false);
    });

    it('returns true for substituted Monday date (2022-12-26 = Christmas observed)', () => {
      expect(holidays.isPublicHoliday('2022-12-26')).toBe(true);
    });
  });

  describe('isBusinessDay', () => {
    it('returns false for weekends', () => {
      expect(holidays.isBusinessDay('2025-01-04')).toBe(false); // Saturday
      expect(holidays.isBusinessDay('2025-01-05')).toBe(false); // Sunday
    });

    it('returns false for holidays', () => {
      expect(holidays.isBusinessDay('2025-01-01')).toBe(false); // New Year
    });

    it('returns true for regular weekdays', () => {
      expect(holidays.isBusinessDay('2025-01-02')).toBe(true); // Thursday
      expect(holidays.isBusinessDay('2025-01-03')).toBe(true); // Friday
    });
  });

  describe('getWorkingDays', () => {
    for (const vec of vectors.working_days) {
      it(`${vec.from} to ${vec.to} = ${vec.expected} working days`, () => {
        expect(holidays.getWorkingDays(vec.from, vec.to)).toBe(vec.expected);
      });
    }
  });

  describe('getNextHoliday', () => {
    it('returns next holiday from a given date', () => {
      const next = holidays.getNextHoliday('2025-01-02');
      expect(next).not.toBeNull();
      expect(next!.date > '2025-01-02').toBe(true);
    });

    it('returns first holiday of next year if no more this year', () => {
      const next = holidays.getNextHoliday('2025-12-27');
      expect(next).not.toBeNull();
      expect(next!.date.startsWith('2026')).toBe(true);
    });
  });
});
