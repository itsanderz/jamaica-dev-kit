# Jamaica Developer Kit

> Production-ready TypeScript and Python packages for building Jamaica-focused applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: 22+](https://img.shields.io/badge/Node-22%2B-339933.svg)](https://nodejs.org/)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-3776AB.svg)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/itsanderz/jamaica-dev-kit/pulls)

## Overview

The Jamaica Developer Kit is a collection of 21 production-ready packages for building Jamaica-focused applications. It covers identity validation, finance and tax, geography, social services, developer experience, and live data -- all available in TypeScript and Python. Every toolkit package is zero-dependency, keeping your builds lean and your applications fast.

## Quick Start

```bash
npm install jamaica
```

```typescript
import { isValidTRN } from 'jamaica/trn'
import { calculatePayroll } from 'jamaica/tax'
import { formatJMD } from 'jamaica/currency'
import { getParish } from 'jamaica/parishes'
```

## Packages

### Core

| Package | Description |
|---------|-------------|
| `jamaica` | Meta-package that re-exports all packages below |
| `jamaica-trn` | TRN (Tax Registration Number) validator and formatter |
| `jamaica-phone` | Phone number validation and formatting for +1-876 / +1-658 |
| `jamaica-addresses` | Informal Jamaican address parser and normalizer |
| `jamaica-constants` | Country codes, timezone, flag colors, and national symbols |
| `jamaica-holidays` | Public holidays, business day calculations, and working day utilities |

### Finance

| Package | Description |
|---------|-------------|
| `jamaica-currency` | JMD formatting, parsing, and conversion utilities |
| `jamaica-tax` | Income tax (PAYE), NIS, NHT, Education Tax, and full payroll calculations |
| `jamaica-gov-fees` | Government service fees database -- passports, licences, registrations, permits |
| `jamaica-banks` | Banking institutions directory -- commercial banks, building societies, credit unions, and branches |
| `jamaica-boj` | Bank of Jamaica exchange rate client -- live FX rates, historical rates, and caching |

### Geography

| Package | Description |
|---------|-------------|
| `jamaica-parishes` | Jamaica's 14 parishes -- names, codes, populations, coordinates, and service centers |
| `jamaica-constituencies` | All 63 electoral constituencies with parish mapping |
| `jamaica-places` | Cities, towns, communities, districts, and villages across all 14 parishes |
| `jamaica-transport` | Airports, seaports, vehicle classifications, and road network data |

### Social Services

| Package | Description |
|---------|-------------|
| `jamaica-schools` | Schools and universities directory -- search, filter by parish, type, and level |
| `jamaica-health` | Health facilities directory -- hospitals, health centres, and regional health authorities |
| `jamaica-emergency` | Emergency services directory -- police stations, fire stations, and disaster shelters |

### Developer Experience

| Package | Description |
|---------|-------------|
| `jamaica-zod` | Zod validation schemas for TRN, phone, parish, currency, and more |
| `jamaica-react` | React hooks and components -- TRN input, phone input, parish select, currency formatting |
| `jamaica-express` | Express middleware for Jamaica data validation -- TRN, phone, parish, GCT |
| `jamaica-cli` | CLI tool for quick lookups from the terminal |

### Live Data

| Package | Description |
|---------|-------------|
| `jamaica-open-data` | Client for the Jamaica Open Data Portal (data.gov.jm) -- search datasets, fetch resources, query the DKAN API |

## Example Apps

The `examples/` directory contains four demo applications that showcase the toolkit in action:

| App | Description |
|-----|-------------|
| **Payroll Calculator** | Compute Jamaican payroll with PAYE, NIS, NHT, and Education Tax using `jamaica-tax` and `jamaica-currency` |
| **Parish Dashboard** | Browse all 14 parishes with schools, health facilities, emergency services, banks, and places data |
| **Gov Services Portal** | Look up government fees, validate TRNs, format costs, and check business days |
| **Checkout Demo** | E-commerce checkout flow with JMD currency formatting, address parsing, parish selection, and phone validation |

## Documentation

Full documentation, API references, and guides are available at:

**[https://itsanderz.github.io/jamaica-dev-kit/](https://itsanderz.github.io/jamaica-dev-kit/)**

## Development

```bash
git clone https://github.com/itsanderz/jamaica-dev-kit.git
cd jamaica-dev-kit
pnpm install
pnpm build
pnpm test
```

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the development workflow, branch naming conventions, code style, and pull request guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
