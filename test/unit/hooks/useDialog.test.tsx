import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDialog } from '../../../src/hooks/useDialog';

describe('useDialog', () => {
  it('should initialize with closed state by default', () => {
    const { result } = renderHook(() => useDialog());

    expect(result.current.isOpen).toBe(false);
  });

  it('should initialize with custom initial state', () => {
    const { result } = renderHook(() => useDialog(true));

    expect(result.current.isOpen).toBe(true);
  });

  it('should open dialog', () => {
    const { result } = renderHook(() => useDialog());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should close dialog', () => {
    const { result } = renderHook(() => useDialog(true));

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle dialog state', () => {
    const { result } = renderHook(() => useDialog());

    // Toggle from closed to open
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    // Toggle from open to closed
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should handle multiple operations', () => {
    const { result } = renderHook(() => useDialog());

    // Open
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    // Close
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);

    // Toggle to open
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    // Toggle to closed
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
