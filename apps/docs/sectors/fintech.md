# Fintech

Build financial applications for the Jamaican market with currency handling, tax calculations, bank data, and live exchange rates.

## Packages You'll Use

| Package | Purpose |
|---------|---------|
| `jamaica-currency` | JMD formatting, GCT, USD conversion |
| `jamaica-tax` | Income tax, NIS, NHT, payroll |
| `jamaica-banks` | Bank directory, SWIFT codes, branches |
| `jamaica-boj` | Live BOJ exchange rates |
| `jamaica-trn` | Customer TRN validation |
| `jamaica-zod` | Form validation schemas |

## Currency Display

```typescript
import { formatJMD, formatUSD, jmdToUSD, usdToJMD } from 'jamaica-currency';

// Format amounts
formatJMD(250000);         // "J$250,000.00"
formatUSD(1500);           // "US$1,500.00"

// Convert
jmdToUSD(250000);          // ~1,607.38
usdToJMD(100);             // ~15,547.00
```

## GCT Invoice

```typescript
import { formatJMD, addGCT, formatWithGCT, GCT_RATE } from 'jamaica-currency';

function createInvoice(items: { name: string; amount: number }[]) {
  const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
  const gct = subtotal * GCT_RATE;
  const total = subtotal + gct;

  return {
    items,
    subtotal: formatJMD(subtotal),
    gct: formatJMD(gct),
    total: formatJMD(total),
  };
}
```

## Payroll Processing

```typescript
import { calculatePayroll } from 'jamaica-tax';

const payroll = calculatePayroll(250_000);
// {
//   grossPay: 250000,
//   incomeTax: 33533.33,
//   nis: 7500,       (3%)
//   nht: 5000,       (2%)
//   educationTax: 5625, (2.25%)
//   netPay: 198341.67,
//   employerCost: 273750
// }
```

## Bank Lookup

```typescript
import { getBanks, getSwiftCode, getBankBranches } from 'jamaica-banks';

const banks = getBanks();
const swift = getSwiftCode('ncb');        // "JABORJMK"
const branches = getBankBranches('ncb');  // 10 branches
```

## Live Exchange Rates

```typescript
import { getExchangeRate, convertToJMD } from 'jamaica-boj';

const usd = await getExchangeRate('USD');
console.log(`Buy: ${usd.buy}, Sell: ${usd.sell}`);

const jmd = await convertToJMD(500, 'USD');
console.log(`$500 USD = J$${jmd.toFixed(2)}`);
```

## Customer Validation with Zod

```typescript
import { trnSchema, phoneSchema, jmdSchema, customerSchema } from 'jamaica-zod';

const customer = customerSchema.parse({
  trn: '123-456-784',
  phone: '8765551234',
  parish: 'Kingston',
});
// Fully validated — TRN check digit verified, phone is Jamaican
```
