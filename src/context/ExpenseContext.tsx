import { createContext, useContext } from "react";
import type { Expense } from "../types";

export interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: number, updatedExpense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: number) => void;
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(
  undefined
);

export const useExpenseContext = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
};