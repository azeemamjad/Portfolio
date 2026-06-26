import React, { createContext, useContext, useEffect, useState } from 'react';

export type ColorMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ColorMode;
  setTheme: (theme: ColorMode) => void;
  actualTheme: ColorMode;
}

const STORAGE_KEY = 'portfolio-color-mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): ColorMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ColorMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (next: ColorMode) => setThemeState(next);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
