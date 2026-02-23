# jamaica-trn

TRN (Tax Registration Number) validator and formatter for Jamaica.

## Install

::: code-group
```bash [npm]
npm install jamaica-trn
```
```bash [pip]
pip install jamaica-trn
```
:::

Or use the meta-package: `npm install jamaica`

## API Reference

### `isValidTRN(trn: string): boolean`

Validate a TRN string. Accepts formatted (`123-456-784`) or raw (`123456784`) input.

```typescript
import { isValidTRN } from 'jamaica-trn';

isValidTRN('123-456-784');  // true
isValidTRN('000000000');    // false
isValidTRN('12345678');     // false (too short)
```

### `formatTRN(trn: string): string`

Format a TRN as `NNN-NNN-NNN`.

```typescript
formatTRN('123456784');  // "123-456-784"
```

### `unformatTRN(trn: string): string`

Strip formatting, returning raw 9 digits.

```typescript
unformatTRN('123-456-784');  // "123456784"
```

### `generateTestTRN(): string`

Generate a random valid TRN for testing purposes.

```typescript
generateTestTRN();  // "847293651" (random, always valid)
```

### `getTRNCheckDigit(digits: string): number | null`

Compute the check digit for the first 8 digits of a TRN. Returns `null` if no valid check digit exists (remainder = 10).

```typescript
getTRNCheckDigit('12345678');  // 4
```

## How TRN Validation Works

Jamaica TRNs are 9-digit numbers with a weighted checksum:
1. Multiply each of the first 8 digits by weights `[3, 7, 1, 3, 7, 1, 3, 7]`
2. Sum the products
3. Check digit = `11 - (sum % 11)`, where 0 stays 0, and 10 is invalid
