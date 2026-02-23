import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  parseAddress,
  normalizeAddress,
  extractParish,
  isKingstonAddress,
  getKingstonSector,
  formatAddress,
  KINGSTON_SECTORS,
  PARISH_NAMES,
  PARISH_ALIASES,
  type ParsedAddress,
} from "../index";

// Load shared test vectors
const vectorsPath = resolve(__dirname, "../../../shared-tests/vectors.json");
const vectors = JSON.parse(readFileSync(vectorsPath, "utf-8"));

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe("KINGSTON_SECTORS", () => {
  it("should contain numbers 1 through 20", () => {
    expect(KINGSTON_SECTORS).toHaveLength(20);
    for (let i = 1; i <= 20; i++) {
      expect(KINGSTON_SECTORS).toContain(i);
    }
  });
});

describe("PARISH_NAMES", () => {
  it("should contain all 14 Jamaican parishes", () => {
    expect(PARISH_NAMES).toHaveLength(14);
    expect(PARISH_NAMES).toContain("Kingston");
    expect(PARISH_NAMES).toContain("St. Andrew");
    expect(PARISH_NAMES).toContain("St. Catherine");
    expect(PARISH_NAMES).toContain("Clarendon");
    expect(PARISH_NAMES).toContain("Manchester");
    expect(PARISH_NAMES).toContain("St. Elizabeth");
    expect(PARISH_NAMES).toContain("Westmoreland");
    expect(PARISH_NAMES).toContain("Hanover");
    expect(PARISH_NAMES).toContain("St. James");
    expect(PARISH_NAMES).toContain("Trelawny");
    expect(PARISH_NAMES).toContain("St. Ann");
    expect(PARISH_NAMES).toContain("St. Mary");
    expect(PARISH_NAMES).toContain("Portland");
    expect(PARISH_NAMES).toContain("St. Thomas");
  });
});

describe("PARISH_ALIASES", () => {
  it("should map KGN to Kingston", () => {
    expect(PARISH_ALIASES["kgn"]).toBe("Kingston");
  });

  it("should map mobay to St. James", () => {
    expect(PARISH_ALIASES["mobay"]).toBe("St. James");
  });

  it("should map sav to Westmoreland", () => {
    expect(PARISH_ALIASES["sav"]).toBe("Westmoreland");
  });

  it("should map ochi to St. Ann", () => {
    expect(PARISH_ALIASES["ochi"]).toBe("St. Ann");
  });

  it("should normalize Saint variants", () => {
    expect(PARISH_ALIASES["saint andrew"]).toBe("St. Andrew");
    expect(PARISH_ALIASES["st andrew"]).toBe("St. Andrew");
  });
});

// ---------------------------------------------------------------------------
// parseAddress
// ---------------------------------------------------------------------------

describe("parseAddress", () => {
  it("should always include the raw input", () => {
    const result = parseAddress("test input");
    expect(result.raw).toBe("test input");
  });

  it("should handle empty string", () => {
    const result = parseAddress("");
    expect(result.raw).toBe("");
  });

  // Shared vector tests
  for (const vector of vectors.parseAddress) {
    it(`should parse: "${vector.input}"`, () => {
      const result = parseAddress(vector.input);
      for (const [key, value] of Object.entries(vector.expected)) {
        expect(result[key as keyof ParsedAddress]).toEqual(value);
      }
    });
  }

  it("should parse Kingston address with sector", () => {
    const result = parseAddress("123 Main Street, Kingston 10");
    expect(result.streetNumber).toBe("123");
    expect(result.streetName).toBe("Main Street");
    expect(result.parish).toBe("Kingston");
    expect(result.kingstonSector).toBe(10);
  });

  it("should parse rural lot address", () => {
    const result = parseAddress("Lot 5, Rose Hall, St. James");
    expect(result.unit).toBe("Lot 5");
    expect(result.community).toBe("Rose Hall");
    expect(result.parish).toBe("St. James");
  });

  it("should parse commercial address", () => {
    const result = parseAddress(
      "Shop 3, Town Centre Plaza, May Pen, Clarendon",
    );
    expect(result.unit).toBe("Shop 3");
    expect(result.streetName).toBe("Town Centre Plaza");
    expect(result.community).toBe("May Pen");
    expect(result.parish).toBe("Clarendon");
  });

  it("should parse district address", () => {
    const result = parseAddress("District of Accompong, St. Elizabeth");
    expect(result.district).toBe("Accompong");
    expect(result.parish).toBe("St. Elizabeth");
  });

  it("should parse landmark + parish address", () => {
    const result = parseAddress("Half Way Tree, St. Andrew");
    expect(result.community).toBe("Half Way Tree");
    expect(result.parish).toBe("St. Andrew");
  });

  it("should parse apartment address with Kingston sector", () => {
    const result = parseAddress("Apt 4, 20 Barbican Road, Kingston 8");
    expect(result.unit).toBe("Apt 4");
    expect(result.streetNumber).toBe("20");
    expect(result.streetName).toBe("Barbican Road");
    expect(result.parish).toBe("Kingston");
    expect(result.kingstonSector).toBe(8);
  });

  it("should normalize Saint to St.", () => {
    const result = parseAddress("Lot 12, Stony Hill, Saint Andrew");
    expect(result.parish).toBe("St. Andrew");
  });
});

