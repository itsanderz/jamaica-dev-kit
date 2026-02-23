import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTRN, usePhone, useJMD, useParish } from '../index';

// ---------------------------------------------------------------------------
// useTRN
// ---------------------------------------------------------------------------
describe('useTRN', () => {
  it('starts with empty state', () => {
    const { result } = renderHook(() => useTRN());
    expect(result.current.value).toBe('');
    expect(result.current.formatted).toBe('');
    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('accepts initial value', () => {
    const { result } = renderHook(() => useTRN('123-456-784'));
    expect(result.current.value).toBe('123-456-784');
    expect(result.current.isValid).toBe(true);
  });

  it('validates valid TRN', () => {
    const { result } = renderHook(() => useTRN());
    act(() => result.current.setValue('123456784'));
    expect(result.current.isValid).toBe(true);
    expect(result.current.formatted).toBe('123-456-784');
    expect(result.current.error).toBeNull();
  });

  it('rejects invalid TRN', () => {
    const { result } = renderHook(() => useTRN());
    act(() => result.current.setValue('123456789'));
    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('resets to empty', () => {
    const { result } = renderHook(() => useTRN('123456784'));
    act(() => result.current.reset());
    expect(result.current.value).toBe('');
    expect(result.current.isValid).toBe(false);
  });

  it('provides input props', () => {
    const { result } = renderHook(() => useTRN());
    expect(result.current.inputProps.maxLength).toBe(11);
    expect(result.current.inputProps.placeholder).toBe('123-456-784');
    expect(result.current.inputProps['aria-invalid']).toBe(false);
  });

  it('input props onChange updates value', () => {
    const { result } = renderHook(() => useTRN());
    act(() => result.current.inputProps.onChange({ target: { value: '123456784' } }));
    expect(result.current.value).toBe('123456784');
    expect(result.current.isValid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// usePhone
// ---------------------------------------------------------------------------
describe('usePhone', () => {
  it('starts with empty state', () => {
    const { result } = renderHook(() => usePhone());
    expect(result.current.value).toBe('');
    expect(result.current.isValid).toBe(false);
    expect(result.current.carrier).toBeNull();
  });

  it('validates valid Jamaican number', () => {
    const { result } = renderHook(() => usePhone());
    act(() => result.current.setValue('8765551234'));
    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('detects carrier', () => {
    const { result } = renderHook(() => usePhone());
    act(() => result.current.setValue('8765551234'));
    expect(result.current.carrier).toBeTruthy();
  });

  it('rejects invalid number', () => {
    const { result } = renderHook(() => usePhone());
    act(() => result.current.setValue('1234'));
    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('resets to empty', () => {
    const { result } = renderHook(() => usePhone());
    act(() => result.current.setValue('8765551234'));
    act(() => result.current.reset());
    expect(result.current.value).toBe('');
    expect(result.current.carrier).toBeNull();
  });

  it('provides input props with type=tel', () => {
    const { result } = renderHook(() => usePhone());
    expect(result.current.inputProps.type).toBe('tel');
  });
});

// ---------------------------------------------------------------------------
// useJMD
// ---------------------------------------------------------------------------
describe('useJMD', () => {
  it('starts with empty state', () => {
    const { result } = renderHook(() => useJMD());
    expect(result.current.rawValue).toBe('');
    expect(result.current.isValid).toBe(false);
    expect(result.current.gct).toBeNull();
  });

  it('parses numeric string', () => {
    const { result } = renderHook(() => useJMD());
    act(() => result.current.setRawValue('5000'));
    expect(result.current.value).toBe(5000);
    expect(result.current.isValid).toBe(true);
    expect(result.current.formatted).toBeTruthy();
  });

  it('calculates GCT breakdown', () => {
    const { result } = renderHook(() => useJMD());
    act(() => result.current.setRawValue('1000'));
    expect(result.current.gct).not.toBeNull();
    expect(result.current.gct!.total).toBeTruthy();
  });

  it('setValue from number', () => {
    const { result } = renderHook(() => useJMD());
    act(() => result.current.setValue(2500));
    expect(result.current.value).toBe(2500);
    expect(result.current.isValid).toBe(true);
  });

  it('rejects invalid input', () => {
    const { result } = renderHook(() => useJMD());
    act(() => result.current.setRawValue('abc'));
    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('resets to empty', () => {
    const { result } = renderHook(() => useJMD());
    act(() => result.current.setValue(5000));
    act(() => result.current.reset());
    expect(result.current.rawValue).toBe('');
    expect(result.current.isValid).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// useParish
// ---------------------------------------------------------------------------
describe('useParish', () => {
  it('starts with null', () => {
    const { result } = renderHook(() => useParish());
    expect(result.current.value).toBeNull();
    expect(result.current.parish).toBeNull();
  });

  it('provides all 14 parishes', () => {
    const { result } = renderHook(() => useParish());
    expect(result.current.parishes.length).toBe(14);
  });

  it('selects a parish by name', () => {
    const { result } = renderHook(() => useParish());
    act(() => result.current.setValue('Kingston'));
    expect(result.current.value).toBe('Kingston');
    expect(result.current.parish).not.toBeNull();
    expect(result.current.parish!.name).toBe('Kingston');
  });

  it('accepts initial value', () => {
    const { result } = renderHook(() => useParish('Kingston'));
    expect(result.current.value).toBe('Kingston');
    expect(result.current.parish).not.toBeNull();
  });

  it('resets to null', () => {
    const { result } = renderHook(() => useParish('Kingston'));
    act(() => result.current.reset());
    expect(result.current.value).toBeNull();
    expect(result.current.parish).toBeNull();
  });

  it('returns null parish for unknown name', () => {
    const { result } = renderHook(() => useParish());
    act(() => result.current.setValue('Atlantis'));
    expect(result.current.value).toBe('Atlantis');
    expect(result.current.parish).toBeNull();
  });
});
