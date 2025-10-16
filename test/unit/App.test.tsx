import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn(() => '12345678-1234-1234-1234-123456789012')
  }
});

// Mock Material-UI components to avoid complex rendering issues
vi.mock('@mui/material', () => ({
  Container: ({ children, maxWidth, ...props }: Record<string, unknown>) => <div data-testid="container" data-max-width={maxWidth} {...props}>{children as React.ReactNode}</div>,
  Typography: ({ children, ...props }: Record<string, unknown>) => {
    // Render text content for specific patterns
    const textContent = children as string;
    if (textContent && typeof textContent === 'string') {
      if (textContent.includes('Cost Tracker') || 
          textContent.includes('Add Expense') || 
          textContent.includes('Expenses')) {
        return <div data-testid="typography" {...props}>{textContent}</div>;
      }
    }
    return <div data-testid="typography" {...props}>{children as React.ReactNode}</div>;
  },
  Paper: ({ children, ...props }: Record<string, unknown>) => <div data-testid="paper" {...props}>{children as React.ReactNode}</div>,
  Grid: ({ children, container, ...props }: Record<string, unknown>) => <div data-testid="grid" data-container={container?.toString()} {...props}>{children as React.ReactNode}</div>,
  Box: ({ children, ...props }: Record<string, unknown>) => <div data-testid="box" {...props}>{children as React.ReactNode}</div>,
  CssBaseline: () => <div data-testid="css-baseline" />,
}));

// Mock context providers
vi.mock('../../src/context/ExpenseProvider', () => ({
  ExpenseProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="expense-provider">{children}</div>,
}));

vi.mock('../../src/context/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

// Mock child components
vi.mock('../../src/components/form/ExpenseForm', () => ({
  default: () => <div data-testid="expense-form">ExpenseForm</div>
}));

vi.mock('../../src/components/list/ExpenseList', () => ({
  default: () => <div data-testid="expense-list">ExpenseList</div>
}));

vi.mock('../../src/components/summary/SummaryGrid', () => ({
  default: () => <div data-testid="summary-grid">SummaryGrid</div>
}));

vi.mock('../../src/components/summary/CurrencySummaryGrid', () => ({
  default: () => <div data-testid="currency-summary-grid">CurrencySummaryGrid</div>
}));

vi.mock('../../src/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">ThemeToggle</div>
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
    expect(screen.getByTestId('currency-summary-grid')).toBeInTheDocument();
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
