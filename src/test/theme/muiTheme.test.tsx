import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { lightTheme, darkTheme } from '../../theme/muiTheme';
import { ThemeProvider as CustomThemeProvider } from '../../context/ThemeContext';

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

// Mock matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
});

// Test component that uses Material-UI theme
const TestComponent: React.FC = () => {
  return (
    <div>
      <button data-testid="test-button">Test Button</button>
    </div>
  );
};

describe('Material-UI Theme Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it('should apply light theme correctly', () => {
    localStorageMock.getItem.mockReturnValue('light');
    
    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    
    // Check that the document has the correct theme attribute
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('should apply dark theme correctly', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    
    // Check that the document has the correct theme attribute
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('should apply system theme correctly', () => {
    localStorageMock.getItem.mockReturnValue('system');
    
    render(
      <CustomThemeProvider>
        <TestComponent />
      </CustomThemeProvider>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    
    // Check that the document has the correct theme attribute
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('should create light theme with correct palette', () => {
    expect(lightTheme.palette.mode).toBe('light');
    expect(lightTheme.palette.background.default).toBe('#f5f5f5');
    expect(lightTheme.palette.background.paper).toBe('#ffffff');
    expect(lightTheme.palette.primary.main).toBe('#1976d2');
  });

  it('should create dark theme with correct palette', () => {
    expect(darkTheme.palette.mode).toBe('dark');
    expect(darkTheme.palette.background.default).toBe('#121212');
    expect(darkTheme.palette.background.paper).toBe('#1e1e1e');
    expect(darkTheme.palette.primary.main).toBe('#90caf9');
  });

  it('should have consistent typography across themes', () => {
    expect(lightTheme.typography.fontFamily).toBe('"Inter", "Roboto", "Helvetica", "Arial", sans-serif');
    expect(darkTheme.typography.fontFamily).toBe('"Inter", "Roboto", "Helvetica", "Arial", sans-serif');
  });
});
