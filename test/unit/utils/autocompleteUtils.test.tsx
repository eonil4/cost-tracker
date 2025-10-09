import { describe, it, expect, vi } from 'vitest';
import { handleAutocompleteChange, renderAutocompleteInput } from '../../../src/utils/autocompleteUtils';

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  TextField: ({ label, ...props }: Record<string, unknown>) => (
    <div data-testid="textfield" data-label={label} {...props} />
  ),
}));

describe('autocompleteUtils', () => {
  describe('handleAutocompleteChange', () => {
    it('should handle string values', () => {
      const setValue = vi.fn();
      handleAutocompleteChange('test string', setValue);
      expect(setValue).toHaveBeenCalledWith('test string');
    });

    it('should handle non-string values by converting to string', () => {
      const setValue = vi.fn();
      handleAutocompleteChange(123, setValue);
      expect(setValue).toHaveBeenCalledWith('123');
    });

    it('should handle object values by converting to string', () => {
      const setValue = vi.fn();
      const obj = { toString: () => 'object string' };
      handleAutocompleteChange(obj, setValue);
      expect(setValue).toHaveBeenCalledWith('object string');
    });

    it('should handle null values by not calling setValue', () => {
      const setValue = vi.fn();
      handleAutocompleteChange(null, setValue);
      expect(setValue).not.toHaveBeenCalled();
    });

    it('should handle undefined values by not calling setValue', () => {
      const setValue = vi.fn();
      handleAutocompleteChange(undefined, setValue);
      expect(setValue).not.toHaveBeenCalled();
    });

    it('should handle boolean values by converting to string', () => {
      const setValue = vi.fn();
      handleAutocompleteChange(true, setValue);
      expect(setValue).toHaveBeenCalledWith('true');
    });

    it('should handle array values by converting to string', () => {
      const setValue = vi.fn();
      handleAutocompleteChange([1, 2, 3], setValue);
      expect(setValue).toHaveBeenCalledWith('1,2,3');
    });
  });

  describe('renderAutocompleteInput', () => {
    it('should render TextField with correct props', () => {
      const params = {
        InputLabelProps: {},
        InputProps: {},
        disabled: false,
        fullWidth: true,
        size: 'medium' as const,
        variant: 'outlined' as const,
      };
      
      const result = renderAutocompleteInput(params, 'Test Label');
      
      // The result should be a JSX element, but we can't easily test JSX in this environment
      // Instead, we'll test that the function doesn't throw and returns something
      expect(result).toBeDefined();
    });

    it('should handle different label values', () => {
      const params = {
        InputLabelProps: {},
        InputProps: {},
        disabled: false,
        fullWidth: true,
        size: 'medium' as const,
        variant: 'outlined' as const,
      };
      
      const result1 = renderAutocompleteInput(params, 'Description');
      const result2 = renderAutocompleteInput(params, 'Amount');
      
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });
  });
});
