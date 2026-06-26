import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'default' | 'glass';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'default' }) => {
  const { actualTheme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  const className =
    variant === 'glass'
      ? 'navbar-glass-btn navbar-glass-btn--icon active:scale-95'
      : `relative w-10 h-10 rounded-xl flex items-center justify-center
         bg-surface-muted hover:bg-surface border border-line
         transition-all duration-200 hover:scale-105 active:scale-95`;

  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      aria-label={actualTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={actualTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {actualTheme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-accent" />
      )}
    </button>
  );
};

export default ThemeToggle;
