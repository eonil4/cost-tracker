import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { 
  createCurrencyFilterOperator, 
  createDescriptionFilterOperator, 
  createDateFilterOperator, 
  createAmountFilterOperator 
} from '../../../src/utils/filterUtils';

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Autocomplete: ({ options, value, ...props }: Record<string, unknown>) => (
    <div data-testid="autocomplete" data-options={JSON.stringify(options)} data-value={value} {...props} />
  ),
  TextField: ({ label, type, value, onChange, inputRef, ...props }: Record<string, unknown>) => (
    <div data-testid="textfield" data-label={label} data-type={type} data-value={value} {...props}>
      <input 
        type={type} 
        value={value || ''} 
        onChange={onChange}
        ref={inputRef}
        data-testid="textfield-input"
      />
    </div>
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

    it('should handle input changes in amount filter', () => {
      const operator = createAmountFilterOperator();
      const mockApplyValue = vi.fn();
      const mockProps = {
        item: { value: '100' },
        applyValue: mockApplyValue,
        focusElementRef: null
      };
      
      const InputComponent = operator.InputComponent;
      render(<InputComponent {...mockProps} />);
      
      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
      
      fireEvent.change(input!, { target: { value: '200' } });
      
      expect(mockApplyValue).toHaveBeenCalledWith({ value: '200' });
    });
  });

  describe('InputComponent rendering', () => {
    it('should render date filter input with correct props', () => {
      const operator = createDateFilterOperator();
      const mockProps = {
        item: { value: '2024-01-01' },
        applyValue: vi.fn(),
        focusElementRef: null
      };
      
      const InputComponent = operator.InputComponent;
      render(<InputComponent {...mockProps} />);
      
      const input = document.querySelector('input[type="date"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('2024-01-01');
    });

    it('should render amount filter input with correct props', () => {
      const operator = createAmountFilterOperator();
      const mockProps = {
        item: { value: '100' },
        applyValue: vi.fn(),
        focusElementRef: null
      };
      
      const InputComponent = operator.InputComponent;
      render(<InputComponent {...mockProps} />);
      
      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(100);
    });

    it('should handle empty values in input components', () => {
      const operator = createDateFilterOperator();
      const mockProps = {
        item: { value: '' },
        applyValue: vi.fn(),
        focusElementRef: null
      };
      
      const InputComponent = operator.InputComponent;
      render(<InputComponent {...mockProps} />);
      
      const input = document.querySelector('input[type="date"]');
      expect(input).toBeInTheDocument();
      // Note: The input might have a default value, so we just check it exists
    });
  });
});
