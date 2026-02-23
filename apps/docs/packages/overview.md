# Package Overview

The Jamaica Developer Kit consists of 21 packages — 16 data packages, 3 developer experience integrations, and 2 live data clients.

## Data Packages

All data packages are **zero-dependency** and ship in both TypeScript and Python.

### Core

| Package | What it does |
|---------|-------------|
| **jamaica-trn** | TRN validation with checksum |
| **jamaica-phone** | Phone validation & formatting |
| **jamaica-addresses** | Informal address parser |
| **jamaica-constants** | Country constants & metadata |

### Finance

| Package | What it does |
|---------|-------------|
| **jamaica-currency** | JMD formatting & GCT |
| **jamaica-tax** | Income tax, NIS, NHT, payroll |
| **jamaica-banks** | 14 banks & branches |
| **jamaica-gov-fees** | 60+ government fees |

### Geography

| Package | What it does |
|---------|-------------|
| **jamaica-parishes** | 14 parishes with geodata |
| **jamaica-places** | Towns, communities, districts |
| **jamaica-constituencies** | 63 electoral constituencies |
| **jamaica-transport** | Airports, seaports, highways |

### Social

| Package | What it does |
|---------|-------------|
| **jamaica-schools** | 1,650+ schools & universities |
| **jamaica-health** | Hospitals & health centres |
| **jamaica-emergency** | Police, fire, disaster shelters |
| **jamaica-holidays** | Public holidays & business days |

## Developer Experience

These packages integrate with popular frameworks. They require their framework as a peer dependency.

| Package | Framework | What it does |
|---------|-----------|-------------|
| **jamaica-zod** | Zod | Validation schemas for TRN, phone, parish, currency |
| **jamaica-react** | React | Hooks for TRN, phone, currency, parish inputs |
| **jamaica-express** | Express | Middleware for TRN, phone, parish, GCT |

## Live Data

These packages connect to real Jamaica data sources with built-in caching.

| Package | Data Source | What it does |
|---------|------------|-------------|
| **jamaica-boj** | Bank of Jamaica | Live FX rates with caching & offline fallback |
| **jamaica-open-data** | data.gov.jm | Client for 31+ government datasets via DKAN API |

## Dual Language

Every data package ships in both TypeScript and Python with identical functionality. Shared test vectors ensure both implementations produce the same output.

```
toolkit/jamaica-trn/
├── ts/                 # TypeScript (npm)
├── python/             # Python (PyPI)
└── shared-tests/       # Test vectors (JSON)
```

## Meta-Package

The `jamaica` meta-package re-exports all 18 data + live data packages:

```typescript
// Everything from one import
import { formatTRN, getAllParishes, formatJMD, isPublicHoliday } from 'jamaica';

// Live data
import { getExchangeRate, getFallbackRates } from 'jamaica';
import { listDatasets, getHealthCentres } from 'jamaica';

// Or use namespaces
import { trn, parishes, currency, holidays, boj, openData } from 'jamaica';

// Or tree-shake with sub-paths
import { formatTRN } from 'jamaica/trn';
import { getExchangeRate } from 'jamaica/boj';
import { listDatasets } from 'jamaica/open-data';
```

> **Note:** DX packages (zod, react, express) are installed separately since they have framework peer dependencies.
