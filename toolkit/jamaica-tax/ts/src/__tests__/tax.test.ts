import { describe, it, expect } from 'vitest';
import vectors from '../../../shared-tests/vectors.json';
import {
  TAX_YEAR,
  ANNUAL_THRESHOLD,
  MONTHLY_THRESHOLD,
  NIS_EMPLOYEE_RATE,
  NIS_EMPLOYER_RATE,
  NIS_ANNUAL_CEILING,
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
} from '../index';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('Constants', () => {
  it('should have correct tax year', () => {
    expect(TAX_YEAR).toBe(2024);
  });

  it('should have correct annual threshold', () => {
    expect(ANNUAL_THRESHOLD).toBe(1_500_096);
  });

  it('should have correct monthly threshold', () => {
    expect(MONTHLY_THRESHOLD).toBe(125_008);
  });

  it('monthly threshold should be annual / 12', () => {
    expect(MONTHLY_THRESHOLD).toBe(ANNUAL_THRESHOLD / 12);
  });

  it('should have correct NIS rates', () => {
    expect(NIS_EMPLOYEE_RATE).toBe(0.03);
    expect(NIS_EMPLOYER_RATE).toBe(0.03);
    expect(NIS_ANNUAL_CEILING).toBe(5_000_000);
  });

  it('should have correct NHT rates', () => {
    expect(NHT_EMPLOYEE_RATE).toBe(0.02);
    expect(NHT_EMPLOYER_RATE).toBe(0.03);
  });

  it('should have correct Education Tax rates', () => {
    expect(EDUCATION_TAX_EMPLOYEE_RATE).toBe(0.0225);
    expect(EDUCATION_TAX_EMPLOYER_RATE).toBe(0.035);
  });

  it('should have correct HEART/NTA rate', () => {
    expect(HEART_NTA_RATE).toBe(0.03);
  });
});

// ---------------------------------------------------------------------------
// getIncomeTaxBrackets / getTaxThreshold
// ---------------------------------------------------------------------------

describe('getIncomeTaxBrackets', () => {
  it('should return 3 brackets', () => {
    const brackets = getIncomeTaxBrackets();
    expect(brackets).toHaveLength(3);
  });

  it('should start with 0% threshold bracket', () => {
    const brackets = getIncomeTaxBrackets();
    expect(brackets[0].rate).toBe(0);
    expect(brackets[0].min).toBe(0);
    expect(brackets[0].max).toBe(ANNUAL_THRESHOLD);
  });

  it('should have 25% second bracket', () => {
    const brackets = getIncomeTaxBrackets();
    expect(brackets[1].rate).toBe(0.25);
    expect(brackets[1].min).toBe(ANNUAL_THRESHOLD);
    expect(brackets[1].max).toBe(ANNUAL_THRESHOLD + 6_000_000);
  });

  it('should have 30% top bracket with no ceiling', () => {
    const brackets = getIncomeTaxBrackets();
    expect(brackets[2].rate).toBe(0.30);
    expect(brackets[2].max).toBeNull();
  });
});

describe('getTaxThreshold', () => {
  it('should return the annual threshold', () => {
    expect(getTaxThreshold()).toBe(ANNUAL_THRESHOLD);
  });
});

// ---------------------------------------------------------------------------
// calculateIncomeTax — vector-driven
// ---------------------------------------------------------------------------

