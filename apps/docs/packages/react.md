# jamaica-react

React hooks for Jamaica data — TRN input, phone validation, currency formatting, and parish selection with real-time feedback.

## Installation

::: code-group
```bash [npm]
npm install jamaica-react
```
```bash [pnpm]
pnpm add jamaica-react
```
:::

> **Note:** `react` (18 or 19) is a peer dependency and must be installed separately.

## Quick Start

```tsx
import { useTRN, usePhone, useParish } from 'jamaica-react';

function RegistrationForm() {
  const trn = useTRN();
  const phone = usePhone();
  const parish = useParish();

  return (
    <form>
      <input {...trn.inputProps} />
      {trn.error && <span className="error">{trn.error}</span>}
      {trn.isValid && <span className="valid">✓ {trn.formatted}</span>}

      <input {...phone.inputProps} />
      {phone.carrier && <span>Carrier: {phone.carrier}</span>}

      <select onChange={(e) => parish.setValue(e.target.value)}>
        <option value="">Select parish...</option>
        {parish.parishes.map((p) => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
    </form>
  );
}
```

## Hooks

### `useTRN(initialValue?)`

Hook for TRN input with validation and formatting.

```typescript
const {
  value,        // Current raw input
  formatted,    // Formatted as NNN-NNN-NNN (if valid)
  isValid,      // Whether current value is valid
  error,        // Error message or null
  setValue,      // Set value manually
  reset,         // Reset to empty
  inputProps,   // Spread onto <input />
} = useTRN();
```

**`inputProps`** includes `value`, `onChange`, `maxLength`, `placeholder`, and `aria-invalid` — spread directly onto an input element.

```tsx
<input {...trn.inputProps} className={trn.error ? 'input-error' : ''} />
```

### `usePhone(initialValue?)`

Hook for Jamaican phone number input with carrier detection.

```typescript
const {
  value,        // Current raw input
  formatted,    // Formatted local number (e.g., "555-1234")
  isValid,      // Whether valid Jamaican number
  carrier,      // Detected carrier: "flow" | "digicel" | "landline" | null
  error,        // Error message or null
  setValue,
  reset,
  inputProps,   // Includes type="tel"
} = usePhone();
```

```tsx
<input {...phone.inputProps} />
{phone.isValid && (
  <span>
    {phone.formatted} — {phone.carrier}
  </span>
)}
```

### `useJMD(options?)`

Hook for JMD currency input with formatting and GCT calculation.

```typescript
const {
  value,        // Parsed numeric value (NaN if invalid)
  rawValue,     // Current string input
  formatted,    // Formatted JMD string (e.g., "$5,000.00")
  isValid,      // Whether valid amount
  gct,          // GCT breakdown: { base, gct, total }
  error,        // Error message or null
  setRawValue,  // Set from string input
  setValue,      // Set from number
  reset,
} = useJMD();
```

```tsx
<input
  value={jmd.rawValue}
  onChange={(e) => jmd.setRawValue(e.target.value)}
  placeholder="Enter amount"
/>
{jmd.isValid && (
  <div>
    <p>Amount: {jmd.formatted}</p>
    <p>With GCT: {jmd.gct?.formatted.total}</p>
  </div>
)}
```

### `useParish(initialValue?)`

Hook for parish selection with full parish data.

```typescript
const {
  value,      // Selected parish name or null
  parish,     // Full Parish object or null
  parishes,   // All 14 parishes for rendering options
  setValue,    // Set by name
  reset,
} = useParish();
```

```tsx
<select onChange={(e) => parish.setValue(e.target.value || null)}>
  <option value="">Select parish</option>
  {parish.parishes.map((p) => (
    <option key={p.name} value={p.name}>
      {p.name} — Pop. {p.population?.toLocaleString()}
    </option>
  ))}
</select>
{parish.parish && (
  <p>Capital: {parish.parish.capital}</p>
)}
```

## Type Exports

Re-exported from underlying packages for convenience:

```typescript
import type { Carrier } from 'jamaica-react';       // from jamaica-phone
import type { FormatOptions } from 'jamaica-react';  // from jamaica-currency
import type { Parish } from 'jamaica-react';         // from jamaica-parishes
```
