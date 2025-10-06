import React, { useContext } from "react";
import type { Expense } from "../../types";
import { ExpenseContext } from "../../context/ExpenseContext";
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import { FaTrash } from "react-icons/fa";

interface ExpenseItemProps {
  expense: Expense;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { deleteExpense } = context;

  return (
    <ListItem divider>
      <ListItemText
        primary={expense.description}
        secondary={`Date: ${expense.date} | Amount: ${expense.amount.toFixed(2)} ${expense.currency}`}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" color="error" onClick={() => deleteExpense(expense.id)}>
          <FaTrash />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ExpenseItem;


