import Inicio from './pages/Inicio.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import List from './pages/List.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Admin from './pages/Admin.jsx';
import AdminGuard from "./components/AdminGuard.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/list" element={<List />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={
          <AdminGuard>
            <Admin />
          </AdminGuard>
        } />
        <Route path="/admin/users" element={
          <AdminGuard>
            <AdminUsers />
          </AdminGuard>
        } />
      </Routes>
    </Router>
  );
}
