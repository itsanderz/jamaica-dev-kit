# Government & Civic Tech

Build government services, civic engagement platforms, and public sector applications.

## Packages You'll Use

| Package | Purpose |
|---------|---------|
| `jamaica-trn` | TRN validation & formatting |
| `jamaica-gov-fees` | 60+ government service fees |
| `jamaica-holidays` | Public holidays & business days |
| `jamaica-constituencies` | 63 electoral constituencies |
| `jamaica-parishes` | Parish data with service centres |
| `jamaica-open-data` | 31+ government datasets |
| `jamaica-express` | API validation middleware |

## TRN Verification

```typescript
import { isValidTRN, formatTRN, unformatTRN } from 'jamaica-trn';

// Validate citizen TRN
if (!isValidTRN(userInput)) {
  throw new Error('Invalid TRN');
}

// Normalize for storage
const raw = unformatTRN('123-456-784');  // "123456784"

// Format for display
const display = formatTRN('123456784');  // "123-456-784"
```

## Government Fee Lookup

```typescript
import { getPassportFee, getDriversLicenceFee, searchFees, getAllFees } from 'jamaica-gov-fees';

// Specific fee lookups
const passport = getPassportFee();
console.log(`${passport.name}: ${passport.formatted}`);

const licence = getDriversLicenceFee();

// Search across all agencies
const results = searchFees('birth certificate');

// All fees for a service portal
const allFees = getAllFees();
```

## Business Day Calculations

```typescript
import { isBusinessDay, isPublicHoliday, getWorkingDays, getHolidays } from 'jamaica-holidays';

// Check if an office is open
const today = '2025-08-06';
isPublicHoliday(today);    // true — Independence Day
isBusinessDay(today);       // false

// Calculate processing time (10 working days)
const workDays = getWorkingDays('2025-01-06', '2025-01-20');
// Excludes weekends and public holidays

// Show upcoming holidays
const holidays = getHolidays(2025);
```

## Constituency Lookup

```typescript
import { getConstituencies, getConstituencyByParish, searchConstituencies } from 'jamaica-constituencies';

// All 63 constituencies
const all = getConstituencies();

// Constituencies in a parish
const kgnConstituencies = getConstituencyByParish('Kingston');
// [{ name: "Kingston Central", parish: "Kingston", code: "..." }, ...]

// Search
const results = searchConstituencies('St. Andrew');
```

## Parish Service Centers

```typescript
import { getParishesWithService, getNearestParishWithNLA } from 'jamaica-parishes';

// Parishes with NLA offices
const nlaParishes = getParishesWithService('nla');

// Find nearest NLA to a parish
const nearest = getNearestParishWithNLA('POR');
console.log(`Nearest NLA: ${nearest.parish.name} (${nearest.distanceKm.toFixed(1)}km)`);
```

## Open Data Integration

```typescript
import { getDataset, searchDatastore, DATASETS, RESOURCES } from 'jamaica-open-data';

// Fetch government datasets
const budget = await getDataset(DATASETS.BUDGET);
console.log(`${budget.title}: ${budget.resources.length} resources`);

// Query health centres
const { records } = await searchDatastore(RESOURCES.HEALTH_CENTRES_GEO, {
  filters: { PARISH: 'Kingston' },
});
```

## API Validation Middleware

```typescript
import express from 'express';
import { validateTRN, validatePhone, validateParish } from 'jamaica-express';

const app = express();
app.use(express.json());

app.post('/api/citizen/register',
  validateTRN({ format: true }),
  validatePhone({ normalize: true }),
  validateParish(),
  (req, res) => {
    // All fields validated and normalized
    res.json({ success: true, data: req.body });
  }
);
```
