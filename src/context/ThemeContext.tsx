import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Theme } from '../types';

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#CCCCCC',
    success: '#27AE60',
    error: '#E74C3C',
    warning: '#F39C12',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#444444',
    success: '#27AE60',
    error: '#E74C3C',
    warning: '#F39C12',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
