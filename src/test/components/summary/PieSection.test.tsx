import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PieSection from '../../../components/summary/PieSection';

// Mock Material-UI components
vi.mock('@mui/material', () => ({
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
  Box: ({ children, ...props }: Record<string, unknown>) => <div data-testid="box" {...props}>{children as React.ReactNode}</div>,
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
  Pie: ({ data, dataKey, nameKey, cx, cy, outerRadius, fill, children, ...props }: Record<string, unknown>) => (
    <div
      data-testid="pie"
      data-data-key={dataKey}
      data-name-key={nameKey}
      data-cx={cx}
      data-cy={cy}
      data-outer-radius={outerRadius}
      data-fill={fill}
      {...props}
    >
      {(data as Array<Record<string, unknown>>)?.map((item: Record<string, unknown>, index: number) => (
        <div key={index} data-testid={`pie-segment-${index}`}>
          {item[nameKey as string] as React.ReactNode}: {item[dataKey as string] as React.ReactNode}
        </div>
      ))}
      {children as React.ReactNode}
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

describe('PieSection', () => {
  const mockData = [
    { name: 'Category 1', value: 100 },
    { name: 'Category 2', value: 200 },
    { name: 'Category 3', value: 150 }
  ];

  const defaultProps = {
    title: 'Test Chart',
    data: mockData,
    color: '#8884d8'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<PieSection {...defaultProps} />)).not.toThrow();
  });

  it('should render the title', () => {
    render(<PieSection {...defaultProps} />);
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('should render with different titles', () => {
    const { rerender } = render(<PieSection {...defaultProps} />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    
    rerender(<PieSection {...defaultProps} title="Different Title" />);
    expect(screen.getByText('Different Title')).toBeInTheDocument();
  });

  it('should render the pie chart', () => {
    render(<PieSection {...defaultProps} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('should render pie segments for each data item', () => {
    render(<PieSection {...defaultProps} />);
    
    expect(screen.getByTestId('pie-segment-0')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-1')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-2')).toBeInTheDocument();
  });

  it('should display correct data in pie segments', () => {
    render(<PieSection {...defaultProps} />);
    
    expect(screen.getByTestId('pie-segment-0')).toHaveTextContent('Category 1: 100');
    expect(screen.getByTestId('pie-segment-1')).toHaveTextContent('Category 2: 200');
    expect(screen.getByTestId('pie-segment-2')).toHaveTextContent('Category 3: 150');
  });

  it('should render with correct pie chart props', () => {
    render(<PieSection {...defaultProps} />);
    
    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-data-key', 'value');
    expect(pie).toHaveAttribute('data-name-key', 'name');
    expect(pie).toHaveAttribute('data-cx', '50%');
    expect(pie).toHaveAttribute('data-cy', '50%');
    expect(pie).toHaveAttribute('data-outer-radius', '80');
  });

  it('should render with different colors', () => {
    const { rerender } = render(<PieSection {...defaultProps} />);
    
    let pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-fill', '#8884d8');
    
    rerender(<PieSection {...defaultProps} color="#82ca9d" />);
    pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-fill', '#82ca9d');
  });

  it('should render cells with different colors', () => {
    render(<PieSection {...defaultProps} />);
    
    const cells = screen.getAllByTestId('cell');
    expect(cells.length).toBeGreaterThan(0);
    
    // Check that cells have fill colors
    cells.forEach(cell => {
      expect(cell).toHaveAttribute('data-fill');
    });
  });

  it('should render tooltip and legend', () => {
    render(<PieSection {...defaultProps} />);
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('should handle empty data array', () => {
    render(<PieSection {...defaultProps} data={[]} />);
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    // Should not have any pie segments
    expect(screen.queryByTestId('pie-segment-0')).not.toBeInTheDocument();
  });

  it('should handle single data item', () => {
    const singleData = [{ name: 'Single Category', value: 100 }];
    render(<PieSection {...defaultProps} data={singleData} />);
    
    expect(screen.getByTestId('pie-segment-0')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-0')).toHaveTextContent('Single Category: 100');
    expect(screen.queryByTestId('pie-segment-1')).not.toBeInTheDocument();
  });

  it('should handle large data arrays', () => {
    const largeData = Array.from({ length: 10 }, (_, i) => ({
      name: `Category ${i + 1}`,
      value: (i + 1) * 10
    }));
    
    render(<PieSection {...defaultProps} data={largeData} />);
    
    // Should render all segments
    for (let i = 0; i < 10; i++) {
      expect(screen.getByTestId(`pie-segment-${i}`)).toBeInTheDocument();
    }
  });

  it('should use default color when color prop is null', () => {
    render(<PieSection {...defaultProps} color={null} />);
    
    // Should render with default color
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('should handle data with zero values', () => {
    const dataWithZeros = [
      { name: 'Zero Value', value: 0 },
      { name: 'Normal Value', value: 100 }
    ];
    
    render(<PieSection {...defaultProps} data={dataWithZeros} />);
    
    expect(screen.getByTestId('pie-segment-0')).toHaveTextContent('Zero Value: 0');
    expect(screen.getByTestId('pie-segment-1')).toHaveTextContent('Normal Value: 100');
  });

  it('should handle data with negative values', () => {
    const dataWithNegatives = [
      { name: 'Negative Value', value: -50 },
      { name: 'Positive Value', value: 100 }
    ];
    
    render(<PieSection {...defaultProps} data={dataWithNegatives} />);
    
    expect(screen.getByTestId('pie-segment-0')).toHaveTextContent('Negative Value: -50');
    expect(screen.getByTestId('pie-segment-1')).toHaveTextContent('Positive Value: 100');
  });

  it('should handle data with decimal values', () => {
    const dataWithDecimals = [
      { name: 'Decimal Value', value: 99.99 },
      { name: 'Whole Value', value: 100 }
    ];
    
    render(<PieSection {...defaultProps} data={dataWithDecimals} />);
    
    expect(screen.getByTestId('pie-segment-0')).toHaveTextContent('Decimal Value: 99.99');
    expect(screen.getByTestId('pie-segment-1')).toHaveTextContent('Whole Value: 100');
  });

  it('should handle long category names', () => {
    const dataWithLongNames = [
      { name: 'This is a very long category name that might cause layout issues', value: 100 }
    ];
    
    render(<PieSection {...defaultProps} data={dataWithLongNames} />);
    
    expect(screen.getByTestId('pie-segment-0')).toHaveTextContent('This is a very long category name that might cause layout issues: 100');
  });

  it('should render with proper accessibility structure', () => {
    render(<PieSection {...defaultProps} />);
    
    // Check that the title is accessible
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    
    // Check that the chart structure is present
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should maintain component state correctly', () => {
    const { rerender } = render(<PieSection {...defaultProps} />);
    
    // Verify initial state
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    
    // Re-render with different props
    rerender(<PieSection {...defaultProps} title="Updated Title" color="#ff0000" />);
    
    // Verify updated state
    expect(screen.getByText('Updated Title')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toHaveAttribute('data-fill', '#ff0000');
  });
});
