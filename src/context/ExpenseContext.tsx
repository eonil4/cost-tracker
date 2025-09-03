import { createContext } from "react";
import type { Expense } from "../types";

export interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: number) => void;
}

export const ExpenseContext = createContext<ExpenseContextType | undefined>(
  undefined
);