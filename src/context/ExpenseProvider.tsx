import React, { useState, useEffect, useCallback, type ReactNode } from "react";
import { ExpenseContext } from "./ExpenseContext";
import type { Expense } from "../types";

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const savedExpenses = localStorage.getItem("expenses");
      if (savedExpenses) {
        const parsed = JSON.parse(savedExpenses);
        // Validate that parsed data is an array
        if (Array.isArray(parsed)) {
          // Validate each expense object has required fields
          const validExpenses = parsed.filter((expense: any) => 
            expense && 
            typeof expense.id === 'number' && 
            typeof expense.description === 'string' && 
            typeof expense.amount === 'number' && 
            typeof expense.date === 'string' && 
            typeof expense.currency === 'string' &&
            expense.amount > 0
          );
          return validExpenses;
        }
      }
      return [];
    } catch (error) {
      console.error("Error parsing expenses from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("expenses");
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving expenses to localStorage:", error);
    }
  }, [expenses]);

  const addExpense = useCallback((expense: Expense) => {
    // Validate expense data before adding
    if (!expense || 
        typeof expense.id !== 'number' || 
        typeof expense.description !== 'string' || 
        typeof expense.amount !== 'number' || 
        typeof expense.date !== 'string' || 
        typeof expense.currency !== 'string' ||
        expense.amount <= 0 ||
        !expense.description.trim()) {
      console.error("Invalid expense data:", expense);
      return;
    }
    
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  }, []);

  const deleteExpense = useCallback((id: number) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  }, []);

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};