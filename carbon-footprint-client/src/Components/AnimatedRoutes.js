// src/Components/AnimatedRoutes.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './Home';
import Login from './Auth/Login/Login';
import Register from './Auth/Register/Register';
import Dashboard from './Dashboard/Dashboard';
import History from './Footprint/History';
import Footprint from './Footprint/Footprint';
import EditFootprintForm from './Footprint/EditFootprintForm';
import PageLoader from 'common/PageLoader';

const AnimatedRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
    useEffect(() => {
    // Simulate background/image loading delay
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400); // match transition time
    return () => clearTimeout(timeout);
  }, [location.pathname]);
  return (
    <>
      {/* Loader animation on route change */}
      <AnimatePresence>
        {loading && <PageLoader key="loader" />}
      </AnimatePresence>

      {/* Actual route transitions */}
      <AnimatePresence mode="wait" initial={false}>
        {!loading && (
          <Routes location={location} key={location.pathname}>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/footprint" element={<Footprint />} />
            <Route path="/history" element={<History />} />
            <Route path="/edit/:id" element={<EditFootprintForm />} />
            <Route path="/" element={<Home />} />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedRoutes;
