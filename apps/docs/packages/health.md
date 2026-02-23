# jamaica-health

Jamaica health facilities directory — hospitals, health centres, and Regional Health Authorities.

## Installation

::: code-group
```bash [npm]
npm install jamaica-health
```
```bash [pip]
pip install jamaica-health
```
:::

## Quick Start

::: code-group
```typescript [TypeScript]
import { getHospitals, getRegionalAuthority, getNearestFacility } from 'jamaica-health';

const hospitals = getHospitals();  // 22 hospitals

// Which RHA manages Manchester?
const rha = getRegionalAuthority('Manchester');  // SRHA

// Find nearest facility to coordinates
const nearest = getNearestFacility(18.0, -76.8);
```

```python [Python]
from jamaica_health import get_hospitals, get_regional_authority, get_nearest_facility

hospitals = get_hospitals()
rha = get_regional_authority("Manchester")
nearest = get_nearest_facility(18.0, -76.8)
```
:::

## Regional Health Authorities

| RHA | Full Name | Parishes |
|-----|-----------|----------|
| NERHA | North East RHA | St. Ann, St. Mary, Portland |
| WRHA | Western RHA | St. James, Trelawny, Hanover, Westmoreland |
| SRHA | Southern RHA | Clarendon, Manchester, St. Elizabeth, St. Catherine |
| SERHA | South East RHA | Kingston, St. Andrew, St. Thomas |

## API Reference

### `getHealthFacilities()` — All facilities
### `getHospitals()` / `getHealthCentres()` — By type
### `getHealthFacilitiesByParish(parish)` — By parish
### `getHealthFacilitiesByRegion(region)` — By RHA
### `getRegionalAuthority(parish)` — RHA for a parish
### `getNearestFacility(lat, lng, type?)` — Nearest by coordinates
### `searchHealthFacilities(query)` — Search by name
