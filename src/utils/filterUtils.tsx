import { Autocomplete, TextField } from '@mui/material';
import type { GridFilterOperator, GridFilterItem, GridFilterInputValueProps } from '@mui/x-data-grid';

/**
 * Creates a currency filter component for DataGrid
 * @param validCurrencies - Array of valid currency options
 * @returns GridFilterOperator for currency filtering
 */
export const createCurrencyFilterOperator = (validCurrencies: string[]): GridFilterOperator => ({
  label: 'Currency',
  value: 'currency',
  getApplyFilterFn: (filterItem: GridFilterItem) => {
    if (!filterItem.value) {
      return null;
    }
    return (params: { value: string }) => {
      return params.value === filterItem.value;
    };
  },
  InputComponent: (props: GridFilterInputValueProps) => {
    const value = (props.item.value as string) ?? "";
    return (
      <Autocomplete
        options={validCurrencies}
        value={value}
        ListboxProps={{
          style: { maxHeight: 36 * 5, overflowY: "auto" },
        }}
        onChange={(_, newValue) =>
          props.applyValue({ ...props.item, value: newValue ?? "" })
        }
        renderInput={(params) => (
          <TextField {...params} label="Currency" inputRef={props.focusElementRef} />
        )}
      />
    );
  },
});

/**
 * Creates a description filter operator for DataGrid
 * @returns GridFilterOperator for description filtering
 */
export const createDescriptionFilterOperator = (): GridFilterOperator => ({
  label: 'Description',
  value: 'description',
  getApplyFilterFn: (filterItem: GridFilterItem) => {
    if (!filterItem.value) {
      return null;
    }
    return (params: { value: string }) => {
      return params.value.toLowerCase().includes(filterItem.value.toLowerCase());
    };
  },
  InputComponent: (props: GridFilterInputValueProps) => (
    <TextField
      variant="standard"
      value={props.item.value || ''}
      onChange={(e) => props.applyValue({ ...props.item, value: e.target.value })}
      label="Description"
      inputRef={props.focusElementRef}
    />
  ),
});

/**
 * Creates a date filter operator for DataGrid
 * @returns GridFilterOperator for date filtering
 */
export const createDateFilterOperator = (): GridFilterOperator => ({
  label: 'Date',
  value: 'date',
  getApplyFilterFn: (filterItem: GridFilterItem) => {
    if (!filterItem.value) {
      return null;
    }
    return (params: { value: string }) => {
      return params.value === filterItem.value;
    };
  },
  InputComponent: (props: GridFilterInputValueProps) => (
    <TextField
      variant="standard"
      type="date"
      value={props.item.value || ''}
      onChange={(e) => props.applyValue({ ...props.item, value: e.target.value })}
      label="Date"
      inputRef={props.focusElementRef}
      InputLabelProps={{ shrink: true }}
    />
  ),
});

/**
 * Creates an amount filter operator for DataGrid
 * @returns GridFilterOperator for amount filtering
 */
export const createAmountFilterOperator = (): GridFilterOperator => ({
  label: 'Amount',
  value: 'amount',
  getApplyFilterFn: (filterItem: GridFilterItem) => {
    if (!filterItem.value) {
      return null;
    }
    return (params: { value: string }) => {
      return params.value === filterItem.value;
    };
  },
  InputComponent: (props: GridFilterInputValueProps) => (
    <TextField
      variant="standard"
      type="number"
      value={props.item.value || ''}
      onChange={(e) => props.applyValue({ ...props.item, value: e.target.value })}
      label="Amount"
      inputRef={props.focusElementRef}
    />
  ),
});
