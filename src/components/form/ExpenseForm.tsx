import React, { useContext, useCallback } from "react";
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
import { useExpenseForm } from "../../hooks/useExpenseForm";

const ExpenseForm: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { addExpense, expenses } = context;
  
  // Use custom hook for form logic
  const {
    description,
    amount,
    date,
    currency,
    errorMessage,
    showError,
    setDescription,
    setAmount,
    setDate,
    setCurrency,
    setErrorMessage,
    setShowError,
    validCurrencies,
    uniqueDescriptions,
    validateForm,
    createExpense,
    resetForm,
  } = useExpenseForm(expenses);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || "Please fill in all fields.");
      setShowError(true);
      return;
    }

    const newExpense = createExpense();
    addExpense(newExpense);
    resetForm();
  }, [validateForm, createExpense, addExpense, resetForm, setErrorMessage, setShowError]);

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
            data-testid="currency-select"
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


