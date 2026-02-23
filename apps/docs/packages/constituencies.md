# jamaica-constituencies

All 63 Jamaican electoral constituencies mapped to their parishes.

## Installation

::: code-group
```bash [npm]
npm install jamaica-constituencies
```
```bash [pip]
pip install jamaica-constituencies
```
:::

## Quick Start

::: code-group
```typescript [TypeScript]
import { getConstituencies, getConstituencyByParish, getConstituencyCount } from 'jamaica-constituencies';

const all = getConstituencies();  // 63 constituencies
const stAndrew = getConstituencyByParish('St. Andrew');  // 12 constituencies
const total = getConstituencyCount();  // 63
```

```python [Python]
from jamaica_constituencies import get_constituencies, get_constituency_by_parish

all_c = get_constituencies()  # 63
st_andrew = get_constituency_by_parish("St. Andrew")  # 12
```
:::

## API Reference

### `getConstituencies()` — All 63 constituencies
### `getConstituencyByParish(parish)` — Filter by parish
### `getConstituency(name)` — Find by name
### `searchConstituencies(query)` — Search by name
### `getConstituencyCount()` — Returns 63
### `getConstituencyCountByParish()` — Count per parish
### `getParishes()` — List of 14 parishes
