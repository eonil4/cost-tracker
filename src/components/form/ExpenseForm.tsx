import React, { useState, useContext, useCallback, useMemo } from "react";
import { ExpenseContext } from "../../context/ExpenseContext";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  Alert,
  Snackbar,
} from "@mui/material";
import { handleAutocompleteChange, renderAutocompleteInput } from "../../utils/autocompleteUtils";

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

  // Valid currencies
  const validCurrencies = useMemo(() => ["HUF", "USD", "EUR", "GBP"], []);

  // Form state
  const [description, setDescription] = useState<string>(""); // State for description
  const [amount, setAmount] = useState<string>(""); // State for amount
  const [date, setDate] = useState<string>(getTodayDate()); // Default date is today
  const [currency, setCurrency] = useState<string>("HUF"); // Default currency
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error messages
  const [showError, setShowError] = useState<boolean>(false); // State for showing error snackbar

  // Generate unique ID using crypto.randomUUID or fallback to timestamp + random
  const generateUniqueId = useCallback((): number => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      // Use crypto.randomUUID for better uniqueness
      return parseInt(crypto.randomUUID().replace(/\D/g, '').slice(0, 13), 10);
    }
    // Fallback: timestamp + random number to reduce collision risk
    return Date.now() + Math.floor(Math.random() * 1000);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Validate form inputs
    if (!description.trim() || !amount || !date || !currency) {
      setErrorMessage("Please fill in all fields.");
      setShowError(true);
      return;
    }

    // Validate currency
    if (!validCurrencies.includes(currency)) {
      setErrorMessage("Please select a valid currency.");
      setShowError(true);
      return;
    }

    // Validate amount is a positive number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid positive amount.");
      setShowError(true);
      return;
    }

    const newExpense = {
      id: generateUniqueId(),
      description: description.trim(),
      amount: parsedAmount,
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
  }, [description, amount, date, currency, validCurrencies, addExpense, generateUniqueId]);

  // Extract unique descriptions from previous expenses
  const uniqueDescriptions = useMemo(() => 
    Array.from(new Set(expenses.map((expense) => expense.description))),
    [expenses]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Autocomplete for Description */}
        <Autocomplete
          options={uniqueDescriptions}
          freeSolo
          inputValue={description}
          onInputChange={(_, newInputValue) => setDescription(newInputValue)}
          // Ensure selected option also updates input when user picks from list
          onChange={(_, newValue) => handleAutocompleteChange(newValue, setDescription)}
          renderInput={(params) => renderAutocompleteInput(params, "Description")}
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
          >
            {validCurrencies.map((curr) => (
              <MenuItem key={curr} value={curr}>
                {curr}
              </MenuItem>
            ))}
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
      
      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default ExpenseForm;


