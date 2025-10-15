/**
 * Utility functions for date operations
 * Follows DRY principle - centralizes date-related logic
 */

/**
 * Formats a date to YYYY-MM-DD string format
 * @param date - Date object to format
 * @returns Formatted date string
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date as string
 */
export const getTodayDateString = (): string => {
  return formatDateToString(new Date());
};

/**
 * Parses a date string into a Date object with validation
 * @param dateString - Date string to parse
 * @returns Date object or current date if invalid
 */
export const parseDateString = (dateString: string): Date => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date string: ${dateString}`);
    return new Date();
  }
  return date;
};
