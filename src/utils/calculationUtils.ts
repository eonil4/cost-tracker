import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import type { Expense } from '../types';

/**
 * Calculates daily costs for the current week
 * @param expenses - Array of expenses
 * @returns Object with daily costs
 */
export const calculateDailyCosts = (expenses: Expense[]): Record<string, number> => {
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

  return expenses.reduce((acc, expense) => {
    const expenseDate = parseISO(expense.date);
    if (expenseDate >= startOfCurrentWeek && expenseDate <= endOfCurrentWeek) {
      const dayName = format(expenseDate, 'EEEE'); // Full day name
      acc[dayName] = (acc[dayName] || 0) + expense.amount;
    }
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Calculates weekly costs for the current month
 * @param expenses - Array of expenses
 * @returns Object with weekly costs
 */
export const calculateWeeklyCosts = (expenses: Expense[]): Record<string, number> => {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  return expenses.reduce((acc, expense) => {
    const expenseDate = parseISO(expense.date);
    if (expenseDate >= startOfCurrentMonth && expenseDate <= endOfCurrentMonth) {
      const weekStart = startOfWeek(expenseDate, { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'MMM dd');
      acc[weekKey] = (acc[weekKey] || 0) + expense.amount;
    }
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Calculates monthly costs for the current year
 * @param expenses - Array of expenses
 * @returns Object with monthly costs
 */
export const calculateMonthlyCosts = (expenses: Expense[]): Record<string, number> => {
  const currentYear = new Date().getFullYear();
  
  return expenses.reduce((acc, expense) => {
    const expenseDate = parseISO(expense.date);
    if (expenseDate.getFullYear() === currentYear) {
      const month = format(expenseDate, "MMMM"); // Group by month name
      acc[month] = (acc[month] || 0) + expense.amount;
    }
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Converts cost data to chart format
 * @param costs - Object with cost data
 * @returns Array of chart data objects
 */
export const convertCostsToChartData = (costs: Record<string, number>) => {
  return Object.entries(costs).map(([name, value]) => ({
    name,
    value,
  }));
};

/**
 * Calculates total from cost data
 * @param costs - Object with cost data
 * @returns Total sum of all costs
 */
export const calculateTotalCosts = (costs: Record<string, number>): number => {
  return Object.values(costs).reduce((sum, value) => sum + value, 0);
};

/**
 * Counts currency usage in expenses
 * @param expenses - Array of expenses
 * @returns Object with currency counts
 */
export const countCurrencies = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    acc[expense.currency] = (acc[expense.currency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};
