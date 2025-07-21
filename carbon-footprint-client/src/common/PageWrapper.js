import React, { useEffect, useState, useRef } from 'react';
import { useLoading } from 'context/LoadingContext';
const PageWrapper = ({ children, backgroundImage }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const { setLoading, canStop } = useLoading();
  const cachedImage = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

 useEffect(() => {
    if (!backgroundImage) return;
    setBgLoaded(false);
    setLoading(true); // show loader while image loads

    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      cachedImage.current = backgroundImage; // persistently store the loaded image
      setBgLoaded(true);
      setLoading(false); // hide loader only after image loads
    };
  }, [backgroundImage, setLoading]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };
console.log('PageWrapper image:', backgroundImage);
console.log('bgLoaded:', bgLoaded, 'backgroundImage:', backgroundImage);
  return (
     <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden justify-between items-center">
      {/* Persistent background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        style={{
          backgroundImage: cachedImage.current ? `url(${cachedImage.current})` : 'none',
          opacity: cachedImage.current ? 1 : 0,
        }}
      ></div>

      {/* Dark mode toggle button */}
      <div className="relative w-full px-0">
      <div className="absolute top-3 right-2 md:right-3 z-50">
        <button
          onClick={toggleTheme}
          className="px-3 py-4 bg-transparent text-emerald-700 dark:text-white transition duration-300"
        >
          {darkMode ? '⁺₊⋆ ☾ ⋆⁺₊' : '⁺₊⋆ 𖤓 ⋆⁺₊'}
        </button>
      </div>
      </div>

      {/* Content area */}
      <div className="flex-grow w-full flex flex-col items-center justify-center px-4">
        {children}
      </div>

      {/* Footer fixed to bottom center */}
      <footer className="w-full text-center text-base italic py-4 text-emerald-700 dark:text-white">
      Carbon down. Future up. v0.0.1
      </footer>
    </div>
  );
};

export default PageWrapper;
