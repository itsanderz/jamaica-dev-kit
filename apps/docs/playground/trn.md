# TRN Validator

Validate, format, and understand Jamaican Tax Registration Numbers. The TRN is a 9-digit identifier used by Tax Administration Jamaica (TAJ) — the 9th digit is a check digit calculated using a weighted modulo-10 algorithm.

<PlaygroundTRN />

## API Reference

| Function | Description |
|----------|-------------|
| `isValidTRN(trn)` | Returns `true` if the TRN passes checksum validation |
| `formatTRN(trn)` | Formats as `NNN-NNN-NNN` (throws if invalid) |
| `unformatTRN(trn)` | Strips dashes, returns raw 9 digits |
| `getTRNCheckDigit(digits)` | Calculates the check digit for the first 8 digits |
| `generateTestTRN()` | Generates a random valid TRN for testing |

## Install

```bash
npm install jamaica-trn
```
