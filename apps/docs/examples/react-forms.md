# React Forms

Build validated forms using `jamaica-react` hooks or the base packages directly.

## Using jamaica-react Hooks

The fastest way to build Jamaica-aware forms.

### Registration Form

```tsx
import { useTRN, usePhone, useParish } from 'jamaica-react';

function RegistrationForm() {
  const trn = useTRN();
  const phone = usePhone();
  const parish = useParish();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trn.isValid || !phone.isValid) return;

    console.log({
      trn: trn.formatted,
      phone: phone.formatted,
      carrier: phone.carrier,
      parish: parish.selected?.name,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>TRN</label>
        <input {...trn.inputProps} placeholder="123-456-789" />
        {trn.error && <span className="error">{trn.error}</span>}
      </div>

      <div>
        <label>Phone</label>
        <input {...phone.inputProps} placeholder="876-555-1234" />
        {phone.error && <span className="error">{phone.error}</span>}
        {phone.carrier && <span className="info">Carrier: {phone.carrier}</span>}
      </div>

      <div>
        <label>Parish</label>
        <select
          value={parish.selected?.code ?? ''}
          onChange={(e) => parish.setValue(e.target.value)}
        >
          <option value="">Select parish...</option>
          {parish.parishes.map(p => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={!trn.isValid || !phone.isValid}>
        Register
      </button>
    </form>
  );
}
```

### Currency Input

```tsx
import { useJMD } from 'jamaica-react';

function PriceInput() {
  const jmd = useJMD();

  return (
    <div>
      <label>Amount (JMD)</label>
      <input
        type="number"
        value={jmd.value}
        onChange={(e) => jmd.setValue(Number(e.target.value))}
        placeholder="0.00"
      />
      <div className="breakdown">
        <p>Formatted: {jmd.formatted}</p>
        {jmd.gctBreakdown && (
          <>
            <p>GCT: {jmd.gctBreakdown.gct}</p>
            <p>Total with GCT: {jmd.gctBreakdown.total}</p>
          </>
        )}
      </div>
    </div>
  );
}
```

## Using Base Packages Directly

For more control, use the validation packages directly.

### TRN Input Component

```tsx
import { useState } from 'react';
import { isValidTRN, formatTRN, unformatTRN } from 'jamaica-trn';

function TRNInput({ onChange }: { onChange: (trn: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = unformatTRN(e.target.value);
    if (raw.length <= 9) {
      const formatted = raw.length === 9 ? formatTRN(raw) : raw;
      setValue(formatted);
      if (raw.length === 9) {
        if (isValidTRN(raw)) {
          setError('');
          onChange(raw);
        } else {
          setError('Invalid TRN check digit');
        }
      } else {
        setError('');
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="123-456-789"
        maxLength={11}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Phone Input with Carrier Detection

```tsx
import { useState } from 'react';
import { isValidJamaicanNumber, formatLocal, getCarrier } from 'jamaica-phone';

function PhoneInput({ onChange }: { onChange: (phone: string, carrier: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [carrier, setCarrier] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input);

    if (input.length >= 7) {
      if (isValidJamaicanNumber(input)) {
        const c = getCarrier(input);
        setCarrier(c ?? '');
        setError('');
        onChange(formatLocal(input), c ?? '');
      } else {
        setError('Invalid Jamaican phone number');
        setCarrier('');
      }
    } else {
      setError('');
      setCarrier('');
    }
  };

  return (
    <div>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="876-555-1234"
      />
      {carrier && <span className="carrier">{carrier}</span>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Parish Select

```tsx
import { getAllParishes } from 'jamaica-parishes';

function ParishSelect({ onChange }: { onChange: (code: string) => void }) {
  const parishes = getAllParishes();

  return (
    <select onChange={(e) => onChange(e.target.value)}>
      <option value="">Select parish...</option>
      {parishes.map(p => (
        <option key={p.code} value={p.code}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
```

## Form Validation with Zod

Combine `jamaica-zod` schemas with React Hook Form or any form library.

```tsx
import { z } from 'zod';
import { trnSchema, phoneSchema, parishSchema } from 'jamaica-zod';

const registrationSchema = z.object({
  trn: trnSchema,
  phone: phoneSchema,
  parish: parishSchema,
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type RegistrationData = z.infer<typeof registrationSchema>;

function RegistrationFormWithZod() {
  const handleSubmit = (formData: Record<string, string>) => {
    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      // result.error.issues contains field-level errors
      console.log(result.error.flatten().fieldErrors);
      return;
    }
    // result.data is fully typed and validated
    console.log(result.data);
  };

  // ... render form
}
```
