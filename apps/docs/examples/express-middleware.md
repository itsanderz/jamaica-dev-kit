# Express Middleware

Build validated APIs using `jamaica-express` middleware or the base packages directly.

## Using jamaica-express Middleware

The fastest way to add Jamaica-specific validation to your API.

### Registration Endpoint

```typescript
import express from 'express';
import { validateTRN, validatePhone, validateParish } from 'jamaica-express';

const app = express();
app.use(express.json());

app.post('/api/register',
  validateTRN({ field: 'body.trn', normalize: true }),
  validatePhone({ field: 'body.phone', normalize: true }),
  validateParish({ field: 'body.parish' }),
  (req, res) => {
    // All fields are validated and normalized
    res.json({
      trn: req.body.trn,       // "123-456-784"
      phone: req.body.phone,   // "+18765551234"
      parish: req.body.parish, // "Kingston"
    });
  }
);
```

### GCT Calculator Endpoint

```typescript
import { gctCalculator, validatePhone } from 'jamaica-express';

app.post('/api/checkout',
  validatePhone({ field: 'body.customer.phone' }),
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

### Custom Error Handling

```typescript
import { validateTRN, validatePhone } from 'jamaica-express';

// Custom status codes and field paths
app.post('/api/customers',
  validateTRN({ field: 'body.customer.trn', statusCode: 422 }),
  validatePhone({ field: 'body.customer.phone', statusCode: 422 }),
  (req, res) => {
    res.json({ success: true, customer: req.body.customer });
  }
);
```

## Building Custom Middleware

For more control, build middleware from the base packages.

### TRN Validation

```typescript
import { Request, Response, NextFunction } from 'express';
import { isValidTRN, formatTRN } from 'jamaica-trn';

function validateTRN(field = 'trn') {
  return (req: Request, res: Response, next: NextFunction) => {
    const trn = req.body[field];
    if (!trn) {
      return res.status(400).json({ error: `${field} is required` });
    }
    if (!isValidTRN(trn)) {
      return res.status(400).json({ error: `Invalid TRN: ${trn}` });
    }
    req.body[field] = formatTRN(trn);
    next();
  };
}
```

### Fee Lookup API

```typescript
import express from 'express';
import { searchFees, getAgencies, getFeesByAgency } from 'jamaica-gov-fees';

const app = express();

app.get('/api/fees/search', (req, res) => {
  const query = req.query.q as string;
  if (!query) return res.status(400).json({ error: 'Query required' });
  res.json(searchFees(query));
});

app.get('/api/agencies', (_req, res) => {
  res.json(getAgencies());
});

app.get('/api/agencies/:id/fees', (req, res) => {
  const fees = getFeesByAgency(req.params.id);
  res.json(fees);
});
```

### Payroll API

```typescript
import express from 'express';
import { calculatePayroll, calculateIncomeTax } from 'jamaica-tax';
import { formatJMD } from 'jamaica-currency';

const app = express();
app.use(express.json());

app.post('/api/payroll/calculate', (req, res) => {
  const { grossPay } = req.body;
  if (!grossPay || typeof grossPay !== 'number' || grossPay <= 0) {
    return res.status(400).json({ error: 'grossPay must be a positive number' });
  }

  const payroll = calculatePayroll(grossPay);

  res.json({
    grossPay: formatJMD(payroll.grossPay),
    deductions: {
      incomeTax: formatJMD(payroll.incomeTax),
      nis: formatJMD(payroll.nis),
      nht: formatJMD(payroll.nht),
      educationTax: formatJMD(payroll.educationTax),
    },
    netPay: formatJMD(payroll.netPay),
    employerCost: formatJMD(payroll.employerCost),
  });
});

app.get('/api/tax/brackets', (_req, res) => {
  const { getIncomeTaxBrackets, getTaxThreshold } = require('jamaica-tax');
  res.json({
    threshold: getTaxThreshold(),
    brackets: getIncomeTaxBrackets(),
  });
});
```

### Parish Data API

```typescript
import express from 'express';
import { getAllParishes, getParish, getDistanceKm } from 'jamaica-parishes';
import { getSchoolsByParish } from 'jamaica-schools';
import { getHealthFacilitiesByParish } from 'jamaica-health';

const app = express();

app.get('/api/parishes', (_req, res) => {
  res.json(getAllParishes());
});

app.get('/api/parishes/:name', (req, res) => {
  const parish = getParish(req.params.name);
  if (!parish) return res.status(404).json({ error: 'Parish not found' });

  res.json({
    ...parish,
    schools: getSchoolsByParish(req.params.name).length,
    healthFacilities: getHealthFacilitiesByParish(req.params.name).length,
  });
});

app.get('/api/parishes/:from/distance/:to', (req, res) => {
  const distance = getDistanceKm(req.params.from as any, req.params.to as any);
  if (distance === null) {
    return res.status(400).json({ error: 'Could not calculate distance' });
  }
  res.json({ from: req.params.from, to: req.params.to, distanceKm: distance });
});
```

### Exchange Rate API

```typescript
import express from 'express';
import { getExchangeRates, getExchangeRate, getFallbackRates } from 'jamaica-boj';
import { formatJMD } from 'jamaica-currency';

const app = express();

app.get('/api/rates', async (_req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json(rates);
  } catch {
    // Fallback to built-in rates
    res.json({ rates: getFallbackRates(), source: 'fallback' });
  }
});

app.get('/api/rates/:currency', async (req, res) => {
  try {
    const rate = await getExchangeRate(req.params.currency as any);
    res.json(rate);
  } catch (error) {
    res.status(404).json({ error: `Rate not available for ${req.params.currency}` });
  }
});
```
