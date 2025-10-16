import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from '../../../src/hooks/useErrorHandler';

describe('useErrorHandler', () => {
  it('should initialize with empty error state', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.errorMessage).toBe('');
    expect(result.current.showError).toBe(false);
  });

  it('should set error message and show error', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.setError('Test error message');
    });

    expect(result.current.errorMessage).toBe('Test error message');
    expect(result.current.showError).toBe(true);
  });

  it('should clear error state', () => {
    const { result } = renderHook(() => useErrorHandler());

    // Set error first
    act(() => {
      result.current.setError('Test error message');
    });

    // Clear error
    act(() => {
      result.current.clearError();
    });

    expect(result.current.errorMessage).toBe('');
    expect(result.current.showError).toBe(false);
  });

  it('should show error for specified duration', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showErrorForDuration('Test error', 1000);
    });

    expect(result.current.errorMessage).toBe('Test error');
    expect(result.current.showError).toBe(true);

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.errorMessage).toBe('');
    expect(result.current.showError).toBe(false);

    vi.useRealTimers();
  });

  it('should use default duration when not specified', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.showErrorForDuration('Test error');
    });

    expect(result.current.errorMessage).toBe('Test error');
    expect(result.current.showError).toBe(true);

    // Fast forward time by default duration (6000ms)
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(result.current.errorMessage).toBe('');
    expect(result.current.showError).toBe(false);

    vi.useRealTimers();
  });
});
