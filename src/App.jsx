import Inicio from './pages/Inicio.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import List from './pages/List.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/list" element={<List />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
