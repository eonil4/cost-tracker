import React from "react";
import { Box, IconButton } from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ActionsCellProps<T = any> {
  row: T;
  onEdit: (row: T) => void;
  onDelete: (id: number) => void;
}

const ActionsCell = <T extends { id: number }>({ row, onEdit, onDelete }: ActionsCellProps<T>) => {
  return (
    <Box display="flex" gap={1}>
      <IconButton color="primary" onClick={() => onEdit(row)} size="small">
        <FaEdit />
      </IconButton>
      <IconButton color="error" onClick={() => onDelete(row.id)} size="small">
        <FaTrash />
      </IconButton>
    </Box>
  );
};

export default ActionsCell;


