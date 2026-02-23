import { describe, it, expect } from "vitest";
import {
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
} from "../index";
import type { ParsedPhone, Carrier } from "../index";

// Load shared test vectors
import vectors from "../../../shared-tests/vectors.json";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
describe("isValidJamaicanNumber", () => {
  for (const v of vectors.valid_numbers) {
    // The 7-digit-only entry is expected invalid (no area code)
    const shouldBeValid = v.expected.isValid;
    it(`${shouldBeValid ? "accepts" : "rejects"}: ${v.description} (${v.input})`, () => {
      expect(isValidJamaicanNumber(v.input)).toBe(shouldBeValid);
    });
  }

  for (const v of vectors.invalid_numbers) {
    it(`rejects: ${v.description} (${JSON.stringify(v.input)})`, () => {
      expect(isValidJamaicanNumber(v.input)).toBe(false);
    });
  }
});

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------
describe("parsePhone", () => {
  for (const v of vectors.valid_numbers) {
    if (!v.expected.isValid) continue;

    it(`parses ${v.description}`, () => {
      const result = parsePhone(v.input);
      expect(result).not.toBeNull();
      const r = result as ParsedPhone;
      expect(r.countryCode).toBe(v.expected.countryCode);
      expect(r.areaCode).toBe(v.expected.areaCode);
      expect(r.localNumber).toBe(v.expected.localNumber);
      expect(r.isValid).toBe(true);
    });
  }

  it("returns null for invalid input", () => {
    expect(parsePhone("not-a-number")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------
describe("formatLocal", () => {
  for (const v of vectors.valid_numbers) {
    if (!v.expected.isValid) continue;
    it(`formats ${v.description} as local`, () => {
      expect(formatLocal(v.input)).toBe(v.expected.local);
    });
  }

  it("throws for invalid input", () => {
    expect(() => formatLocal("invalid")).toThrow();
  });
});

describe("formatNational", () => {
  for (const v of vectors.valid_numbers) {
    if (!v.expected.isValid) continue;
    it(`formats ${v.description} as national`, () => {
      expect(formatNational(v.input)).toBe(v.expected.national);
    });
  }
});

describe("formatE164", () => {
  for (const v of vectors.valid_numbers) {
    if (!v.expected.isValid) continue;
    it(`formats ${v.description} as E.164`, () => {
      expect(formatE164(v.input)).toBe(v.expected.e164);
    });
  }
});

describe("formatInternational", () => {
  for (const v of vectors.valid_numbers) {
    if (!v.expected.isValid) continue;
    it(`formats ${v.description} as international`, () => {
      expect(formatInternational(v.input)).toBe(v.expected.international);
    });
  }
});

// ---------------------------------------------------------------------------
// Carrier detection
// ---------------------------------------------------------------------------
describe("getCarrier", () => {
  for (const v of vectors.carrier_detection) {
    it(`detects carrier for ${v.description} (${v.input})`, () => {
      expect(getCarrier(v.input)).toBe(v.expected_carrier as Carrier);
    });
  }

  it('returns "unknown" for invalid numbers', () => {
    expect(getCarrier("invalid")).toBe("unknown");
  });
});

// ---------------------------------------------------------------------------
// Area code helpers
// ---------------------------------------------------------------------------
describe("isAreaCode876 / isAreaCode658", () => {
  for (const v of vectors.area_code_tests) {
    it(`${v.input} is876=${v.is876}, is658=${v.is658}`, () => {
      expect(isAreaCode876(v.input)).toBe(v.is876);
      expect(isAreaCode658(v.input)).toBe(v.is658);
    });
  }

  it("returns false for invalid numbers", () => {
    expect(isAreaCode876("invalid")).toBe(false);
    expect(isAreaCode658("invalid")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Mobile detection
// ---------------------------------------------------------------------------
describe("isMobile", () => {
  for (const v of vectors.mobile_detection) {
    it(`${v.description} (${v.input}) isMobile=${v.isMobile}`, () => {
      expect(isMobile(v.input)).toBe(v.isMobile);
    });
  }

  it("returns false for invalid numbers", () => {
    expect(isMobile("invalid")).toBe(false);
  });
});
