import { TextField } from '@mui/material';
import type { AutocompleteRenderInputParams } from '@mui/material';

/**
 * Handles autocomplete onChange events with different value types
 * @param newValue - The new value from the autocomplete
 * @param setValue - Function to set the value
 */
export const handleAutocompleteChange = (
  newValue: unknown,
  setValue: (value: string) => void
): void => {
  if (typeof newValue === "string") {
    setValue(newValue);
  } else if (newValue != null) {
    setValue(String(newValue));
  }
};

/**
 * Renders a TextField for autocomplete input
 * @param params - Autocomplete render input parameters
 * @param label - Label for the TextField
 * @returns JSX element
 */
export const renderAutocompleteInput = (
  params: AutocompleteRenderInputParams,
  label: string
) => (
  <TextField {...params} label={label} variant="outlined" fullWidth />
);
