import { describe, it, expect } from 'vitest';
import {
  trnSchema,
  rawTrnSchema,
  phoneSchema,
  parishSchema,
  parishFlexSchema,
  jmdSchema,
  positiveJmdSchema,
  jmdStringSchema,
  bankIdSchema,
  constituencySchema,
  addressSchema,
  customerSchema,
  paymentSchema,
} from '../index';

// ---------------------------------------------------------------------------
// trnSchema
// ---------------------------------------------------------------------------
describe('trnSchema', () => {
  it('accepts valid formatted TRN', () => {
    expect(trnSchema.parse('123-456-784')).toBe('123-456-784');
  });

  it('accepts valid raw TRN', () => {
    expect(trnSchema.parse('123456784')).toBe('123456784');
  });

  it('trims whitespace', () => {
    expect(trnSchema.parse('  123-456-784  ')).toBe('123-456-784');
  });

  it('rejects invalid TRN', () => {
    expect(() => trnSchema.parse('123-456-789')).toThrow();
  });

  it('rejects empty string', () => {
    expect(() => trnSchema.parse('')).toThrow();
  });

  it('rejects non-string', () => {
    expect(() => trnSchema.parse(123456784)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// rawTrnSchema
// ---------------------------------------------------------------------------
describe('rawTrnSchema', () => {
  it('strips dashes and validates', () => {
    expect(rawTrnSchema.parse('123-456-784')).toBe('123456784');
  });

  it('accepts raw 9 digits', () => {
    expect(rawTrnSchema.parse('123456784')).toBe('123456784');
  });

  it('rejects invalid check digit', () => {
    expect(() => rawTrnSchema.parse('123456789')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// phoneSchema
// ---------------------------------------------------------------------------
describe('phoneSchema', () => {
  it('accepts valid Jamaican number', () => {
    expect(phoneSchema.parse('8765551234')).toBe('8765551234');
  });

  it('accepts with country code', () => {
    expect(phoneSchema.parse('+18765551234')).toBe('+18765551234');
  });

  it('trims whitespace', () => {
    expect(phoneSchema.parse('  8765551234  ')).toBe('8765551234');
  });

  it('rejects invalid number', () => {
    expect(() => phoneSchema.parse('1234')).toThrow();
  });

  it('rejects non-Jamaican number', () => {
    expect(() => phoneSchema.parse('2125551234')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// parishSchema
// ---------------------------------------------------------------------------
describe('parishSchema', () => {
  it('accepts valid parish', () => {
    expect(parishSchema.parse('Kingston')).toBe('Kingston');
  });

  it('accepts St. Andrew', () => {
    expect(parishSchema.parse('St. Andrew')).toBe('St. Andrew');
  });

  it('rejects invalid parish', () => {
    expect(() => parishSchema.parse('Atlantis')).toThrow();
  });

  it('is case-sensitive (exact enum)', () => {
    expect(() => parishSchema.parse('kingston')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// parishFlexSchema
// ---------------------------------------------------------------------------
describe('parishFlexSchema', () => {
  it('accepts exact match', () => {
    expect(parishFlexSchema.parse('Kingston')).toBeTruthy();
  });

  it('accepts lowercase', () => {
    expect(parishFlexSchema.parse('kingston')).toBeTruthy();
  });

  it('accepts uppercase', () => {
    expect(parishFlexSchema.parse('KINGSTON')).toBeTruthy();
  });

  it('trims whitespace', () => {
    expect(parishFlexSchema.parse('  Kingston  ')).toBeTruthy();
  });

  it('rejects invalid parish', () => {
    expect(() => parishFlexSchema.parse('Nowhere')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// jmdSchema
// ---------------------------------------------------------------------------
describe('jmdSchema', () => {
  it('accepts zero', () => {
    expect(jmdSchema.parse(0)).toBe(0);
  });

  it('accepts positive number', () => {
    expect(jmdSchema.parse(5000)).toBe(5000);
  });

  it('rejects negative number', () => {
    expect(() => jmdSchema.parse(-100)).toThrow();
  });

  it('rejects non-number', () => {
    expect(() => jmdSchema.parse('5000')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// positiveJmdSchema
// ---------------------------------------------------------------------------
describe('positiveJmdSchema', () => {
  it('accepts positive number', () => {
    expect(positiveJmdSchema.parse(100)).toBe(100);
  });

  it('rejects zero', () => {
    expect(() => positiveJmdSchema.parse(0)).toThrow();
  });

  it('rejects negative', () => {
    expect(() => positiveJmdSchema.parse(-1)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// jmdStringSchema
// ---------------------------------------------------------------------------
describe('jmdStringSchema', () => {
  it('parses plain number string', () => {
    expect(jmdStringSchema.parse('5000')).toBe(5000);
  });

  it('parses formatted number', () => {
    expect(jmdStringSchema.parse('5,000.00')).toBe(5000);
  });

  it('strips J$ prefix', () => {
    expect(jmdStringSchema.parse('J$5,000')).toBe(5000);
  });

  it('rejects non-numeric string', () => {
    expect(() => jmdStringSchema.parse('abc')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// bankIdSchema
// ---------------------------------------------------------------------------
describe('bankIdSchema', () => {
  it('accepts valid bank id', () => {
    expect(bankIdSchema.parse('ncb')).toBe('ncb');
  });

  it('is case-insensitive', () => {
    expect(bankIdSchema.parse('NCB')).toBe('ncb');
  });

  it('accepts scotiabank', () => {
    expect(bankIdSchema.parse('scotiabank')).toBe('scotiabank');
  });

  it('rejects unknown bank', () => {
    expect(() => bankIdSchema.parse('nonexistent')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// constituencySchema
// ---------------------------------------------------------------------------
describe('constituencySchema', () => {
  it('accepts valid constituency', () => {
    expect(constituencySchema.parse('Kingston Central')).toBeTruthy();
  });

  it('is case-insensitive', () => {
    expect(constituencySchema.parse('kingston central')).toBeTruthy();
  });

  it('rejects invalid constituency', () => {
    expect(() => constituencySchema.parse('Nonexistent Place')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// addressSchema
// ---------------------------------------------------------------------------
describe('addressSchema', () => {
  it('accepts valid address', () => {
    expect(addressSchema.parse('123 Hope Road, Kingston 6')).toBe('123 Hope Road, Kingston 6');
  });

  it('trims whitespace', () => {
    expect(addressSchema.parse('  123 Hope Road  ')).toBe('123 Hope Road');
  });

  it('rejects too short', () => {
    expect(() => addressSchema.parse('Hi')).toThrow();
  });

  it('rejects empty', () => {
    expect(() => addressSchema.parse('')).toThrow();
  });
});

// ---------------------------------------------------------------------------
// customerSchema
// ---------------------------------------------------------------------------
describe('customerSchema', () => {
  it('validates a complete customer', () => {
    const result = customerSchema.parse({
      trn: '123-456-784',
      phone: '8765551234',
      parish: 'Kingston',
      address: '123 Hope Road, Kingston 6',
    });
    expect(result.trn).toBe('123-456-784');
    expect(result.phone).toBe('8765551234');
    expect(result.parish).toBe('Kingston');
  });

  it('address is optional', () => {
    const result = customerSchema.parse({
      trn: '123456784',
      phone: '8765551234',
      parish: 'Kingston',
    });
    expect(result.address).toBeUndefined();
  });

  it('rejects invalid TRN in customer', () => {
    expect(() =>
      customerSchema.parse({
        trn: '123456789',
        phone: '8765551234',
        parish: 'Kingston',
      }),
    ).toThrow();
  });

  it('rejects invalid parish in customer', () => {
    expect(() =>
      customerSchema.parse({
        trn: '123456784',
        phone: '8765551234',
        parish: 'Invalid',
      }),
    ).toThrow();
  });
});

// ---------------------------------------------------------------------------
// paymentSchema
// ---------------------------------------------------------------------------
describe('paymentSchema', () => {
  it('validates a payment', () => {
    const result = paymentSchema.parse({
      amount: 5000,
      description: 'Passport renewal fee',
    });
    expect(result.amount).toBe(5000);
    expect(result.description).toBe('Passport renewal fee');
  });

  it('rejects zero amount', () => {
    expect(() =>
      paymentSchema.parse({
        amount: 0,
        description: 'Test',
      }),
    ).toThrow();
  });

  it('parish is optional', () => {
    const result = paymentSchema.parse({
      amount: 100,
      description: 'Fee',
    });
    expect(result.parish).toBeUndefined();
  });
});
