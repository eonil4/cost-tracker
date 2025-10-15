import type { Expense } from '../types';

export interface FormValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface EditFormData {
  description: string;
  amount: string;
  date: string;
  currency: string;
}

/**
 * Core validation logic for expense form data
 * @param formData - The form data to validate
 * @param validCurrencies - Array of valid currencies
 * @returns Validation result with error message if invalid
 */
const validateExpenseFormData = (
  formData: EditFormData,
  validCurrencies: string[]
): FormValidationResult => {
  // Check if all fields are filled
  if (!formData.description.trim() || !formData.amount || !formData.date || !formData.currency) {
    return {
      isValid: false,
      errorMessage: "Please fill in all fields."
    };
  }

  // Validate currency
  if (!validCurrencies.includes(formData.currency)) {
    return {
      isValid: false,
      errorMessage: "Please select a valid currency."
    };
  }

  // Validate amount is a positive number
  const parsedAmount = parseFloat(formData.amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid positive amount."
    };
  }

  return { isValid: true };
};

/**
 * Validates edit form data
 * @param formData - The form data to validate
 * @param validCurrencies - Array of valid currencies
 * @returns Validation result with error message if invalid
 */
export const validateEditForm = (
  formData: EditFormData,
  validCurrencies: string[]
): FormValidationResult => {
  return validateExpenseFormData(formData, validCurrencies);
};

/**
 * Creates updated expense object from form data
 * @param formData - The form data
 * @returns Updated expense object without ID
 */
export const createUpdatedExpense = (formData: EditFormData): Omit<Expense, 'id'> => {
  return {
    description: formData.description.trim(),
    amount: parseFloat(formData.amount),
    date: formData.date,
    currency: formData.currency,
  };
};

/**
 * Validates expense form data
 * @param formData - The form data to validate
 * @param validCurrencies - Array of valid currencies
 * @returns Validation result with error message if invalid
 */
export const validateExpenseForm = (
  formData: EditFormData,
  validCurrencies: string[]
): FormValidationResult => {
  return validateExpenseFormData(formData, validCurrencies);
};

/**
 * Creates new expense object from form data
 * @param formData - The form data
 * @returns New expense object without ID
 */
export const createNewExpense = (formData: EditFormData): Omit<Expense, 'id'> => {
  return {
    description: formData.description.trim(),
    amount: parseFloat(formData.amount),
    date: formData.date,
    currency: formData.currency,
  };
};
