# jamaica-schools

Jamaica schools and universities directory — search, filter by parish, type, and level.

## Installation

::: code-group
```bash [npm]
npm install jamaica-schools
```
```bash [pip]
pip install jamaica-schools
```
:::

## Quick Start

::: code-group
```typescript [TypeScript]
import { getSchools, getUniversities, searchSchools, getSchoolsByParish } from 'jamaica-schools';

// All schools
const schools = getSchools();  // 70+ schools

// Universities
const unis = getUniversities();  // UWI, UTech, NCU, etc.

// Search
const results = searchSchools('Kingston');

// Filter by parish
const stAndrewSchools = getSchoolsByParish('St. Andrew');
```

```python [Python]
from jamaica_schools import get_schools, get_universities, search_schools

schools = get_schools()
unis = get_universities()
results = search_schools("Kingston")
```
:::

## API Reference

### `getSchools()` — All schools
### `getSchoolsByParish(parish)` — Filter by parish
### `getSchoolsByType(type)` — Filter by type (primary, secondary, tertiary, etc.)
### `getSchoolsByLevel(level)` — Filter by level
### `getSchoolsByOwnership(ownership)` — Filter by ownership
### `getSchool(name)` — Find by name (case-insensitive)
### `getUniversities()` — All universities
### `searchSchools(query)` — Search by name
### `getSchoolCount()` — Total count
### `getSchoolCountByParish()` — Count by parish
