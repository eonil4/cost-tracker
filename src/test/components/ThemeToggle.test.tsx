import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

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

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  const renderWithProvider = (initialMode = 'system') => {
    localStorageMock.getItem.mockReturnValue(initialMode);
    return render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
  };

  it('should render with system theme icon initially', () => {
    renderWithProvider('system');
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Check for SettingsBrightness icon (system theme)
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should show correct tooltip for system theme', () => {
    renderWithProvider('system');
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('should show correct tooltip for light theme', () => {
    renderWithProvider('light');
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('should show correct tooltip for dark theme', () => {
    renderWithProvider('dark');
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to system theme');
  });

  it('should cycle through themes when clicked', () => {
    renderWithProvider('light');
    
    const button = screen.getByRole('button');
    
    // Start with light theme
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    
    // Click to go to dark
    fireEvent.click(button);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
    
    // Click to go to system
    fireEvent.click(button);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'system');
    
    // Click to go back to light
    fireEvent.click(button);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'light');
  });

  it('should handle click events correctly', () => {
    renderWithProvider('system');
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'light');
  });
});

