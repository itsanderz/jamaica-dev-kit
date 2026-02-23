/**
 * Jamaica Tax Calculations
 *
 * Covers income tax (PAYE), NIS, NHT, Education Tax, HEART/NTA,
 * and full payroll breakdowns for the Jamaican tax system.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Tax year these rates apply to */
export const TAX_YEAR = 2024;

/** Annual income tax threshold (J$) */
export const ANNUAL_THRESHOLD = 1_500_096;

/** Monthly income tax threshold (J$) */
export const MONTHLY_THRESHOLD = 125_008;

// NIS
export const NIS_EMPLOYEE_RATE = 0.03;
export const NIS_EMPLOYER_RATE = 0.03;
export const NIS_ANNUAL_CEILING = 5_000_000;
export const NIS_WEEKLY_CEILING = 96_154;

// NHT
export const NHT_EMPLOYEE_RATE = 0.02;
export const NHT_EMPLOYER_RATE = 0.03;

// Education Tax
export const EDUCATION_TAX_EMPLOYEE_RATE = 0.0225;
export const EDUCATION_TAX_EMPLOYER_RATE = 0.035;

// HEART/NTA
export const HEART_NTA_RATE = 0.03;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  label: string;
}

export interface IncomeTaxBreakdown {
  annualIncome: number;
  threshold: number;
  taxableIncome: number;
  tax: number;
  effectiveRate: number;
  brackets: { bracket: string; taxableInThisBracket: number; tax: number }[];
}

export interface PayrollBreakdown {
  period: 'monthly' | 'fortnightly' | 'weekly' | 'annual';
  grossPay: number;
  annualized: number;
  // Employee deductions
  incomeTax: number;
  nis: number;
  nht: number;
  educationTax: number;
  totalDeductions: number;
  netPay: number;
  // Employer costs
  employerNIS: number;
  employerNHT: number;
  employerEducationTax: number;
  employerHEART: number;
  totalEmployerContributions: number;
  totalCostToEmployer: number;
}

