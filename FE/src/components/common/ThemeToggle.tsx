import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { actualTheme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center
                 bg-gray-100 hover:bg-gray-200
                 dark:bg-gray-800 dark:hover:bg-gray-700
                 transition-all duration-200 hover:scale-105 active:scale-95
                 border border-gray-200 dark:border-gray-700"
      aria-label={actualTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={actualTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {actualTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
