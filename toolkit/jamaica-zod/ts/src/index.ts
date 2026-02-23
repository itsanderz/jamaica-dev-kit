/**
 * jamaica-zod — Zod validation schemas for Jamaica data.
 *
 * Provides ready-to-use Zod schemas for TRN, phone numbers, parishes,
 * currency amounts, bank IDs, constituencies, and common form patterns.
 */

import { z } from 'zod';
import { isValidTRN, unformatTRN } from 'jamaica-trn';
import { isValidJamaicanNumber } from 'jamaica-phone';
import { getAllParishes } from 'jamaica-parishes';
import { getConstituencies } from 'jamaica-constituencies';
import { getBanks } from 'jamaica-banks';

// ---------------------------------------------------------------------------
// Parish constants (computed once)
// ---------------------------------------------------------------------------
const PARISH_NAMES = getAllParishes().map((p) => p.name) as [string, ...string[]];

// ---------------------------------------------------------------------------
// TRN Schemas
// ---------------------------------------------------------------------------

/** Validates a formatted or raw TRN string (e.g., "123-456-784" or "123456784"). */
export const trnSchema = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z.string().refine((val) => isValidTRN(val), {
      message: 'Invalid Jamaica TRN — must be 9 digits with a valid check digit',
    }),
  );

/** Validates a raw 9-digit TRN string (no dashes). */
export const rawTrnSchema = z
  .string()
  .transform((val) => unformatTRN(val))
  .pipe(
    z
      .string()
      .regex(/^\d{9}$/, 'TRN must be exactly 9 digits')
      .refine((val) => isValidTRN(val), {
        message: 'Invalid TRN check digit',
      }),
  );

// ---------------------------------------------------------------------------
// Phone Schemas
// ---------------------------------------------------------------------------

/** Validates a Jamaican phone number in any format (+1-876, 876, etc.). */
export const phoneSchema = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z.string().refine((val) => isValidJamaicanNumber(val), {
      message: 'Invalid Jamaican phone number — must be a valid +1-876 or +1-658 number',
    }),
  );

// ---------------------------------------------------------------------------
// Parish Schemas
// ---------------------------------------------------------------------------

/** Validates against the 14 official Jamaica parish names. */
export const parishSchema = z.enum(PARISH_NAMES, {
  errorMap: () => ({
    message: `Must be a valid Jamaica parish: ${PARISH_NAMES.join(', ')}`,
  }),
});

/** Case-insensitive parish validation. */
export const parishFlexSchema = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z.string().refine(
      (val) => {
        const lower = val.toLowerCase();
        return PARISH_NAMES.some((p) => p.toLowerCase() === lower);
      },
      { message: 'Must be a valid Jamaica parish' },
    ),
  );

// ---------------------------------------------------------------------------
// Currency Schemas
// ---------------------------------------------------------------------------

/** Validates a non-negative JMD amount. */
export const jmdSchema = z.number().nonnegative({ message: 'Amount must be non-negative' });

/** Validates a positive JMD amount (greater than zero). */
export const positiveJmdSchema = z.number().positive({ message: 'Amount must be greater than zero' });

/** Validates a JMD string like "5000", "5,000.00", "J$5,000". */
export const jmdStringSchema = z
  .string()
  .transform((val) => {
    const cleaned = val.replace(/[J$,\s]/g, '');
    return parseFloat(cleaned);
  })
  .pipe(z.number().nonnegative({ message: 'Invalid JMD amount' }).finite());

// ---------------------------------------------------------------------------
// Bank Schemas
// ---------------------------------------------------------------------------

/** Validates a bank ID (e.g., "ncb", "scotiabank"). */
export const bankIdSchema = z
  .string()
  .transform((val) => val.trim().toLowerCase())
  .pipe(
    z.string().refine(
      (val) => getBanks().some((b) => b.id === val),
      { message: 'Invalid Jamaica bank ID' },
    ),
  );

// ---------------------------------------------------------------------------
// Constituency Schemas
// ---------------------------------------------------------------------------

/** Validates a constituency name. */
export const constituencySchema = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z.string().refine(
      (val) => {
        const lower = val.toLowerCase();
        return getConstituencies().some((c) => c.name.toLowerCase() === lower);
      },
      { message: 'Invalid Jamaica constituency' },
    ),
  );

// ---------------------------------------------------------------------------
// Address Schema
// ---------------------------------------------------------------------------

/** Basic address string validation (non-empty, reasonable length). */
export const addressSchema = z
  .string()
  .min(5, 'Address is too short')
  .max(500, 'Address is too long')
  .transform((val) => val.trim());

// ---------------------------------------------------------------------------
// Composite Schemas (common form patterns)
// ---------------------------------------------------------------------------

/** Schema for a Jamaica customer/person record. */
export const customerSchema = z.object({
  trn: trnSchema,
  phone: phoneSchema,
  parish: parishSchema,
  address: addressSchema.optional(),
});

/** Schema for a payment/transaction. */
export const paymentSchema = z.object({
  amount: positiveJmdSchema,
  description: z.string().min(1).max(200),
  parish: parishSchema.optional(),
});

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------
export type Customer = z.infer<typeof customerSchema>;
export type Payment = z.infer<typeof paymentSchema>;
