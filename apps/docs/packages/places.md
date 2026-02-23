# jamaica-places

200+ cities, towns, communities, districts, and villages across all 14 Jamaican parishes.

## Installation

::: code-group
```bash [npm]
npm install jamaica-places
```
```bash [pip]
pip install jamaica-places
```
:::

## Quick Start

::: code-group
```typescript [TypeScript]
import { searchPlaces, getTowns, getPlacesByParish, getCommunities } from 'jamaica-places';

// Search for places
const results = searchPlaces('Montego');  // Montego Bay

// All major towns
const towns = getTowns();

// Places in a parish
const stAnn = getPlacesByParish('St. Ann');

// Community names
const communities = getCommunities('Kingston');
```

```python [Python]
from jamaica_places import search_places, get_towns, get_places_by_parish

results = search_places("Montego")
towns = get_towns()
st_ann = get_places_by_parish("St. Ann")
```
:::

## API Reference

### `getPlaces()` — All 200+ places
### `getPlacesByParish(parish)` — Filter by parish
### `getPlacesByType(type)` — Filter by type (city, town, community, etc.)
### `getPlace(name)` — Find by name
### `getTowns()` — All towns and cities
### `getCommunities(parish)` — Community names for a parish
### `searchPlaces(query)` — Search by name
### `getPlaceCount()` / `getPlaceCountByParish()` — Counts