// ---------------------------------------------------------------------------
// normalizeAddress
// ---------------------------------------------------------------------------

describe("normalizeAddress", () => {
  for (const vector of vectors.normalizeAddress) {
    it(`should normalize to: "${vector.expected}"`, () => {
      const result = normalizeAddress(vector.input as ParsedAddress);
      expect(result).toBe(vector.expected);
    });
  }

  it("should format Kingston with sector", () => {
    const result = normalizeAddress({
      streetNumber: "45",
      streetName: "Hope Road",
      parish: "Kingston",
      kingstonSector: 6,
      raw: "45 Hope Road, Kingston 6",
    });
    expect(result).toBe("45 Hope Road, Kingston 6");
  });

  it("should format address without street number", () => {
    const result = normalizeAddress({
      community: "Half Way Tree",
      parish: "St. Andrew",
      raw: "Half Way Tree, St. Andrew",
    });
    expect(result).toBe("Half Way Tree, St. Andrew");
  });

  it("should include unit prefix", () => {
    const result = normalizeAddress({
      unit: "Suite 10",
      streetNumber: "5",
      streetName: "Knutsford Blvd",
      parish: "Kingston",
      kingstonSector: 5,
      raw: "Suite 10, 5 Knutsford Blvd, Kingston 5",
    });
    expect(result).toBe("Suite 10, 5 Knutsford Blvd, Kingston 5");
  });
});

// ---------------------------------------------------------------------------
// extractParish
// ---------------------------------------------------------------------------

describe("extractParish", () => {
  for (const vector of vectors.extractParish) {
    it(`should extract parish from: "${vector.input}"`, () => {
      expect(extractParish(vector.input)).toBe(vector.expected);
    });
  }

  it("should return null for empty string", () => {
    expect(extractParish("")).toBeNull();
  });

  it("should handle Saint variant", () => {
    expect(extractParish("Saint James")).toBe("St. James");
  });
});

// ---------------------------------------------------------------------------
// isKingstonAddress
// ---------------------------------------------------------------------------

describe("isKingstonAddress", () => {
  for (const vector of vectors.isKingstonAddress) {
    it(`should return ${vector.expected} for: "${vector.input}"`, () => {
      expect(isKingstonAddress(vector.input)).toBe(vector.expected);
    });
  }
});

// ---------------------------------------------------------------------------
// getKingstonSector
// ---------------------------------------------------------------------------

describe("getKingstonSector", () => {
  for (const vector of vectors.getKingstonSector) {
    it(`should return ${vector.expected} for: "${vector.input}"`, () => {
      expect(getKingstonSector(vector.input)).toBe(vector.expected);
    });
  }

  it("should return null for non-Kingston address", () => {
    expect(getKingstonSector("Negril, Westmoreland")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// formatAddress
// ---------------------------------------------------------------------------

describe("formatAddress", () => {
  it("should produce the same output as normalizeAddress", () => {
    const parsed: ParsedAddress = {
      streetNumber: "7",
      streetName: "Church Street",
      community: "Montego Bay",
      parish: "St. James",
      raw: "7 Church Street, Montego Bay, St. James",
    };
    expect(formatAddress(parsed)).toBe(normalizeAddress(parsed));
  });
});
