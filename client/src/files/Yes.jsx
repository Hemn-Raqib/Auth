import { useState, useEffect } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import {logosStyles} from '../css/Styles'
const Yes = ({ onThemeToggle }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    onThemeToggle?.(newTheme);
  };

  return (
    <div className="logo-container">
      <button 
        onClick={toggleTheme} 
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </button>
      <button 
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        <img src={reactLogo} className="logo react" alt="React logo" />
      </button>
      <style>{logosStyles}</style>
    </div>
  );
};

export default Yes;