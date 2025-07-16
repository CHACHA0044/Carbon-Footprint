import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './Components/AnimatedRoutes';
import { LoadingProvider } from 'context/LoadingContext';
import React from 'react';

function App() {
  return (
    <LoadingProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </LoadingProvider>
  );
}

export default App;
