# jamaica-emergency

Jamaica emergency services directory — police stations, fire stations, disaster shelters, and emergency numbers.

## Installation

::: code-group
```bash [npm]
npm install jamaica-emergency
```
```bash [pip]
pip install jamaica-emergency
```
:::

## Quick Start

::: code-group
```typescript [TypeScript]
import { getEmergencyNumbers, getPoliceStations, getDisasterShelters } from 'jamaica-emergency';

const numbers = getEmergencyNumbers();
// { police: '119', ambulance: '110', fire: '110', ... }

const police = getPoliceStations();  // 23 stations across all parishes
const shelters = getDisasterShelters();  // 17 hurricane shelters
```

```python [Python]
from jamaica_emergency import get_emergency_numbers, get_police_stations

numbers = get_emergency_numbers()
police = get_police_stations()
```
:::

## Emergency Numbers

| Service | Number |
|---------|--------|
| Police | 119 |
| Ambulance | 110 |
| Fire | 110 |
| Disaster Preparedness (ODPEM) | 116 |

## API Reference

### `getEmergencyNumbers()` — All emergency contact numbers
### `getPoliceStations()` / `getPoliceStationsByParish(parish)` — Police
### `getFireStations()` / `getFireStationsByParish(parish)` — Fire
### `getDisasterShelters()` / `getSheltersByParish(parish)` — Shelters
### `searchStations(query)` / `searchShelters(query)` — Search
