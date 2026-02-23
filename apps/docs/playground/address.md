# Address Parser

Parse informal Jamaican addresses into structured components. Handles street numbers, community names, Kingston sectors (1-20), parish aliases ("Mobay" → "St. James"), and more.

<PlaygroundAddress />

## API Reference

| Function | Description |
|----------|-------------|
| `parseAddress(raw)` | Parse address string into structured `ParsedAddress` |
| `extractParish(address)` | Extract canonical parish name |
| `isKingstonAddress(address)` | Check if Kingston or St. Andrew address |
| `getKingstonSector(address)` | Extract Kingston sector number (1-20) |
| `normalizeAddress(parsed)` | Format parsed address to normalized string |
| `toNormalizedAddress(parsed)` | Convert to structured `NormalizedAddress` |

## Install

```bash
npm install jamaica-addresses
```
