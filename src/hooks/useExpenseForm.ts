import { useState, useCallback, useMemo } from 'react';
import { CURRENCY_ORDER } from '../constants/currencies';
import type { ValidCurrency } from '../constants/currencies';
import { validateExpenseForm, createNewExpense } from '../utils/formValidationUtils';
import type { FormValidationResult } from '../utils/formValidationUtils';
import { getTodayDateString } from '../utils/dateUtils';
import type { Expense } from '../types';

export interface UseExpenseFormReturn {
  // Form state
  description: string;
  amount: string;
  date: string;
  currency: string;
  errorMessage: string;
  showError: boolean;
  
  // Form actions
  setDescription: (value: string) => void;
  setAmount: (value: string) => void;
  setDate: (value: string) => void;
  setCurrency: (value: string) => void;
  setErrorMessage: (value: string) => void;
  setShowError: (value: boolean) => void;
  
  // Form utilities
  validCurrencies: readonly ValidCurrency[];
  uniqueDescriptions: string[];
  getTodayDate: () => string;
  generateUniqueId: () => number;
  validateForm: () => FormValidationResult;
  createExpense: () => { id: number; description: string; amount: number; date: string; currency: string };
  resetForm: () => void;
}

/**
 * Custom hook for managing expense form state and logic
 * Follows Single Responsibility Principle - handles only form-related logic
 */
export const useExpenseForm = (expenses: Expense[]): UseExpenseFormReturn => {
  // Form state
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [currency, setCurrency] = useState<string>('HUF');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  // Generate unique ID using crypto.randomUUID or fallback to timestamp + random
  const generateUniqueId = useCallback((): number => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return parseInt(crypto.randomUUID().replace(/\D/g, '').slice(0, 13), 10);
    }
    return Date.now() + Math.floor(Math.random() * 1000);
  }, []);

  // Extract unique descriptions from previous expenses
  const uniqueDescriptions = useMemo(() => 
    Array.from(new Set(expenses.map((expense) => expense.description))),
    [expenses]
  );

  // Validate form data
  const validateForm = useCallback((): FormValidationResult => {
    const formData = { description, amount, date, currency };
    return validateExpenseForm(formData, [...CURRENCY_ORDER]);
  }, [description, amount, date, currency]);

  // Create expense object from form data
  const createExpense = useCallback(() => {
    const formData = { description, amount, date, currency };
    const expenseData = createNewExpense(formData);
    return {
      id: generateUniqueId(),
      ...expenseData,
    };
  }, [description, amount, date, currency, generateUniqueId]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setDescription('');
    setAmount('');
    setDate(getTodayDateString());
    setCurrency('HUF');
    setErrorMessage('');
    setShowError(false);
  }, []);

  return {
    // Form state
    description,
    amount,
    date,
    currency,
    errorMessage,
    showError,
    
    // Form actions
    setDescription,
    setAmount,
    setDate,
    setCurrency,
    setErrorMessage,
    setShowError,
    
    // Form utilities
    validCurrencies: CURRENCY_ORDER,
    uniqueDescriptions,
    getTodayDate: getTodayDateString,
    generateUniqueId,
    validateForm,
    createExpense,
    resetForm,
  };
};
