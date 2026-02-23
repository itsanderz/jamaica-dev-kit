# Civic Tech

Build civic engagement platforms, constituency tools, and open government applications for Jamaica.

## Packages You'll Use

| Package | Purpose |
|---------|---------|
| `jamaica-constituencies` | 63 electoral constituencies |
| `jamaica-parishes` | Parish boundaries & data |
| `jamaica-gov-fees` | Government service fees |
| `jamaica-holidays` | Public holidays & business days |
| `jamaica-open-data` | Government datasets from data.gov.jm |
| `jamaica-trn` | Citizen TRN validation |

## Constituency Lookup

```typescript
import {
  getConstituencies,
  getConstituencyByParish,
  getConstituency,
  lookupConstituency,
} from 'jamaica-constituencies';

// All 63 constituencies
const all = getConstituencies();

// Constituencies in a parish
const kgnSeats = getConstituencyByParish('Kingston');
// [{ name: "Kingston Central", parish: "Kingston", code: "KIN-C" }, ...]

// Look up by name
const seat = getConstituency('St. Andrew Western');

// Look up from an address
const match = lookupConstituency('Half Way Tree, St. Andrew');
```

## Parish Demographics Dashboard

```typescript
import { getAllParishes, getParish } from 'jamaica-parishes';

function getParishProfile(name: string) {
  const parish = getParish(name);
  if (!parish) return null;

  return {
    name: parish.name,
    capital: parish.capital,
    population: parish.population,
    area: parish.area,
    density: parish.population && parish.area
      ? Math.round(parish.population / parish.area)
      : null,
  };
}

// Full island profile
const profiles = getAllParishes().map(p => getParishProfile(p.name));
```

## Government Service Fee Calculator

```typescript
import { getAgencies, getFeesByAgency, getFee, searchFees } from 'jamaica-gov-fees';

// Browse agencies
const agencies = getAgencies();
// TAJ, RGD, PICA, etc.

// All fees for an agency
const tajFees = getFeesByAgency('taj');

// Look up a specific fee
const passportFee = getFee('pica', 'adult-passport');

// Search across all agencies
const results = searchFees('birth certificate');
```

## Open Data Integration

```typescript
import { listDatasets, getDataset, searchDatastore, getHealthCentres } from 'jamaica-open-data';

// Browse available datasets
const datasets = await listDatasets();

// Get dataset details
const dataset = await getDataset('health-centres-geospatial');

// Query datastore
const results = await searchDatastore(resourceId, {
  filters: { PARISH: 'Kingston' },
  limit: 50,
});

// Pre-built query for health centres
const centres = await getHealthCentres({ parish: 'Kingston' });
```

## Business Day Calculator

```typescript
import { getWorkingDays, isBusinessDay, getHolidays, isPublicHoliday } from 'jamaica-holidays';

// Calculate processing time for government services
function estimateProcessingDate(submissionDate: string, processingDays: number) {
  let remaining = processingDays;
  const date = new Date(submissionDate);

  while (remaining > 0) {
    date.setDate(date.getDate() + 1);
    const dateStr = date.toISOString().split('T')[0];
    if (isBusinessDay(dateStr)) {
      remaining--;
    }
  }

  return date.toISOString().split('T')[0];
}

// Example: Passport takes 10 business days
const ready = estimateProcessingDate('2025-03-01', 10);
```

## Citizen Portal Registration

```typescript
import { isValidTRN, formatTRN } from 'jamaica-trn';
import { isValidJamaicanNumber, formatE164 } from 'jamaica-phone';
import { lookupConstituency } from 'jamaica-constituencies';

function registerCitizen(data: {
  trn: string;
  phone: string;
  address: string;
}) {
  if (!isValidTRN(data.trn)) {
    throw new Error('Invalid TRN');
  }

  if (!isValidJamaicanNumber(data.phone)) {
    throw new Error('Invalid phone number');
  }

  const constituency = lookupConstituency(data.address);

  return {
    trn: formatTRN(data.trn),
    phone: formatE164(data.phone),
    constituency: constituency?.name ?? 'Unknown',
    parish: constituency?.parish ?? 'Unknown',
  };
}
```
