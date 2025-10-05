import React, { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { 
  IconButton, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Snackbar
} from "@mui/material";
import { FaTrash, FaEdit } from "react-icons/fa";
import type { Expense } from "../types";

const ExpenseList: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { expenses, deleteExpense, updateExpense } = context;

  // Valid currencies
  const validCurrencies = ["HUF", "USD", "EUR", "GBP"];

  // State for managing the confirmation dialog
  const [open, setOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

  // State for managing the edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDescription, setEditDescription] = useState<string>("");
  const [editAmount, setEditAmount] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");
  const [editCurrency, setEditCurrency] = useState<string>("HUF");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  // Open the confirmation dialog
  const handleOpenDialog = (id: number) => {
    setSelectedExpenseId(id); // Store the ID of the expense to be deleted
    setOpen(true); // Open the dialog
  };

  // Close the confirmation dialog
  const handleCloseDialog = () => {
    setOpen(false); // Close the dialog
    setSelectedExpenseId(null); // Clear the selected expense ID
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (selectedExpenseId !== null) {
      deleteExpense(selectedExpenseId); // Delete the expense
    }
    handleCloseDialog(); // Close the dialog
  };

  // Open the edit dialog
  const handleOpenEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDescription(expense.description);
    setEditAmount(expense.amount.toString());
    setEditDate(expense.date);
    setEditCurrency(expense.currency);
    setEditOpen(true);
  };

  // Close the edit dialog
  const handleCloseEditDialog = () => {
    setEditOpen(false);
    setEditingExpense(null);
    setEditDescription("");
    setEditAmount("");
    setEditDate("");
    setEditCurrency("HUF");
    setErrorMessage("");
    setShowError(false);
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    if (!editingExpense) return;

    // Validate form inputs
    if (!editDescription.trim() || !editAmount || !editDate || !editCurrency) {
      setErrorMessage("Please fill in all fields.");
      setShowError(true);
      return;
    }

    // Validate currency
    if (!validCurrencies.includes(editCurrency)) {
      setErrorMessage("Please select a valid currency.");
      setShowError(true);
      return;
    }

    // Validate amount is a positive number
    const parsedAmount = parseFloat(editAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid positive amount.");
      setShowError(true);
      return;
    }

    const updatedExpense = {
      description: editDescription.trim(),
      amount: parsedAmount,
      date: editDate,
      currency: editCurrency,
    };

    updateExpense(editingExpense.id, updatedExpense);
    handleCloseEditDialog();
  };

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "description", headerName: "Description", flex: 1 },
    { field: "amount", headerName: "Amount", type: "number", flex: 1 },
    { field: "currency", headerName: "Currency", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            onClick={() => handleOpenEditDialog(params.row)} // Open the edit dialog
            size="small"
          >
            <FaEdit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleOpenDialog(params.row.id)} // Open the confirmation dialog
            size="small"
          >
            <FaTrash />
          </IconButton>
        </Box>
      ),
      flex: 0.8,
    },
  ];

  return (
    <div style={{ height: 400, marginTop: "2rem" }}>
      <DataGrid
        rows={expenses}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
          sorting: {
            sortModel: [{ field: "date", sort: "desc" }],
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row.id} // Use the `id` field as the unique identifier
        disableRowSelectionOnClick
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
      >
        <DialogTitle id="confirm-delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-dialog-description">
            Are you sure you want to delete this expense? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-expense-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="edit-expense-dialog-title">Edit Expense</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
            {/* Description Input */}
            <TextField
              label="Description"
              variant="outlined"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              fullWidth
            />
            {/* Amount Input */}
            <TextField
              label="Amount"
              variant="outlined"
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              fullWidth
            />
            {/* Date Input */}
            <TextField
              label="Date"
              variant="outlined"
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            {/* Currency Selector */}
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={editCurrency}
                onChange={(e) => setEditCurrency(e.target.value)}
                label="Currency"
              >
                {validCurrencies.map((curr) => (
                  <MenuItem key={curr} value={curr}>
                    {curr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
};

export default ExpenseList;