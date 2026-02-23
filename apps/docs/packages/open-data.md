# jamaica-open-data

Client for the Jamaica Open Data Portal ([data.gov.jm](https://data.gov.jm)) — search datasets, fetch resources, and query the DKAN datastore API.

## Installation

::: code-group
```bash [npm]
npm install jamaica-open-data
```
```bash [pnpm]
pnpm add jamaica-open-data
```
:::

## Quick Start

```typescript
import {
  listDatasets,
  getDataset,
  searchDatastore,
  getHealthCentres,
  DATASETS,
  RESOURCES,
} from 'jamaica-open-data';

// List all 31+ datasets
const datasets = await listDatasets();

// Get dataset metadata
const health = await getDataset(DATASETS.HEALTH_FACILITIES);
console.log(health.title, health.resources.length);

// Query the datastore
const { records, total } = await searchDatastore(RESOURCES.HEALTH_CENTRES_GEO, {
  filters: { PARISH: 'Kingston' },
  limit: 10,
});

// Pre-built query for health centres
const centres = await getHealthCentres({ parish: 'St. Andrew' });
```

## Available Datasets

The portal hosts 31+ datasets covering:

| Category | Datasets |
|----------|----------|
| **Economy** | GDP (quarterly/annual), interest rates, public finance, public debt, budget |
| **Health** | Health facilities, epidemiological data, surveillance data |
| **Trade** | International merchandising trade (IMTS), visitor statistics |
| **Consumer** | Consumer prices, grocery prices, petrol prices, textbook prices |
| **Infrastructure** | Energy, parcel data, quarries/mining leases |
| **Education** | Enrollment by parish, teacher gender data |
| **Agriculture** | Farmer reports |
| **Government** | National contracts, quarterly contract awards |

Use the `DATASETS` constant for type-safe dataset names:

```typescript
import { DATASETS } from 'jamaica-open-data';

const ds = await getDataset(DATASETS.INTEREST_RATES);
const budget = await getDataset(DATASETS.BUDGET);
```

## API Reference

### `listDatasets()`
Returns all dataset names on the portal.

```typescript
const names = await listDatasets();
// ["national-contracts", "consumer-prices", "health-facilities", ...]
```

### `getDataset(nameOrId)`
Returns full metadata for a dataset including resources, tags, and organization.

```typescript
const ds = await getDataset('health-facilities');
// ds.title, ds.resources, ds.tags, ds.organization, ds.license
```

### `searchDatastore(resourceId, options?)`
Searches the datastore for records in a specific resource.

```typescript
const result = await searchDatastore('9bac5276-...', {
  limit: 10,
  offset: 0,
  filters: { PARISH: 'Kingston' },
  query: 'health',
  sort: 'CEN_NAME asc',
});
// result.records, result.total, result.fields
```

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `limit` | `number` | `100` | Max records to return |
| `offset` | `number` | `0` | Records to skip |
| `filters` | `Record<string, string>` | — | Key-value filter conditions |
| `query` | `string` | — | Full-text search |
| `sort` | `string` | — | Sort field and direction |

### `fetchAllRecords(resourceId, options?)`
Fetches all records by paginating automatically.

```typescript
const allRecords = await fetchAllRecords('9bac5276-...');
```

### Pre-built Queries

#### `getHealthCentres(options?)`
Fetches health centres with geospatial data.

```typescript
const centres = await getHealthCentres({ parish: 'Kingston', limit: 50 });
// [{ CEN_NAME, PARISH, ADDRESS, TELEPHONE, Latitude, Longitude, ... }]
```

### Client Factory

#### `createOpenDataClient(options?)`
Create a custom client instance.

```typescript
const client = createOpenDataClient({
  baseUrl: 'https://data.gov.jm',
  fetchFn: customFetch,
  timeout: 30000,
});
```

## Constants

```typescript
import { DATASETS, RESOURCES } from 'jamaica-open-data';

// Well-known dataset names
DATASETS.HEALTH_FACILITIES    // "health-facilities"
DATASETS.INTEREST_RATES       // "interest-rates"
DATASETS.GDP_QUARTERLY        // "quarterly-gross-domestic-product-gdp"

// Well-known resource IDs
RESOURCES.HEALTH_CENTRES_GEO  // "9bac5276-..."
```
