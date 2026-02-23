# E-commerce

Build online stores and marketplaces for the Jamaican market with GCT handling, address parsing, and delivery routing.

## Packages You'll Use

| Package | Purpose |
|---------|---------|
| `jamaica-currency` | JMD formatting & GCT |
| `jamaica-addresses` | Address parsing & parish extraction |
| `jamaica-parishes` | Delivery zones & distances |
| `jamaica-phone` | Customer phone validation |
| `jamaica-trn` | Business TRN validation |
| `jamaica-express` | Checkout API middleware |
| `jamaica-zod` | Form validation schemas |

## Product Pricing with GCT

```typescript
import { formatJMD, addGCT, formatWithGCT, GCT_RATE } from 'jamaica-currency';

function displayPrice(basePrice: number) {
  const breakdown = formatWithGCT(basePrice);
  return {
    price: breakdown.base,      // "J$5,000.00"
    gct: breakdown.gct,         // "J$750.00"
    total: breakdown.total,     // "J$5,750.00"
  };
}

// Cart total
function calculateCart(items: { price: number; qty: number }[]) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return {
    subtotal: formatJMD(subtotal),
    gct: formatJMD(subtotal * GCT_RATE),
    total: formatJMD(addGCT(subtotal)),
  };
}
```

## Delivery Address Handling

```typescript
import { parseAddress, extractParish, normalizeAddress } from 'jamaica-addresses';

const input = '23 Hope Road, Kgn 6';
const parsed = parseAddress(input);
// { street: "23 Hope Road", parish: "Kingston", sector: "6" }

// Extract parish for routing
const parish = extractParish('Half Way Tree, St. Andrew');
// "St. Andrew"

// Normalize for storage
const normalized = normalizeAddress(input);
```

## Delivery Zone Pricing

```typescript
import { getParish, getDistanceKm, type ParishCode } from 'jamaica-parishes';

const WAREHOUSE_PARISH: ParishCode = 'KIN';

function getDeliveryFee(customerParish: ParishCode): number {
  const distance = getDistanceKm(WAREHOUSE_PARISH, customerParish);
  if (distance === null) return 2000;

  if (distance < 20) return 500;
  if (distance < 50) return 1000;
  if (distance < 100) return 1500;
  return 2000;
}

// Usage
const fee = getDeliveryFee('MAN'); // Manchester
```

## Customer Validation

```typescript
import { isValidJamaicanNumber, formatE164 } from 'jamaica-phone';
import { isValidTRN } from 'jamaica-trn';

function validateCustomer(phone: string, trn?: string) {
  if (!isValidJamaicanNumber(phone)) {
    return { valid: false, error: 'Invalid phone number' };
  }

  if (trn && !isValidTRN(trn)) {
    return { valid: false, error: 'Invalid TRN' };
  }

  return {
    valid: true,
    phone: formatE164(phone), // "+18765551234"
  };
}
```

## Checkout API with Express

```typescript
import express from 'express';
import { validatePhone, gctCalculator } from 'jamaica-express';

const app = express();
app.use(express.json());

app.post('/api/checkout',
  validatePhone({ field: 'body.customer.phone', normalize: true }),
  gctCalculator({ field: 'body.subtotal' }),
  (req, res) => {
    const gct = (req as any).gct;
    res.json({
      customer: req.body.customer,
      subtotal: gct.formatted.base,
      gct: gct.formatted.gct,
      total: gct.formatted.total,
    });
  }
);
```

## Checkout Form Validation with Zod

```typescript
import { z } from 'zod';
import { phoneSchema, addressSchema, parishSchema, positiveJmdSchema } from 'jamaica-zod';

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    phone: phoneSchema,
    email: z.string().email(),
  }),
  shipping: z.object({
    address: addressSchema,
    parish: parishSchema,
  }),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: positiveJmdSchema,
  })).min(1),
});

const order = checkoutSchema.parse(formData);
```
