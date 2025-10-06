import { describe, it, expect } from 'vitest';
import { 
  validateEditForm, 
  createUpdatedExpense, 
  validateExpenseForm, 
  createNewExpense 
} from '../../utils/formValidationUtils';

describe('formValidationUtils', () => {
  const validCurrencies = ['USD', 'EUR', 'HUF'];

  describe('validateEditForm', () => {
    it('should return valid for correct form data', () => {
      const formData = {
        description: 'Test expense',
        amount: '100',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should return invalid for empty description', () => {
      const formData = {
        description: '',
        amount: '100',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please fill in all fields.');
    });

    it('should return invalid for whitespace-only description', () => {
      const formData = {
        description: '   ',
        amount: '100',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please fill in all fields.');
    });

    it('should return invalid for empty amount', () => {
      const formData = {
        description: 'Test expense',
        amount: '',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please fill in all fields.');
    });

    it('should return invalid for empty date', () => {
      const formData = {
        description: 'Test expense',
        amount: '100',
        date: '',
        currency: 'USD'
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please fill in all fields.');
    });

    it('should return invalid for empty currency', () => {
      const formData = {
        description: 'Test expense',
        amount: '100',
        date: '2024-01-01',
        currency: ''
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please fill in all fields.');
    });

    it('should return invalid for invalid currency', () => {
      const formData = {
        description: 'Test expense',
        amount: '100',
        date: '2024-01-01',
        currency: 'INVALID'
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please select a valid currency.');
    });

    it('should return invalid for zero amount', () => {
      const formData = {
        description: 'Test expense',
        amount: '0',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid positive amount.');
    });

    it('should return invalid for negative amount', () => {
      const formData = {
        description: 'Test expense',
        amount: '-100',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid positive amount.');
    });

    it('should return invalid for non-numeric amount', () => {
      const formData = {
        description: 'Test expense',
        amount: 'abc',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = validateEditForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid positive amount.');
    });
  });

  describe('createUpdatedExpense', () => {
    it('should create updated expense object correctly', () => {
      const formData = {
        description: '  Test expense  ',
        amount: '100.50',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = createUpdatedExpense(formData);
      expect(result).toEqual({
        description: 'Test expense',
        amount: 100.50,
        date: '2024-01-01',
        currency: 'USD'
      });
    });

    it('should trim description whitespace', () => {
      const formData = {
        description: '   Test   ',
        amount: '100',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = createUpdatedExpense(formData);
      expect(result.description).toBe('Test');
    });
  });

  describe('validateExpenseForm', () => {
    it('should return valid for correct form data', () => {
      const formData = {
        description: 'Test expense',
        amount: '100',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = validateExpenseForm(formData, validCurrencies);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should return invalid for empty description', () => {
      const formData = {
        description: '',
        amount: '100',
        date: '2024-01-01',
        currency: 'USD'
      };

      const result = validateExpenseForm(formData, validCurrencies);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please fill in all fields.');
    });
  });

  describe('createNewExpense', () => {
    it('should create new expense object correctly', () => {
      const formData = {
        description: '  New expense  ',
        amount: '200.75',
        date: '2024-02-01',
        currency: 'EUR'
      };

      const result = createNewExpense(formData);
      expect(result).toEqual({
        description: 'New expense',
        amount: 200.75,
        date: '2024-02-01',
        currency: 'EUR'
      });
    });
  });
});
