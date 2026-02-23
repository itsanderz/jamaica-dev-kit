# Payroll Calculator

Calculate complete Jamaican payroll deductions — income tax (PAYE), NIS, NHT, and education tax — for any salary and pay period. See both employee deductions and employer contributions with visual breakdowns.

<PlaygroundPayroll />

## API Reference

| Function | Description |
|----------|-------------|
| `calculatePayroll(gross, period?)` | Full payroll breakdown (PAYE, NIS, NHT, EdTax, net) |
| `calculateIncomeTax(annual)` | Income tax with bracket details |
| `calculateNIS(annual)` | National Insurance Scheme contributions |
| `calculateNHT(gross)` | National Housing Trust contributions |
| `calculateEducationTax(gross)` | Education tax contributions |
| `calculateHEART(gross)` | HEART/NTA employer levy |
| `getIncomeTaxBrackets()` | Current tax bracket definitions |
| `getTaxThreshold()` | Annual tax-free threshold |

## Install

```bash
npm install jamaica-tax jamaica-currency
```
