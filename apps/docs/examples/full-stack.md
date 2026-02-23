# Full-Stack Example

A complete example combining frontend validation, backend API, and database-ready data.

## Payroll Management System

### Shared Validation (jamaica-zod)

```typescript
// shared/schemas.ts
import { z } from 'zod';
import { trnSchema, phoneSchema, parishSchema, positiveJmdSchema } from 'jamaica-zod';

export const employeeSchema = z.object({
  name: z.string().min(1),
  trn: trnSchema,
  phone: phoneSchema,
  parish: parishSchema,
  grossPay: positiveJmdSchema,
  bankId: z.string().min(1),
  accountNumber: z.string().min(1),
});

export type Employee = z.infer<typeof employeeSchema>;
```

### Backend API (Express + jamaica-express)

```typescript
// server/api.ts
import express from 'express';
import { validateTRN, validatePhone } from 'jamaica-express';
import { calculatePayroll } from 'jamaica-tax';
import { formatJMD } from 'jamaica-currency';
import { getBank, getSwiftCode } from 'jamaica-banks';
import { isBusinessDay } from 'jamaica-holidays';
import { employeeSchema } from '../shared/schemas';

const app = express();
app.use(express.json());

// Register employee with full validation
app.post('/api/employees',
  validateTRN({ field: 'body.trn', normalize: true }),
  validatePhone({ field: 'body.phone', normalize: true }),
  (req, res) => {
    const result = employeeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }

    const bank = getBank(result.data.bankId);
    if (!bank) {
      return res.status(400).json({ error: 'Invalid bank' });
    }

    res.json({
      employee: result.data,
      bank: { name: bank.name, swift: getSwiftCode(result.data.bankId) },
    });
  }
);

// Calculate payroll for an employee
app.post('/api/payroll/calculate', (req, res) => {
  const { grossPay } = req.body;
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

// Check if today is a pay day
app.get('/api/payroll/is-payday', (req, res) => {
  const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
  res.json({ date, isBusinessDay: isBusinessDay(date) });
});
```

### Frontend Form (React + jamaica-react)

```tsx
// client/EmployeeForm.tsx
import { useTRN, usePhone, useParish, useJMD } from 'jamaica-react';
import { getBanks } from 'jamaica-banks';

function EmployeeForm() {
  const trn = useTRN();
  const phone = usePhone();
  const parish = useParish();
  const salary = useJMD();
  const banks = getBanks();

  const isFormValid = trn.isValid && phone.isValid && parish.selected;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: (document.getElementById('name') as HTMLInputElement).value,
        trn: trn.value,
        phone: phone.value,
        parish: parish.selected!.name,
        grossPay: salary.value,
        bankId: (document.getElementById('bank') as HTMLSelectElement).value,
        accountNumber: (document.getElementById('account') as HTMLInputElement).value,
      }),
    });

    const data = await res.json();
    console.log('Registered:', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input id="name" placeholder="Full Name" required />

      <div>
        <label>TRN</label>
        <input {...trn.inputProps} placeholder="123-456-789" />
        {trn.error && <span className="error">{trn.error}</span>}
      </div>

      <div>
        <label>Phone</label>
        <input {...phone.inputProps} placeholder="876-555-1234" />
        {phone.error && <span className="error">{phone.error}</span>}
        {phone.carrier && <span>({phone.carrier})</span>}
      </div>

      <div>
        <label>Parish</label>
        <select
          value={parish.selected?.code ?? ''}
          onChange={(e) => parish.setValue(e.target.value)}
        >
          <option value="">Select...</option>
          {parish.parishes.map(p => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Monthly Salary (JMD)</label>
        <input
          type="number"
          value={salary.value || ''}
          onChange={(e) => salary.setValue(Number(e.target.value))}
        />
        <span>{salary.formatted}</span>
      </div>

      <div>
        <label>Bank</label>
        <select id="bank">
          {banks.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <input id="account" placeholder="Account Number" />
      </div>

      <button type="submit" disabled={!isFormValid}>
        Register Employee
      </button>
    </form>
  );
}
```

## E-commerce Checkout

### Backend

```typescript
import express from 'express';
import { validatePhone, gctCalculator } from 'jamaica-express';
import { getDistanceKm } from 'jamaica-parishes';
import { parseAddress, extractParish } from 'jamaica-addresses';

const app = express();
app.use(express.json());

app.post('/api/checkout',
  validatePhone({ field: 'body.phone', normalize: true }),
  gctCalculator({ field: 'body.subtotal' }),
  (req, res) => {
    const gct = (req as any).gct;
    const parish = extractParish(req.body.address);

    // Calculate delivery
    let deliveryFee = 2000;
    if (parish) {
      const distance = getDistanceKm('KIN', parish as any);
      if (distance !== null) {
        deliveryFee = distance < 20 ? 500 : distance < 50 ? 1000 : 2000;
      }
    }

    res.json({
      subtotal: gct.formatted.base,
      gct: gct.formatted.gct,
      delivery: `J$${deliveryFee.toFixed(2)}`,
      total: `J$${(gct.total + deliveryFee).toFixed(2)}`,
      parish,
    });
  }
);
```

### Frontend

```tsx
import { useJMD, usePhone } from 'jamaica-react';
import { parseAddress } from 'jamaica-addresses';
import { getAllParishes } from 'jamaica-parishes';

function CheckoutForm() {
  const phone = usePhone();
  const total = useJMD();

  return (
    <form>
      <input {...phone.inputProps} placeholder="Phone for delivery updates" />
      {phone.error && <span className="error">{phone.error}</span>}

      <select>
        <option value="">Delivery parish...</option>
        {getAllParishes().map(p => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      <textarea placeholder="Delivery address (e.g., 23 Hope Road, Kgn 6)" />

      <div className="totals">
        <p>Subtotal: {total.formatted}</p>
        {total.gctBreakdown && (
          <>
            <p>GCT: {total.gctBreakdown.gct}</p>
            <p>Total: {total.gctBreakdown.total}</p>
          </>
        )}
      </div>

      <button type="submit" disabled={!phone.isValid}>
        Place Order
      </button>
    </form>
  );
}
```
