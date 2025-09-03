import React, { useContext, useState } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { FaTrash } from "react-icons/fa";

const ExpenseList: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { expenses, deleteExpense } = context;

  // State for managing the confirmation dialog
  const [open, setOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

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
        <IconButton
          color="error"
          onClick={() => handleOpenDialog(params.row.id)} // Open the confirmation dialog
        >
          <FaTrash />
        </IconButton>
      ),
      flex: 0.5,
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
    </div>
  );
};

export default ExpenseList;
/*
import React, { useContext } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { FaTrash } from "react-icons/fa";

const ExpenseList: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { expenses, deleteExpense } = context;

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "description", headerName: "Description", flex: 1 },
    { field: "amount", headerName: "Amount", type: "number", flex: 1 },
    { field: "currency", headerName: "Currency", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      // Display the date as a string (no transformation)
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => deleteExpense(params.row.id)} // Call deleteExpense with the row ID
        >
          <FaTrash />
        </IconButton>
      ),
      flex: 0.5,
    },
  ];

  return (
    <div style={{ height: 400, marginTop: "2rem" }}>
      <DataGrid
        rows={expenses}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
          sorting: {
            sortModel: [{ field: "date", sort: "desc" }],
          },
        }}
        getRowId={(row) => row.id} // Use the `id` field as the unique identifier
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default ExpenseList;
*/