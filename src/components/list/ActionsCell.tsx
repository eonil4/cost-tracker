import { Box, IconButton } from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ActionsCellProps<T = Record<string, unknown>> {
  row: T;
  onEdit: (row: T) => void;
  onDelete: (id: number) => void;
}

const ActionsCell = <T extends { id: number }>({ row, onEdit, onDelete }: ActionsCellProps<T>) => {
  return (
    <Box display="flex" gap={1}>
      <IconButton 
        color="primary" 
        onClick={() => onEdit(row)} 
        size="small"
        data-testid="edit-button"
      >
        <FaEdit />
      </IconButton>
      <IconButton 
        color="error" 
        onClick={() => onDelete(row.id)} 
        size="small"
        data-testid="delete-button"
      >
        <FaTrash />
      </IconButton>
    </Box>
  );
};

export default ActionsCell;


