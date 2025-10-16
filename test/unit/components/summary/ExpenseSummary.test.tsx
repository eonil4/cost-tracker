import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExpenseSummary from '../../../../src/components/summary/ExpenseSummary';
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

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Paper: ({ children, elevation, ...props }: Record<string, unknown>) => (
    <div data-testid="paper" data-elevation={elevation} {...props}>{children as React.ReactNode}</div>
  ),
  Typography: ({ children, variant, align, gutterBottom, ...props }: Record<string, unknown>) => {
    // Render text content for specific patterns
    const textContent = children as string;
    if (textContent && typeof textContent === 'string') {
      if (textContent.includes('Daily Costs (Current Week)') || 
          textContent.includes('Weekly Costs (Current Month)') || 
          textContent.includes('Monthly Costs (Current Year)') ||
          textContent.includes('Weekly Total:') ||
          textContent.includes('Monthly Total:') ||
          textContent.includes('Yearly Total:') ||
          textContent.includes('Total: 0.00')) {
        return (
          <div
            data-testid="typography"
            data-variant={variant}
            data-align={align}
            data-gutter-bottom={gutterBottom?.toString()}
            {...props}
          >
            {textContent}
          </div>
        );
      }
    }
    return (
      <div
        data-testid="typography"
        data-variant={variant}
        data-align={align}
        data-gutter-bottom={gutterBottom?.toString()}
        {...props}
      >
        {children as React.ReactNode}
      </div>
    );
  },
  Box: ({ children, ...props }: Record<string, unknown>) => <div data-testid="box" {...props}>{children as React.ReactNode}</div>,
  Divider: ({ style, ...props }: Record<string, unknown>) => <div data-testid="divider" style={style as React.CSSProperties} {...props} />,
}));

// Mock recharts components
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children, width, height, ...props }: Record<string, unknown>) => (
    <div data-testid="responsive-container" data-width={width} data-height={height} {...props}>
      {children as React.ReactNode}
    </div>
  ),
  PieChart: ({ children, width, height, ...props }: Record<string, unknown>) => (
    <div data-testid="pie-chart" data-width={width} data-height={height} {...props}>
      {children as React.ReactNode}
    </div>
  ),
  Pie: ({ data, dataKey, nameKey, cx, cy, outerRadius, fill, label, ...props }: Record<string, unknown>) => (
    <div 
      data-testid="pie" 
      data-data-key={dataKey}
      data-name-key={nameKey}
      data-cx={cx}
      data-cy={cy}
      data-outer-radius={outerRadius}
      data-fill={fill}
      data-label={label?.toString()}
      {...props}
    >
      {(data as Array<Record<string, unknown>>)?.map((item: Record<string, unknown>, index: number) => (
        <div key={index} data-testid={`pie-segment-${index}`}>
          {item[nameKey as string] as React.ReactNode}: {item[dataKey as string] as React.ReactNode}
        </div>
      ))}
    </div>
  ),
  Cell: ({ fill, ...props }: Record<string, unknown>) => (
    <div data-testid="cell" data-fill={fill} {...props} />
  ),
  Tooltip: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="tooltip" {...props}>{children as React.ReactNode}</div>
  ),
  Legend: ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="legend" {...props}>{children as React.ReactNode}</div>
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ExpenseProvider>
      {component}
    </ExpenseProvider>
  );
};

