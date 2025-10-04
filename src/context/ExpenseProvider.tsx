import React, { useState, useEffect, type ReactNode } from "react";
import { ExpenseContext } from "./ExpenseContext";
import type { Expense } from "../types";

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  // Load persisted expenses safely and defensively
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const savedExpenses = window.localStorage.getItem("expenses");
      if (!savedExpenses) return [];
      const parsed = JSON.parse(savedExpenses);
      return Array.isArray(parsed) ? (parsed as Expense[]) : [];
    } catch {
      // Corrupted or inaccessible storage; start fresh
      return [];
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("expenses", JSON.stringify(expenses));
      }
    } catch {
      // Ignore storage write failures
    }
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  const deleteExpense = (id: number) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};