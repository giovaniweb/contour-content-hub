import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import './styles/aurora-design-system.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipments from './pages/AdminEquipments';
import EquipmentDetail from './pages/EquipmentDetails';
import NotFound from './pages/NotFound';
import CreateEquipment from '@/pages/admin/CreateEquipment';
import EditEquipment from '@/pages/admin/EditEquipment';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import MarketingConsultant from './pages/MarketingConsultant';
import DiagnosticHistory from './pages/DiagnosticHistory';
import DiagnosticReport from './pages/DiagnosticReport';
import Media from './pages/Media';
import PhotosPage from './pages/PhotosPage';
import EquipmentList from './pages/EquipmentList';
import IdeaValidatorPage from './pages/IdeaValidatorPage';
import ContentPlannerPage from './pages/ContentPlannerPage';
import ScriptGeneratorPage from './pages/ScriptGeneratorPage';
import AppLayout from './components/layout/AppLayout';
import { ROUTES } from './routes';
import FluidaRoteiristPage from '@/pages/FluidaRoteiristsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes - without sidebar */}
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes - with sidebar layout */}
          <Route path={ROUTES.DASHBOARD} element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path={ROUTES.PROFILE} element={<AppLayout><Profile /></AppLayout>} />
          
          {/* Content Routes */}
          <Route path={ROUTES.CONTENT.SCRIPTS.GENERATOR} element={<AppLayout><ScriptGeneratorPage /></AppLayout>} />
          <Route path={ROUTES.CONTENT.SCRIPTS.VALIDATION} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Script Validation</h1><p>Valide seus roteiros aqui.</p></div></AppLayout>} />
          <Route path={ROUTES.CONTENT.PLANNER} element={<AppLayout><ContentPlannerPage /></AppLayout>} />
          <Route path={ROUTES.CONTENT.IDEAS} element={<AppLayout><IdeaValidatorPage /></AppLayout>} />
          <Route path={ROUTES.CONTENT.STRATEGY} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Content Strategy</h1><p>Desenvolva sua estratégia de conteúdo.</p></div></AppLayout>} />
          <Route path={ROUTES.CONTENT.CALENDAR} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Calendar</h1><p>Calendário de publicações.</p></div></AppLayout>} />
          
          {/* Videos Routes */}
          <Route path={ROUTES.VIDEOS.ROOT} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Videos</h1><p>Gerencie seus vídeos.</p></div></AppLayout>} />
          <Route path={ROUTES.VIDEOS.CREATE} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Create Video</h1><p>Crie novos vídeos.</p></div></AppLayout>} />
          <Route path={ROUTES.VIDEOS.PLAYER} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Video Player</h1><p>Reproduza seus vídeos.</p></div></AppLayout>} />
          <Route path={ROUTES.VIDEOS.STORAGE} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Video Storage</h1><p>Armazenamento de vídeos.</p></div></AppLayout>} />
          <Route path={ROUTES.VIDEOS.BATCH} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Batch Videos</h1><p>Processamento em lote.</p></div></AppLayout>} />
          <Route path={ROUTES.VIDEOS.IMPORT} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Import Videos</h1><p>Importe vídeos externos.</p></div></AppLayout>} />
          <Route path={ROUTES.VIDEOS.SWIPE} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Video Swipe</h1><p>Interface swipe para vídeos.</p></div></AppLayout>} />
          
          {/* Equipment Routes */}
          <Route path={ROUTES.EQUIPMENTS.LIST} element={<AppLayout><EquipmentList /></AppLayout>} />
          <Route path={ROUTES.EQUIPMENTS.DETAILS(':id')} element={<AppLayout><EquipmentDetail /></AppLayout>} />
          
          {/* Media Routes */}
          <Route path={ROUTES.MEDIA} element={<AppLayout><Media /></AppLayout>} />
          <Route path="/photos" element={<AppLayout><PhotosPage /></AppLayout>} />
          <Route path="/arts" element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Arts Page</h1><p>Galeria de artes e designs.</p></div></AppLayout>} />
          
          {/* Scientific Articles */}
          <Route path={ROUTES.SCIENTIFIC_ARTICLES} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Scientific Articles</h1><p>Artigos científicos e pesquisas.</p></div></AppLayout>} />
          
          {/* Marketing Routes */}
          <Route path={ROUTES.MARKETING.CONSULTANT} element={<AppLayout><MarketingConsultant /></AppLayout>} />
          <Route path={ROUTES.MARKETING.REPORTS} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p>Relatórios de marketing.</p></div></AppLayout>} />
          <Route path={ROUTES.MARKETING.DIAGNOSTIC_HISTORY} element={<AppLayout><DiagnosticHistory /></AppLayout>} />
          
          {/* Diagnostic Report Route */}
          <Route path="/diagnostic-report/:sessionId" element={<AppLayout><DiagnosticReport /></AppLayout>} />
          
          {/* Consultant Routes */}
          <Route path={ROUTES.CONSULTANT.PANEL} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Consultant Panel</h1><p>Painel de consultoria.</p></div></AppLayout>} />
          
          {/* Admin Routes */}
          <Route path={ROUTES.ADMIN.ROOT} element={<AppLayout requireAdmin><AdminDashboard /></AppLayout>} />
          <Route path={ROUTES.ADMIN.EQUIPMENTS.ROOT} element={<AppLayout requireAdmin><AdminEquipments /></AppLayout>} />
          <Route path={ROUTES.ADMIN.EQUIPMENTS.CREATE} element={<AppLayout requireAdmin><CreateEquipment /></AppLayout>} />
          <Route path={ROUTES.ADMIN.EQUIPMENTS.EDIT(':id')} element={<AppLayout requireAdmin><EditEquipment /></AppLayout>} />
          <Route path={ROUTES.ADMIN.CONTENT} element={<AppLayout requireAdmin><div className="p-6"><h1 className="text-2xl font-bold">Admin Content</h1><p>Gerenciamento de conteúdo.</p></div></AppLayout>} />
          <Route path={ROUTES.ADMIN.AI} element={<AppLayout requireAdmin><div className="p-6"><h1 className="text-2xl font-bold">Admin AI</h1><p>Configurações de IA.</p></div></AppLayout>} />
          <Route path={ROUTES.ADMIN.SYSTEM.DIAGNOSTICS} element={<AppLayout requireAdmin><div className="p-6"><h1 className="text-2xl font-bold">System Diagnostics</h1><p>Diagnóstico do sistema.</p></div></AppLayout>} />
          <Route path={ROUTES.ADMIN.SYSTEM.INTELLIGENCE} element={<AppLayout requireAdmin><div className="p-6"><h1 className="text-2xl font-bold">System Intelligence</h1><p>Inteligência do sistema.</p></div></AppLayout>} />
          <Route path={ROUTES.ADMIN.VIMEO.SETTINGS} element={<AppLayout requireAdmin><div className="p-6"><h1 className="text-2xl font-bold">Vimeo Settings</h1><p>Configurações do Vimeo.</p></div></AppLayout>} />
          <Route path={ROUTES.ADMIN.WORKSPACE} element={<AppLayout requireAdmin><div className="p-6"><h1 className="text-2xl font-bold">Admin Workspace</h1><p>Área de trabalho administrativa.</p></div></AppLayout>} />
          <Route path={ROUTES.ADMIN_VIDEOS} element={<AppLayout requireAdmin><div className="p-6"><h1 className="text-2xl font-bold">Admin Videos</h1><p>Administração de vídeos.</p></div></AppLayout>} />
          
          {/* Workspace Settings */}
          <Route path={ROUTES.WORKSPACE_SETTINGS} element={<AppLayout><div className="p-6"><h1 className="text-2xl font-bold">Workspace Settings</h1><p>Configurações do workspace.</p></div></AppLayout>} />
          
          {/* Script Generator Route */}
          <Route path="/script-generator" element={<AppLayout><ScriptGeneratorPage /></AppLayout>} />
          
          {/* Nova rota para FLUIDAROTEIRISTA */}
          <Route 
            path="/fluidaroteirista" 
            element={
              <AppLayout>
                <FluidaRoteiristPage />
              </AppLayout>
            } 
          />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
