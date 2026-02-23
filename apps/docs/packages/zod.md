# jamaica-zod

Zod validation schemas for Jamaica data — TRN, phone, parish, currency, bank, constituency, and common form patterns.

## Installation

::: code-group
```bash [npm]
npm install jamaica-zod zod
```
```bash [pnpm]
pnpm add jamaica-zod zod
```
:::

> **Note:** `zod` is a peer dependency and must be installed separately.

## Quick Start

```typescript
import { trnSchema, phoneSchema, parishSchema, customerSchema } from 'jamaica-zod';

// Validate a TRN
const trn = trnSchema.parse('123-456-784');  // ✓ valid

// Validate a phone number
const phone = phoneSchema.parse('8765551234');  // ✓ valid

// Validate a full customer
const customer = customerSchema.parse({
  trn: '123-456-784',
  phone: '8765551234',
  parish: 'Kingston',
  address: '123 Hope Road, Kingston 6',
});
```

## Schemas

### Identity & Contact

#### `trnSchema`
Validates a formatted (`123-456-784`) or raw (`123456784`) TRN. Trims whitespace and checks the Luhn check digit.

```typescript
trnSchema.parse('123-456-784');  // ✓ "123-456-784"
trnSchema.parse('123456784');    // ✓ "123456784"
trnSchema.parse('123456789');    // ✗ throws — invalid check digit
```

#### `rawTrnSchema`
Validates and normalizes to a raw 9-digit TRN (strips dashes).

```typescript
rawTrnSchema.parse('123-456-784');  // ✓ "123456784"
rawTrnSchema.parse('123456784');    // ✓ "123456784"
```

#### `phoneSchema`
Validates a Jamaican phone number (`876` or `658` area code).

```typescript
phoneSchema.parse('8765551234');    // ✓
phoneSchema.parse('+18765551234');  // ✓
phoneSchema.parse('2125551234');    // ✗ throws — not Jamaican
```

### Geography

#### `parishSchema`
Validates against the 14 official Jamaica parish names (case-sensitive).

```typescript
parishSchema.parse('Kingston');    // ✓
parishSchema.parse('St. Andrew'); // ✓
parishSchema.parse('kingston');   // ✗ throws — case-sensitive
```

#### `parishFlexSchema`
Case-insensitive parish validation with whitespace trimming.

```typescript
parishFlexSchema.parse('kingston');    // ✓
parishFlexSchema.parse('KINGSTON');    // ✓
parishFlexSchema.parse('  Kingston '); // ✓
```

#### `constituencySchema`
Case-insensitive constituency validation.

```typescript
constituencySchema.parse('Kingston Central');    // ✓
constituencySchema.parse('kingston central');    // ✓
```

#### `addressSchema`
Basic address validation (5–500 characters, trimmed).

```typescript
addressSchema.parse('123 Hope Road, Kingston 6');  // ✓
addressSchema.parse('Hi');                          // ✗ too short
```

### Currency

#### `jmdSchema`
Non-negative number.

```typescript
jmdSchema.parse(5000);  // ✓
jmdSchema.parse(-100);  // ✗ throws
```

#### `positiveJmdSchema`
Positive number (greater than zero).

```typescript
positiveJmdSchema.parse(100);  // ✓
positiveJmdSchema.parse(0);    // ✗ throws
```

#### `jmdStringSchema`
Parses formatted JMD strings to numbers.

```typescript
jmdStringSchema.parse('5000');      // ✓ 5000
jmdStringSchema.parse('5,000.00');  // ✓ 5000
jmdStringSchema.parse('J$5,000');   // ✓ 5000
```

### Finance

#### `bankIdSchema`
Case-insensitive bank ID validation.

```typescript
bankIdSchema.parse('ncb');         // ✓ "ncb"
bankIdSchema.parse('NCB');         // ✓ "ncb" (normalized)
bankIdSchema.parse('scotiabank');  // ✓
```

### Composite Schemas

#### `customerSchema`
Complete customer/person validation combining TRN, phone, parish, and optional address.

```typescript
const customer = customerSchema.parse({
  trn: '123-456-784',
  phone: '8765551234',
  parish: 'Kingston',
  address: '123 Hope Road',  // optional
});
```

#### `paymentSchema`
Payment validation with positive amount, description, and optional parish.

```typescript
const payment = paymentSchema.parse({
  amount: 5000,
  description: 'Passport renewal fee',
  parish: 'Kingston',  // optional
});
```

## Type Exports

```typescript
import type { Customer, Payment } from 'jamaica-zod';
```

## Integration with Forms

Works with any framework that supports Zod:

```typescript
// React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type Customer } from 'jamaica-zod';

const form = useForm<Customer>({
  resolver: zodResolver(customerSchema),
});
```
