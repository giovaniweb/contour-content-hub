
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import './styles/aurora-design-system.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipments from './pages/AdminEquipments';
import EquipmentDetail from './pages/EquipmentDetails';
import NotFound from './pages/NotFound';
import CreateEquipment from '@/pages/admin/CreateEquipment';
import EditEquipment from '@/pages/admin/EditEquipment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/equipments/:id" element={<EquipmentDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/equipments" element={<AdminEquipments />} />
        <Route path="/admin/equipments/create" element={<CreateEquipment />} />
        <Route path="/admin/equipments/edit/:id" element={<EditEquipment />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
