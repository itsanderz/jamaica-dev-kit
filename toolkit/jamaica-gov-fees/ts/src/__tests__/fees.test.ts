import { describe, it, expect } from "vitest";
import vectors from "../../../shared-tests/vectors.json";
import {
  getAgencies,
  getAgency,
  getPassportFee,
  getVehicleRegistrationFee,
  getCertificateOfFitnessFee,
  getDriversLicenceFee,
  getBusinessRegistrationFee,
  getVitalRecordFee,
  getPoliceRecordFee,
  searchFees,
  getAllFees,
  EXCHANGE_RATE,
  DATA_DATE,
} from "../index";

const v = vectors.vectors;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe("constants", () => {
  it("EXCHANGE_RATE matches vector", () => {
    expect(EXCHANGE_RATE).toBe(v.constants.EXCHANGE_RATE);
  });

  it("DATA_DATE matches vector", () => {
    expect(DATA_DATE).toBe(v.constants.DATA_DATE);
  });
});

// ---------------------------------------------------------------------------
// Agencies
// ---------------------------------------------------------------------------

describe("getAgencies", () => {
  it("returns the expected number of agencies", () => {
    const agencies = getAgencies();
    expect(agencies.length).toBe(v.getAgencies.expected_count);
  });

  it("returns all expected agency ids", () => {
    const ids = getAgencies().map((a) => a.id);
    for (const expected of v.getAgencies.expected_ids) {
      expect(ids).toContain(expected);
    }
  });
});

describe("getAgency", () => {
  for (const tc of v.getAgency) {
    if (tc.expected === null) {
      it(`returns undefined for unknown id "${tc.input}"`, () => {
        expect(getAgency(tc.input)).toBeUndefined();
      });
    } else {
      it(`returns correct data for "${tc.input}"`, () => {
        const agency = getAgency(tc.input);
        expect(agency).toBeDefined();
        expect(agency!.name).toBe(tc.expected_name);
        if (tc.expected_acronym) {
          expect(agency!.acronym).toBe(tc.expected_acronym);
        }
      });
    }
  }
});

// ---------------------------------------------------------------------------
// Passport fees
// ---------------------------------------------------------------------------

describe("getPassportFee", () => {
  for (const tc of v.getPassportFee) {
    const label = JSON.stringify(tc.input);
    it(`returns ${tc.expected} for ${label}`, () => {
      const result = getPassportFee(tc.input as Parameters<typeof getPassportFee>[0]);
      expect(result).toBe(tc.expected);
    });
  }

  it("throws for invalid combination", () => {
    expect(() =>
      getPassportFee({
        type: "new",
        age: "adult",
        speed: "same_day",
        office: "regional",
      }),
    ).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Vehicle registration fees
// ---------------------------------------------------------------------------

describe("getVehicleRegistrationFee", () => {
  for (const tc of v.getVehicleRegistrationFee) {
    it(`returns ${tc.expected} for ${tc.input}cc`, () => {
      expect(getVehicleRegistrationFee(tc.input)).toBe(tc.expected);
    });
  }
});

// ---------------------------------------------------------------------------
// Certificate of fitness fees
// ---------------------------------------------------------------------------

describe("getCertificateOfFitnessFee", () => {
  for (const tc of v.getCertificateOfFitnessFee) {
    it(`returns ${tc.expected} for "${tc.input}"`, () => {
      expect(getCertificateOfFitnessFee(tc.input)).toBe(tc.expected);
    });
  }

  it("throws for unknown vehicle type", () => {
    expect(() => getCertificateOfFitnessFee("spaceship")).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Driver's licence fees
// ---------------------------------------------------------------------------

describe("getDriversLicenceFee", () => {
  for (const tc of v.getDriversLicenceFee) {
    it(`returns ${tc.expected} for "${tc.input}"`, () => {
      expect(getDriversLicenceFee(tc.input as Parameters<typeof getDriversLicenceFee>[0])).toBe(
        tc.expected,
      );
    });
  }
});

// ---------------------------------------------------------------------------
// Business registration fees
// ---------------------------------------------------------------------------

describe("getBusinessRegistrationFee", () => {
  for (const tc of v.getBusinessRegistrationFee) {
    it(`returns ${tc.expected} for "${tc.input}"`, () => {
      expect(
        getBusinessRegistrationFee(tc.input as Parameters<typeof getBusinessRegistrationFee>[0]),
      ).toBe(tc.expected);
    });
  }
});

// ---------------------------------------------------------------------------
// Vital record fees
// ---------------------------------------------------------------------------

describe("getVitalRecordFee", () => {
  for (const tc of v.getVitalRecordFee) {
    const { type, speed } = tc.input;
    it(`returns ${tc.expected} for ${type} / ${speed}`, () => {
      expect(
        getVitalRecordFee(
          type as Parameters<typeof getVitalRecordFee>[0],
          speed as Parameters<typeof getVitalRecordFee>[1],
        ),
      ).toBe(tc.expected);
    });
  }
});

// ---------------------------------------------------------------------------
// Police record fees
// ---------------------------------------------------------------------------

describe("getPoliceRecordFee", () => {
  for (const tc of v.getPoliceRecordFee) {
    it(`returns ${tc.expected} for "${tc.input}"`, () => {
      expect(getPoliceRecordFee(tc.input as Parameters<typeof getPoliceRecordFee>[0])).toBe(
        tc.expected,
      );
    });
  }
});

// ---------------------------------------------------------------------------
// searchFees
// ---------------------------------------------------------------------------

describe("searchFees", () => {
  for (const tc of v.searchFees) {
    it(tc.description, () => {
      const results = searchFees(tc.input);
      if (tc.expected_count !== undefined) {
        expect(results.length).toBe(tc.expected_count);
      }
      if (tc.expected_min_results !== undefined) {
        expect(results.length).toBeGreaterThanOrEqual(tc.expected_min_results);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// getAllFees
// ---------------------------------------------------------------------------

describe("getAllFees", () => {
  it("returns at least the expected minimum number of fees", () => {
    const fees = getAllFees();
    expect(fees.length).toBeGreaterThanOrEqual(v.getAllFees.expected_min_count);
  });

  it("every fee has required fields", () => {
    for (const fee of getAllFees()) {
      expect(fee.agency).toBeDefined();
      expect(fee.agencyName).toBeDefined();
      expect(fee.service).toBeDefined();
      expect(fee.description).toBeDefined();
      expect(typeof fee.jmd).toBe("number");
    }
  });
});
