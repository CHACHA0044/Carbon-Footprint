import React, { useEffect, useState } from 'react';

const PageWrapper = ({ children, backgroundImage }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      }}
    >
      {/* Dark Mode Button */}
      <div className="absolute top-3 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="px-4 py-4 bg-transparent text-emerald-700 dark:text-white transition duration-300"
        >
          {darkMode ? '⁺₊⋆ ☾ ⋆⁺₊' : '⁺₊⋆ 𖤓 ⋆⁺₊'}
        </button>
      </div>

      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
