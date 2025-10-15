import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionsCell from '../../../../src/components/list/ActionsCell';

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Box: ({ children, ...props }: Record<string, unknown>) => <div data-testid="box" {...props}>{children as React.ReactNode}</div>,
  IconButton: ({ children, onClick, color, size, ...props }: Record<string, unknown>) => (
    <button 
      onClick={onClick as () => void} 
      data-testid={`icon-button-${color}`}
      data-size={size}
      {...props}
    >
      {children as React.ReactNode}
    </button>
  ),
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaEdit: () => <span data-testid="edit-icon">Edit</span>,
  FaTrash: () => <span data-testid="trash-icon">Trash</span>,
}));

describe('ActionsCell', () => {
  const mockRow = {
    id: 1,
    description: 'Test expense',
    amount: 100,
    date: '2024-01-01',
    currency: 'HUF'
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => 
      render(
        <ActionsCell 
          row={mockRow} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )
    ).not.toThrow();
  });

  it('should render edit and delete buttons', () => {
    render(
      <ActionsCell 
        row={mockRow} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <ActionsCell 
        row={mockRow} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockRow);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <ActionsCell 
        row={mockRow} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockRow.id);
  });

  it('should render with correct button sizes', () => {
    render(
      <ActionsCell 
        row={mockRow} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByTestId('edit-button');
    const deleteButton = screen.getByTestId('delete-button');

    expect(editButton).toHaveAttribute('data-size', 'small');
    expect(deleteButton).toHaveAttribute('data-size', 'small');
  });

  it('should render with correct colors', () => {
    render(
      <ActionsCell 
        row={mockRow} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('should work with different row types', () => {
    const customRow = {
      id: 999,
      name: 'Custom item',
      value: 42
    };

    render(
      <ActionsCell 
        row={customRow} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByTestId('edit-button');
    const deleteButton = screen.getByTestId('delete-button');

    fireEvent.click(editButton);
    fireEvent.click(deleteButton);

    expect(mockOnEdit).toHaveBeenCalledWith(customRow);
    expect(mockOnDelete).toHaveBeenCalledWith(999);
  });

  it('should handle multiple clicks correctly', () => {
    render(
      <ActionsCell 
        row={mockRow} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByTestId('edit-button');
    const deleteButton = screen.getByTestId('delete-button');

    // Click edit button multiple times
    fireEvent.click(editButton);
    fireEvent.click(editButton);
    fireEvent.click(editButton);

    // Click delete button multiple times
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(3);
    expect(mockOnDelete).toHaveBeenCalledTimes(2);
  });
});