export interface NISContribution {
  employee: number;
  employer: number;
  total: number;
  atCeiling: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Round to 2 decimal places using banker-friendly rounding. */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function assertNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative finite number, got ${value}`);
  }
}

const PERIODS_PER_YEAR: Record<string, number> = {
  annual: 1,
  monthly: 12,
  fortnightly: 26,
  weekly: 52,
};

// ---------------------------------------------------------------------------
// Income Tax Brackets
// ---------------------------------------------------------------------------

export function getIncomeTaxBrackets(): TaxBracket[] {
  return [
    {
      min: 0,
      max: ANNUAL_THRESHOLD,
      rate: 0,
      label: `0 – ${ANNUAL_THRESHOLD.toLocaleString('en-JM')} (Threshold)`,
    },
    {
      min: ANNUAL_THRESHOLD,
      max: ANNUAL_THRESHOLD + 6_000_000,
      rate: 0.25,
      label: `${(ANNUAL_THRESHOLD + 1).toLocaleString('en-JM')} – ${(ANNUAL_THRESHOLD + 6_000_000).toLocaleString('en-JM')} (25%)`,
    },
    {
      min: ANNUAL_THRESHOLD + 6_000_000,
      max: null,
      rate: 0.30,
      label: `Above ${(ANNUAL_THRESHOLD + 6_000_000).toLocaleString('en-JM')} (30%)`,
    },
  ];
}

export function getTaxThreshold(): number {
  return ANNUAL_THRESHOLD;
}

// ---------------------------------------------------------------------------
// Income Tax Calculation
// ---------------------------------------------------------------------------

export function calculateIncomeTax(annualIncome: number): IncomeTaxBreakdown {
  assertNonNegative(annualIncome, 'annualIncome');

  const threshold = ANNUAL_THRESHOLD;
  const taxableIncome = Math.max(0, annualIncome - threshold);

  const bracketDetails: IncomeTaxBreakdown['brackets'] = [];
  let remainingTaxable = taxableIncome;
  let totalTax = 0;

  // First bracket above threshold: up to J$6,000,000 at 25%
  const firstBracketMax = 6_000_000;
  const inFirstBracket = Math.min(remainingTaxable, firstBracketMax);
  const firstBracketTax = round2(inFirstBracket * 0.25);
  if (inFirstBracket > 0) {
    bracketDetails.push({
      bracket: '25%',
      taxableInThisBracket: round2(inFirstBracket),
      tax: firstBracketTax,
    });
  }
  totalTax += firstBracketTax;
  remainingTaxable -= inFirstBracket;

  // Second bracket: everything above J$6,000,000 at 30%
  if (remainingTaxable > 0) {
    const secondBracketTax = round2(remainingTaxable * 0.30);
    bracketDetails.push({
      bracket: '30%',
      taxableInThisBracket: round2(remainingTaxable),
      tax: secondBracketTax,
    });
    totalTax += secondBracketTax;
  }

  totalTax = round2(totalTax);

  const effectiveRate = annualIncome > 0 ? round2(totalTax / annualIncome) : 0;

  return {
    annualIncome: round2(annualIncome),
    threshold,
    taxableIncome: round2(taxableIncome),
    tax: totalTax,
    effectiveRate: round2(effectiveRate),
    brackets: bracketDetails,
  };
}

// ---------------------------------------------------------------------------
// NIS Calculation
// ---------------------------------------------------------------------------

export function calculateNIS(annualGross: number): NISContribution {
  assertNonNegative(annualGross, 'annualGross');

  const cappedGross = Math.min(annualGross, NIS_ANNUAL_CEILING);
  const employee = round2(cappedGross * NIS_EMPLOYEE_RATE);
  const employer = round2(cappedGross * NIS_EMPLOYER_RATE);
  const atCeiling = annualGross >= NIS_ANNUAL_CEILING;

  return {
    employee,
    employer,
    total: round2(employee + employer),
    atCeiling,
  };
}

// ---------------------------------------------------------------------------
// NHT Calculation
// ---------------------------------------------------------------------------

export function calculateNHT(grossPay: number): {
  employee: number;
  employer: number;
  total: number;
} {
  assertNonNegative(grossPay, 'grossPay');

  const employee = round2(grossPay * NHT_EMPLOYEE_RATE);
  const employer = round2(grossPay * NHT_EMPLOYER_RATE);

  return {
    employee,
    employer,
    total: round2(employee + employer),
  };
}

// ---------------------------------------------------------------------------
// Education Tax Calculation
// ---------------------------------------------------------------------------

export function calculateEducationTax(grossPay: number): {
  employee: number;
  employer: number;
  total: number;
} {
  assertNonNegative(grossPay, 'grossPay');

  const employee = round2(grossPay * EDUCATION_TAX_EMPLOYEE_RATE);
  const employer = round2(grossPay * EDUCATION_TAX_EMPLOYER_RATE);

  return {
    employee,
    employer,
    total: round2(employee + employer),
  };
}

// ---------------------------------------------------------------------------
// HEART/NTA Levy Calculation
// ---------------------------------------------------------------------------

export function calculateHEART(grossPay: number): number {
  assertNonNegative(grossPay, 'grossPay');
  return round2(grossPay * HEART_NTA_RATE);
}

// ---------------------------------------------------------------------------
// Full Payroll Calculation
// ---------------------------------------------------------------------------

export function calculatePayroll(
  grossPay: number,
  period: 'monthly' | 'fortnightly' | 'weekly' | 'annual' = 'monthly',
): PayrollBreakdown {
  assertNonNegative(grossPay, 'grossPay');

  const periodsPerYear = PERIODS_PER_YEAR[period];
  const annualized = round2(grossPay * periodsPerYear);

  // Income tax (annual then de-annualize)
  const incomeTaxResult = calculateIncomeTax(annualized);
  const incomeTax = round2(incomeTaxResult.tax / periodsPerYear);

  // NIS (annual then de-annualize)
  const nisResult = calculateNIS(annualized);
  const nis = round2(nisResult.employee / periodsPerYear);
  const employerNIS = round2(nisResult.employer / periodsPerYear);

  // NHT (on period gross — no ceiling)
  const nhtResult = calculateNHT(grossPay);
  const nht = nhtResult.employee;
  const employerNHT = nhtResult.employer;

  // Education Tax (on period gross)
  const edTaxResult = calculateEducationTax(grossPay);
  const educationTax = edTaxResult.employee;
  const employerEducationTax = edTaxResult.employer;

  // HEART/NTA (employer only, on period gross)
  const employerHEART = calculateHEART(grossPay);

  const totalDeductions = round2(incomeTax + nis + nht + educationTax);
  const netPay = round2(grossPay - totalDeductions);

  const totalEmployerContributions = round2(
    employerNIS + employerNHT + employerEducationTax + employerHEART,
  );
  const totalCostToEmployer = round2(grossPay + totalEmployerContributions);

  return {
    period,
    grossPay: round2(grossPay),
    annualized,
    incomeTax,
    nis,
    nht,
    educationTax,
    totalDeductions,
    netPay,
    employerNIS,
    employerNHT,
    employerEducationTax,
    employerHEART,
    totalEmployerContributions,
    totalCostToEmployer,
  };
}
