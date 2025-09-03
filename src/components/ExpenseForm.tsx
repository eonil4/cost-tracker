import React, { useState, useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";

const ExpenseForm: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { addExpense, expenses } = context;

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero
    const day = String(today.getDate()).padStart(2, "0"); // Add leading zero
    return `${year}-${month}-${day}`;
  };

  // Form state
  const [description, setDescription] = useState<string>(""); // State for description
  const [amount, setAmount] = useState<string>(""); // State for amount
  const [date, setDate] = useState<string>(getTodayDate()); // Default date is today
  const [currency, setCurrency] = useState<string>("HUF"); // Default currency

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (!description || !amount || !date || !currency) {
      alert("Please fill in all fields.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      date,
      currency,
    };

    // Add the new expense to the context
    addExpense(newExpense);

    // Reset form fields
    setDescription("");
    setAmount("");
    setDate(getTodayDate()); // Reset date to today
    setCurrency("HUF");
  };

  // Extract unique descriptions from previous expenses
  const uniqueDescriptions = Array.from(
    new Set(expenses.map((expense) => expense.description))
  );

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Autocomplete for Description */}
        <Autocomplete
          options={uniqueDescriptions} // Options for autocomplete
          freeSolo // Allow custom input
          value={description} // Bind to description state
          onInputChange={(_, newInputValue) => setDescription(newInputValue)} // Update description on input change
          renderInput={(params) => (
            <TextField {...params} label="Description" variant="outlined" fullWidth />
          )}
        />
        {/* Amount Input */}
        <TextField
          label="Amount"
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
        />
        {/* Date Input */}
        <TextField
          label="Date"
          variant="outlined"
          type="date"
          value={date} // Default date is today
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        {/* Currency Selector */}
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            label="Currency"
            readOnly
          >
            <MenuItem value="HUF">HUF</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
          </Select>
        </FormControl>
        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          Add Expense
        </Button>
      </Box>
    </form>
  );
};

export default ExpenseForm;