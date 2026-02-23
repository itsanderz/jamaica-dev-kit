# jamaica-banks

Jamaica banking institutions directory — commercial banks, building societies, credit unions, and branches.

## Installation

::: code-group
```bash [npm]
npm install jamaica-banks
```
```bash [pip]
pip install jamaica-banks
```
:::

## Quick Start

::: code-group
```typescript [TypeScript]
import { getBanks, getSwiftCode, getBankBranches, searchBanks } from 'jamaica-banks';

const banks = getBanks();  // 14 institutions

// SWIFT code lookup
const swift = getSwiftCode('ncb');  // "JABORJMK"

// Branches
const ncbBranches = getBankBranches('ncb');  // 10 branches

// Search
const results = searchBanks('Jamaica');
```

```python [Python]
from jamaica_banks import get_banks, get_swift_code, get_bank_branches

banks = get_banks()
swift = get_swift_code("ncb")
branches = get_bank_branches("ncb")
```
:::

## API Reference

### `getBanks()` — All institutions
### `getBank(idOrName)` — Find by ID or name
### `getBanksByType(type)` — Filter by type
### `getCommercialBanks()` — Commercial banks only
### `getBranches()` / `getBankBranches(bankId)` — Branches
### `getBranchesByParish(parish)` — Branches in a parish
### `getSwiftCode(bankId)` — SWIFT/BIC code
### `searchBanks(query)` — Search by name or abbreviation
