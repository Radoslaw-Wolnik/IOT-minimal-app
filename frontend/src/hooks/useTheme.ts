// src/hooks/useTheme.ts
import { useState, useEffect } from 'react';
import { setTheme, getTheme } from '../utils/theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    const initialValue = saved ? JSON.parse(saved) : undefined;
    return initialValue ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    setTheme(theme);

    localStorage.setItem('theme', JSON.stringify(theme));
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};