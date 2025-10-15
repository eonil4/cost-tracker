import { useState, useCallback } from 'react';

export interface UseErrorHandlerReturn {
  errorMessage: string;
  showError: boolean;
  setError: (message: string) => void;
  clearError: () => void;
  showErrorForDuration: (message: string, duration?: number) => void;
}

/**
 * Custom hook for managing error state and display
 * Follows Single Responsibility Principle - handles only error-related logic
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const setError = useCallback((message: string) => {
    setErrorMessage(message);
    setShowError(true);
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage('');
    setShowError(false);
  }, []);

  const showErrorForDuration = useCallback((message: string, duration: number = 6000) => {
    setError(message);
    setTimeout(() => {
      clearError();
    }, duration);
  }, [setError, clearError]);

  return {
    errorMessage,
    showError,
    setError,
    clearError,
    showErrorForDuration,
  };
};
