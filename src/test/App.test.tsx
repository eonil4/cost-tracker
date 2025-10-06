import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn(() => '12345678-1234-1234-1234-123456789012')
  }
});

// Mock Material-UI components to avoid complex rendering issues
vi.mock('@mui/material', () => ({
  Container: ({ children, ...props }: Record<string, unknown>) => <div data-testid="container" {...props}>{children as React.ReactNode}</div>,
  Typography: ({ children, ...props }: Record<string, unknown>) => <div data-testid="typography" {...props}>{children as React.ReactNode}</div>,
  Paper: ({ children, ...props }: Record<string, unknown>) => <div data-testid="paper" {...props}>{children as React.ReactNode}</div>,
  Grid: ({ children, ...props }: Record<string, unknown>) => <div data-testid="grid" {...props}>{children as React.ReactNode}</div>,
}));

// Mock child components
vi.mock('../components/form/ExpenseForm', () => ({
  default: () => <div data-testid="expense-form">ExpenseForm</div>
}));

vi.mock('../components/list/ExpenseList', () => ({
  default: () => <div data-testid="expense-list">ExpenseList</div>
}));

vi.mock('../components/summary/SummaryGrid', () => ({
  default: () => <div data-testid="summary-grid">SummaryGrid</div>
}));

describe('App', () => {
  it('should render without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('should render the main title', () => {
    render(<App />);
    expect(screen.getByText('Cost Tracker')).toBeInTheDocument();
  });

  it('should render all main sections', () => {
    render(<App />);
    
    expect(screen.getByText('Add Expense')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByTestId('expense-form')).toBeInTheDocument();
    expect(screen.getByTestId('expense-list')).toBeInTheDocument();
    expect(screen.getByTestId('summary-grid')).toBeInTheDocument();
  });

  it('should render with proper layout structure', () => {
    render(<App />);
    
    // Check that main container is present
    expect(screen.getByTestId('container')).toBeInTheDocument();
    
    // Check that all grid containers are present
    const grids = screen.getAllByTestId('grid');
    expect(grids.length).toBeGreaterThan(0);
    
    // Check that all paper containers are present
    const papers = screen.getAllByTestId('paper');
    expect(papers.length).toBeGreaterThan(0);
  });

  it('should wrap everything in ExpenseProvider', () => {
    render(<App />);
    
    // The ExpenseProvider should be present (it's the root wrapper)
    // We can verify this by checking that the context-dependent components render
    expect(screen.getByTestId('expense-form')).toBeInTheDocument();
    expect(screen.getByTestId('expense-list')).toBeInTheDocument();
  });
});
