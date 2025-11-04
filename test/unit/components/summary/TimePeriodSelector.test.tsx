import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimePeriodSelector from '../../../../src/components/summary/TimePeriodSelector';

// Mock dayjs
vi.mock('dayjs', () => {
  const mockDayjs = vi.fn((date?: string) => ({
    toISOString: () => date || '2025-01-01T00:00:00.000Z',
    format: () => date || '2025-01-01',
    isValid: () => true,
    startOf: vi.fn((unit: string) => ({
      toISOString: () => {
        if (unit === 'month') return '2025-01-01T00:00:00.000Z';
        if (unit === 'year') return '2025-01-01T00:00:00.000Z';
        if (unit === 'week') return '2024-12-30T00:00:00.000Z'; // Sunday before Monday
        return '2025-01-01T00:00:00.000Z';
      },
      add: vi.fn((amount: number, unit: string) => ({
        toISOString: () => {
          if (unit === 'day' && amount === 1) return '2025-01-01T00:00:00.000Z'; // Monday
          return '2025-01-01T00:00:00.000Z';
        }
      }))
    })),
    add: vi.fn((amount: number, unit: string) => ({
      toISOString: () => {
        if (unit === 'day' && amount === 1) return '2025-01-02T00:00:00.000Z';
        return '2025-01-01T00:00:00.000Z';
      },
      isAfter: vi.fn(() => false),
      subtract: vi.fn(() => ({
        toISOString: () => '2024-12-25T00:00:00.000Z'
      }))
    })),
    isAfter: vi.fn(() => false),
    subtract: vi.fn(() => ({
      toISOString: () => '2024-12-25T00:00:00.000Z'
    }))
  }));
  (mockDayjs as Record<string, unknown>).extend = vi.fn();
  (mockDayjs as Record<string, unknown>).locale = vi.fn();
  return { default: mockDayjs };
});

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Box: ({ children, sx, ...props }: Record<string, unknown>) => (
    <div data-testid="box" data-sx={JSON.stringify(sx)} {...props}>
      {children as React.ReactNode}
    </div>
  ),
  Typography: ({ children, variant, align, gutterBottom, ...props }: Record<string, unknown>) => {
    // Render text content for specific patterns
    const textContent = children as string;
    if (textContent && typeof textContent === 'string') {
      if (textContent.includes('Test Title') || 
          textContent.includes('Current Week') || 
          textContent.includes('Current Month') ||
          textContent.includes('Current Year')) {
        return (
          <div
            data-testid="typography"
            data-variant={variant}
            data-align={align}
            data-gutter-bottom={gutterBottom}
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
        data-gutter-bottom={gutterBottom}
        {...props}
      >
        {children as React.ReactNode}
      </div>
    );
  },
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
            // Create a mock dayjs object with the necessary methods
            const mockDayjs = {
              toISOString: () => e.target.value,
              startOf: vi.fn(() => ({
                add: vi.fn((amount: number, unit: string) => ({
                  toISOString: () => {
                    if (unit === 'day' && amount === 1) return '2025-01-01T00:00:00.000Z'; // Monday
                    return e.target.value;
                  },
                  isAfter: vi.fn(() => false),
                  subtract: vi.fn(() => ({
                    toISOString: () => '2024-12-25T00:00:00.000Z'
                  }))
                }))
              })),
              isAfter: vi.fn(() => false),
              subtract: vi.fn(() => ({
                toISOString: () => '2024-12-25T00:00:00.000Z'
              }))
            };
            onChange(mockDayjs);
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
    // For week picker, it should return the start of the week (Monday)
    expect(defaultProps.onSelect).toHaveBeenCalledWith('2025-01-01T00:00:00.000Z');
  });

  it('should disable date picker when disabled prop is true', () => {
    render(<TimePeriodSelector {...defaultProps} disabled={true} />);
    const datePicker = screen.getByTestId('date-picker');
    const dateInput = screen.getByTestId('date-picker-input');
    expect(datePicker).toHaveAttribute('data-disabled', 'true');
    expect(dateInput).toBeDisabled();
  });

  it('should render Current Week button for week picker type', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="week" />);
    expect(screen.getByText('Current Week')).toBeInTheDocument();
    expect(screen.queryByText('Current Month')).not.toBeInTheDocument();
    expect(screen.queryByText('Current Year')).not.toBeInTheDocument();
  });

  it('should render Current Month button for month picker type', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="month" />);
    expect(screen.getByText('Current Month')).toBeInTheDocument();
    expect(screen.queryByText('Current Week')).not.toBeInTheDocument();
    expect(screen.queryByText('Current Year')).not.toBeInTheDocument();
  });

  it('should render Current Year button for year picker type', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="year" />);
    expect(screen.getByText('Current Year')).toBeInTheDocument();
    expect(screen.queryByText('Current Week')).not.toBeInTheDocument();
    expect(screen.queryByText('Current Month')).not.toBeInTheDocument();
  });

  it('should call onSelect when Current Week button is clicked', () => {
    render(<TimePeriodSelector {...defaultProps} pickerType="week" />);
    const currentWeekButton = screen.getByText('Current Week');
    fireEvent.click(currentWeekButton);
    // For week picker, it should return the start of the current week (Monday)
    expect(defaultProps.onSelect).toHaveBeenCalledWith('2025-01-01T00:00:00.000Z');
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
    const currentWeekButton = screen.getByText('Current Week');
    expect(currentWeekButton).toBeDisabled();
  });

});
