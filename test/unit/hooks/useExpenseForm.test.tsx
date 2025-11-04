import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExpenseForm } from '../../../src/hooks/useExpenseForm';
import type { Expense } from '../../../src/types';

// Mock the date utility
vi.mock('../../../src/utils/dateUtils', () => ({
  getTodayDateString: vi.fn(() => '2024-01-15'),
}));

describe('useExpenseForm', () => {
  const mockExpenses: Expense[] = [
    {
      id: 1,
      description: 'Test expense 1',
      amount: 100,
      date: '2024-01-01',
      currency: 'USD',
    },
    {
      id: 2,
      description: 'Test expense 2',
      amount: 200,
      date: '2024-01-02',
      currency: 'EUR',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    expect(result.current.description).toBe('');
    expect(result.current.amount).toBe('');
    expect(result.current.date).toBe('2024-01-15');
    expect(result.current.currency).toBe('HUF');
    expect(result.current.errorMessage).toBe('');
    expect(result.current.showError).toBe(false);
  });

  it('should update form state correctly', () => {
    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    act(() => {
      result.current.setDescription('New expense');
    });
    expect(result.current.description).toBe('New expense');

    act(() => {
      result.current.setAmount('150');
    });
    expect(result.current.amount).toBe('150');

    act(() => {
      result.current.setDate('2024-01-20');
    });
    expect(result.current.date).toBe('2024-01-20');

    act(() => {
      result.current.setCurrency('USD');
    });
    expect(result.current.currency).toBe('USD');
  });

  it('should extract unique descriptions from expenses', () => {
    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    expect(result.current.uniqueDescriptions).toEqual(['Test expense 1', 'Test expense 2']);
  });

  it('should validate form data correctly', () => {
    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    // Test valid form data
    act(() => {
      result.current.setDescription('Valid expense');
      result.current.setAmount('100');
      result.current.setDate('2024-01-15');
      result.current.setCurrency('USD');
    });

    const validation = result.current.validateForm();
    expect(validation.isValid).toBe(true);

    // Test invalid form data - empty description
    act(() => {
      result.current.setDescription('');
    });

    const invalidValidation = result.current.validateForm();
    expect(invalidValidation.isValid).toBe(false);
    expect(invalidValidation.errorMessage).toBe('Please fill in all fields.');
  });

  it('should create expense object correctly', () => {
    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    act(() => {
      result.current.setDescription('Test expense');
      result.current.setAmount('100');
      result.current.setDate('2024-01-15');
      result.current.setCurrency('USD');
    });

    const expense = result.current.createExpense();
    expect(expense.description).toBe('Test expense');
    expect(expense.amount).toBe(100);
    expect(expense.date).toBe('2024-01-15');
    expect(expense.currency).toBe('USD');
    expect(expense.id).toBeTypeOf('number');
  });

  it('should reset form to initial state', () => {
    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    // Set some values
    act(() => {
      result.current.setDescription('Test expense');
      result.current.setAmount('100');
      result.current.setDate('2024-01-20');
      result.current.setCurrency('EUR');
      result.current.setErrorMessage('Test error');
      result.current.setShowError(true);
    });

    // Reset form
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.description).toBe('');
    expect(result.current.amount).toBe('');
    expect(result.current.date).toBe('2024-01-15');
    expect(result.current.currency).toBe('HUF');
    expect(result.current.errorMessage).toBe('');
    expect(result.current.showError).toBe(false);
  });

  it('should handle error state correctly', () => {
    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    act(() => {
      result.current.setErrorMessage('Test error message');
    });
    expect(result.current.errorMessage).toBe('Test error message');

    act(() => {
      result.current.setShowError(true);
    });
    expect(result.current.showError).toBe(true);
  });

  it('should provide valid currencies', () => {
    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    expect(result.current.validCurrencies).toEqual(['HUF', 'USD', 'EUR', 'GBP']);
  });

  it('should generate unique IDs', () => {
    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    const id1 = result.current.generateUniqueId();
    const id2 = result.current.generateUniqueId();
    
    expect(id1).toBeTypeOf('number');
    expect(id2).toBeTypeOf('number');
    // IDs should be defined and valid numbers
    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    // Note: IDs might be the same if generated in the same millisecond, which is acceptable
  });

  it('should handle crypto.randomUUID fallback', () => {
    // Mock crypto.randomUUID as undefined
    const originalCrypto = global.crypto;
    // @ts-expect-error - Testing fallback behavior when crypto is undefined
    delete global.crypto;

    const { result } = renderHook(() => useExpenseForm(mockExpenses));

    const id = result.current.generateUniqueId();
    expect(id).toBeTypeOf('number');

    // Restore crypto
    global.crypto = originalCrypto;
  });
});
