import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  isValidTRN,
  formatTRN,
  unformatTRN,
  generateTestTRN,
  getTRNCheckDigit,
} from "../index";

interface ValidVector {
  raw: string;
  formatted: string;
  description: string;
}

interface InvalidVector {
  input: string;
  reason: string;
}

interface FormattingVector {
  input: string;
  formatted: string;
}

interface UnformattingVector {
  input: string;
  raw: string;
}

interface CheckDigitVector {
  digits: string;
  expected: number | null;
  description?: string;
}

interface TestVectors {
  valid: ValidVector[];
  invalid: InvalidVector[];
  formatting: FormattingVector[];
  unformatting: UnformattingVector[];
  checkDigit: CheckDigitVector[];
}

const vectorsPath = resolve(__dirname, "../../../shared-tests/vectors.json");
const vectors: TestVectors = JSON.parse(readFileSync(vectorsPath, "utf-8"));

describe("isValidTRN", () => {
  describe("valid TRNs", () => {
    for (const v of vectors.valid) {
      it(`should accept raw ${v.raw} (${v.description})`, () => {
        expect(isValidTRN(v.raw)).toBe(true);
      });

      it(`should accept formatted ${v.formatted} (${v.description})`, () => {
        expect(isValidTRN(v.formatted)).toBe(true);
      });
    }
  });

  describe("invalid TRNs", () => {
    for (const v of vectors.invalid) {
      it(`should reject "${v.input}" (${v.reason})`, () => {
        expect(isValidTRN(v.input)).toBe(false);
      });
    }
  });
});

describe("formatTRN", () => {
  for (const v of vectors.formatting) {
    it(`should format "${v.input}" as "${v.formatted}"`, () => {
      expect(formatTRN(v.input)).toBe(v.formatted);
    });
  }

  it("should throw for non-9-digit input", () => {
    expect(() => formatTRN("12345")).toThrow();
  });
});

describe("unformatTRN", () => {
  for (const v of vectors.unformatting) {
    it(`should unformat "${v.input}" to "${v.raw}"`, () => {
      expect(unformatTRN(v.input)).toBe(v.raw);
    });
  }
});

describe("getTRNCheckDigit", () => {
  for (const v of vectors.checkDigit) {
    const label = v.description ?? `digits "${v.digits}"`;
    it(`should return ${v.expected} for ${label}`, () => {
      expect(getTRNCheckDigit(v.digits)).toBe(v.expected);
    });
  }
});

describe("generateTestTRN", () => {
  it("should generate a valid 9-digit TRN", () => {
    const trn = generateTestTRN();
    expect(trn).toMatch(/^\d{9}$/);
    expect(isValidTRN(trn)).toBe(true);
  });

  it("should generate different TRNs on successive calls", () => {
    const trns = new Set(Array.from({ length: 20 }, () => generateTestTRN()));
    // With 20 random TRNs the probability of all being identical is negligible
    expect(trns.size).toBeGreaterThan(1);
  });
});
