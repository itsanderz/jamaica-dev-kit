# HR & Payroll

Build HR management systems and payroll processing for Jamaican businesses with full statutory deduction support.

## Packages You'll Use

| Package | Purpose |
|---------|---------|
| `jamaica-tax` | PAYE, NIS, NHT, Education Tax, HEART |
| `jamaica-currency` | JMD formatting |
| `jamaica-holidays` | Business days & leave planning |
| `jamaica-trn` | Employee TRN validation |
| `jamaica-phone` | Employee contact validation |
| `jamaica-banks` | Salary deposit bank lookup |

## Full Payroll Calculation

```typescript
import { calculatePayroll, type PayrollBreakdown } from 'jamaica-tax';
import { formatJMD } from 'jamaica-currency';

const monthly = calculatePayroll(250_000);

console.log('=== Monthly Payslip ===');
console.log(`Gross Pay:       ${formatJMD(monthly.grossPay)}`);
console.log(`Income Tax:      ${formatJMD(monthly.incomeTax)}`);
console.log(`NIS (3%):        ${formatJMD(monthly.nis)}`);
console.log(`NHT (2%):        ${formatJMD(monthly.nht)}`);
console.log(`Ed. Tax (2.25%): ${formatJMD(monthly.educationTax)}`);
console.log(`─────────────────────`);
console.log(`Net Pay:         ${formatJMD(monthly.netPay)}`);
console.log(`Employer Cost:   ${formatJMD(monthly.employerCost)}`);
```

## Tax Bracket Breakdown

```typescript
import { calculateIncomeTax, getIncomeTaxBrackets, getTaxThreshold } from 'jamaica-tax';

// Annual threshold
const threshold = getTaxThreshold();  // J$1,500,096

// Tax brackets
const brackets = getIncomeTaxBrackets();
// [{ min: 0, max: 6000000, rate: 0.25 }, { min: 6000000, max: Infinity, rate: 0.30 }]

// Detailed tax breakdown
const annualSalary = 3_000_000;
const tax = calculateIncomeTax(annualSalary);
console.log(`Annual Income: ${annualSalary}`);
console.log(`Threshold: ${tax.threshold}`);
console.log(`Taxable Income: ${tax.taxableIncome}`);
console.log(`Tax: ${tax.tax}`);
console.log(`Effective Rate: ${(tax.effectiveRate * 100).toFixed(1)}%`);
```

## Individual Deductions

```typescript
import { calculateNIS, calculateNHT, calculateEducationTax, calculateHEART } from 'jamaica-tax';

const gross = 200_000;

// Employee deductions
const nisEmployee = calculateNIS(gross);           // 3% of gross
const nhtEmployee = calculateNHT(gross);           // 2% of gross
const edTaxEmployee = calculateEducationTax(gross); // 2.25% of gross

// Employer contributions (different rates)
const nisEmployer = gross * 0.03;    // 3%
const nhtEmployer = gross * 0.03;    // 3%
const edTaxEmployer = gross * 0.035; // 3.5%
const heart = calculateHEART(gross); // 3%
```

## Business Days & Leave

```typescript
import { getWorkingDays, isBusinessDay, getHolidays, isPublicHoliday } from 'jamaica-holidays';

// Working days in a month
const jan2025Working = getWorkingDays('2025-01-01', '2025-01-31');

// Plan around holidays
const holidays = getHolidays(2025);
const longWeekends = holidays.filter(h => {
  const day = new Date(h.date).getDay();
  return day === 1 || day === 5; // Monday or Friday holidays
});

// Validate leave request
function validateLeaveRequest(start: string, end: string, days: number) {
  const workDays = getWorkingDays(start, end);
  return {
    requested: days,
    actualWorkDays: workDays,
    valid: days <= workDays,
  };
}
```

## Employee Onboarding

```typescript
import { isValidTRN, formatTRN } from 'jamaica-trn';
import { isValidJamaicanNumber } from 'jamaica-phone';
import { getBank } from 'jamaica-banks';

function onboardEmployee(data: {
  trn: string;
  phone: string;
  bankId: string;
  accountNumber: string;
}) {
  // Validate TRN
  if (!isValidTRN(data.trn)) {
    throw new Error('Invalid employee TRN — required for statutory deductions');
  }

  // Validate phone
  if (!isValidJamaicanNumber(data.phone)) {
    throw new Error('Invalid contact number');
  }

  // Validate bank
  const bank = getBank(data.bankId);
  if (!bank) {
    throw new Error('Bank not found — check bank ID');
  }

  return {
    trn: formatTRN(data.trn),
    phone: data.phone,
    bank: bank.name,
    swift: bank.swift,
  };
}
```

## Payroll Summary Report

```typescript
import { calculatePayroll } from 'jamaica-tax';
import { formatJMD } from 'jamaica-currency';

interface Employee { name: string; grossPay: number }

function generatePayrollReport(employees: Employee[]) {
  const payrolls = employees.map(e => ({
    name: e.name,
    ...calculatePayroll(e.grossPay),
  }));

  const totals = payrolls.reduce((acc, p) => ({
    gross: acc.gross + p.grossPay,
    tax: acc.tax + p.incomeTax,
    nis: acc.nis + p.nis,
    nht: acc.nht + p.nht,
    net: acc.net + p.netPay,
    employerCost: acc.employerCost + p.employerCost,
  }), { gross: 0, tax: 0, nis: 0, nht: 0, net: 0, employerCost: 0 });

  return {
    employees: payrolls,
    totals: {
      grossPay: formatJMD(totals.gross),
      totalTax: formatJMD(totals.tax),
      totalNIS: formatJMD(totals.nis),
      totalNHT: formatJMD(totals.nht),
      totalNet: formatJMD(totals.net),
      totalEmployerCost: formatJMD(totals.employerCost),
    },
  };
}
```
