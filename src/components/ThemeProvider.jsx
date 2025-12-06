'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for saved theme in localStorage or default to system
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);

    // Determine the actual theme based on preferences
    const getActualTheme = () => {
      if (savedTheme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return savedTheme;
    };

    const actualTheme = getActualTheme();
    setResolvedTheme(actualTheme);
    setIsDarkMode(actualTheme === 'dark');

    // Apply theme to document
    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark');

    root.classList.add(actualTheme);
    root.setAttribute('data-theme', actualTheme);

    // Set CSS color scheme
    root.style.colorScheme = actualTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' :
                    theme === 'dark' ? 'system' : 'light';

    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);

    // Update the DOM
    const getActualTheme = () => {
      if (newTheme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return newTheme;
    };

    const actualTheme = getActualTheme();
    setResolvedTheme(actualTheme);
    setIsDarkMode(actualTheme === 'dark');

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
    root.setAttribute('data-theme', actualTheme);
    root.style.colorScheme = actualTheme;
  };

  // Listen to system preference changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (theme === 'system') {
          const actualTheme = mediaQuery.matches ? 'dark' : 'light';
          setResolvedTheme(actualTheme);
          setIsDarkMode(actualTheme === 'dark');

          const root = window.document.documentElement;
          root.classList.remove('light', 'dark');
          root.classList.add(actualTheme);
          root.setAttribute('data-theme', actualTheme);
          root.style.colorScheme = actualTheme;
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Return null until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'system', resolvedTheme: null, isDarkMode: false, toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};