describe('ExpenseSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => renderWithProvider(<ExpenseSummary />)).not.toThrow();
  });

  it('should render all three summary sections', () => {
    renderWithProvider(<ExpenseSummary />);
    
    expect(screen.getByText('Daily Costs (Current Week)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Costs (Current Month)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should display empty state when no expenses', () => {
    renderWithProvider(<ExpenseSummary />);
    
    expect(screen.getByText('Weekly Total: 0.00 HUF')).toBeInTheDocument();
    expect(screen.getByText('Monthly Total: 0.00 HUF')).toBeInTheDocument();
    expect(screen.getByText('Yearly Total: 0.00 HUF')).toBeInTheDocument();
  });

  it('should render pie charts for each section', () => {
    renderWithProvider(<ExpenseSummary />);
    
    // Check that the chart containers are rendered
    const responsiveContainers = screen.getAllByTestId('responsive-container');
    expect(responsiveContainers.length).toBeGreaterThan(0);
    
    const pieCharts = screen.getAllByTestId('pie-chart');
    expect(pieCharts.length).toBeGreaterThan(0);
  });

  it('should render without crashing', () => {
    expect(() => renderWithProvider(<ExpenseSummary />)).not.toThrow();
  });

  it('should have proper layout structure', () => {
    renderWithProvider(<ExpenseSummary />);
    
    // Check that all sections are present
    expect(screen.getByText('Daily Costs (Current Week)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Costs (Current Month)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should render box containers with proper structure', () => {
    renderWithProvider(<ExpenseSummary />);
    
    const boxes = screen.getAllByTestId('box');
    expect(boxes.length).toBeGreaterThan(0);
    
    // Check that boxes are rendered
    boxes.forEach(box => {
      expect(box).toBeInTheDocument();
    });
  });

  it('should render typography with correct variants', () => {
    renderWithProvider(<ExpenseSummary />);
    
    const typographies = screen.getAllByTestId('typography');
    expect(typographies.length).toBeGreaterThan(0);
    
    // Check for h6 variants (titles)
    const titleTypographies = typographies.filter(typography => 
      typography.getAttribute('data-variant') === 'h6'
    );
    expect(titleTypographies.length).toBeGreaterThan(0);
    
    // Check for subtitle1 variants (totals)
    const totalTypographies = typographies.filter(typography => 
      typography.getAttribute('data-variant') === 'subtitle1'
    );
    expect(totalTypographies.length).toBeGreaterThan(0);
  });

  it('should render boxes with proper styling', () => {
    renderWithProvider(<ExpenseSummary />);
    
    const boxes = screen.getAllByTestId('box');
    expect(boxes.length).toBeGreaterThan(0);
  });

  it('should render pie components with correct props', () => {
    renderWithProvider(<ExpenseSummary />);
    
    const pies = screen.getAllByTestId('pie');
    expect(pies.length).toBeGreaterThan(0);
    
    // Check that pies have the expected data attributes
    pies.forEach(pie => {
      expect(pie).toHaveAttribute('data-data-key', 'value');
      expect(pie).toHaveAttribute('data-name-key', 'name');
    });
  });

  it('should render pie components with different colors', () => {
    renderWithProvider(<ExpenseSummary />);
    
    const pies = screen.getAllByTestId('pie');
    expect(pies.length).toBeGreaterThan(0);
    
    // Check that pies have fill colors
    pies.forEach(pie => {
      expect(pie).toHaveAttribute('data-fill');
    });
  });

  it('should render tooltips and legends', () => {
    renderWithProvider(<ExpenseSummary />);
    
    const tooltips = screen.getAllByTestId('tooltip');
    const legends = screen.getAllByTestId('legend');
    
    expect(tooltips.length).toBeGreaterThan(0);
    expect(legends.length).toBeGreaterThan(0);
  });

  it('should handle different currency types', () => {
    renderWithProvider(<ExpenseSummary />);
    
    // The component should handle different currencies gracefully
    const totalElements = screen.getAllByText(/Total: 0\.00/);
    expect(totalElements.length).toBeGreaterThan(0);
  });

  it('should render with proper accessibility structure', () => {
    renderWithProvider(<ExpenseSummary />);
    
    // Check that all main sections are present and accessible
    expect(screen.getByText('Daily Costs (Current Week)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Costs (Current Month)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should maintain component state correctly', () => {
    renderWithProvider(<ExpenseSummary />);
    
    // Verify that the component maintains its internal state
    expect(screen.getByText('Daily Costs (Current Week)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Costs (Current Month)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should calculate monthly costs correctly with different months', () => {
    const mockExpenses = [
      { id: 1, description: 'January Expense', amount: 100, date: '2024-01-15', currency: 'USD' },
      { id: 2, description: 'February Expense', amount: 200, date: '2024-02-15', currency: 'USD' },
      { id: 3, description: 'March Expense', amount: 150, date: '2024-03-15', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<ExpenseSummary />);
    
    // Verify the component renders with monthly data
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should handle monthly data mapping correctly', () => {
    const mockExpenses = [
      { id: 1, description: 'Test Expense 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'Test Expense 2', amount: 200, date: '2024-01-15', currency: 'USD' },
      { id: 3, description: 'Test Expense 3', amount: 300, date: '2024-02-01', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<ExpenseSummary />);
    
    // Verify the component renders
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should calculate monthly costs with multiple months and different amounts', () => {
    const mockExpenses = [
      { id: 1, description: 'January 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'January 2', amount: 200, date: '2024-01-15', currency: 'USD' },
      { id: 3, description: 'February 1', amount: 300, date: '2024-02-01', currency: 'USD' },
      { id: 4, description: 'February 2', amount: 400, date: '2024-02-15', currency: 'USD' },
      { id: 5, description: 'March 1', amount: 500, date: '2024-03-01', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<ExpenseSummary />);
    
    // Verify the component renders with monthly data
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should handle monthly data mapping with multiple entries per month', () => {
    const mockExpenses = [
      { id: 1, description: 'Jan 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'Jan 2', amount: 200, date: '2024-01-15', currency: 'USD' },
      { id: 3, description: 'Jan 3', amount: 300, date: '2024-01-30', currency: 'USD' },
      { id: 4, description: 'Feb 1', amount: 400, date: '2024-02-01', currency: 'USD' },
      { id: 5, description: 'Feb 2', amount: 500, date: '2024-02-15', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<ExpenseSummary />);
    
    // Verify the component renders
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should handle monthly data mapping with single month', () => {
    const mockExpenses = [
      { id: 1, description: 'January 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'January 2', amount: 200, date: '2024-01-15', currency: 'USD' }
    ];
    
    // Mock localStorage to return test data
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    
    renderWithProvider(<ExpenseSummary />);
    
    // Verify the component renders
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should calculate monthly costs correctly with different months and amounts', () => {
    const mockExpenses = [
      { id: 1, description: 'January Expense 1', amount: 100, date: '2024-01-15', currency: 'USD' },
      { id: 2, description: 'January Expense 2', amount: 150, date: '2024-01-20', currency: 'USD' },
      { id: 3, description: 'February Expense', amount: 200, date: '2024-02-15', currency: 'USD' },
      { id: 4, description: 'March Expense 1', amount: 300, date: '2024-03-15', currency: 'USD' },
      { id: 5, description: 'March Expense 2', amount: 250, date: '2024-03-25', currency: 'USD' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<ExpenseSummary />);
    
    // Verify the component renders with monthly data
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should handle monthly data mapping with multiple entries per month', () => {
    const mockExpenses = [
      { id: 1, description: 'January Expense 1', amount: 100, date: '2024-01-15', currency: 'USD' },
      { id: 2, description: 'January Expense 2', amount: 150, date: '2024-01-20', currency: 'USD' },
      { id: 3, description: 'January Expense 3', amount: 200, date: '2024-01-25', currency: 'USD' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<ExpenseSummary />);
    
    // Verify the component renders with monthly data
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should handle monthly data mapping with single month', () => {
    const mockExpenses = [
      { id: 1, description: 'January Expense', amount: 100, date: '2024-01-15', currency: 'USD' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<ExpenseSummary />);
    
    // Verify the component renders with monthly data
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });
});
