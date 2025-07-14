import React from 'react';
import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="loader border-4 border-emerald-300 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
    </motion.div>
  );
}
