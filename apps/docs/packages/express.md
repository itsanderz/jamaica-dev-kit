# jamaica-express

Express middleware for Jamaica data validation — TRN, phone, parish validation, and GCT calculation for API servers.

## Installation

::: code-group
```bash [npm]
npm install jamaica-express
```
```bash [pnpm]
pnpm add jamaica-express
```
:::

> **Note:** `express` (v4 or v5) is a peer dependency and must be installed separately.

## Quick Start

```typescript
import express from 'express';
import { validateTRN, validatePhone, validateParish, gctCalculator } from 'jamaica-express';

const app = express();
app.use(express.json());

// Validate TRN and phone in request body
app.post('/api/register',
  validateTRN(),
  validatePhone(),
  validateParish(),
  (req, res) => {
    res.json({ message: 'Valid Jamaica customer', body: req.body });
  }
);

// Calculate GCT on checkout
app.post('/api/checkout',
  gctCalculator(),
  (req, res) => {
    const gct = (req as any).gct;
    res.json({
      base: gct.base,
      gct: gct.gct,
      total: gct.total,
      formatted: gct.formatted,
    });
  }
);
```

## Middleware

### `validateTRN(options?)`

Validates a TRN field on the request body.

```typescript
// Default: validates body.trn
app.post('/register', validateTRN(), handler);

// Custom field path
app.post('/register', validateTRN({ field: 'body.customer.trn' }), handler);

// Format TRN in-place (raw → NNN-NNN-NNN)
app.post('/register', validateTRN({ format: true }), handler);
```

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `field` | `string` | `"body.trn"` | Dot-path to the TRN field |
| `statusCode` | `number` | `400` | HTTP status for validation errors |
| `format` | `boolean` | `false` | Format TRN in-place after validation |

**Error response:**
```json
{
  "error": "Validation failed",
  "message": "Invalid Jamaica TRN — must be 9 digits with a valid check digit"
}
```

### `validatePhone(options?)`

Validates a Jamaican phone number field.

```typescript
// Default: validates body.phone
app.post('/register', validatePhone(), handler);

// Normalize to E.164 format
app.post('/register', validatePhone({ normalize: true }), handler);
// body.phone: "8765551234" → "+18765551234"
```

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `field` | `string` | `"body.phone"` | Dot-path to the phone field |
| `statusCode` | `number` | `400` | HTTP status for validation errors |
| `normalize` | `boolean` | `false` | Normalize to E.164 format |

### `validateParish(options?)`

Validates a Jamaica parish name.

```typescript
// Default: case-insensitive, validates body.parish
app.post('/register', validateParish(), handler);
// "kingston" → "Kingston" (normalized to canonical name)
```

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `field` | `string` | `"body.parish"` | Dot-path to the parish field |
| `statusCode` | `number` | `400` | HTTP status for validation errors |
| `caseInsensitive` | `boolean` | `true` | Match case-insensitively |

### `gctCalculator(options?)`

Calculates GCT (General Consumption Tax) on an amount and attaches the breakdown to the request.

```typescript
app.post('/checkout', gctCalculator(), (req, res) => {
  const gct = (req as any).gct;
  // gct.base = 1000
  // gct.gct = 150
  // gct.total = 1150
  // gct.rate = 0.15
  // gct.formatted = { base: "J$1,000.00", gct: "J$150.00", total: "J$1,150.00" }
});
```

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `field` | `string` | `"body.amount"` | Dot-path to the amount field |
| `rate` | `number` | `0.15` | GCT rate (default 15%) |
| `attach` | `string` | `"gct"` | Property name on `req` for the result |

**GCT Result type:**
```typescript
interface GCTResult {
  base: number;
  gct: number;
  total: number;
  rate: number;
  formatted: { base: string; gct: string; total: string };
}
```

## Chaining Middleware

All middleware is composable — chain multiple validators:

```typescript
app.post('/api/payment',
  validateTRN({ field: 'body.customer_trn', format: true }),
  validatePhone({ field: 'body.customer_phone', normalize: true }),
  validateParish({ field: 'body.parish' }),
  gctCalculator({ field: 'body.amount' }),
  (req, res) => {
    // All fields validated and normalized
    // req.gct contains GCT breakdown
    res.json({ success: true });
  }
);
```
