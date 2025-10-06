import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, FormControl, InputLabel, Select, MenuItem, Autocomplete, Alert, Snackbar } from "@mui/material";

interface EditExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  validCurrencies: string[];
  uniqueDescriptions: string[];
  editDescription: string;
  setEditDescription: (val: string) => void;
  editAmount: string;
  setEditAmount: (val: string) => void;
  editDate: string;
  setEditDate: (val: string) => void;
  editCurrency: string;
  setEditCurrency: (val: string) => void;
  showError: boolean;
  setShowError: (open: boolean) => void;
  errorMessage: string;
}

const EditExpenseDialog: React.FC<EditExpenseDialogProps> = ({
  open,
  onClose,
  onSubmit,
  validCurrencies,
  uniqueDescriptions,
  editDescription,
  setEditDescription,
  editAmount,
  setEditAmount,
  editDate,
  setEditDate,
  editCurrency,
  setEditCurrency,
  showError,
  setShowError,
  errorMessage,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="edit-expense-dialog-title" maxWidth="sm" fullWidth>
      <DialogTitle id="edit-expense-dialog-title">Edit Expense</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
          <Autocomplete
            options={uniqueDescriptions}
            freeSolo
            inputValue={editDescription}
            onInputChange={(_, v) => setEditDescription(v)}
            onChange={(_, v) => {
              if (typeof v === "string") setEditDescription(v);
              else if (v != null) setEditDescription(String(v));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Description" variant="outlined" fullWidth />
            )}
          />
          <TextField label="Amount" variant="outlined" type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} fullWidth />
          <TextField label="Date" variant="outlined" type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Currency</InputLabel>
            <Select value={editCurrency} onChange={(e) => setEditCurrency(e.target.value)} label="Currency">
              {validCurrencies.map((curr) => (
                <MenuItem key={curr} value={curr}>{curr}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={onSubmit} color="primary" variant="contained">Update</Button>
      </DialogActions>
      <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default EditExpenseDialog;


