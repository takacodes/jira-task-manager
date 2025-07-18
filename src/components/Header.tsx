import React from 'react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => (
  <header className={`w-full flex items-center justify-between px-8 py-4 shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
    <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Jira Task Manager</h1>
    <button
      className={`px-4 py-2 rounded shadow bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 transition`}
      onClick={onToggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙 ' : '☀️ '}
    </button>
  </header>
);

export default Header;
