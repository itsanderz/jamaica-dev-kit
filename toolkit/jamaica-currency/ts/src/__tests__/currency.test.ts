import { describe, it, expect } from "vitest";
import {
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
} from "../index";

import vectors from "../../../shared-tests/vectors.json";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe("constants", () => {
  it("GCT_RATE is 0.15", () => {
    expect(GCT_RATE).toBe(0.15);
  });

  it("TELECOM_GCT_RATE is 0.25", () => {
    expect(TELECOM_GCT_RATE).toBe(0.25);
  });

  it("DEFAULT_EXCHANGE_RATE is 155.47", () => {
    expect(DEFAULT_EXCHANGE_RATE).toBe(155.47);
  });
});

// ---------------------------------------------------------------------------
// formatJMD
// ---------------------------------------------------------------------------

describe("formatJMD", () => {
  for (const v of vectors.formatJMD) {
    const label = v.options
      ? `formatJMD(${v.input}, ${JSON.stringify(v.options)}) => "${v.expected}"`
      : `formatJMD(${v.input}) => "${v.expected}"`;

    it(label, () => {
      const opts = v.options as
        | { showSymbol?: boolean; decimals?: number; useGrouping?: boolean }
        | undefined;
      expect(formatJMD(v.input, opts)).toBe(v.expected);
    });
  }

  it("defaults to two decimal places", () => {
    expect(formatJMD(5)).toBe("J$5.00");
  });
});

// ---------------------------------------------------------------------------
// parseJMD
// ---------------------------------------------------------------------------

describe("parseJMD", () => {
  for (const v of vectors.parseJMD) {
    it(`parseJMD("${v.input}") => ${v.expected}`, () => {
      expect(parseJMD(v.input)).toBe(v.expected);
    });
  }

  it("returns null for undefined-ish input", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseJMD(null as any)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// formatUSD
// ---------------------------------------------------------------------------

describe("formatUSD", () => {
  for (const v of vectors.formatUSD) {
    it(`formatUSD(${v.input}) => "${v.expected}"`, () => {
      expect(formatUSD(v.input)).toBe(v.expected);
    });
  }
});

// ---------------------------------------------------------------------------
// jmdToUSD
// ---------------------------------------------------------------------------

describe("jmdToUSD", () => {
  for (const v of vectors.jmdToUSD) {
    if (v.comment) {
      it(v.comment, () => {
        const result = jmdToUSD(v.jmd);
        expect(typeof result).toBe("number");
        // With default rate the result should be jmd / 155.47 rounded to 3 dp
        expect(result).toBeCloseTo(v.jmd / DEFAULT_EXCHANGE_RATE, 2);
      });
    } else {
      it(`jmdToUSD(${v.jmd}, ${v.rate}) => ${v.expected}`, () => {
        expect(jmdToUSD(v.jmd, v.rate)).toBeCloseTo(v.expected!, 3);
      });
    }
  }
});

// ---------------------------------------------------------------------------
// usdToJMD
// ---------------------------------------------------------------------------

describe("usdToJMD", () => {
  for (const v of vectors.usdToJMD) {
    if (v.comment) {
      it(v.comment, () => {
        const result = usdToJMD(v.usd);
        expect(typeof result).toBe("number");
        expect(result).toBeCloseTo(v.usd * DEFAULT_EXCHANGE_RATE, 1);
      });
    } else {
      it(`usdToJMD(${v.usd}, ${v.rate}) => ${v.expected}`, () => {
        expect(usdToJMD(v.usd, v.rate)).toBeCloseTo(v.expected!, 2);
      });
    }
  }
});

// ---------------------------------------------------------------------------
// GCT functions
// ---------------------------------------------------------------------------

describe("addGCT", () => {
  for (const v of vectors.addGCT) {
    const label = v.rate
      ? `addGCT(${v.amount}, ${v.rate}) => ${v.expected}`
      : `addGCT(${v.amount}) => ${v.expected}`;

    it(label, () => {
      const result = v.rate ? addGCT(v.amount, v.rate) : addGCT(v.amount);
      expect(result).toBeCloseTo(v.expected, 4);
    });
  }
});

describe("removeGCT", () => {
  for (const v of vectors.removeGCT) {
    const label = v.rate
      ? `removeGCT(${v.amountWithGCT}, ${v.rate}) => ${v.expected}`
      : `removeGCT(${v.amountWithGCT}) => ${v.expected}`;

    it(label, () => {
      const result = v.rate
        ? removeGCT(v.amountWithGCT, v.rate)
        : removeGCT(v.amountWithGCT);
      expect(result).toBeCloseTo(v.expected, 4);
    });
  }

  it("roundtrip: removeGCT(addGCT(x)) ≈ x", () => {
    const original = 1234.56;
    expect(removeGCT(addGCT(original))).toBeCloseTo(original, 10);
  });
});

describe("addTelecomGCT", () => {
  for (const v of vectors.addTelecomGCT) {
    it(`addTelecomGCT(${v.amount}) => ${v.expected}`, () => {
      expect(addTelecomGCT(v.amount)).toBeCloseTo(v.expected, 4);
    });
  }
});

// ---------------------------------------------------------------------------
// formatWithGCT
// ---------------------------------------------------------------------------

describe("formatWithGCT", () => {
  for (const v of vectors.formatWithGCT) {
    it(`formatWithGCT(${v.amount})`, () => {
      const result = formatWithGCT(v.amount);
      expect(result.base).toBe(v.expected.base);
      expect(result.gct).toBe(v.expected.gct);
      expect(result.total).toBe(v.expected.total);
    });
  }
});
