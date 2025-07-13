import React, { useEffect, useState } from 'react';

const PageWrapper = ({ children, backgroundImage }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => setBgLoaded(true);
    }
  }, [backgroundImage]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div
      className={`min-h-screen w-full relative flex flex-col items-center bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-500 ${
        bgLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-3 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="px-4 py-4 bg-transparent text-emerald-700 dark:text-white transition duration-300"
        >
          {darkMode ? '⁺₊⋆ ☾ ⋆⁺₊' : '⁺₊⋆ 𖤓 ⋆⁺₊'}
        </button>
      </div>

      {/* Optional Glass Background Layer */}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-lg z-0 rounded-none" />

      {/* Page Content */}
      <div
        className={`relative z-10 flex flex-col w-full min-h-screen justify-between items-center px-4 py-8 transition-opacity duration-1000 ${
          bgLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
