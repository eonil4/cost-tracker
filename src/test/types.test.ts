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
  });
});
