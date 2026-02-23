# jamaica-tax

Jamaica tax calculations — income tax (PAYE), NIS, NHT, Education Tax, and full payroll breakdowns.

## Installation

::: code-group
```bash [npm]
npm install jamaica-tax
```
```bash [pip]
pip install jamaica-tax
```
:::

## Quick Start

::: code-group
```typescript [TypeScript]
import { calculatePayroll, calculateIncomeTax } from 'jamaica-tax';

// Full payroll breakdown for J$200,000 monthly salary
const payroll = calculatePayroll(200_000);
console.log(payroll.netPay);         // Net after all deductions
console.log(payroll.incomeTax);      // PAYE income tax
console.log(payroll.nis);            // NIS contribution (3%)
console.log(payroll.nht);            // NHT contribution (2%)
console.log(payroll.educationTax);   // Education Tax (2.25%)

// Income tax only
const tax = calculateIncomeTax(3_000_000);
console.log(tax.effectiveRate);      // Effective tax rate
```

```python [Python]
from jamaica_tax import calculate_payroll, calculate_income_tax

# Full payroll breakdown
payroll = calculate_payroll(200_000)
print(payroll.net_pay)
print(payroll.income_tax)

# Income tax only
tax = calculate_income_tax(3_000_000)
print(tax.effective_rate)
```
:::

## Tax Rates

| Deduction | Employee Rate | Employer Rate |
|-----------|:---:|:---:|
| Income Tax (PAYE) | 25% / 30% | — |
| NIS | 3% | 3% |
| NHT | 2% | 3% |
| Education Tax | 2.25% | 3.5% |
| HEART/NTA | — | 3% |

**Income Tax Threshold:** J$1,500,096 per year (J$125,008/month)

## API Reference

### `calculatePayroll(grossPay, period?)`
Calculate full payroll deductions. Default period is `'monthly'`.

### `calculateIncomeTax(annualIncome)`
Calculate PAYE income tax with bracket breakdown.

### `calculateNIS(annualGross)`
Calculate NIS contributions (capped at J$5,000,000/year).

### `calculateNHT(grossPay)`
Calculate NHT contributions (no ceiling).

### `calculateEducationTax(grossPay)`
Calculate Education Tax contributions.

### `calculateHEART(grossPay)`
Calculate HEART/NTA levy (employer only).

### `getIncomeTaxBrackets()`
Returns the 3 income tax brackets.

### `getTaxThreshold()`
Returns the annual tax-free threshold (J$1,500,096).
