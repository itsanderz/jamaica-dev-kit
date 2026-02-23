# Interactive Playground

Try every Jamaica Developer Kit function live — no installation required. Each playground module lets you experiment with real toolkit functions and see the equivalent TypeScript code.

## Modules

| Module | Package | What you can do |
|--------|---------|----------------|
| [TRN Validator](/playground/trn) | jamaica-trn | Validate, format, and generate test TRNs |
| [Phone Formatter](/playground/phone) | jamaica-phone | Parse, format, and detect carrier for Jamaican numbers |
| [Currency & GCT](/playground/currency) | jamaica-currency | Format JMD, calculate GCT, convert to USD |
| [Payroll Calculator](/playground/payroll) | jamaica-tax | Full PAYE, NIS, NHT, education tax breakdown |
| [Address Parser](/playground/address) | jamaica-addresses | Parse informal Jamaican addresses into components |
| [Government Fees](/playground/fees) | jamaica-gov-fees | Search and browse 60+ government service fees |
| [Public Holidays](/playground/holidays) | jamaica-holidays | Holiday calendar, business day counter |
| [Parish Explorer](/playground/parishes) | jamaica-parishes | Explore 14 parishes with stats and distance calculator |

## How It Works

Every playground runs the actual toolkit functions in your browser. The "View Code" button shows the equivalent TypeScript you'd write in your own project.

```typescript
// What you see in the playground is exactly what runs in your code
import { formatTRN, isValidTRN } from 'jamaica-trn';

isValidTRN('123-456-784'); // true
formatTRN('123456784');    // '123-456-784'
```
