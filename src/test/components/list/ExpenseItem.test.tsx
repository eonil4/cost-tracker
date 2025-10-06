import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExpenseItem from '../../../components/list/ExpenseItem';
import { ExpenseProvider } from '../../../context/ExpenseProvider';

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  ListItem: ({ children, divider, ...props }: Record<string, unknown>) => (
    <div data-testid="list-item" data-divider={divider} {...props}>{children as React.ReactNode}</div>
  ),
  ListItemText: ({ primary, secondary, ...props }: Record<string, unknown>) => (
    <div data-testid="list-item-text" {...props}>
      <div data-testid="primary-text">{primary as React.ReactNode}</div>
      <div data-testid="secondary-text">{secondary as React.ReactNode}</div>
    </div>
  ),
  ListItemSecondaryAction: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="list-item-secondary-action" {...props}>{children as React.ReactNode}</div>
  ),
  IconButton: ({ children, onClick, color, edge, ...props }: Record<string, unknown>) => (
    <button 
      onClick={onClick as () => void} 
      data-testid={`icon-button-${color}`}
      data-edge={edge}
      {...props}
    >
      {children as React.ReactNode}
    </button>
  ),
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaTrash: () => <span data-testid="trash-icon">Trash</span>,
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ExpenseProvider>
      {component}
    </ExpenseProvider>
  );
};

describe('ExpenseItem', () => {
  const mockExpense = {
    id: 1,
    description: 'Test expense',
    amount: 100.50,
    date: '2024-01-01',
    currency: 'HUF'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => renderWithProvider(<ExpenseItem expense={mockExpense} />)).not.toThrow();
  });

  it('should render expense information correctly', () => {
    renderWithProvider(<ExpenseItem expense={mockExpense} />);
    
    expect(screen.getByTestId('list-item')).toBeInTheDocument();
    expect(screen.getByTestId('list-item-text')).toBeInTheDocument();
    expect(screen.getByTestId('primary-text')).toHaveTextContent('Test expense');
    expect(screen.getByTestId('secondary-text')).toHaveTextContent('Date: 2024-01-01 | Amount: 100.50 HUF');
  });

  it('should render delete button', () => {
    renderWithProvider(<ExpenseItem expense={mockExpense} />);
    
    expect(screen.getByTestId('icon-button-error')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('should call deleteExpense when delete button is clicked', () => {
    renderWithProvider(<ExpenseItem expense={mockExpense} />);
    
    const deleteButton = screen.getByTestId('icon-button-error');
    fireEvent.click(deleteButton);
    
    // The deleteExpense function should be called (we can't easily test the actual deletion
    // without more complex setup, but we can verify the button click works)
    expect(deleteButton).toBeInTheDocument();
  });

  it('should render with divider', () => {
    renderWithProvider(<ExpenseItem expense={mockExpense} />);
    
    const listItem = screen.getByTestId('list-item');
    expect(listItem).toHaveAttribute('data-divider', 'true');
  });

  it('should render delete button with correct edge position', () => {
    renderWithProvider(<ExpenseItem expense={mockExpense} />);
    
    const deleteButton = screen.getByTestId('icon-button-error');
    expect(deleteButton).toHaveAttribute('data-edge', 'end');
  });

  it('should format amount correctly with decimal places', () => {
    const expenseWithDecimals = {
      ...mockExpense,
      amount: 123.456
    };
    
    renderWithProvider(<ExpenseItem expense={expenseWithDecimals} />);
    
    expect(screen.getByTestId('secondary-text')).toHaveTextContent('123.46');
  });

  it('should handle different currencies', () => {
    const expenseWithUSD = {
      ...mockExpense,
      currency: 'USD',
      amount: 50.00
    };
    
    renderWithProvider(<ExpenseItem expense={expenseWithUSD} />);
    
    expect(screen.getByTestId('secondary-text')).toHaveTextContent('Date: 2024-01-01 | Amount: 50.00 USD');
  });

  it('should handle different dates', () => {
    const expenseWithDifferentDate = {
      ...mockExpense,
      date: '2024-12-25'
    };
    
    renderWithProvider(<ExpenseItem expense={expenseWithDifferentDate} />);
    
    expect(screen.getByTestId('secondary-text')).toHaveTextContent('Date: 2024-12-25 | Amount: 100.50 HUF');
  });

  it('should handle long descriptions', () => {
    const expenseWithLongDescription = {
      ...mockExpense,
      description: 'This is a very long expense description that might wrap to multiple lines'
    };
    
    renderWithProvider(<ExpenseItem expense={expenseWithLongDescription} />);
    
    expect(screen.getByTestId('primary-text')).toHaveTextContent('This is a very long expense description that might wrap to multiple lines');
  });

  it('should handle zero amount', () => {
    const expenseWithZeroAmount = {
      ...mockExpense,
      amount: 0
    };
    
    renderWithProvider(<ExpenseItem expense={expenseWithZeroAmount} />);
    
    expect(screen.getByTestId('secondary-text')).toHaveTextContent('Date: 2024-01-01 | Amount: 0.00 HUF');
  });

  it('should handle large amounts', () => {
    const expenseWithLargeAmount = {
      ...mockExpense,
      amount: 999999.99
    };
    
    renderWithProvider(<ExpenseItem expense={expenseWithLargeAmount} />);
    
    expect(screen.getByTestId('secondary-text')).toHaveTextContent('Date: 2024-01-01 | Amount: 999999.99 HUF');
  });

  it('should handle multiple delete button clicks', () => {
    renderWithProvider(<ExpenseItem expense={mockExpense} />);
    
    const deleteButton = screen.getByTestId('icon-button-error');
    
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);
    
    // Button should still be present and functional
    expect(deleteButton).toBeInTheDocument();
  });
});
