/**
 * jamaica-express — Express middleware for Jamaica data validation.
 *
 * Provides request validation middleware for TRN, phone, parish,
 * and GCT calculation for Express/Connect-compatible servers.
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { isValidTRN, formatTRN, unformatTRN } from 'jamaica-trn';
import { isValidJamaicanNumber, parsePhone, formatE164 } from 'jamaica-phone';
import { getAllParishes } from 'jamaica-parishes';
import { addGCT, removeGCT, GCT_RATE, formatWithGCT } from 'jamaica-currency';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract a nested value from an object using dot-path (e.g., "body.trn"). */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((o, key) => (o != null ? o[key] : undefined), obj);
}

/** Set a nested value on an object using dot-path. */
function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] == null) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// ---------------------------------------------------------------------------
// validateTRN
// ---------------------------------------------------------------------------

export interface ValidateTRNOptions {
  /** Dot-path to the TRN field on the request (default: "body.trn") */
  field?: string;
  /** HTTP status code for validation errors (default: 400) */
  statusCode?: number;
  /** Whether to format the TRN in-place after validation (default: false) */
  format?: boolean;
}

/**
 * Middleware that validates a TRN field on the request.
 *
 * @example
 * app.post('/register', validateTRN(), handler);
 * app.post('/register', validateTRN({ field: 'body.customer.trn', format: true }), handler);
 */
export function validateTRN(options: ValidateTRNOptions = {}): RequestHandler {
  const { field = 'body.trn', statusCode = 400, format = false } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const value = getNestedValue(req as any, field);

    if (value == null || typeof value !== 'string') {
      res.status(statusCode).json({
        error: 'Validation failed',
        message: `Missing or invalid TRN at ${field}`,
      });
      return;
    }

    if (!isValidTRN(value)) {
      res.status(statusCode).json({
        error: 'Validation failed',
        message: 'Invalid Jamaica TRN — must be 9 digits with a valid check digit',
      });
      return;
    }

    if (format) {
      const raw = unformatTRN(value);
      setNestedValue(req as any, field, formatTRN(raw));
    }

    next();
  };
}

// ---------------------------------------------------------------------------
// validatePhone
// ---------------------------------------------------------------------------

export interface ValidatePhoneOptions {
  /** Dot-path to the phone field (default: "body.phone") */
  field?: string;
  /** HTTP status code for validation errors (default: 400) */
  statusCode?: number;
  /** Whether to normalize to E.164 format in-place (default: false) */
  normalize?: boolean;
}

/**
 * Middleware that validates a Jamaican phone number.
 *
 * @example
 * app.post('/register', validatePhone(), handler);
 * app.post('/register', validatePhone({ field: 'body.mobile', normalize: true }), handler);
 */
export function validatePhone(options: ValidatePhoneOptions = {}): RequestHandler {
  const { field = 'body.phone', statusCode = 400, normalize = false } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const value = getNestedValue(req as any, field);

    if (value == null || typeof value !== 'string') {
      res.status(statusCode).json({
        error: 'Validation failed',
        message: `Missing or invalid phone number at ${field}`,
      });
      return;
    }

    if (!isValidJamaicanNumber(value)) {
      res.status(statusCode).json({
        error: 'Validation failed',
        message: 'Invalid Jamaican phone number — must be a valid +1-876 or +1-658 number',
      });
      return;
    }

    if (normalize) {
      try {
        setNestedValue(req as any, field, formatE164(value));
      } catch {
        // keep original if normalization fails
      }
    }

    next();
  };
}

// ---------------------------------------------------------------------------
// validateParish
// ---------------------------------------------------------------------------

export interface ValidateParishOptions {
  /** Dot-path to the parish field (default: "body.parish") */
  field?: string;
  /** HTTP status code for validation errors (default: 400) */
  statusCode?: number;
  /** Whether to match case-insensitively (default: true) */
  caseInsensitive?: boolean;
}

/**
 * Middleware that validates a Jamaica parish name.
 *
 * @example
 * app.post('/register', validateParish(), handler);
 */
export function validateParish(options: ValidateParishOptions = {}): RequestHandler {
  const { field = 'body.parish', statusCode = 400, caseInsensitive = true } = options;
  const parishes = getAllParishes();
  const parishNames = parishes.map((p) => p.name);

  return (req: Request, res: Response, next: NextFunction): void => {
    const value = getNestedValue(req as any, field);

    if (value == null || typeof value !== 'string') {
      res.status(statusCode).json({
        error: 'Validation failed',
        message: `Missing or invalid parish at ${field}`,
      });
      return;
    }

    const trimmed = value.trim();
    const match = caseInsensitive
      ? parishNames.find((p) => p.toLowerCase() === trimmed.toLowerCase())
      : parishNames.find((p) => p === trimmed);

    if (!match) {
      res.status(statusCode).json({
        error: 'Validation failed',
        message: `Invalid Jamaica parish. Must be one of: ${parishNames.join(', ')}`,
      });
      return;
    }

    // Normalize to canonical name
    if (caseInsensitive) {
      setNestedValue(req as any, field, match);
    }

    next();
  };
}

// ---------------------------------------------------------------------------
// gctCalculator
// ---------------------------------------------------------------------------

export interface GCTCalculatorOptions {
  /** Dot-path to the amount field (default: "body.amount") */
  field?: string;
  /** Custom GCT rate (default: 0.15) */
  rate?: number;
  /** Property name to attach GCT breakdown to req (default: "gct") */
  attach?: string;
}

export interface GCTResult {
  /** Original amount before GCT */
  base: number;
  /** GCT amount */
  gct: number;
  /** Total with GCT */
  total: number;
  /** GCT rate used */
  rate: number;
  /** Formatted breakdown */
  formatted: { base: string; gct: string; total: string };
}

/**
 * Middleware that calculates GCT on an amount and attaches the breakdown to the request.
 *
 * @example
 * app.post('/checkout', gctCalculator(), (req, res) => {
 *   const gct = (req as any).gct; // { base, gct, total, rate, formatted }
 *   res.json(gct);
 * });
 */
export function gctCalculator(options: GCTCalculatorOptions = {}): RequestHandler {
  const { field = 'body.amount', rate = GCT_RATE, attach = 'gct' } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const rawValue = getNestedValue(req as any, field);
    const amount = typeof rawValue === 'string' ? parseFloat(rawValue) : rawValue;

    if (amount == null || typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      res.status(400).json({
        error: 'Validation failed',
        message: `Invalid amount at ${field} — must be a non-negative number`,
      });
      return;
    }

    const gctAmount = amount * rate;
    const total = amount + gctAmount;
    const breakdown = formatWithGCT(amount);

    const result: GCTResult = {
      base: amount,
      gct: gctAmount,
      total,
      rate,
      formatted: breakdown,
    };

    (req as any)[attach] = result;
    next();
  };
}
