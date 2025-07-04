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
      className="min-h-screen w-full relative flex justify-start items-center bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-500 ${bgLoaded ? 'opacity-100' : 'opacity-0'}"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      // Dark Mode Button
      <div className="absolute top-3 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="px-4 py-4 bg-transparent text-emerald-700 dark:text-white transition duration-300"
        >
          {darkMode ? '⁺₊⋆ ☾ ⋆⁺₊' : '⁺₊⋆ 𖤓 ⋆⁺₊'}
        </button>
      </div>

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
