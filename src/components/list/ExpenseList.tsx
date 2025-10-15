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
import { CURRENCY_ORDER } from "../../constants/currencies";
import { useDialog } from "../../hooks/useDialog";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { DATA_GRID_HEIGHT, DATA_GRID_MIN_WIDTH, COLUMN_WIDTHS } from "../../constants/ui";

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
  const validCurrencies = CURRENCY_ORDER;

  // Custom hooks for state management
  const deleteDialog = useDialog();
  const editDialog = useDialog();
  const errorHandler = useErrorHandler();

  // State for managing selected expense
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDescription, setEditDescription] = useState<string>("");
  const [editAmount, setEditAmount] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");
  const [editCurrency, setEditCurrency] = useState<string>("HUF");


  // Open the confirmation dialog
  const handleOpenDialog = (id: number) => {
    setSelectedExpenseId(id);
    deleteDialog.open();
  };

  // Close the confirmation dialog
  const handleCloseDialog = () => {
    deleteDialog.close();
    setSelectedExpenseId(null);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    if (selectedExpenseId !== null) {
      deleteExpense(selectedExpenseId);
    }
    handleCloseDialog();
  };

  // Open the edit dialog
  const handleOpenEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDescription(expense.description);
    setEditAmount(expense.amount.toString());
    setEditDate(expense.date);
    setEditCurrency(expense.currency);
    editDialog.open();
  };

  // Close the edit dialog
  const handleCloseEditDialog = () => {
    editDialog.close();
    setEditingExpense(null);
    setEditDescription("");
    setEditAmount("");
    setEditDate("");
    setEditCurrency("HUF");
    errorHandler.clearError();
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

    const validation = validateEditForm(formData, [...validCurrencies]);
    if (!validation.isValid) {
      errorHandler.setError(validation.errorMessage || "Please fill in all fields.");
      return;
    }

    const updatedExpense = createUpdatedExpense(formData);
    updateExpense(editingExpense.id, updatedExpense);
    handleCloseEditDialog();
  };

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "description", headerName: "Description", flex: 2, minWidth: COLUMN_WIDTHS.DESCRIPTION },
    { field: "amount", headerName: "Amount", type: "number", width: COLUMN_WIDTHS.AMOUNT, align: "right", headerAlign: "right" },
    { field: "currency", headerName: "Currency", width: COLUMN_WIDTHS.CURRENCY },
    {
      field: "date",
      headerName: "Date",
      width: COLUMN_WIDTHS.DATE,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionsCell row={params.row} onEdit={handleOpenEditDialog} onDelete={(id) => handleOpenDialog(id)} />
      ),
      width: COLUMN_WIDTHS.ACTIONS,
      hideable: false,
    },
  ];

  return (
    <div style={{ height: DATA_GRID_HEIGHT, marginTop: "1rem", width: "100%", overflow: "auto" }}>
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
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        autoHeight={false}
        disableColumnMenu={false}
        disableColumnFilter={false}
        disableColumnSelector={false}
        columnVisibilityModel={{}}
        sx={{
          '& .MuiDataGrid-root': {
            minWidth: `${DATA_GRID_MIN_WIDTH}px`,
          },
          '& .MuiDataGrid-main': {
            overflow: 'auto',
          },
          '& .MuiDataGrid-virtualScroller': {
            overflow: 'auto',
          }
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmDeleteDialog open={deleteDialog.isOpen} onClose={handleCloseDialog} onConfirm={handleConfirmDelete} />

      {/* Edit Dialog */}
      <EditExpenseDialog
        open={editDialog.isOpen}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditSubmit}
        validCurrencies={[...validCurrencies]}
        uniqueDescriptions={[]}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        editAmount={editAmount}
        setEditAmount={setEditAmount}
        editDate={editDate}
        setEditDate={setEditDate}
        editCurrency={editCurrency}
        setEditCurrency={setEditCurrency}
        showError={errorHandler.showError}
        setShowError={(open: boolean) => errorHandler.setError(open ? errorHandler.errorMessage : '')}
        errorMessage={errorHandler.errorMessage}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={errorHandler.showError}
        autoHideDuration={6000}
        onClose={errorHandler.clearError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={errorHandler.clearError} severity="error" sx={{ width: '100%' }}>
          {errorHandler.errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ExpenseList;



