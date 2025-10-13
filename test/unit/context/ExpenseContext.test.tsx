import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ExpenseProvider } from '../../../src/context/ExpenseProvider';
import { useExpenseContext } from '../../../src/context/ExpenseContext';
import type { Expense } from '../../../src/types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ExpenseContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ExpenseProvider>{children}</ExpenseProvider>
  );

  describe('useExpenseContext', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useExpenseContext());
      }).toThrow('useExpenseContext must be used within an ExpenseProvider');
    });

    it('should provide context when used within provider', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      expect(result.current).toHaveProperty('expenses');
      expect(result.current).toHaveProperty('addExpense');
      expect(result.current).toHaveProperty('updateExpense');
      expect(result.current).toHaveProperty('deleteExpense');
      expect(Array.isArray(result.current.expenses)).toBe(true);
    });
  });

  describe('ExpenseProvider', () => {
    it('should initialize with empty expenses array', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      expect(result.current.expenses).toEqual([]);
    });

    it('should load expenses from localStorage on mount', () => {
      const mockExpenses: Expense[] = [
        {
          id: 1,
          description: 'Test expense',
          amount: 100,
          date: '2024-01-01',
          currency: 'USD'
        }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
      
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      expect(result.current.expenses).toEqual(mockExpenses);
    });

    it('should handle invalid localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      expect(result.current.expenses).toEqual([]);
    });

    it('should handle null localStorage data', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      expect(result.current.expenses).toEqual([]);
    });
  });

  describe('addExpense', () => {
    it('should add new expense to the list', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const newExpense: Expense = {
        id: 1,
        description: 'New expense',
        amount: 50,
        date: '2024-01-01',
        currency: 'USD'
      };

      act(() => {
        act(() => {
        result.current.addExpense(newExpense);
      });
      });

      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0]).toEqual(newExpense);
    });

    it('should save expenses to localStorage when adding', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const newExpense: Expense = {
        id: 1,
        description: 'New expense',
        amount: 50,
        date: '2024-01-01',
        currency: 'USD'
      };

      act(() => {
        act(() => {
        result.current.addExpense(newExpense);
      });
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'expenses',
        JSON.stringify([newExpense])
      );
    });

    it('should add multiple expenses', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const expense1: Expense = {
        id: 1,
        description: 'Expense 1',
        amount: 50,
        date: '2024-01-01',
        currency: 'USD'
      };

      const expense2: Expense = {
        id: 2,
        description: 'Expense 2',
        amount: 75,
        date: '2024-01-02',
        currency: 'EUR'
      };

      act(() => {
        result.current.addExpense(expense1);
        result.current.addExpense(expense2);
      });

      expect(result.current.expenses).toHaveLength(2);
      expect(result.current.expenses[0]).toEqual(expense1);
      expect(result.current.expenses[1]).toEqual(expense2);
    });
  });

  describe('updateExpense', () => {
    it('should update existing expense', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const originalExpense: Expense = {
        id: 1,
        description: 'Original',
        amount: 50,
        date: '2024-01-01',
        currency: 'USD'
      };

      const updatedExpense = {
        description: 'Updated',
        amount: 75,
        date: '2024-01-02',
        currency: 'EUR'
      };

      act(() => {
        act(() => {
          result.current.addExpense(originalExpense);
        });
      });

      act(() => {
        act(() => {
          result.current.updateExpense(1, updatedExpense);
        });
      });

      expect(result.current.expenses[0]).toEqual({
        id: 1,
        ...updatedExpense
      });
    });

    it('should not update non-existent expense', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const updatedExpense = {
        description: 'Updated',
        amount: 75,
        date: '2024-01-02',
        currency: 'EUR'
      };

      act(() => {
        result.current.updateExpense(999, updatedExpense);
      });

      expect(result.current.expenses).toHaveLength(0);
    });

    it('should save updated expenses to localStorage', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const originalExpense: Expense = {
        id: 1,
        description: 'Original',
        amount: 50,
        date: '2024-01-01',
        currency: 'USD'
      };

      const updatedExpense = {
        description: 'Updated',
        amount: 75,
        date: '2024-01-02',
        currency: 'EUR'
      };

      act(() => {
        act(() => {
          result.current.addExpense(originalExpense);
        });
      });

      act(() => {
        act(() => {
          result.current.updateExpense(1, updatedExpense);
        });
      });

      const lastCall = localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1];
      expect(lastCall[0]).toBe('expenses');
      const savedData = JSON.parse(lastCall[1]);
      expect(savedData).toEqual([{ id: 1, ...updatedExpense }]);
    });
  });

  describe('deleteExpense', () => {
    it('should delete existing expense', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const expense1: Expense = {
        id: 1,
        description: 'Expense 1',
        amount: 50,
        date: '2024-01-01',
        currency: 'USD'
      };

      const expense2: Expense = {
        id: 2,
        description: 'Expense 2',
        amount: 75,
        date: '2024-01-02',
        currency: 'EUR'
      };

      act(() => {
        result.current.addExpense(expense1);
        result.current.addExpense(expense2);
      });

      act(() => {
        act(() => {
          result.current.deleteExpense(1);
        });
      });

      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0]).toEqual(expense2);
    });

    it('should not delete non-existent expense', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const expense: Expense = {
        id: 1,
        description: 'Expense',
        amount: 50,
        date: '2024-01-01',
        currency: 'USD'
      };

      act(() => {
        act(() => {
          result.current.addExpense(expense);
        });
      });

      act(() => {
        result.current.deleteExpense(999);
      });

      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0]).toEqual(expense);
    });

    it('should save updated expenses to localStorage after deletion', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const expense: Expense = {
        id: 1,
        description: 'Expense',
        amount: 50,
        date: '2024-01-01',
        currency: 'USD'
      };

      act(() => {
        act(() => {
          result.current.addExpense(expense);
        });
      });

      act(() => {
        act(() => {
          result.current.deleteExpense(1);
        });
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'expenses',
        JSON.stringify([])
      );
    });
  });

  describe('localStorage error handling', () => {
    it('should handle localStorage data that is not an array', () => {
      localStorageMock.getItem.mockReturnValue('{"not": "an array"}');
      
      const { result } = renderHook(() => useExpenseContext(), {
        wrapper: ({ children }) => <ExpenseProvider>{children}</ExpenseProvider>
      });
      
      expect(result.current.expenses).toEqual([]);
    });

    it('should filter out invalid expense objects', () => {
      const invalidExpenses = [
        { id: 1, description: 'Valid', amount: 100, date: '2024-01-01', currency: 'HUF' },
        { id: 2, description: 'Invalid - missing amount', date: '2024-01-01', currency: 'HUF' },
        { id: 3, description: 'Invalid - negative amount', amount: -50, date: '2024-01-01', currency: 'HUF' },
        { id: 4, description: 'Valid', amount: 200, date: '2024-01-01', currency: 'USD' }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidExpenses));
      
      const { result } = renderHook(() => useExpenseContext(), {
        wrapper: ({ children }) => <ExpenseProvider>{children}</ExpenseProvider>
      });
      
      expect(result.current.expenses).toHaveLength(2);
      expect(result.current.expenses[0].id).toBe(1);
      expect(result.current.expenses[1].id).toBe(4);
    });

    it('should handle expenses with zero amount', () => {
      const expensesWithZero = [
        { id: 1, description: 'Zero amount', amount: 0, date: '2024-01-01', currency: 'HUF' }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(expensesWithZero));
      
      const { result } = renderHook(() => useExpenseContext(), {
        wrapper: ({ children }) => <ExpenseProvider>{children}</ExpenseProvider>
      });
      
      expect(result.current.expenses).toHaveLength(0);
    });

    it('should handle expenses with missing required fields', () => {
      const incompleteExpenses = [
        { id: 1, description: 'Missing amount', date: '2024-01-01', currency: 'HUF' },
        { id: 2, description: 'Missing date', amount: 100, currency: 'HUF' },
        { id: 3, description: 'Missing currency', amount: 100, date: '2024-01-01' },
        { id: 4, description: 'Valid', amount: 100, date: '2024-01-01', currency: 'HUF' }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(incompleteExpenses));
      
      const { result } = renderHook(() => useExpenseContext(), {
        wrapper: ({ children }) => <ExpenseProvider>{children}</ExpenseProvider>
      });
      
      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0].id).toBe(4);
    });

    it('should handle expenses with wrong data types', () => {
      const wrongTypeExpenses = [
        { id: 'not a number', description: 'Valid', amount: 100, date: '2024-01-01', currency: 'HUF' },
        { id: 1, description: 123, amount: 100, date: '2024-01-01', currency: 'HUF' },
        { id: 2, description: 'Valid', amount: 'not a number', date: '2024-01-01', currency: 'HUF' },
        { id: 3, description: 'Valid', amount: 100, date: 123, currency: 'HUF' },
        { id: 4, description: 'Valid', amount: 100, date: '2024-01-01', currency: 123 }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(wrongTypeExpenses));
      
      const { result } = renderHook(() => useExpenseContext(), {
        wrapper: ({ children }) => <ExpenseProvider>{children}</ExpenseProvider>
      });
      
      expect(result.current.expenses).toHaveLength(0);
    });

    it('should handle null expense objects', () => {
      const nullExpenses = [
        null,
        { id: 1, description: 'Valid', amount: 100, date: '2024-01-01', currency: 'HUF' },
        undefined
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(nullExpenses));
      
      const { result } = renderHook(() => useExpenseContext(), {
        wrapper: ({ children }) => <ExpenseProvider>{children}</ExpenseProvider>
      });
      
      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0].id).toBe(1);
    });

    it('should handle empty expense objects', () => {
      const emptyExpenses = [
        {},
        { id: 1, description: 'Valid', amount: 100, date: '2024-01-01', currency: 'HUF' }
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(emptyExpenses));
      
      const { result } = renderHook(() => useExpenseContext(), {
        wrapper: ({ children }) => <ExpenseProvider>{children}</ExpenseProvider>
      });
      
      expect(result.current.expenses).toHaveLength(1);
      expect(result.current.expenses[0].id).toBe(1);
    });
  });

  describe('Error handling', () => {
    it('should handle localStorage save errors gracefully', () => {
      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const expense: Expense = {
        id: 1,
        description: 'Test Expense',
        amount: 100,
        date: '2024-01-01',
        currency: 'USD'
      };

      // This should not throw an error even if localStorage fails
      expect(() => {
        act(() => {
          act(() => {
          result.current.addExpense(expense);
        });
        });
      }).not.toThrow();

      // Restore original implementation
      localStorageMock.setItem = originalSetItem;
    });

    it('should handle invalid expense data in addExpense', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      const invalidExpenses = [
        null,
        undefined,
        { id: 'invalid', description: 'Test', amount: 100, date: '2024-01-01', currency: 'USD' },
        { id: 1, description: '', amount: 100, date: '2024-01-01', currency: 'USD' },
        { id: 1, description: 'Test', amount: -100, date: '2024-01-01', currency: 'USD' },
        { id: 1, description: 'Test', amount: 0, date: '2024-01-01', currency: 'USD' },
        { id: 1, description: '   ', amount: 100, date: '2024-01-01', currency: 'USD' }
      ];

      invalidExpenses.forEach(invalidExpense => {
        const initialLength = result.current.expenses.length;
        act(() => {
          result.current.addExpense(invalidExpense as Expense);
        });
        // Expenses should not be added
        expect(result.current.expenses).toHaveLength(initialLength);
      });
    });

    it('should handle invalid expense data in updateExpense', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      // First add a valid expense
      const validExpense: Expense = {
        id: 1,
        description: 'Valid Expense',
        amount: 100,
        date: '2024-01-01',
        currency: 'USD'
      };
      act(() => {
        result.current.addExpense(validExpense);
      });

      const invalidUpdates = [
        null,
        undefined,
        { description: '', amount: 100, date: '2024-01-01', currency: 'USD' },
        { description: 'Test', amount: -100, date: '2024-01-01', currency: 'USD' },
        { description: 'Test', amount: 0, date: '2024-01-01', currency: 'USD' },
        { description: '   ', amount: 100, date: '2024-01-01', currency: 'USD' }
      ];

      invalidUpdates.forEach(invalidUpdate => {
        const originalExpense = result.current.expenses[0];
        act(() => {
          result.current.updateExpense(1, invalidUpdate as Omit<Expense, 'id'>);
        });
        // Expense should not be updated
        expect(result.current.expenses[0]).toEqual(originalExpense);
      });
    });

    it('should update expense when valid data is provided', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      // First add a valid expense
      const validExpense: Expense = {
        id: 1,
        description: 'Original Expense',
        amount: 100,
        date: '2024-01-01',
        currency: 'USD'
      };
      act(() => {
        act(() => {
        result.current.addExpense(validExpense);
      });
      });

      // Update the expense
      const updatedData = {
        description: 'Updated Expense',
        amount: 200,
        date: '2024-01-02',
        currency: 'EUR'
      };
      act(() => {
        result.current.updateExpense(1, updatedData);
      });

      // Verify the expense was updated
      expect(result.current.expenses[0]).toEqual({
        id: 1,
        description: 'Updated Expense',
        amount: 200,
        date: '2024-01-02',
        currency: 'EUR'
      });
    });

    it('should not update expense when ID is not found', () => {
      const { result } = renderHook(() => useExpenseContext(), { wrapper });
      
      // First add a valid expense
      const validExpense: Expense = {
        id: 1,
        description: 'Original Expense',
        amount: 100,
        date: '2024-01-01',
        currency: 'USD'
      };
      act(() => {
        act(() => {
        result.current.addExpense(validExpense);
      });
      });

      // Try to update non-existent expense
      const updatedData = {
        description: 'Updated Expense',
        amount: 200,
        date: '2024-01-02',
        currency: 'EUR'
      };
      act(() => {
        result.current.updateExpense(999, updatedData);
      });

      // Verify the original expense was not changed
      expect(result.current.expenses[0]).toEqual(validExpense);
    });
  });
});
