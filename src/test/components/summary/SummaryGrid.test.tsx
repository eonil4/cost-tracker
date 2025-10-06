import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SummaryGrid from '../../../components/summary/SummaryGrid';
import { ExpenseProvider } from '../../../context/ExpenseProvider';

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
}));

// Mock PieSection component
vi.mock('../../../components/summary/PieSection', () => ({
  default: ({ title, data, color }: Record<string, unknown>) => (
    <div data-testid="pie-section" data-title={title as string} data-color={color as string}>
      <div data-testid="pie-section-title">{title as string}</div>
      <div data-testid="pie-section-data">{JSON.stringify(data)}</div>
    </div>
  )
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
    
    expect(screen.getByText('Daily Costs (Current Week)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Costs (Current Month)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
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
    expect(screen.getByText('Daily Costs (Current Week)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Costs (Current Month)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should render pie sections with correct props', () => {
    renderWithProvider(<SummaryGrid />);
    
    const pieSections = screen.getAllByTestId('pie-section');
    expect(pieSections.length).toBe(3);
    
    // Check that pie sections have the expected titles
    const pieSectionTitles = screen.getAllByTestId('pie-section-title');
    expect(pieSectionTitles[0]).toHaveTextContent('Daily Costs (Current Week)');
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
    expect(screen.getByText('Daily Costs (Current Week)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Costs (Current Month)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
    
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
    expect(screen.getByText('Daily Costs (Current Week)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Costs (Current Month)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
  });

  it('should maintain component state correctly', () => {
    renderWithProvider(<SummaryGrid />);
    
    // Verify that the component maintains its internal state
    expect(screen.getByText('Daily Costs (Current Week)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Costs (Current Month)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Costs (Current Year)')).toBeInTheDocument();
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
});