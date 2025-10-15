import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import CurrencySummaryGrid from '../../../../src/components/summary/CurrencySummaryGrid';
import { ExpenseProvider } from '../../../../src/context/ExpenseProvider';
import type { Expense } from '../../../../src/types';

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

const theme = createTheme();

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <ExpenseProvider>
        {component}
      </ExpenseProvider>
    </ThemeProvider>
  );
};

describe('CurrencySummaryGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render currency breakdowns when expenses exist', () => {
    const mockExpenses: Expense[] = [
      { id: 1, description: 'USD Expense 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'EUR Expense 1', amount: 150, date: '2024-01-02', currency: 'EUR' },
      { id: 3, description: 'HUF Expense 1', amount: 300, date: '2024-01-03', currency: 'HUF' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<CurrencySummaryGrid />);
    
    // Should render the main title
    expect(screen.getByText('Currency Breakdowns')).toBeInTheDocument();
    
    // Should render currency-specific sections
    expect(screen.getByText('USD Summary')).toBeInTheDocument();
    expect(screen.getByText('EUR Summary')).toBeInTheDocument();
    expect(screen.getByText('HUF Summary')).toBeInTheDocument();
  });

  it('should not render when no expenses exist', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]));
    const { container } = renderWithProvider(<CurrencySummaryGrid />);
    
    // Should not render anything
    expect(container.firstChild).toBeNull();
  });

  it('should handle single currency', () => {
    const mockExpenses: Expense[] = [
      { id: 1, description: 'USD Expense 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'USD Expense 2', amount: 200, date: '2024-01-02', currency: 'USD' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<CurrencySummaryGrid />);
    
    // Should render only USD summary
    expect(screen.getByText('Currency Breakdowns')).toBeInTheDocument();
    expect(screen.getByText('USD Summary')).toBeInTheDocument();
    expect(screen.queryByText('EUR Summary')).not.toBeInTheDocument();
  });

  it('should display time period selectors for each currency', () => {
    const mockExpenses: Expense[] = [
      { id: 1, description: 'USD Expense 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'EUR Expense 1', amount: 150, date: '2024-01-02', currency: 'EUR' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<CurrencySummaryGrid />);
    
    // Should have time period selectors for each currency
    const weekSelectors = screen.getAllByText(/Daily Costs - Week of/);
    const monthSelectors = screen.getAllByText(/Weekly Costs -/);
    const yearSelectors = screen.getAllByText(/Monthly Costs -/);
    
    expect(weekSelectors).toHaveLength(2); // One for each currency
    expect(monthSelectors).toHaveLength(2); // One for each currency
    expect(yearSelectors).toHaveLength(2); // One for each currency
  });

  it('should display totals with correct currency symbols', () => {
    const mockExpenses: Expense[] = [
      { id: 1, description: 'USD Expense 1', amount: 100, date: '2024-01-01', currency: 'USD' },
      { id: 2, description: 'EUR Expense 1', amount: 150, date: '2024-01-02', currency: 'EUR' }
    ];
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
    renderWithProvider(<CurrencySummaryGrid />);
    
    // Should display totals with currency symbols
    expect(screen.getByText(/Weekly Total: .* USD/)).toBeInTheDocument();
    expect(screen.getByText(/Weekly Total: .* EUR/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Total: .* USD/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Total: .* EUR/)).toBeInTheDocument();
    expect(screen.getByText(/Yearly Total: .* USD/)).toBeInTheDocument();
    expect(screen.getByText(/Yearly Total: .* EUR/)).toBeInTheDocument();
  });

  it('should handle empty localStorage gracefully', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { container } = renderWithProvider(<CurrencySummaryGrid />);
    
    // Should not render anything when localStorage is empty
    expect(container.firstChild).toBeNull();
  });
});
