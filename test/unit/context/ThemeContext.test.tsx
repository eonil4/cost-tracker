import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '../../../src/context/ThemeContext';
import { useTheme } from '../../../src/context/useTheme';

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

// Test component that uses the theme context
const TestComponent: React.FC = () => {
  const { mode, setMode, actualTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="mode">{mode}</div>
      <div data-testid="actual-theme">{actualTheme}</div>
      <button onClick={() => setMode('light')}>Set Light</button>
      <button onClick={() => setMode('dark')}>Set Dark</button>
      <button onClick={() => setMode('system')}>Set System</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should provide default system theme when no localStorage value', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('system');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('light');
  });

  it('should load theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark');
  });

  it('should update theme mode and save to localStorage', () => {
    localStorageMock.getItem.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Set Dark'));
    
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
  });

  it('should cycle through theme modes correctly', () => {
    localStorageMock.getItem.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Start with light
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    
    // Click to go to dark
    fireEvent.click(screen.getByText('Set Dark'));
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    
    // Click to go to system
    fireEvent.click(screen.getByText('Set System'));
    expect(screen.getByTestId('mode')).toHaveTextContent('system');
  });

  it('should respond to system theme changes when in system mode', () => {
    localStorageMock.getItem.mockReturnValue('system');
    
    const mockAddEventListener = vi.fn();
    const mockRemoveEventListener = vi.fn();
    
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('system');
    expect(screen.getByTestId('actual-theme')).toHaveTextContent('light');
    
    // Verify that event listener was added
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should throw error when used outside ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});
