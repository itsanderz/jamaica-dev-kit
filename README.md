# Jamaica Developer Kit

Production-ready open-source infrastructure for building Jamaica-focused software in TypeScript and Python.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: 22+](https://img.shields.io/badge/Node-22%2B-339933.svg)](https://nodejs.org/)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-3776AB.svg)](https://www.python.org/)
[![CI](https://img.shields.io/github/actions/workflow/status/itsanderz/jamaica-dev-kit/ci.yml?branch=master&label=CI)](https://github.com/itsanderz/jamaica-dev-kit/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/github/actions/workflow/status/itsanderz/jamaica-dev-kit/deploy-docs.yml?branch=master&label=Docs)](https://github.com/itsanderz/jamaica-dev-kit/actions/workflows/deploy-docs.yml)
[![Release](https://img.shields.io/github/actions/workflow/status/itsanderz/jamaica-dev-kit/publish.yml?branch=master&label=Release)](https://github.com/itsanderz/jamaica-dev-kit/actions/workflows/publish.yml)
[![GitHub Release](https://img.shields.io/github/v/release/itsanderz/jamaica-dev-kit?display_name=tag&label=GitHub%20release)](https://github.com/itsanderz/jamaica-dev-kit/releases/latest)

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

## Why This Repository Matters

Most global developer tooling ignores country-specific implementation details for Jamaica. This repository closes that gap with reusable primitives for:

- tax and payroll calculations
- identity and phone validation
- parish, constituency, and location data
- public-service directories and government fee lookups
- live data integrations for Jamaica-specific workflows

That makes the repository useful to fintech, govtech, HR, logistics, education, healthcare, and internal business software built for Jamaica.

## Maintainer Scope

This is not a single-library repository. Ongoing maintenance spans:

- 21 public toolkit packages across TypeScript and Python
- shared test fixtures to keep both language implementations aligned
- example applications that demonstrate production usage
- docs and interactive playgrounds hosted on GitHub Pages
- release metadata, issue triage, and contribution workflows

More detail is in [MAINTAINERSHIP.md](MAINTAINERSHIP.md).

## Quick Start

Package publication to npm and PyPI is still being prepared. Until that is configured, use the monorepo from source:

```bash
git clone https://github.com/itsanderz/jamaica-dev-kit.git
cd jamaica-dev-kit
pnpm install
pnpm build
```

```ts
import { isValidTRN } from "jamaica/trn";
import { calculatePayroll } from "jamaica/tax";
import { formatJMD } from "jamaica/currency";
import { getParish } from "jamaica/parishes";
```

See issue [#2](https://github.com/itsanderz/jamaica-dev-kit/issues/2) for package publication work across npm and PyPI.
See [PUBLICATION_STATUS.md](PUBLICATION_STATUS.md) for the current release state and verified registry-name collisions.

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
| [Payroll Calculator](examples/payroll-calculator) | Jamaican payroll calculations with tax and currency formatting |
| [Parish Dashboard](examples/parish-dashboard) | Explore parishes with schools, health, emergency, and places data |
| [Gov Services Portal](examples/gov-services-portal) | Government fees, TRN validation, formatted costs, and business-day logic |
| [Checkout Demo](examples/checkout-demo) | Commerce flow with JMD currency, addresses, parishes, and phone validation |
| **Addressing Web / API** | Addressing and geocoding-oriented tools and services |
| **AI Assistant Web / API** | AI-assisted retrieval and workflow examples on top of toolkit data |

## Sector Coverage

The docs site includes sector-specific guides that show how the toolkit maps to real Jamaica-focused software domains:

- [Fintech](apps/docs/sectors/fintech.md)
- [Government & Civic Tech](apps/docs/sectors/government.md)
- [HR & Payroll](apps/docs/sectors/hr-payroll.md)
- [Logistics & Delivery](apps/docs/sectors/logistics.md)
- [Education](apps/docs/sectors/education.md)
- [Healthcare](apps/docs/sectors/health.md)
- [E-commerce](apps/docs/sectors/ecommerce.md)
- [Civic Tech](apps/docs/sectors/civic-tech.md)
- [Diaspora Services](apps/docs/sectors/diaspora.md)

## Documentation

- Docs site: [https://itsanderz.github.io/jamaica-dev-kit/](https://itsanderz.github.io/jamaica-dev-kit/)
- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Project Status

- Public repository with GitHub Pages documentation
- Initial public GitHub release: [`v0.1.0`](https://github.com/itsanderz/jamaica-dev-kit/releases/tag/v0.1.0)
- MIT licensed
- Issue templates and pull request template in place
- TypeScript and Python implementations maintained in one monorepo
- Package publication work is tracked publicly before npm/PyPI release
- Publication status and package-name collision tracking are documented in [PUBLICATION_STATUS.md](PUBLICATION_STATUS.md)
- CI, docs deployment, and release workflows configured under `.github/workflows/`

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
