# Logistics & Delivery

Build delivery platforms, address systems, and logistics tools for Jamaica.

## Packages You'll Use

| Package | Purpose |
|---------|---------|
| `jamaica-addresses` | Address parsing & normalization |
| `jamaica-parishes` | Delivery zones & distances |
| `jamaica-places` | Towns, communities for routing |
| `jamaica-transport` | Airports, seaports, highways |
| `jamaica-phone` | Driver/customer phone validation |

## Address Parsing

```typescript
import { parseAddress, extractParish, normalizeAddress, isKingstonAddress } from 'jamaica-addresses';

// Parse informal Jamaican addresses
const parsed = parseAddress('23 Hope Road, Kgn 6');
// { street: "23 Hope Road", parish: "Kingston", sector: "6" }

// Handle common abbreviations
extractParish('Half Way Tree, St. Andrew');  // "St. Andrew"
extractParish('Ocho Rios, St. Ann');         // "St. Ann"

// Kingston sector detection
isKingstonAddress('Hope Road, Kingston 6');  // true
```

## Delivery Zone Routing

```typescript
import { getDistanceKm, getAllParishes, type ParishCode } from 'jamaica-parishes';

const DEPOT: ParishCode = 'KIN'; // Kingston warehouse

function calculateDeliveryZone(destination: ParishCode) {
  const distance = getDistanceKm(DEPOT, destination);
  if (distance === null) return { zone: 'unknown', fee: 2500 };

  if (distance < 15) return { zone: 'metro', fee: 500 };
  if (distance < 40) return { zone: 'suburban', fee: 1000 };
  if (distance < 80) return { zone: 'regional', fee: 1500 };
  return { zone: 'island-wide', fee: 2500 };
}

// Generate delivery fee table
const feeTable = getAllParishes().map(p => ({
  parish: p.name,
  ...calculateDeliveryZone(p.code),
}));
```

## Community-Level Routing

```typescript
import { getPlacesByParish, searchPlaces, getTowns } from 'jamaica-places';

// All communities in a delivery area
const portlandPlaces = getPlacesByParish('Portland');

// Find a specific community
const results = searchPlaces('Mandeville');

// Major towns for hub locations
const towns = getTowns();
```

## Transport Infrastructure

```typescript
import {
  getAirports,
  getSeaports,
  getHighways,
  getRoadNetwork,
} from 'jamaica-transport';

// Airport locations for air freight
const airports = getAirports();
const international = airports.filter(a => a.type === 'international');
// Norman Manley (KIN), Sangster (MBJ)

// Seaports for shipping
const ports = getSeaports();

// Road network for route planning
const roads = getRoadNetwork();
console.log(`Total road network: ${roads.totalKm} km`);

// Highways
const highways = getHighways();
```

## Driver Contact Management

```typescript
import { isValidJamaicanNumber, formatLocal, getCarrier } from 'jamaica-phone';

function registerDriver(phone: string) {
  if (!isValidJamaicanNumber(phone)) {
    throw new Error('Invalid phone number — must be Jamaican number');
  }

  return {
    phone,
    formatted: formatLocal(phone),
    carrier: getCarrier(phone),
  };
}
```

## Delivery Tracking API

```typescript
import express from 'express';
import { validatePhone, validateParish } from 'jamaica-express';
import { getDistanceKm } from 'jamaica-parishes';

const app = express();
app.use(express.json());

app.post('/api/delivery/estimate',
  validatePhone({ field: 'body.phone' }),
  validateParish({ field: 'body.parish' }),
  (req, res) => {
    const distance = getDistanceKm('KIN', req.body.parishCode);
    const estimatedHours = distance ? Math.ceil(distance / 40) + 1 : 8;

    res.json({
      parish: req.body.parish,
      estimatedDelivery: `${estimatedHours} hours`,
      distance: distance ? `${distance.toFixed(1)} km` : 'unknown',
    });
  }
);
```
