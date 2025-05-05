
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
import CustomGpt from './pages/CustomGpt';
import ScriptValidationPage from './pages/ScriptValidationPage';
import MediaLibrary from './pages/MediaLibrary';
import TechnicalDocuments from './pages/TechnicalDocuments';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Index />} />
        
        {/* Páginas autenticadas */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        
        {/* Rotas de equipamentos */}
        <Route path="/admin/equipments" element={<PrivateRoute element={<AdminEquipments />} />} />
        <Route path="/admin/equipment/:id" element={<PrivateRoute element={<EquipmentDetailsPage />} />} />
        <Route path="/equipments/:id" element={<PrivateRoute element={<EquipmentDetails />} />} />
        
        {/* Estratégia de conteúdo */}
        <Route path="/content-strategy" element={<PrivateRoute element={<ContentStrategy />} />} />
        
        {/* Custom GPT e funcionalidades relacionadas */}
        <Route path="/custom-gpt" element={<PrivateRoute element={<CustomGpt />} />} />
        <Route path="/validate-script" element={<PrivateRoute element={<ScriptValidationPage />} />} />
        
        {/* Media e documentos */}
        <Route path="/media" element={<PrivateRoute element={<MediaLibrary />} />} />
        <Route path="/documents" element={<PrivateRoute element={<TechnicalDocuments />} />} />
        
        {/* Dashboard de vendedor */}
        <Route path="/seller/dashboard" element={<PrivateRoute element={<SellerDashboard />} />} />
        
        {/* Rota para página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
