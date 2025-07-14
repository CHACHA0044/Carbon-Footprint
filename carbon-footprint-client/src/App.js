import { HashRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './Components/AnimatedRoutes';
import { LoadingProvider } from './context/LoadingContext';

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
