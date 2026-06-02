# Jamaica Developer Kit

Production-ready open-source infrastructure for building Jamaica-focused software in TypeScript and Python.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: 22+](https://img.shields.io/badge/Node-22%2B-339933.svg)](https://nodejs.org/)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-3776AB.svg)](https://www.python.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/itsanderz/jamaica-dev-kit/pulls)

## What It Is

Jamaica Developer Kit is a monorepo of 20+ reusable packages, example apps, documentation, and APIs for common Jamaica-specific product and platform problems:

- identity validation
- payroll and tax calculations
- currency and banking utilities
- parish, constituency, and places data
- schools, health, and emergency-service directories
- CLI, React, Express, and Zod integrations

This project exists because local developers regularly have to rebuild the same country-specific logic from scratch. The goal is to make Jamaica-targeted software easier to build, test, and maintain.

## Why It Matters

- Public infrastructure for an underserved developer ecosystem
- Shared validation and data primitives instead of repeated one-off implementations
- Practical OSS shaped around real product workflows, not just demos
- Available in both TypeScript and Python for wider adoption

## Quick Start

```bash
npm install jamaica
```

```ts
import { isValidTRN } from "jamaica/trn";
import { calculatePayroll } from "jamaica/tax";
import { formatJMD } from "jamaica/currency";
import { getParish } from "jamaica/parishes";
```

## Package Coverage

### Core

| Package | Description |
|---------|-------------|
| `jamaica` | Meta-package that re-exports toolkit packages |
| `jamaica-trn` | TRN validator and formatter |
| `jamaica-phone` | Jamaican phone validation and formatting |
| `jamaica-addresses` | Informal Jamaican address parsing and normalization |
| `jamaica-constants` | Country codes, timezone, flag colors, and national symbols |
| `jamaica-holidays` | Public holidays, business-day and working-day utilities |

### Finance

| Package | Description |
|---------|-------------|
| `jamaica-currency` | JMD formatting, parsing, and conversion utilities |
| `jamaica-tax` | PAYE, NIS, NHT, Education Tax, and payroll calculations |
| `jamaica-gov-fees` | Government-service fees for passports, licences, registrations, and permits |
| `jamaica-banks` | Banks, building societies, credit unions, and branch data |
| `jamaica-boj` | Bank of Jamaica exchange-rate client with live and historical support |

### Geography and Civic Data

| Package | Description |
|---------|-------------|
| `jamaica-parishes` | Jamaica's 14 parishes with codes and metadata |
| `jamaica-constituencies` | All 63 electoral constituencies with parish mapping |
| `jamaica-places` | Cities, towns, communities, districts, and villages |
| `jamaica-transport` | Airports, seaports, vehicle classifications, and transport-related data |

### Social Services

| Package | Description |
|---------|-------------|
| `jamaica-schools` | Schools and universities directory |
| `jamaica-health` | Hospitals, health centres, and regional health authorities |
| `jamaica-emergency` | Police stations, fire stations, and disaster shelters |

### Developer Experience

| Package | Description |
|---------|-------------|
| `jamaica-zod` | Zod schemas for Jamaica-specific validation |
| `jamaica-react` | React hooks and components for common forms |
| `jamaica-express` | Express middleware for request validation |
| `jamaica-cli` | Terminal-first lookups and utilities |

### Live Data

| Package | Description |
|---------|-------------|
| `jamaica-open-data` | Client for the Jamaica Open Data Portal |

## Example Apps

The repo includes runnable examples and apps that show the toolkit in actual product flows:

| App | Description |
|-----|-------------|
| **Payroll Calculator** | Jamaican payroll calculations with tax and currency formatting |
| **Parish Dashboard** | Explore parishes with schools, health, emergency, and places data |
| **Gov Services Portal** | Government fees, TRN validation, formatted costs, and business-day logic |
| **Checkout Demo** | Commerce flow with JMD currency, addresses, parishes, and phone validation |
| **Addressing Web / API** | Addressing and geocoding-oriented tools and services |
| **AI Assistant Web / API** | AI-assisted retrieval and workflow examples on top of toolkit data |

## Documentation

- Docs site: [https://itsanderz.github.io/jamaica-dev-kit/](https://itsanderz.github.io/jamaica-dev-kit/)
- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Development

```bash
git clone https://github.com/itsanderz/jamaica-dev-kit.git
cd jamaica-dev-kit
pnpm install
pnpm build
pnpm test
```

## License

MIT. See [LICENSE](LICENSE).
