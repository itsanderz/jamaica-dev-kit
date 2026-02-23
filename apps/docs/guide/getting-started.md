# Getting Started

The Jamaica Developer Kit is a collection of open-source packages for building Jamaica-focused applications. Available for both TypeScript/JavaScript and Python.

## Why?

Jamaica has 83-85% internet penetration and growing developer community, but zero Jamaica-specific packages on npm or PyPI. This toolkit fills that gap with production-ready, well-tested utilities.

## Choose Your Approach

### Option 1: Meta-package (recommended)

Install everything at once:

::: code-group
```bash [npm]
npm install jamaica
```
```bash [pip]
pip install jamaica
```
:::

```typescript
import { formatTRN, getAllParishes, formatJMD } from 'jamaica';
```

### Option 2: Individual packages

Install only what you need:

```bash
npm install jamaica-trn jamaica-currency
```

```typescript
import { isValidTRN } from 'jamaica-trn';
import { formatJMD } from 'jamaica-currency';
```

### Option 3: CLI

Install the CLI globally for quick lookups:

```bash
npm install -g jamaica-cli

jamaica trn validate 123-456-784
jamaica parish list
jamaica fees search passport
```

## Package Overview

| Package | Description | npm | PyPI |
|---------|-------------|-----|------|
| `jamaica` | Meta-package (includes all below) | `jamaica` | `jamaica` |
| `jamaica-trn` | TRN validation and formatting | `jamaica-trn` | `jamaica-trn` |
| `jamaica-parishes` | 14 parishes with full data | `jamaica-parishes` | `jamaica-parishes` |
| `jamaica-phone` | Phone validation (+1-876/+1-658) | `jamaica-phone` | `jamaica-phone` |
| `jamaica-currency` | JMD formatting, GCT calculations | `jamaica-currency` | `jamaica-currency` |
| `jamaica-gov-fees` | Government fees (10 agencies) | `jamaica-gov-fees` | `jamaica-gov-fees` |
| `jamaica-addresses` | Informal address parser | `jamaica-addresses` | `jamaica-addresses` |
| `jamaica-constants` | Country codes, timezone, symbols | `jamaica-constants` | `jamaica-constants` |
| `jamaica-holidays` | Public holidays, business days | `jamaica-holidays` | `jamaica-holidays` |

## Next Steps

- [Installation details](/guide/installation)
- [Quick start with examples](/guide/quick-start)
- [Package reference](/packages/overview)
- [CLI documentation](/cli/)
