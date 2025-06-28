// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Auth/Login/Login';
import Register from './Components/Auth/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import History from './Components/Footprint/History';
import Footprint from './Components/Footprint/Footprint';
import EditFootprintForm from './Components/Footprint/EditFootprintForm';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/footprint" element={<Footprint />} />
        <Route path="/history" element={<History />} />
        <Route path="/edit/:id" element={<EditFootprintForm />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
