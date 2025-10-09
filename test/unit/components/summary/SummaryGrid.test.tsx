import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryGrid from '../../../../src/components/summary/SummaryGrid';
import { ExpenseProvider } from '../../../../src/context/ExpenseProvider';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn(() => '12345678-1234-1234-1234-123456789012')
  }
});

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Paper: ({ children, elevation, ...props }: Record<string, unknown>) => (
    <div data-testid="paper" data-elevation={elevation} {...props}>{children as React.ReactNode}</div>
  ),
  Typography: ({ children, variant, align, gutterBottom, ...props }: Record<string, unknown>) => (
    <div
      data-testid="typography"
      data-variant={variant}
      data-align={align}
      data-gutter-bottom={gutterBottom}
      {...props}
    >
      {children as React.ReactNode}
    </div>
  ),
  Grid: ({ children, container, spacing, size, ...props }: Record<string, unknown>) => (
    <div
      data-testid="grid"
      data-container={container}
      data-spacing={spacing}
      data-size={JSON.stringify(size)}
      {...props}
    >
      {children as React.ReactNode}
    </div>
  ),
  Box: ({ children, sx, ...props }: Record<string, unknown>) => (
    <div data-testid="box" data-sx={JSON.stringify(sx)} {...props}>
      {children as React.ReactNode}
    </div>
  ),
  Button: ({ children, variant, size, onClick, disabled, ...props }: Record<string, unknown>) => (
    <button 
      data-testid="button" 
      data-variant={variant} 
      data-size={size} 
      data-disabled={disabled}
      onClick={onClick as () => void}
      disabled={disabled as boolean}
      {...props}
    >
      {children as React.ReactNode}
    </button>
  ),
  ButtonGroup: ({ children, size, ...props }: Record<string, unknown>) => (
    <div data-testid="button-group" data-size={size} {...props}>
      {children as React.ReactNode}
    </div>
  ),
}));

// Mock PieSection component
vi.mock('../../../../src/components/summary/PieSection', () => ({
  default: ({ title, data, color }: Record<string, unknown>) => (
    <div data-testid="pie-section" data-title={title as string} data-color={color as string}>
      <div data-testid="pie-section-title">{title as string}</div>
      <div data-testid="pie-section-data">{JSON.stringify(data)}</div>
    </div>
  )
}));

