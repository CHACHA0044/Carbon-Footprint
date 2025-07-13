import React, { useEffect, useState } from 'react';

const PageWrapper = ({ children, backgroundImage }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Handle theme
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Preload background
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = () => setBgLoaded(true);
    }
  }, [backgroundImage]);

  // Toggle theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div
      className={`min-h-screen w-full relative bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-500 ${
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

      {/* Optional Glass Background */}
      <div className="absolute inset-0 bg-white/20 dark:bg-black/30 backdrop-blur-lg z-0" />

      {/* Page Content Wrapper */}
      <div className="relative z-10 flex min-h-screen w-full justify-center items-center px-4">
        <div className="w-full max-w-6xl">{children}</div>
      </div>
    </div>
  );
};

export default PageWrapper;
