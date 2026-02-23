# jamaica-phone

Phone number validation and formatting for Jamaica (+1-876 and +1-658 area codes).

## Install

::: code-group
```bash [npm]
npm install jamaica-phone
```
```bash [pip]
pip install jamaica-phone
```
:::

## API Reference

### `isValidJamaicanNumber(phone: string): boolean`

```typescript
isValidJamaicanNumber('876-555-1234');    // true
isValidJamaicanNumber('+1-658-555-1234'); // true
isValidJamaicanNumber('555-1234');        // false (no area code)
```

### `parsePhone(phone: string): ParsedPhone`

Parse into structured components.

### `formatE164(phone: string): string`

Format as E.164: `+18765551234`

### `formatNational(phone: string): string`

Format as national: `(876) 555-1234`

### `formatInternational(phone: string): string`

Format as international: `+1 (876) 555-1234`

### `getCarrier(phone: string): Carrier`

Detect carrier by prefix heuristics: `"flow"`, `"digicel"`, `"landline"`, or `"unknown"`.

### `isMobile(phone: string): boolean`

Check if the number is a mobile number.
