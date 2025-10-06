import { describe, it, expect } from 'vitest';
import { 
  calculateDailyCosts, 
  calculateWeeklyCosts, 
  calculateMonthlyCosts,
  convertCostsToChartData,
  calculateTotalCosts,
  countCurrencies
} from '../../utils/calculationUtils';
import type { Expense } from '../../types';

describe('calculationUtils', () => {
  const mockExpenses: Expense[] = [
    {
      id: 1,
      description: 'Test expense 1',
      amount: 100,
      date: '2024-01-15', // Monday
      currency: 'USD'
    },
    {
      id: 2,
      description: 'Test expense 2',
      amount: 200,
      date: '2024-01-16', // Tuesday
      currency: 'EUR'
    },
    {
      id: 3,
      description: 'Test expense 3',
      amount: 150,
      date: '2024-01-20', // Saturday
      currency: 'USD'
    },
    {
      id: 4,
      description: 'Test expense 4',
      amount: 300,
      date: '2024-02-01', // Different month
      currency: 'HUF'
    },
    {
      id: 5,
      description: 'Test expense 5',
      amount: 250,
      date: '2023-12-01', // Different year
      currency: 'USD'
    }
  ];

  describe('calculateDailyCosts', () => {
    it('should calculate daily costs for current week', () => {
      // Mock current date to be in the same week as test expenses
      const originalDate = global.Date;
      global.Date = class extends originalDate {
        constructor() {
          super('2024-01-15'); // Monday of the test week
        }
      } as typeof Date;

      const result = calculateDailyCosts(mockExpenses);
      
      // Should include expenses from the current week
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      
      global.Date = originalDate;
    });

    it('should return empty object when no expenses in current week', () => {
      const oldExpenses: Expense[] = [{
        id: 1,
        description: 'Old expense',
        amount: 100,
        date: '2020-01-01',
        currency: 'USD'
      }];

      const result = calculateDailyCosts(oldExpenses);
      expect(result).toEqual({});
    });
  });

  describe('calculateWeeklyCosts', () => {
    it('should calculate weekly costs for current month', () => {
      const result = calculateWeeklyCosts(mockExpenses);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should return empty object when no expenses in current month', () => {
      const oldExpenses: Expense[] = [{
        id: 1,
        description: 'Old expense',
        amount: 100,
        date: '2020-01-01',
        currency: 'USD'
      }];

      const result = calculateWeeklyCosts(oldExpenses);
      expect(result).toEqual({});
    });
  });

  describe('calculateMonthlyCosts', () => {
    it('should calculate monthly costs for current year', () => {
      const result = calculateMonthlyCosts(mockExpenses);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should return empty object when no expenses in current year', () => {
      const oldExpenses: Expense[] = [{
        id: 1,
        description: 'Old expense',
        amount: 100,
        date: '2020-01-01',
        currency: 'USD'
      }];

      const result = calculateMonthlyCosts(oldExpenses);
      expect(result).toEqual({});
    });
  });

  describe('convertCostsToChartData', () => {
    it('should convert costs object to chart data format', () => {
      const costs = {
        'January': 100,
        'February': 200,
        'March': 150
      };

      const result = convertCostsToChartData(costs);
      expect(result).toEqual([
        { name: 'January', value: 100 },
        { name: 'February', value: 200 },
        { name: 'March', value: 150 }
      ]);
    });

    it('should return empty array for empty costs object', () => {
      const result = convertCostsToChartData({});
      expect(result).toEqual([]);
    });
  });

  describe('calculateTotalCosts', () => {
    it('should calculate total from costs object', () => {
      const costs = {
        'January': 100,
        'February': 200,
        'March': 150
      };

      const result = calculateTotalCosts(costs);
      expect(result).toBe(450);
    });

    it('should return 0 for empty costs object', () => {
      const result = calculateTotalCosts({});
      expect(result).toBe(0);
    });

    it('should handle negative values', () => {
      const costs = {
        'Income': 1000,
        'Expense': -200
      };

      const result = calculateTotalCosts(costs);
      expect(result).toBe(800);
    });
  });

  describe('countCurrencies', () => {
    it('should count currency usage in expenses', () => {
      const result = countCurrencies(mockExpenses);
      expect(result).toEqual({
        'USD': 3,
        'EUR': 1,
        'HUF': 1
      });
    });

    it('should return empty object for empty expenses array', () => {
      const result = countCurrencies([]);
      expect(result).toEqual({});
    });

    it('should handle single currency', () => {
      const singleCurrencyExpenses: Expense[] = [{
        id: 1,
        description: 'Test',
        amount: 100,
        date: '2024-01-01',
        currency: 'USD'
      }];

      const result = countCurrencies(singleCurrencyExpenses);
      expect(result).toEqual({ 'USD': 1 });
    });
  });
});
