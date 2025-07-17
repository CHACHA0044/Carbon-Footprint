import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './Components/AnimatedRoutes';
import { LoadingProvider } from 'context/LoadingContext';
import React from 'react';
//import PageWrapper from 'common/PageWrapper';
function App() {
  return (
    <Router>
      <LoadingProvider>
       {/* <PageWrapper>*/}
          <AnimatedRoutes />
       {/*  </PageWrapper>*/}
      </LoadingProvider>
    </Router>
  );
}

export default App;
