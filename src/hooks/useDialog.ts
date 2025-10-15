import { useState, useCallback } from 'react';

export interface UseDialogReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Custom hook for managing dialog state
 * Follows Single Responsibility Principle - handles only dialog open/close logic
 */
export const useDialog = (initialState: boolean = false): UseDialogReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};
