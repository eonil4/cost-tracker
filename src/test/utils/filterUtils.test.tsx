import { describe, it, expect, vi } from 'vitest';
import { 
  createCurrencyFilterOperator, 
  createDescriptionFilterOperator, 
  createDateFilterOperator, 
  createAmountFilterOperator 
} from '../../utils/filterUtils';

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Autocomplete: ({ options, value, ...props }: Record<string, unknown>) => (
    <div data-testid="autocomplete" data-options={JSON.stringify(options)} data-value={value} {...props} />
  ),
  TextField: ({ label, type, value, ...props }: Record<string, unknown>) => (
    <div data-testid="textfield" data-label={label} data-type={type} data-value={value} {...props} />
  ),
}));

describe('filterUtils', () => {
  describe('createCurrencyFilterOperator', () => {
    it('should create currency filter operator with correct properties', () => {
      const validCurrencies = ['USD', 'EUR', 'HUF'];
      const operator = createCurrencyFilterOperator(validCurrencies);
      
      expect(operator.label).toBe('Currency');
      expect(operator.value).toBe('currency');
      expect(operator.getApplyFilterFn).toBeDefined();
      expect(operator.InputComponent).toBeDefined();
    });

    it('should return null when filter value is empty', () => {
      const validCurrencies = ['USD', 'EUR', 'HUF'];
      const operator = createCurrencyFilterOperator(validCurrencies);
      const filterFn = operator.getApplyFilterFn({ value: '' });
      
      expect(filterFn).toBeNull();
    });

    it('should return filter function when filter value is provided', () => {
      const validCurrencies = ['USD', 'EUR', 'HUF'];
      const operator = createCurrencyFilterOperator(validCurrencies);
      const filterFn = operator.getApplyFilterFn({ value: 'USD' });
      
      expect(filterFn).toBeDefined();
      expect(typeof filterFn).toBe('function');
    });

    it('should filter correctly when value matches', () => {
      const validCurrencies = ['USD', 'EUR', 'HUF'];
      const operator = createCurrencyFilterOperator(validCurrencies);
      const filterFn = operator.getApplyFilterFn({ value: 'USD' });
      
      expect(filterFn?.({ value: 'USD' })).toBe(true);
      expect(filterFn?.({ value: 'EUR' })).toBe(false);
    });
  });

  describe('createDescriptionFilterOperator', () => {
    it('should create description filter operator with correct properties', () => {
      const operator = createDescriptionFilterOperator();
      
      expect(operator.label).toBe('Description');
      expect(operator.value).toBe('description');
      expect(operator.getApplyFilterFn).toBeDefined();
      expect(operator.InputComponent).toBeDefined();
    });

    it('should return null when filter value is empty', () => {
      const operator = createDescriptionFilterOperator();
      const filterFn = operator.getApplyFilterFn({ value: '' });
      
      expect(filterFn).toBeNull();
    });

    it('should filter correctly with case-insensitive matching', () => {
      const operator = createDescriptionFilterOperator();
      const filterFn = operator.getApplyFilterFn({ value: 'test' });
      
      expect(filterFn?.({ value: 'Test Description' })).toBe(true);
      expect(filterFn?.({ value: 'TEST DESCRIPTION' })).toBe(true);
      expect(filterFn?.({ value: 'Other Description' })).toBe(false);
    });
  });

  describe('createDateFilterOperator', () => {
    it('should create date filter operator with correct properties', () => {
      const operator = createDateFilterOperator();
      
      expect(operator.label).toBe('Date');
      expect(operator.value).toBe('date');
      expect(operator.getApplyFilterFn).toBeDefined();
      expect(operator.InputComponent).toBeDefined();
    });

    it('should return null when filter value is empty', () => {
      const operator = createDateFilterOperator();
      const filterFn = operator.getApplyFilterFn({ value: '' });
      
      expect(filterFn).toBeNull();
    });

    it('should filter correctly when date matches', () => {
      const operator = createDateFilterOperator();
      const filterFn = operator.getApplyFilterFn({ value: '2024-01-01' });
      
      expect(filterFn?.({ value: '2024-01-01' })).toBe(true);
      expect(filterFn?.({ value: '2024-01-02' })).toBe(false);
    });
  });

  describe('createAmountFilterOperator', () => {
    it('should create amount filter operator with correct properties', () => {
      const operator = createAmountFilterOperator();
      
      expect(operator.label).toBe('Amount');
      expect(operator.value).toBe('amount');
      expect(operator.getApplyFilterFn).toBeDefined();
      expect(operator.InputComponent).toBeDefined();
    });

    it('should return null when filter value is empty', () => {
      const operator = createAmountFilterOperator();
      const filterFn = operator.getApplyFilterFn({ value: '' });
      
      expect(filterFn).toBeNull();
    });

    it('should filter correctly when amount matches', () => {
      const operator = createAmountFilterOperator();
      const filterFn = operator.getApplyFilterFn({ value: '100' });
      
      expect(filterFn?.({ value: '100' })).toBe(true);
      expect(filterFn?.({ value: '200' })).toBe(false);
    });
  });
});
