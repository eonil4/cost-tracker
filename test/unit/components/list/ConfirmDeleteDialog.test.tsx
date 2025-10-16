import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDeleteDialog from '../../../../src/components/list/ConfirmDeleteDialog';

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Dialog: ({ children, open, ...props }: Record<string, unknown>) => 
    open ? <div data-testid="dialog" {...props}>{children as React.ReactNode}</div> : null,
  DialogTitle: ({ children, ...props }: Record<string, unknown>) => <div data-testid="dialog-title" {...props}>{children as React.ReactNode}</div>,
  DialogContent: ({ children, ...props }: Record<string, unknown>) => <div data-testid="dialog-content" {...props}>{children as React.ReactNode}</div>,
  DialogContentText: ({ children, ...props }: Record<string, unknown>) => <div data-testid="dialog-content-text" {...props}>{children as React.ReactNode}</div>,
  DialogActions: ({ children, ...props }: Record<string, unknown>) => <div data-testid="dialog-actions" {...props}>{children as React.ReactNode}</div>,
  Button: ({ children, onClick, color, ...props }: Record<string, unknown>) => (
    <button 
      onClick={onClick as () => void} 
      data-testid={`button-${color || 'default'}`}
      {...props}
    >
      {children as React.ReactNode}
    </button>
  ),
  Typography: ({ children, ...props }: Record<string, unknown>) => {
    // Render text content for specific patterns
    const textContent = children as string;
    if (textContent && typeof textContent === 'string') {
      if (textContent.includes('Confirm Deletion') || 
          textContent.includes('Are you sure you want to delete this expense?') ||
          textContent.includes('Cancel') ||
          textContent.includes('Delete')) {
        return <div data-testid="typography" {...props}>{textContent}</div>;
      }
    }
    return <div data-testid="typography" {...props}>{children as React.ReactNode}</div>;
  },
}));

describe('ConfirmDeleteDialog', () => {
  const mockOnConfirm = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => 
      render(
        <ConfirmDeleteDialog
          open={true}
          onConfirm={mockOnConfirm}
          onClose={mockOnClose}
        />
      )
    ).not.toThrow();
  });

  it('should not render when closed', () => {
    render(
      <ConfirmDeleteDialog
        open={false}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-actions')).toBeInTheDocument();
  });

  it('should display correct title and message', () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this expense? This action cannot be undone.')).toBeInTheDocument();
  });

  it('should render cancel and delete buttons', () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('button-primary')).toBeInTheDocument();
    expect(screen.getByTestId('button-error')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByTestId('button-primary');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should call onConfirm when delete button is clicked', () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const deleteButton = screen.getByTestId('button-error');
    fireEvent.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should render dialog when open', () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const dialog = screen.getByTestId('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should handle multiple button clicks correctly', () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    const cancelButton = screen.getByTestId('button-primary');
    const deleteButton = screen.getByTestId('button-error');

    // Click cancel multiple times
    fireEvent.click(cancelButton);
    fireEvent.click(cancelButton);

    // Click delete multiple times
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    expect(mockOnClose).toHaveBeenCalledTimes(2);
    expect(mockOnConfirm).toHaveBeenCalledTimes(2);
  });
});
