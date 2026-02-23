import { describe, it, expect } from 'vitest';
import * as constants from '../index';
import vectors from '../../../shared-tests/vectors.json';

describe('jamaica-constants', () => {
  it('exports all expected constants', () => {
    for (const key of vectors.expected_exports) {
      expect(constants).toHaveProperty(key);
    }
  });

  it('has correct ISO codes', () => {
    expect(constants.COUNTRY_CODE).toBe(vectors.iso.alpha2);
    expect(constants.ISO_ALPHA3).toBe(vectors.iso.alpha3);
    expect(constants.ISO_NUMERIC).toBe(vectors.iso.numeric);
  });

  it('has correct timezone', () => {
    expect(constants.TIMEZONE).toBe(vectors.timezone.name);
    expect(constants.UTC_OFFSET).toBe(vectors.timezone.utc_offset);
    expect(constants.OBSERVES_DST).toBe(vectors.timezone.observes_dst);
  });

  it('has correct currency', () => {
    expect(constants.CURRENCY_CODE).toBe(vectors.currency.code);
    expect(constants.CURRENCY_SYMBOL).toBe(vectors.currency.symbol);
  });

  it('has correct telecom', () => {
    expect(constants.CALLING_CODE).toBe(vectors.telecom.calling_code);
    expect(constants.AREA_CODES).toEqual(vectors.telecom.area_codes);
  });

  it('has correct geography', () => {
    expect(constants.CAPITAL).toBe(vectors.geography.capital);
    expect(constants.TOTAL_PARISHES).toBe(vectors.geography.total_parishes);
    expect(constants.AREA_KM2).toBe(vectors.geography.area_km2);
    expect(constants.DRIVING_SIDE).toBe(vectors.geography.driving_side);
  });

  it('has correct emergency numbers', () => {
    expect(constants.EMERGENCY_NUMBER).toBe(vectors.emergency.police);
    expect(constants.AMBULANCE_NUMBER).toBe(vectors.emergency.ambulance);
    expect(constants.FIRE_NUMBER).toBe(vectors.emergency.fire);
  });

  it('has correct flag colors', () => {
    expect(constants.FLAG_COLORS).toEqual(vectors.flag_colors);
  });
});
