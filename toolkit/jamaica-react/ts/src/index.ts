/**
 * jamaica-react — React hooks and components for Jamaica data.
 *
 * Provides headless hooks for TRN, phone, currency, and parish
 * validation with real-time feedback, plus unstyled form components.
 */

import { useState, useCallback, useMemo } from 'react';
import { isValidTRN, formatTRN, unformatTRN } from 'jamaica-trn';
import {
  isValidJamaicanNumber,
  parsePhone,
  formatLocal,
  formatNational,
  getCarrier,
  type Carrier,
} from 'jamaica-phone';
import {
  formatJMD,
  parseJMD,
  addGCT,
  formatWithGCT,
  type FormatOptions,
  type GCTBreakdown,
} from 'jamaica-currency';
import { getAllParishes, type Parish } from 'jamaica-parishes';

// ---------------------------------------------------------------------------
// useTRN
// ---------------------------------------------------------------------------

export interface UseTRNResult {
  /** Current raw value */
  value: string;
  /** Formatted TRN (NNN-NNN-NNN) or raw input if invalid */
  formatted: string;
  /** Whether the current value is a valid TRN */
  isValid: boolean;
  /** Error message, or null if valid/empty */
  error: string | null;
  /** Set the value */
  setValue: (val: string) => void;
  /** Reset to empty */
  reset: () => void;
  /** Props to spread onto an input element */
  inputProps: {
    value: string;
    onChange: (e: { target: { value: string } }) => void;
    maxLength: number;
    placeholder: string;
    'aria-invalid': boolean;
  };
}

/** Hook for TRN input with validation. */
export function useTRN(initialValue = ''): UseTRNResult {
  const [value, setValueRaw] = useState(initialValue);

  const setValue = useCallback((val: string) => {
    setValueRaw(val);
  }, []);

  const reset = useCallback(() => {
    setValueRaw('');
  }, []);

  const isValid = useMemo(() => {
    if (!value.trim()) return false;
    return isValidTRN(value);
  }, [value]);

  const formatted = useMemo(() => {
    if (!value.trim()) return '';
    const raw = unformatTRN(value);
    if (/^\d{9}$/.test(raw) && isValidTRN(raw)) return formatTRN(raw);
    return value;
  }, [value]);

  const error = useMemo(() => {
    if (!value.trim()) return null;
    if (!isValid) return 'Invalid TRN — must be 9 digits with a valid check digit';
    return null;
  }, [value, isValid]);

  const inputProps = useMemo(
    () => ({
      value,
      onChange: (e: { target: { value: string } }) => setValue(e.target.value),
      maxLength: 11, // NNN-NNN-NNN
      placeholder: '123-456-784',
      'aria-invalid': !!error,
    }),
    [value, error, setValue],
  );

  return { value, formatted, isValid, error, setValue, reset, inputProps };
}

// ---------------------------------------------------------------------------
// usePhone
// ---------------------------------------------------------------------------

export interface UsePhoneResult {
  /** Current raw value */
  value: string;
  /** Formatted phone number (local format) */
  formatted: string;
  /** Whether the current value is a valid Jamaican number */
  isValid: boolean;
  /** Detected carrier */
  carrier: Carrier | null;
  /** Error message, or null if valid/empty */
  error: string | null;
  /** Set the value */
  setValue: (val: string) => void;
  /** Reset to empty */
  reset: () => void;
  /** Props to spread onto an input element */
  inputProps: {
    value: string;
    onChange: (e: { target: { value: string } }) => void;
    type: string;
    placeholder: string;
    'aria-invalid': boolean;
  };
}

