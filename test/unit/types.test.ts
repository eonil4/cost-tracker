import { describe, it, expect } from 'vitest';
import type { Expense } from '../types';

describe('Types', () => {
  describe('Expense interface', () => {
    it('should have all required properties', () => {
      const expense: Expense = {
        id: 1,
        description: 'Test expense',
        amount: 100.50,
        date: '2024-01-01',
        currency: 'USD'
      };

      expect(expense.id).toBe(1);
      expect(expense.description).toBe('Test expense');
      expect(expense.amount).toBe(100.50);
      expect(expense.date).toBe('2024-01-01');
      expect(expense.currency).toBe('USD');
    });

    it('should accept different currency types', () => {
      const currencies = ['HUF', 'USD', 'EUR', 'GBP'];
      
      currencies.forEach(currency => {
        const expense: Expense = {
          id: 1,
          description: 'Test',
          amount: 100,
          date: '2024-01-01',
          currency
        };
        expect(expense.currency).toBe(currency);
      });
    });

    it('should accept different amount types', () => {
      const amounts = [0, 0.01, 100, 999.99, 1000000];
      
      amounts.forEach(amount => {
        const expense: Expense = {
          id: 1,
          description: 'Test',
          amount,
          date: '2024-01-01',
          currency: 'USD'
        };
        expect(expense.amount).toBe(amount);
      });
    });

    it('should accept different date formats', () => {
      const dates = ['2024-01-01', '2024-12-31', '2023-06-15', '2025-03-20'];
      
      dates.forEach(date => {
        const expense: Expense = {
          id: 1,
          description: 'Test',
          amount: 100,
          date,
          currency: 'USD'
        };
        expect(expense.date).toBe(date);
      });
    });

    it('should accept different ID types', () => {
      const ids = [1, 2, 999, 1000000];
      
      ids.forEach(id => {
        const expense: Expense = {
          id,
          description: 'Test',
          amount: 100,
          date: '2024-01-01',
          currency: 'USD'
        };
        expect(expense.id).toBe(id);
      });
    });

    it('should accept different description types', () => {
      const descriptions = ['Simple', 'Complex description with spaces', 'Description with numbers 123', 'Description with special chars !@#$%'];
      
      descriptions.forEach(description => {
        const expense: Expense = {
          id: 1,
          description,
          amount: 100,
          date: '2024-01-01',
          currency: 'USD'
        };
        expect(expense.description).toBe(description);
      });
    });

    it('should work with all properties combined', () => {
      const expense: Expense = {
        id: 42,
        description: 'Complete test expense with all properties',
        amount: 1234.56,
        date: '2024-12-25',
        currency: 'EUR'
      };

      expect(expense.id).toBe(42);
      expect(expense.description).toBe('Complete test expense with all properties');
      expect(expense.amount).toBe(1234.56);
      expect(expense.date).toBe('2024-12-25');
      expect(expense.currency).toBe('EUR');
    });
  });
});
