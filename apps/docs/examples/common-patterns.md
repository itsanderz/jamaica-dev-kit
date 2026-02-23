# Common Patterns

Practical code patterns that combine multiple Jamaica Dev Kit packages.

## Validate User Input

```typescript
import { isValidTRN, formatTRN } from 'jamaica-trn';
import { isValidJamaicanNumber, formatE164, getCarrier } from 'jamaica-phone';
import { parseAddress, extractParish } from 'jamaica-addresses';

function validateCustomer(data: {
  trn: string;
  phone: string;
  address: string;
}) {
  const errors: string[] = [];

  if (!isValidTRN(data.trn)) {
    errors.push('Invalid TRN — must be 9 digits with valid check digit');
  }

  if (!isValidJamaicanNumber(data.phone)) {
    errors.push('Invalid phone — must be +1-876 or +1-658');
  }

  const parish = extractParish(data.address);
  if (!parish) {
    errors.push('Could not determine parish from address');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    customer: {
      trn: formatTRN(data.trn),
      phone: formatE164(data.phone),
      carrier: getCarrier(data.phone),
      parish,
      address: parseAddress(data.address),
    },
  };
}
```

## Invoice with GCT

```typescript
import { formatJMD, addGCT, formatWithGCT, GCT_RATE } from 'jamaica-currency';

interface LineItem { name: string; amount: number; qty: number }

function createInvoice(items: LineItem[]) {
  const lines = items.map(item => ({
    name: item.name,
    unitPrice: formatJMD(item.amount),
    qty: item.qty,
    total: formatJMD(item.amount * item.qty),
  }));

  const subtotal = items.reduce((sum, i) => sum + i.amount * i.qty, 0);
  const breakdown = formatWithGCT(subtotal);

  return {
    lines,
    subtotal: breakdown.base,
    gct: breakdown.gct,
    total: breakdown.total,
  };
}
```

## Payroll with Full Deductions

```typescript
import { calculatePayroll } from 'jamaica-tax';
import { formatJMD } from 'jamaica-currency';

function generatePayslip(employeeName: string, grossPay: number) {
  const payroll = calculatePayroll(grossPay);

  return {
    employee: employeeName,
    gross: formatJMD(payroll.grossPay),
    deductions: {
      incomeTax: formatJMD(payroll.incomeTax),
      nis: formatJMD(payroll.nis),
      nht: formatJMD(payroll.nht),
      educationTax: formatJMD(payroll.educationTax),
    },
    netPay: formatJMD(payroll.netPay),
    employerCost: formatJMD(payroll.employerCost),
  };
}
```

## Delivery Fee Calculator

```typescript
import { getDistanceKm, getParish, type ParishCode } from 'jamaica-parishes';
import { formatJMD, addGCT } from 'jamaica-currency';
import { extractParish } from 'jamaica-addresses';

const DEPOT: ParishCode = 'KIN';

function getDeliveryQuote(address: string) {
  const parishName = extractParish(address);
  if (!parishName) return { error: 'Could not determine parish' };

  const parish = getParish(parishName);
  if (!parish) return { error: 'Unknown parish' };

  const distance = getDistanceKm(DEPOT, parish.code);
  if (distance === null) return { error: 'Cannot calculate distance' };

  let fee: number;
  let zone: string;
  if (distance < 15) { zone = 'Metro'; fee = 500; }
  else if (distance < 40) { zone = 'Suburban'; fee = 1000; }
  else if (distance < 80) { zone = 'Regional'; fee = 1500; }
  else { zone = 'Island-wide'; fee = 2500; }

  return {
    parish: parishName,
    zone,
    distance: `${distance.toFixed(1)} km`,
    fee: formatJMD(fee),
    feeWithGCT: formatJMD(addGCT(fee)),
  };
}
```

## Check Office Hours

```typescript
import { isBusinessDay, isPublicHoliday, getNextHoliday } from 'jamaica-holidays';

function getOfficeStatus(date: string = new Date().toISOString().split('T')[0]) {
  if (!isBusinessDay(date)) {
    if (isPublicHoliday(date)) {
      return 'Closed — Public Holiday';
    }
    return 'Closed — Weekend';
  }
  const next = getNextHoliday(date);
  return `Open. Next holiday: ${next?.name} (${next?.date})`;
}
```

## Nearest Health Facility

```typescript
import { getNearestFacility, getHospitalsByParish } from 'jamaica-health';
import { getEmergencyNumbers } from 'jamaica-emergency';

function getEmergencyInfo(lat: number, lng: number) {
  const nearest = getNearestFacility(lat, lng);
  const numbers = getEmergencyNumbers();

  return {
    nearestFacility: nearest?.name,
    facilityType: nearest?.type,
    parish: nearest?.parish,
    emergency: {
      ambulance: numbers.ambulance,
      police: numbers.police,
      fire: numbers.fire,
    },
  };
}
```

## School Finder

```typescript
import { getSchoolsByParish, searchSchools, getSchoolsByType } from 'jamaica-schools';

function findSchools(query: { parish?: string; type?: string; search?: string }) {
  if (query.search) {
    return searchSchools(query.search);
  }

  if (query.parish && query.type) {
    return getSchoolsByParish(query.parish)
      .filter(s => s.type === query.type);
  }

  if (query.parish) {
    return getSchoolsByParish(query.parish);
  }

  if (query.type) {
    return getSchoolsByType(query.type as any);
  }

  return [];
}
```

## Bank Transfer Details

```typescript
import { getBank, getSwiftCode, getBankBranches } from 'jamaica-banks';

function getBankTransferInfo(bankId: string) {
  const bank = getBank(bankId);
  if (!bank) return { error: 'Bank not found' };

  const branches = getBankBranches(bankId);
  const swift = getSwiftCode(bankId);

  return {
    name: bank.name,
    type: bank.type,
    swift: swift ?? 'N/A',
    branches: branches.length,
    branchList: branches.map(b => ({
      name: b.name,
      parish: b.parish,
    })),
  };
}
```
