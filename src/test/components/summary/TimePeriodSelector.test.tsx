import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimePeriodSelector from '../../../components/summary/TimePeriodSelector';

// Mock dayjs
vi.mock('dayjs', () => {
  const mockDayjs = vi.fn((date?: string) => ({
    toISOString: () => date || '2025-01-01T00:00:00.000Z',
    format: () => date || '2025-01-01',
    startOf: vi.fn((unit: string) => ({
      toISOString: () => {
        if (unit === 'month') return '2025-01-01T00:00:00.000Z';
        if (unit === 'year') return '2025-01-01T00:00:00.000Z';
        return '2025-01-01T00:00:00.000Z';
      }
    }))
  }));
  mockDayjs.extend = vi.fn();
  return { default: mockDayjs };
});

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Box: ({ children, sx, ...props }: Record<string, unknown>) => (
    <div data-testid="box" data-sx={JSON.stringify(sx)} {...props}>
      {children as React.ReactNode}
    </div>
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
  Button: ({ children, onClick, disabled, ...props }: Record<string, unknown>) => (
    <button
      data-testid="button"
      onClick={onClick as () => void}
      disabled={disabled as boolean}
      {...props}
    >
      {children as React.ReactNode}
    </button>
  ),
  ButtonGroup: ({ children, size, variant, ...props }: Record<string, unknown>) => (
    <div
      data-testid="button-group"
      data-size={size}
      data-variant={variant}
      {...props}
    >
      {children as React.ReactNode}
    </div>
  ),
}));

// Mock Material-UI date pickers
vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }: Record<string, unknown>) => (
    <div data-testid="localization-provider">
      {children as React.ReactNode}
    </div>
  ),
}));

vi.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: vi.fn(),
}));

vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ value, onChange, disabled, views, format }: Record<string, unknown>) => (
    <div
      data-testid="date-picker"
      data-views={JSON.stringify(views)}
      data-format={format}
      data-disabled={disabled}
    >
      <input
        data-testid="date-picker-input"
        value={value?.format?.() || '2025-01-01'}
        onChange={(e) => {
          if (onChange && typeof onChange === 'function') {
            onChange({ toISOString: () => e.target.value });
          }
        }}
        disabled={disabled as boolean}
      />
    </div>
  ),
}));

describe('TimePeriodSelector', () => {
  const defaultProps = {
    title: 'Test Title',
    currentValue: '2025-01-01T00:00:00.000Z',
    onSelect: vi.fn(),
    pickerType: 'week' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<TimePeriodSelector {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render title correctly', () => {
    render(<TimePeriodSelector {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render date picker for week type', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="week" />);
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toHaveAttribute('data-views', JSON.stringify(['year', 'month', 'day']));
    expect(screen.getByTestId('date-picker')).toHaveAttribute('data-format', 'YYYY-MM-DD');
  });

  it('should render date picker for month type', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="month" />);
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toHaveAttribute('data-views', JSON.stringify(['month', 'year']));
    expect(screen.getByTestId('date-picker')).toHaveAttribute('data-format', 'YYYY-MM');
  });

  it('should render date picker for year type', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="year" />);
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toHaveAttribute('data-views', JSON.stringify(['year']));
    expect(screen.getByTestId('date-picker')).toHaveAttribute('data-format', 'YYYY');
  });

  it('should call onSelect when date picker value changes', () => {
    render(<TimePeriodSelector {...defaultProps} />);
    const dateInput = screen.getByTestId('date-picker-input');
    fireEvent.change(dateInput, { target: { value: '2025-02-01' } });
    expect(defaultProps.onSelect).toHaveBeenCalledWith('2025-02-01');
  });

  it('should disable date picker when disabled prop is true', () => {
    render(<TimePeriodSelector {...defaultProps} disabled={true} />);
    const datePicker = screen.getByTestId('date-picker');
    const dateInput = screen.getByTestId('date-picker-input');
    expect(datePicker).toHaveAttribute('data-disabled', 'true');
    expect(dateInput).toBeDisabled();
  });

  it('should render Today button for week picker type', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="week" />);
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.queryByText('Current Month')).not.toBeInTheDocument();
    expect(screen.queryByText('Current Year')).not.toBeInTheDocument();
  });

  it('should render Current Month button for month picker type', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="month" />);
    expect(screen.getByText('Current Month')).toBeInTheDocument();
    expect(screen.queryByText('Today')).not.toBeInTheDocument();
    expect(screen.queryByText('Current Year')).not.toBeInTheDocument();
  });

  it('should render Current Year button for year picker type', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="year" />);
    expect(screen.getByText('Current Year')).toBeInTheDocument();
    expect(screen.queryByText('Today')).not.toBeInTheDocument();
    expect(screen.queryByText('Current Month')).not.toBeInTheDocument();
  });

  it('should call onSelect when Today button is clicked', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="week" />);
    const todayButton = screen.getByText('Today');
    fireEvent.click(todayButton);
    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it('should call onSelect when Current Month button is clicked', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="month" />);
    const currentMonthButton = screen.getByText('Current Month');
    fireEvent.click(currentMonthButton);
    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it('should call onSelect when Current Year button is clicked', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="year" />);
    const currentYearButton = screen.getByText('Current Year');
    fireEvent.click(currentYearButton);
    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it('should disable quick navigation buttons when disabled prop is true', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="week" disabled={true} />);
    const todayButton = screen.getByText('Today');
    expect(todayButton).toBeDisabled();
  });

});
