# jamaica-transport

Jamaica transport infrastructure — airports, seaports, vehicle classifications, and road network data.

## Installation

::: code-group
```bash [npm]
npm install jamaica-transport
```
```bash [pip]
pip install jamaica-transport
```
:::

## Quick Start

::: code-group
```typescript [TypeScript]
import { getAirport, getSeaports, getRoadNetwork, getVehicleClasses } from 'jamaica-transport';

// Airport lookup
const nmia = getAirport('KIN');  // Norman Manley International

// Road network
const roads = getRoadNetwork();  // 22,121 km total

// Vehicle classes for registration
const classes = getVehicleClasses();
```

```python [Python]
from jamaica_transport import get_airport, get_road_network

nmia = get_airport("KIN")
roads = get_road_network()
```
:::

## Airports

| Name | IATA | ICAO | Type |
|------|------|------|------|
| Norman Manley International | KIN | MKJP | International |
| Sangster International | MBJ | MKJS | International |
| Ian Fleming International | OCJ | MKBS | International |
| Tinson Pen Aerodrome | KTP | MKTP | Domestic |
| Ken Jones Aerodrome | POT | MKKJ | Domestic |
| Negril Aerodrome | NEG | MKNG | Domestic |

## API Reference

### `getAirports()` / `getAirport(code)` — Airports by IATA or ICAO
### `getSeaports()` / `getSeaport(name)` — Seaports
### `getVehicleClasses()` / `getVehicleClass(code)` — Vehicle classifications
### `getRoadNetwork()` — Road network statistics
### `getHighways()` — Major highways
### `getLicencePlatePrefixes()` — Plate prefix meanings