describe('calculateIncomeTax', () => {
  for (const v of vectors.incomeTax) {
    it(v.description, () => {
      const result = calculateIncomeTax(v.annualIncome);
      expect(result.annualIncome).toBe(v.annualIncome);
      expect(result.threshold).toBe(v.expected.threshold);
      expect(result.taxableIncome).toBe(v.expected.taxableIncome);
      expect(result.tax).toBeCloseTo(v.expected.tax, 2);
      expect(result.effectiveRate).toBeCloseTo(v.expected.effectiveRate, 2);
      expect(result.brackets).toHaveLength(v.expected.brackets.length);

      for (let i = 0; i < v.expected.brackets.length; i++) {
        expect(result.brackets[i].bracket).toBe(v.expected.brackets[i].bracket);
        expect(result.brackets[i].taxableInThisBracket).toBeCloseTo(
          v.expected.brackets[i].taxableInThisBracket,
          2,
        );
        expect(result.brackets[i].tax).toBeCloseTo(v.expected.brackets[i].tax, 2);
      }
    });
  }

  it('should throw for negative income', () => {
    expect(() => calculateIncomeTax(-1)).toThrow();
  });

  it('should throw for NaN', () => {
    expect(() => calculateIncomeTax(NaN)).toThrow();
  });

  it('should throw for Infinity', () => {
    expect(() => calculateIncomeTax(Infinity)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// calculateNIS — vector-driven
// ---------------------------------------------------------------------------

describe('calculateNIS', () => {
  for (const v of vectors.nis) {
    it(v.description, () => {
      const result = calculateNIS(v.annualGross);
      expect(result.employee).toBeCloseTo(v.expected.employee, 2);
      expect(result.employer).toBeCloseTo(v.expected.employer, 2);
      expect(result.total).toBeCloseTo(v.expected.total, 2);
      expect(result.atCeiling).toBe(v.expected.atCeiling);
    });
  }

  it('should throw for negative gross', () => {
    expect(() => calculateNIS(-1)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// calculateNHT — vector-driven
// ---------------------------------------------------------------------------

describe('calculateNHT', () => {
  for (const v of vectors.nht) {
    it(v.description, () => {
      const result = calculateNHT(v.grossPay);
      expect(result.employee).toBeCloseTo(v.expected.employee, 2);
      expect(result.employer).toBeCloseTo(v.expected.employer, 2);
      expect(result.total).toBeCloseTo(v.expected.total, 2);
    });
  }

  it('should throw for negative gross', () => {
    expect(() => calculateNHT(-1)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// calculateEducationTax — vector-driven
// ---------------------------------------------------------------------------

describe('calculateEducationTax', () => {
  for (const v of vectors.educationTax) {
    it(v.description, () => {
      const result = calculateEducationTax(v.grossPay);
      expect(result.employee).toBeCloseTo(v.expected.employee, 2);
      expect(result.employer).toBeCloseTo(v.expected.employer, 2);
      expect(result.total).toBeCloseTo(v.expected.total, 2);
    });
  }

  it('should throw for negative gross', () => {
    expect(() => calculateEducationTax(-1)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// calculateHEART — vector-driven
// ---------------------------------------------------------------------------

describe('calculateHEART', () => {
  for (const v of vectors.heart) {
    it(v.description, () => {
      const result = calculateHEART(v.grossPay);
      expect(result).toBeCloseTo(v.expected, 2);
    });
  }

  it('should throw for negative gross', () => {
    expect(() => calculateHEART(-1)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// calculatePayroll — vector-driven
// ---------------------------------------------------------------------------

describe('calculatePayroll', () => {
  for (const v of vectors.payroll) {
    it(v.description, () => {
      const result = calculatePayroll(
        v.grossPay,
        v.period as 'monthly' | 'fortnightly' | 'weekly' | 'annual',
      );

      expect(result.period).toBe(v.expected.period);
      expect(result.grossPay).toBeCloseTo(v.expected.grossPay, 2);
      expect(result.annualized).toBeCloseTo(v.expected.annualized, 2);
      expect(result.incomeTax).toBeCloseTo(v.expected.incomeTax, 2);
      expect(result.nis).toBeCloseTo(v.expected.nis, 2);
      expect(result.nht).toBeCloseTo(v.expected.nht, 2);
      expect(result.educationTax).toBeCloseTo(v.expected.educationTax, 2);
      expect(result.totalDeductions).toBeCloseTo(v.expected.totalDeductions, 2);
      expect(result.netPay).toBeCloseTo(v.expected.netPay, 2);
      expect(result.employerNIS).toBeCloseTo(v.expected.employerNIS, 2);
      expect(result.employerNHT).toBeCloseTo(v.expected.employerNHT, 2);
      expect(result.employerEducationTax).toBeCloseTo(v.expected.employerEducationTax, 2);
      expect(result.employerHEART).toBeCloseTo(v.expected.employerHEART, 2);
      expect(result.totalEmployerContributions).toBeCloseTo(
        v.expected.totalEmployerContributions,
        2,
      );
      expect(result.totalCostToEmployer).toBeCloseTo(v.expected.totalCostToEmployer, 2);
    });
  }

  it('should default to monthly period', () => {
    const result = calculatePayroll(200_000);
    expect(result.period).toBe('monthly');
  });

  it('should handle weekly period', () => {
    const result = calculatePayroll(50_000, 'weekly');
    expect(result.period).toBe('weekly');
    expect(result.annualized).toBe(2_600_000);
  });

  it('should handle fortnightly period', () => {
    const result = calculatePayroll(100_000, 'fortnightly');
    expect(result.period).toBe('fortnightly');
    expect(result.annualized).toBe(2_600_000);
  });

  it('should handle annual period', () => {
    const result = calculatePayroll(2_400_000, 'annual');
    expect(result.period).toBe('annual');
    expect(result.annualized).toBe(2_400_000);
    expect(result.grossPay).toBe(2_400_000);
  });

  it('should throw for negative gross', () => {
    expect(() => calculatePayroll(-1)).toThrow();
  });

  it('net pay + deductions should equal gross pay', () => {
    const result = calculatePayroll(500_000, 'monthly');
    expect(result.netPay + result.totalDeductions).toBeCloseTo(result.grossPay, 2);
  });
});

// ---------------------------------------------------------------------------
// Validation vectors
// ---------------------------------------------------------------------------

describe('Validation', () => {
  for (const v of vectors.validation) {
    it(v.description, () => {
      if (v.function === 'calculateIncomeTax') {
        expect(() => calculateIncomeTax(v.input)).toThrow();
      } else if (v.function === 'calculatePayroll') {
        expect(() => calculatePayroll(v.input)).toThrow();
      }
    });
  }
});
