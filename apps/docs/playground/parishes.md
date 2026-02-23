# Parish Explorer

Explore all 14 Jamaican parishes with population, area, density, connectivity, government services, and economic data. Calculate straight-line distances between parish capitals and compare populations.

<PlaygroundParish />

## API Reference

| Function | Description |
|----------|-------------|
| `getAllParishes()` | Get all 14 parishes with full data |
| `getParish(code)` | Look up parish by 3-letter code |
| `getParishByName(name)` | Fuzzy lookup by name |
| `getParishesWithService(type)` | Filter parishes by NLA/TAJ/PICA/COJ availability |
| `getDistanceKm(from, to)` | Haversine distance between parish capitals |
| `getNearestParishWithNLA(code)` | Find nearest NLA office |
| `getTotalPopulation()` | Sum of all parish populations |

## Install

```bash
npm install jamaica-parishes
```
