
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
import EquipmentsPage from './pages/EquipmentsPage';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminIntegrations from './pages/AdminIntegrations';

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial (pública) */}
        <Route path="/" element={<Index />} />
        
        {/* Redirecionamento para a página inicial quando acessar /login */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        
        {/* Páginas autenticadas */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        
        {/* Rotas de equipamentos */}
        <Route path="/admin/equipments" element={<AdminRoute element={<AdminEquipments />} />} />
        <Route path="/admin/equipment/:id" element={<AdminRoute element={<EquipmentDetailsPage />} />} />
        <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path="/admin/integrations" element={<AdminRoute element={<AdminIntegrations />} />} />
        <Route path="/equipments" element={<PrivateRoute element={<EquipmentsPage />} />} />
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
