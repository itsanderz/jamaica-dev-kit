# jamaica-parishes

Complete data for Jamaica's 14 parishes including population, coordinates, service centers, and distance calculations.

## Install

::: code-group
```bash [npm]
npm install jamaica-parishes
```
```bash [pip]
pip install jamaica-parishes
```
:::

## API Reference

### `getAllParishes(): Parish[]`

Returns all 14 parishes with full data.

```typescript
import { getAllParishes } from 'jamaica-parishes';

const parishes = getAllParishes();
// Each parish includes: code, name, capital, population, coordinates,
// area_km2, service_centers, internet, mobile_coverage, economy
```

### `getParish(code: ParishCode): Parish | undefined`

Lookup by 3-letter code.

```typescript
getParish('KIN');  // Kingston parish data
getParish('SJA');  // St. James parish data
```

### `getParishByName(name: string): Parish | undefined`

Lookup by name (case-insensitive).

```typescript
getParishByName('Kingston');
getParishByName('st. james');
```

### `getDistanceKm(from: ParishCode, to: ParishCode): number | null`

Haversine distance between two parish centers in kilometers.

```typescript
getDistanceKm('KIN', 'SJA');  // ~132 km (Kingston to Montego Bay)
```

### `getParishesWithService(service: ServiceType): Parish[]`

Filter parishes that have a specific government service office.

```typescript
getParishesWithService('nla');   // Parishes with NLA offices
getParishesWithService('pica');  // Parishes with PICA offices
```

### Parish Codes

`KIN` Kingston, `SAN` St. Andrew, `SCA` St. Catherine, `CLA` Clarendon, `MAN` Manchester, `SEL` St. Elizabeth, `WES` Westmoreland, `HAN` Hanover, `SJA` St. James, `TRE` Trelawny, `SAN2` St. Ann, `SMA` St. Mary, `POR` Portland, `STH` St. Thomas
