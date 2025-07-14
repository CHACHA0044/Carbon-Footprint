
import React from 'react';

const PageLoader = () => {
  return (
<div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] transition-opacity duration-300">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default PageLoader;
