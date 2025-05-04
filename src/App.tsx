
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound';
import EquipmentDetailsPage from './pages/EquipmentDetailsPage';
import Dashboard from './pages/Dashboard';
import AdminEquipments from './pages/AdminEquipments';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import EquipmentDetails from './pages/EquipmentDetails';
import Index from './pages/Index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/equipments" element={<AdminEquipments />} />
        <Route path="/equipment-details/:id" element={<EquipmentDetailsPage />} />
        <Route path="/equipments/:id" element={<EquipmentDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
