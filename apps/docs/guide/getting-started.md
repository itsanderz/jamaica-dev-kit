# Getting Started

The Jamaica Developer Kit is a collection of open-source packages for building Jamaica-focused applications. Available for both TypeScript/JavaScript and Python.

## Why?

Jamaica has strong internet adoption and a growing developer community, but very limited Jamaica-specific tooling on mainstream package registries. This toolkit is meant to close that gap with production-focused, reusable utilities.

## Choose Your Approach

### Option 1: Use the monorepo from source (recommended right now)

Package publication is still being prepared, so the safest current path is to use the repo directly:

```bash
git clone https://github.com/itsanderz/jamaica-dev-kit.git
cd jamaica-dev-kit
pnpm install
pnpm build
```

```typescript
import { formatTRN, getAllParishes, formatJMD } from 'jamaica';
```

### Option 2: Plan around package names

The package names below are the intended npm/PyPI publication targets:

```bash
jamaica-trn
jamaica-currency
jamaica-parishes
```

```typescript
import { isValidTRN } from 'jamaica-trn';
import { formatJMD } from 'jamaica-currency';
```

### Option 3: CLI

The CLI exists in the monorepo, but global package publication is still pending:

```bash
pnpm --filter jamaica-cli test
```

## Package Overview

| Package | Description | npm | PyPI |
|---------|-------------|-----|------|
| `jamaica` | Meta-package (includes all below) | planned | planned |
| `jamaica-trn` | TRN validation and formatting | planned | planned |
| `jamaica-parishes` | 14 parishes with full data | planned | planned |
| `jamaica-phone` | Phone validation (+1-876/+1-658) | planned | planned |
| `jamaica-currency` | JMD formatting, GCT calculations | planned | planned |
| `jamaica-gov-fees` | Government fees (10 agencies) | planned | planned |
| `jamaica-addresses` | Informal address parser | planned | planned |
| `jamaica-constants` | Country codes, timezone, symbols | planned | planned |
| `jamaica-holidays` | Public holidays, business days | planned | planned |

## Next Steps

- [Installation details](/guide/installation)
- [Quick start with examples](/guide/quick-start)
- [Package reference](/packages/overview)
- [CLI documentation](/cli/)
- [Public package release tracking](https://github.com/itsanderz/jamaica-dev-kit/issues/2)
