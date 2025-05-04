
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
import SellerDashboard from './pages/seller/SellerDashboard';
import ContentStrategy from './pages/ContentStrategy';

function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Index />} />
        
        {/* Páginas autenticadas */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rotas de equipamentos */}
        <Route path="/admin/equipments" element={<AdminEquipments />} />
        <Route path="/equipment-details/:id" element={<EquipmentDetailsPage />} />
        <Route path="/equipments/:id" element={<EquipmentDetails />} />
        
        {/* Estratégia de conteúdo */}
        <Route path="/content-strategy" element={<ContentStrategy />} />
        
        {/* Dashboard de vendedor */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        
        {/* Rota para página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