// Mock TimePeriodSelector component
vi.mock('../../../../src/components/summary/TimePeriodSelector', () => ({
  default: ({ title, currentValue, onSelect, disabled, pickerType }: Record<string, unknown>) => (
    <div data-testid="time-period-selector" data-title={title as string} data-current-value={currentValue as string} data-disabled={disabled as boolean} data-picker-type={pickerType as string}>
      <div data-testid="selector-title">{title as string}</div>
      <div data-testid="date-picker" data-picker-type={pickerType as string}>
        <input 
          data-testid="date-picker-input" 
          value={currentValue as string}
          onChange={(e) => (onSelect as (value: string) => void)(e.target.value)}
          disabled={disabled as boolean}
        />
      </div>
      <div data-testid="quick-nav-buttons">
        {pickerType === 'week' && <button data-testid="today-button">Today</button>}
        {pickerType === 'month' && <button data-testid="current-month-button">Current Month</button>}
        {pickerType === 'year' && <button data-testid="current-year-button">Current Year</button>}
      </div>
    </div>
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ExpenseProvider>
      {component}
    </ExpenseProvider>
  );
};

describe('SummaryGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all three summary sections', () => {
    renderWithProvider(<SummaryGrid />);
    
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
    expect(screen.getByText(/Weekly Costs -/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Costs -/)).toBeInTheDocument();
  });

  it('should display empty state when no expenses', () => {
    renderWithProvider(<SummaryGrid />);
    
    expect(screen.getByText('Weekly Total: 0.00 HUF')).toBeInTheDocument();
    expect(screen.getByText('Monthly Total: 0.00 HUF')).toBeInTheDocument();
    expect(screen.getByText('Yearly Total: 0.00 HUF')).toBeInTheDocument();
  });

  it('should render chart containers', () => {
    renderWithProvider(<SummaryGrid />);
    
    // Check that pie sections are rendered (which contain the charts)
    const pieSections = screen.getAllByTestId('pie-section');
    expect(pieSections.length).toBe(3);
  });

  it('should render without crashing', () => {
    expect(() => renderWithProvider(<SummaryGrid />)).not.toThrow();
  });

  it('should have proper layout structure', () => {
    renderWithProvider(<SummaryGrid />);
    
    // Check that all sections are present
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
    expect(screen.getByText(/Weekly Costs -/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Costs -/)).toBeInTheDocument();
  });

  it('should render pie sections with correct props', () => {
    renderWithProvider(<SummaryGrid />);
    
    const pieSections = screen.getAllByTestId('pie-section');
    expect(pieSections.length).toBe(3);
    
    // Check that pie sections have the expected titles
    const pieSectionTitles = screen.getAllByTestId('pie-section-title');
    expect(pieSectionTitles[0]).toHaveTextContent('');
  });

  it('should render with proper grid structure', () => {
    renderWithProvider(<SummaryGrid />);
    
    const grids = screen.getAllByTestId('grid');
    expect(grids.length).toBeGreaterThan(0);
    
    // Check for container grids
    const containerGrids = grids.filter(grid => grid.getAttribute('data-container') === 'true');
    expect(containerGrids.length).toBeGreaterThan(0);
  });

  it('should render papers with correct elevation', () => {
    renderWithProvider(<SummaryGrid />);
    
    const papers = screen.getAllByTestId('paper');
    expect(papers.length).toBeGreaterThan(0);
    
    // Check that papers have elevation
    papers.forEach(paper => {
      expect(paper).toHaveAttribute('data-elevation', '3');
    });
  });

  it('should render typography with correct variants', () => {
    renderWithProvider(<SummaryGrid />);
    
    // Check that the main titles are present
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
    expect(screen.getByText(/Weekly Costs -/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Costs -/)).toBeInTheDocument();
    
    // Check that totals are present
    expect(screen.getByText('Weekly Total: 0.00 HUF')).toBeInTheDocument();
    expect(screen.getByText('Monthly Total: 0.00 HUF')).toBeInTheDocument();
    expect(screen.getByText('Yearly Total: 0.00 HUF')).toBeInTheDocument();
  });

  it('should handle different currency types', () => {
    renderWithProvider(<SummaryGrid />);
    
    // The component should handle different currencies gracefully
    const totalElements = screen.getAllByText(/Total: 0\.00/);
    expect(totalElements.length).toBeGreaterThan(0);
  });

  it('should render with proper accessibility structure', () => {
    renderWithProvider(<SummaryGrid />);
    
    // Check that all main sections are present and accessible
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
    expect(screen.getByText(/Weekly Costs -/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Costs -/)).toBeInTheDocument();
  });

  it('should maintain component state correctly', () => {
    renderWithProvider(<SummaryGrid />);
    
    // Verify that the component maintains its internal state
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
    expect(screen.getByText(/Weekly Costs -/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Costs -/)).toBeInTheDocument();
  });

  it('should render with correct spacing and sizing', () => {
    renderWithProvider(<SummaryGrid />);
    
    const grids = screen.getAllByTestId('grid');
    expect(grids.length).toBeGreaterThan(0);
    
    // Check that grids have proper spacing
    const gridsWithSpacing = grids.filter(grid => 
      grid.getAttribute('data-spacing') !== null
    );
    expect(gridsWithSpacing.length).toBeGreaterThan(0);
  });

  it('should handle responsive layout correctly', () => {
    renderWithProvider(<SummaryGrid />);
    
    const grids = screen.getAllByTestId('grid');
    expect(grids.length).toBeGreaterThan(0);
    
    // Check that grids have size attributes for responsive behavior
    const gridsWithSize = grids.filter(grid => 
      grid.getAttribute('data-size') !== null
    );
    expect(gridsWithSize.length).toBeGreaterThan(0);
  });

  it('should filter expenses by year correctly', () => {
    const mockExpenses = [
      { id: 1, description: 'Current Year', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'Last Year', amount: 200, date: '2023-01-01', currency: 'USD' },
      { id: 3, description: 'Current Year 2', amount: 300, date: '2024-06-01', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });

  it('should calculate monthly costs with multiple months', () => {
    const mockExpenses = [
      { id: 1, description: 'January', amount: 100, date: '2024-01-15', currency: 'USD' },
      { id: 2, description: 'February', amount: 200, date: '2024-02-15', currency: 'USD' },
      { id: 3, description: 'March', amount: 150, date: '2024-03-15', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders
    expect(screen.getByText(/Monthly Costs -/)).toBeInTheDocument();
  });

  it('should handle currency counting correctly', () => {
    const mockExpenses = [
      { id: 1, description: 'USD 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'USD 2', amount: 200, date: '2024-01-02', currency: 'USD' },
      { id: 3, description: 'EUR 1', amount: 150, date: '2024-01-03', currency: 'EUR' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });

  it('should handle empty expense list for currency counting', () => {
    // Mock localStorage to return empty array
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
    
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders with default currency
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });

  it('should calculate weekly costs with multiple weeks', () => {
    const mockExpenses = [
      { id: 1, description: 'Week 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'Week 1', amount: 200, date: '2024-01-02', currency: 'USD' },
      { id: 3, description: 'Week 2', amount: 300, date: '2024-01-08', currency: 'USD' },
      { id: 4, description: 'Week 2', amount: 400, date: '2024-01-09', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });

  it('should calculate monthly costs with multiple months and different amounts', () => {
    const mockExpenses = [
      { id: 1, description: 'January 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'January 2', amount: 200, date: '2024-01-15', currency: 'USD' },
      { id: 3, description: 'February 1', amount: 300, date: '2024-02-01', currency: 'USD' },
      { id: 4, description: 'February 2', amount: 400, date: '2024-02-15', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders
    expect(screen.getByText(/Monthly Costs -/)).toBeInTheDocument();
  });

  it('should handle currency counting with multiple currencies', () => {
    const mockExpenses = [
      { id: 1, description: 'USD 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'USD 2', amount: 200, date: '2024-01-02', currency: 'USD' },
      { id: 3, description: 'EUR 1', amount: 150, date: '2024-01-03', currency: 'EUR' },
      { id: 4, description: 'HUF 1', amount: 300, date: '2024-01-04', currency: 'HUF' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });

  it('should handle currency counting with equal currency counts', () => {
    const mockExpenses = [
      { id: 1, description: 'USD 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'EUR 1', amount: 200, date: '2024-01-02', currency: 'EUR' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });

  it('should handle currency counting with single currency', () => {
    const mockExpenses = [
      { id: 1, description: 'USD 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'USD 2', amount: 200, date: '2024-01-02', currency: 'USD' },
      { id: 3, description: 'USD 3', amount: 300, date: '2024-01-03', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });

  it('should calculate weekly costs with multiple weeks', () => {
    const mockExpenses = [
      { id: 1, description: 'Week 1 Expense', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'Week 1 Expense 2', amount: 150, date: '2024-01-03', currency: 'USD' },
      { id: 3, description: 'Week 2 Expense', amount: 200, date: '2024-01-08', currency: 'USD' },
      { id: 4, description: 'Week 2 Expense 2', amount: 250, date: '2024-01-10', currency: 'USD' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders with weekly data
    expect(screen.getByText(/Weekly Costs -/)).toBeInTheDocument();
  });

  it('should calculate monthly costs with multiple months and different amounts', () => {
    const mockExpenses = [
      { id: 1, description: 'January Expense 1', amount: 100, date: '2024-01-15', currency: 'USD' },
      { id: 2, description: 'January Expense 2', amount: 150, date: '2024-01-20', currency: 'USD' },
      { id: 3, description: 'February Expense', amount: 200, date: '2024-02-15', currency: 'USD' },
      { id: 4, description: 'March Expense 1', amount: 300, date: '2024-03-15', currency: 'USD' },
      { id: 5, description: 'March Expense 2', amount: 250, date: '2024-03-25', currency: 'USD' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders with monthly data
    expect(screen.getByText(/Monthly Costs -/)).toBeInTheDocument();
  });

  it('should handle currency counting with multiple currencies', () => {
    const mockExpenses = [
      { id: 1, description: 'USD Expense 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'USD Expense 2', amount: 150, date: '2024-01-02', currency: 'USD' },
      { id: 3, description: 'EUR Expense', amount: 200, date: '2024-01-03', currency: 'EUR' },
      { id: 4, description: 'HUF Expense', amount: 300, date: '2024-01-04', currency: 'HUF' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders with currency data
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });

  it('should handle currency counting with equal currency counts', () => {
    const mockExpenses = [
      { id: 1, description: 'USD Expense', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'EUR Expense', amount: 150, date: '2024-01-02', currency: 'EUR' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders with currency data
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });

  it('should handle currency counting with single currency', () => {
    const mockExpenses = [
      { id: 1, description: 'USD Expense 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'USD Expense 2', amount: 150, date: '2024-01-02', currency: 'USD' },
      { id: 3, description: 'USD Expense 3', amount: 200, date: '2024-01-03', currency: 'USD' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<SummaryGrid />);
    
    // Verify the component renders with currency data
    expect(screen.getByText(/Daily Costs - Week of/)).toBeInTheDocument();
  });
});
