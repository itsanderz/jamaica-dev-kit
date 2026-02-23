import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateTRN, validatePhone, validateParish, gctCalculator } from '../index';

// ---------------------------------------------------------------------------
// Mock Express req/res/next
// ---------------------------------------------------------------------------
function mockReq(overrides: Record<string, any> = {}): any {
  return { body: {}, params: {}, query: {}, ...overrides };
}

function mockRes(): any {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

function mockNext(): any {
  return vi.fn();
}

// ---------------------------------------------------------------------------
// validateTRN
// ---------------------------------------------------------------------------
describe('validateTRN', () => {
  it('passes with valid TRN in body', () => {
    const req = mockReq({ body: { trn: '123-456-784' } });
    const res = mockRes();
    const next = mockNext();

    validateTRN()(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('passes with raw 9-digit TRN', () => {
    const req = mockReq({ body: { trn: '123456784' } });
    const res = mockRes();
    const next = mockNext();

    validateTRN()(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('rejects missing TRN', () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    const next = mockNext();

    validateTRN()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects invalid TRN', () => {
    const req = mockReq({ body: { trn: '123456789' } });
    const res = mockRes();
    const next = mockNext();

    validateTRN()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('uses custom field path', () => {
    const req = mockReq({ body: { customer: { trn: '123456784' } } });
    const res = mockRes();
    const next = mockNext();

    validateTRN({ field: 'body.customer.trn' })(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('formats TRN in-place when format=true', () => {
    const req = mockReq({ body: { trn: '123456784' } });
    const res = mockRes();
    const next = mockNext();

    validateTRN({ format: true })(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.trn).toBe('123-456-784');
  });

  it('uses custom status code', () => {
    const req = mockReq({ body: { trn: 'bad' } });
    const res = mockRes();
    const next = mockNext();

    validateTRN({ statusCode: 422 })(req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
  });

  it('rejects non-string TRN', () => {
    const req = mockReq({ body: { trn: 123456784 } });
    const res = mockRes();
    const next = mockNext();

    validateTRN()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ---------------------------------------------------------------------------
// validatePhone
// ---------------------------------------------------------------------------
describe('validatePhone', () => {
  it('passes with valid phone', () => {
    const req = mockReq({ body: { phone: '8765551234' } });
    const res = mockRes();
    const next = mockNext();

    validatePhone()(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('passes with +1 prefix', () => {
    const req = mockReq({ body: { phone: '+18765551234' } });
    const res = mockRes();
    const next = mockNext();

    validatePhone()(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('rejects missing phone', () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    const next = mockNext();

    validatePhone()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects invalid phone', () => {
    const req = mockReq({ body: { phone: '1234' } });
    const res = mockRes();
    const next = mockNext();

    validatePhone()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('normalizes to E.164 when normalize=true', () => {
    const req = mockReq({ body: { phone: '8765551234' } });
    const res = mockRes();
    const next = mockNext();

    validatePhone({ normalize: true })(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.phone).toMatch(/^\+1876/);
  });

  it('uses custom field path', () => {
    const req = mockReq({ body: { contact: { mobile: '8765551234' } } });
    const res = mockRes();
    const next = mockNext();

    validatePhone({ field: 'body.contact.mobile' })(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// validateParish
// ---------------------------------------------------------------------------
describe('validateParish', () => {
  it('passes with valid parish', () => {
    const req = mockReq({ body: { parish: 'Kingston' } });
    const res = mockRes();
    const next = mockNext();

    validateParish()(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('is case-insensitive by default', () => {
    const req = mockReq({ body: { parish: 'kingston' } });
    const res = mockRes();
    const next = mockNext();

    validateParish()(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.parish).toBe('Kingston'); // normalized
  });

  it('rejects invalid parish', () => {
    const req = mockReq({ body: { parish: 'Atlantis' } });
    const res = mockRes();
    const next = mockNext();

    validateParish()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('accepts St. Andrew', () => {
    const req = mockReq({ body: { parish: 'St. Andrew' } });
    const res = mockRes();
    const next = mockNext();

    validateParish()(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('trims whitespace', () => {
    const req = mockReq({ body: { parish: '  Kingston  ' } });
    const res = mockRes();
    const next = mockNext();

    validateParish()(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.parish).toBe('Kingston');
  });

  it('rejects missing parish', () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    const next = mockNext();

    validateParish()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ---------------------------------------------------------------------------
// gctCalculator
// ---------------------------------------------------------------------------
describe('gctCalculator', () => {
  it('calculates GCT and attaches to request', () => {
    const req = mockReq({ body: { amount: 1000 } });
    const res = mockRes();
    const next = mockNext();

    gctCalculator()(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.gct).toBeDefined();
    expect(req.gct.base).toBe(1000);
    expect(req.gct.gct).toBe(150);
    expect(req.gct.total).toBe(1150);
    expect(req.gct.rate).toBe(0.15);
  });

  it('provides formatted breakdown', () => {
    const req = mockReq({ body: { amount: 5000 } });
    const res = mockRes();
    const next = mockNext();

    gctCalculator()(req, res, next);
    expect(req.gct.formatted).toBeDefined();
    expect(req.gct.formatted.base).toBeTruthy();
    expect(req.gct.formatted.total).toBeTruthy();
  });

  it('accepts string amount', () => {
    const req = mockReq({ body: { amount: '2000' } });
    const res = mockRes();
    const next = mockNext();

    gctCalculator()(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.gct.base).toBe(2000);
  });

  it('rejects missing amount', () => {
    const req = mockReq({ body: {} });
    const res = mockRes();
    const next = mockNext();

    gctCalculator()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects negative amount', () => {
    const req = mockReq({ body: { amount: -100 } });
    const res = mockRes();
    const next = mockNext();

    gctCalculator()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects non-numeric string', () => {
    const req = mockReq({ body: { amount: 'abc' } });
    const res = mockRes();
    const next = mockNext();

    gctCalculator()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('uses custom field path', () => {
    const req = mockReq({ body: { payment: { total: 3000 } } });
    const res = mockRes();
    const next = mockNext();

    gctCalculator({ field: 'body.payment.total' })(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.gct.base).toBe(3000);
  });

  it('uses custom attach name', () => {
    const req = mockReq({ body: { amount: 1000 } });
    const res = mockRes();
    const next = mockNext();

    gctCalculator({ attach: 'taxBreakdown' })(req, res, next);
    expect(req.taxBreakdown).toBeDefined();
    expect(req.taxBreakdown.base).toBe(1000);
  });

  it('accepts zero amount', () => {
    const req = mockReq({ body: { amount: 0 } });
    const res = mockRes();
    const next = mockNext();

    gctCalculator()(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.gct.base).toBe(0);
    expect(req.gct.gct).toBe(0);
  });
});