/** Hook for Jamaican phone number input with validation. */
export function usePhone(initialValue = ''): UsePhoneResult {
  const [value, setValueRaw] = useState(initialValue);

  const setValue = useCallback((val: string) => {
    setValueRaw(val);
  }, []);

  const reset = useCallback(() => {
    setValueRaw('');
  }, []);

  const isValid = useMemo(() => {
    if (!value.trim()) return false;
    return isValidJamaicanNumber(value);
  }, [value]);

  const formatted = useMemo(() => {
    if (!value.trim()) return '';
    if (isValid) {
      try {
        return formatLocal(value);
      } catch {
        return value;
      }
    }
    return value;
  }, [value, isValid]);

  const carrier = useMemo((): Carrier | null => {
    if (!isValid) return null;
    try {
      return getCarrier(value);
    } catch {
      return null;
    }
  }, [value, isValid]);

  const error = useMemo(() => {
    if (!value.trim()) return null;
    if (!isValid) return 'Invalid Jamaican phone number';
    return null;
  }, [value, isValid]);

  const inputProps = useMemo(
    () => ({
      value,
      onChange: (e: { target: { value: string } }) => setValue(e.target.value),
      type: 'tel',
      placeholder: '876-555-1234',
      'aria-invalid': !!error,
    }),
    [value, error, setValue],
  );

  return { value, formatted, isValid, carrier, error, setValue, reset, inputProps };
}

// ---------------------------------------------------------------------------
// useJMD
// ---------------------------------------------------------------------------

export interface UseJMDResult {
  /** Current numeric value (NaN if invalid) */
  value: number;
  /** Current raw string input */
  rawValue: string;
  /** Formatted JMD string */
  formatted: string;
  /** Whether the current value is a valid amount */
  isValid: boolean;
  /** GCT breakdown for the current amount */
  gct: GCTBreakdown | null;
  /** Error message, or null if valid/empty */
  error: string | null;
  /** Set from a raw string (e.g., form input) */
  setRawValue: (val: string) => void;
  /** Set from a number */
  setValue: (val: number) => void;
  /** Reset to empty */
  reset: () => void;
}

/** Hook for JMD currency input with formatting and GCT calculation. */
export function useJMD(options?: FormatOptions): UseJMDResult {
  const [rawValue, setRawValue] = useState('');

  const value = useMemo(() => {
    if (!rawValue.trim()) return NaN;
    const parsed = parseJMD(rawValue);
    return parsed ?? NaN;
  }, [rawValue]);

  const isValid = useMemo(() => {
    return !isNaN(value) && value >= 0;
  }, [value]);

  const formatted = useMemo(() => {
    if (!isValid) return '';
    return formatJMD(value, options);
  }, [value, isValid, options]);

  const gct = useMemo((): GCTBreakdown | null => {
    if (!isValid) return null;
    return formatWithGCT(value);
  }, [value, isValid]);

  const error = useMemo(() => {
    if (!rawValue.trim()) return null;
    if (!isValid) return 'Invalid JMD amount';
    return null;
  }, [rawValue, isValid]);

  const setValue = useCallback((val: number) => {
    setRawValue(String(val));
  }, []);

  const reset = useCallback(() => {
    setRawValue('');
  }, []);

  return { value, rawValue, formatted, isValid, gct, error, setRawValue, setValue, reset };
}

// ---------------------------------------------------------------------------
// useParish
// ---------------------------------------------------------------------------

export interface UseParishResult {
  /** Currently selected parish name, or null */
  value: string | null;
  /** Full parish object, or null */
  parish: Parish | null;
  /** All parishes for rendering options */
  parishes: Parish[];
  /** Set the selected parish by name */
  setValue: (name: string | null) => void;
  /** Reset to null */
  reset: () => void;
}

/** Hook for parish selection. */
export function useParish(initialValue: string | null = null): UseParishResult {
  const parishes = useMemo(() => getAllParishes(), []);
  const [value, setValueRaw] = useState<string | null>(initialValue);

  const parish = useMemo(() => {
    if (!value) return null;
    return parishes.find((p) => p.name === value) ?? null;
  }, [value, parishes]);

  const setValue = useCallback((name: string | null) => {
    setValueRaw(name);
  }, []);

  const reset = useCallback(() => {
    setValueRaw(null);
  }, []);

  return { value, parish, parishes, setValue, reset };
}

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------
export type { Carrier } from 'jamaica-phone';
export type { FormatOptions, GCTBreakdown } from 'jamaica-currency';
export type { Parish } from 'jamaica-parishes';
