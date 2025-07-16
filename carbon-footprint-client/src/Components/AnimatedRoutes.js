// src/Components/AnimatedRoutes.js
import React, { useEffect } from 'react';
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
import { useLoading } from 'context/LoadingContext';
import PageWrapper from 'common/PageWrapper';

const AnimatedRoutes = () => {
  const location = useLocation();
  const { loading, setLoading, setCanStop } = useLoading();

  // ✅ Trigger loading on every route change
  useEffect(() => {
  setLoading(true);
  setCanStop(false);
  const minTime = setTimeout(() => {
    setCanStop(true);
  }, 200); // min time

  return () => clearTimeout(minTime);
}, [location]);


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
            <Route path="/home" element={<PageWrapper backgroundImage="/images/home-bk.webp"><Home /></PageWrapper>}/>
            <Route path="/login" element={<PageWrapper backgroundImage="/images/register-bk.webp"><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper backgroundImage="/images/register-bk.webp"><Register /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper backgroundImage="/images/dashboard-bk.webp"><Dashboard /></PageWrapper>} />
            <Route path="/footprint" element={<PageWrapper backgroundImage="/images/home-bk.webp"><Footprint /></PageWrapper>} />
            <Route path="/history" element={<PageWrapper backgroundImage="/images/history-bk.webp"><History /></PageWrapper>} />
            <Route path="/edit/:id" element={<PageWrapper backgroundImage="/images/edit-bk.webp"><EditFootprintForm /></PageWrapper>} />
            <Route path="/" element={<PageWrapper backgroundImage="/images/home-bk.webp"><Home /></PageWrapper>} />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedRoutes;
