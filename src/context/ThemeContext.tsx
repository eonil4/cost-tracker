import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../theme/muiTheme';
import { ThemeContext } from './ThemeContextDefinition';
import type { ThemeMode } from './ThemeContextDefinition';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return mode;
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  useEffect(() => {
    const updateActualTheme = () => {
      if (mode === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setActualTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        setActualTheme(mode);
      }
    };

    updateActualTheme();

    if (mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateActualTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  const muiTheme = actualTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, setMode, actualTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

