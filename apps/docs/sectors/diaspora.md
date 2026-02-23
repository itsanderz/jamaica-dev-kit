# Diaspora Apps

Build applications for the Jamaican diaspora — remittance calculators, identity verification, and homeland connection tools.

## Packages You'll Use

| Package | Purpose |
|---------|---------|
| `jamaica-currency` | JMD/USD formatting & conversion |
| `jamaica-boj` | Live exchange rates |
| `jamaica-trn` | TRN validation for overseas Jamaicans |
| `jamaica-phone` | Validate Jamaican contact numbers |
| `jamaica-parishes` | Homeland parish lookup |
| `jamaica-banks` | Bank & SWIFT codes for transfers |
| `jamaica-holidays` | Holiday awareness |

## Remittance Calculator

```typescript
import { formatJMD, formatUSD } from 'jamaica-currency';
import { getExchangeRate, convertToJMD, getFallbackRate } from 'jamaica-boj';

async function calculateRemittance(usdAmount: number) {
  const rate = await getExchangeRate('USD').catch(() => getFallbackRate('USD'));
  if (!rate) throw new Error('Could not get exchange rate');

  const jmdAmount = usdAmount * rate.sell;
  const fee = usdAmount < 100 ? 4.99 : usdAmount < 500 ? 7.99 : 12.99;

  return {
    sending: formatUSD(usdAmount),
    fee: formatUSD(fee),
    totalCharged: formatUSD(usdAmount + fee),
    rate: `1 USD = J$${rate.sell.toFixed(2)}`,
    recipientGets: formatJMD(jmdAmount),
  };
}

// Usage
const result = await calculateRemittance(200);
// {
//   sending: "US$200.00",
//   fee: "US$7.99",
//   totalCharged: "US$207.99",
//   rate: "1 USD = J$155.47",
//   recipientGets: "J$31,094.00"
// }
```

## Multi-Currency Support

```typescript
import { getSupportedCurrencies, getFallbackRates, getExchangeRate } from 'jamaica-boj';
import { formatJMD } from 'jamaica-currency';

// Show all supported currencies
const currencies = getSupportedCurrencies();
// ['USD', 'GBP', 'CAD', 'EUR', 'JPY', 'KYD', 'TTD', 'BBD', ...]

// Compare rates across corridors
async function getRateTable() {
  const corridors = ['USD', 'GBP', 'CAD', 'EUR'] as const;
  const rates = await Promise.all(
    corridors.map(async (currency) => {
      const rate = await getExchangeRate(currency).catch(() => getFallbackRate(currency));
      return {
        currency,
        buy: rate?.buy ?? 0,
        sell: rate?.sell ?? 0,
        jmd100: rate ? formatJMD(100 * rate.sell) : 'N/A',
      };
    })
  );
  return rates;
}
```

## Recipient Verification

```typescript
import { isValidTRN, formatTRN } from 'jamaica-trn';
import { isValidJamaicanNumber, formatLocal, getCarrier } from 'jamaica-phone';
import { getBank, getSwiftCode } from 'jamaica-banks';

function verifyRecipient(data: {
  trn: string;
  phone: string;
  bankId: string;
  accountNumber: string;
}) {
  const errors: string[] = [];

  if (!isValidTRN(data.trn)) {
    errors.push('Invalid Jamaican TRN — ask recipient for correct number');
  }

  if (!isValidJamaicanNumber(data.phone)) {
    errors.push('Invalid Jamaican phone — must be +1-876 or +1-658');
  }

  const bank = getBank(data.bankId);
  if (!bank) {
    errors.push('Bank not recognized — check bank name');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    recipient: {
      trn: formatTRN(data.trn),
      phone: formatLocal(data.phone),
      carrier: getCarrier(data.phone),
      bank: bank!.name,
      swift: getSwiftCode(data.bankId),
    },
  };
}
```

## Parish Connection

```typescript
import { getParish, getAllParishes } from 'jamaica-parishes';
import { getSchoolsByParish } from 'jamaica-schools';
import { getHealthFacilitiesByParish } from 'jamaica-health';

// Help diaspora members stay connected to their home parish
function getHomeParishInfo(parishName: string) {
  const parish = getParish(parishName);
  if (!parish) return null;

  return {
    name: parish.name,
    capital: parish.capital,
    population: parish.population,
    schools: getSchoolsByParish(parishName).length,
    healthFacilities: getHealthFacilitiesByParish(parishName).length,
  };
}
```

## Jamaican Holiday Awareness

```typescript
import { getHolidays, isPublicHoliday, getNextHoliday } from 'jamaica-holidays';

// Show upcoming Jamaican holidays
function getUpcomingHolidays(year: number) {
  const holidays = getHolidays(year);
  const today = new Date().toISOString().split('T')[0];

  return holidays
    .filter(h => h.date >= today)
    .map(h => ({
      name: h.name,
      date: h.date,
      daysAway: Math.ceil(
        (new Date(h.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
    }));
}

// Notify about bank closures
function isBankOpenInJamaica(date: string): boolean {
  const d = new Date(date);
  const day = d.getDay();
  if (day === 0 || day === 6) return false;
  return !isPublicHoliday(date);
}
```

## Diaspora Registration Form

```typescript
import { z } from 'zod';
import { trnSchema, phoneSchema, parishSchema } from 'jamaica-zod';

const diasporaSchema = z.object({
  // Identity
  trn: trnSchema,
  name: z.string().min(1),

  // Current location
  country: z.string().min(2),
  city: z.string().min(1),

  // Jamaica connection
  homeParish: parishSchema,
  contactInJA: phoneSchema,

  // Preferences
  interests: z.array(z.enum([
    'remittances',
    'investment',
    'property',
    'education',
    'healthcare',
    'voting',
  ])).min(1),
});

type DiasporaRegistration = z.infer<typeof diasporaSchema>;
```
