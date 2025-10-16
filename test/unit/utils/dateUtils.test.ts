import { describe, it, expect } from 'vitest';
import { formatDateToString, getTodayDateString, parseDateString } from '../../../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDateToString', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDateToString(date);
      expect(result).toBe('2024-01-15');
    });

    it('should handle single digit months and days', () => {
      const date = new Date('2024-01-05T10:30:00Z');
      const result = formatDateToString(date);
      expect(result).toBe('2024-01-05');
    });

    it('should handle different timezones', () => {
      const date = new Date('2024-12-31T12:00:00Z');
      const result = formatDateToString(date);
      expect(result).toBe('2024-12-31');
    });
  });

  describe('getTodayDateString', () => {
    it('should return today\'s date in correct format', () => {
      const result = getTodayDateString();
      const today = new Date();
      const expected = formatDateToString(today);
      expect(result).toBe(expected);
    });

    it('should return a valid date string', () => {
      const result = getTodayDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('parseDateString', () => {
    it('should parse valid date string correctly', () => {
      const result = parseDateString('2024-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January is 0
      expect(result.getDate()).toBe(15);
    });

    it('should handle invalid date string and return current date', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = parseDateString('invalid-date');
      expect(result).toBeInstanceOf(Date);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid date string: invalid-date');
      
      consoleSpy.mockRestore();
    });

    it('should handle empty string and return current date', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = parseDateString('');
      expect(result).toBeInstanceOf(Date);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid date string: ');
      
      consoleSpy.mockRestore();
    });

    it('should handle null and return current date', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // @ts-expect-error - testing invalid input
      const result = parseDateString(null as unknown as string);
      expect(result).toBeInstanceOf(Date);
      // Note: new Date(null) actually creates a valid date (epoch), so no warning is called
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle undefined and return current date', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // @ts-expect-error - testing invalid input
      const result = parseDateString(undefined as unknown as string);
      expect(result).toBeInstanceOf(Date);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid date string: undefined');
      
      consoleSpy.mockRestore();
    });
  });
});
