import React, { useContext, useState } from "react";
import { ExpenseContext } from "../../context/ExpenseContext";
import { 
  DataGrid, 
  type GridColDef, 
  GridToolbarQuickFilter,
  GridToolbarContainer 
} from "@mui/x-data-grid";
import { Alert, Snackbar } from "@mui/material";
import type { Expense } from "../../types";
import ActionsCell from "./ActionsCell";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import EditExpenseDialog from "./EditExpenseDialog";
import { validateEditForm, createUpdatedExpense } from "../../utils/formValidationUtils";

// Custom toolbar with quick filter
const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ padding: 1 }}>
      <GridToolbarQuickFilter 
        quickFilterParser={(searchInput) => searchInput.split(' ')}
        debounceMs={300}
      />
    </GridToolbarContainer>
  );
};

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

  // Extract unique descriptions from existing expenses for autocomplete options
  // Note: uniqueDescriptions removed since we're not using custom filter operators


  // Note: DescriptionFilterInput removed since we're not using custom filter operators


  // Note: Filter operators removed to fix quick filter functionality
  // Custom filter operators were interfering with the quick filter

  // Note: Date filter operators also removed to fix quick filter functionality

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

    const formData = {
      description: editDescription,
      amount: editAmount,
      date: editDate,
      currency: editCurrency,
    };

    const validation = validateEditForm(formData, validCurrencies);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || "Please fill in all fields.");
      setShowError(true);
      return;
    }

    const updatedExpense = createUpdatedExpense(formData);
    updateExpense(editingExpense.id, updatedExpense);
    handleCloseEditDialog();
  };

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "description", headerName: "Description", flex: 1, minWidth: 280 },
    { field: "amount", headerName: "Amount", type: "number", width: 140, align: "right", headerAlign: "right" },
    { field: "currency", headerName: "Currency", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionsCell row={params.row} onEdit={handleOpenEditDialog} onDelete={(id) => handleOpenDialog(id)} />
      ),
      flex: 0.8,
      minWidth: 120, // Ensure actions column has minimum width
      hideable: false, // Prevent hiding the actions column
    },
  ];

  return (
    <div style={{ height: 400, marginTop: "2rem", width: "100%", minWidth: "800px" }}>
      <DataGrid
        rows={expenses}
        columns={columns}
        slots={{
          toolbar: CustomToolbar,
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
          sorting: {
            sortModel: [{ field: "date", sort: "desc" }],
          },
          filter: {
            filterModel: { 
              items: [],
              quickFilterValues: []
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row.id} // Use the `id` field as the unique identifier
        disableRowSelectionOnClick
        autoHeight={false}
        disableColumnMenu={false}
        disableColumnFilter={false}
        disableColumnSelector={false}
        columnVisibilityModel={{}} // Ensure all columns are visible by default
        sx={{
          '& .MuiDataGrid-root': {
            minWidth: '800px', // Force minimum width to prevent column hiding
          }
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmDeleteDialog open={open} onClose={handleCloseDialog} onConfirm={handleConfirmDelete} />

      {/* Edit Dialog */}
      <EditExpenseDialog
        open={editOpen}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditSubmit}
        validCurrencies={validCurrencies}
        uniqueDescriptions={[]}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        editAmount={editAmount}
        setEditAmount={setEditAmount}
        editDate={editDate}
        setEditDate={setEditDate}
        editCurrency={editCurrency}
        setEditCurrency={setEditCurrency}
        showError={showError}
        setShowError={setShowError}
        errorMessage={errorMessage}
      />

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



