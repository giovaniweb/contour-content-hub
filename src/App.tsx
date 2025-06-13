
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import WorkspaceSettingsPage from './pages/WorkspaceSettings';
import CalendarPage from './pages/Calendar';
import MediaLibraryPage from './pages/MediaLibraryPage';
import VideoPlayerPage from './pages/VideoPlayer';
import VideoStoragePage from './pages/VideoStorage';
import VideoBatchPage from './pages/VideoBatchManage';
import VideoImportPage from './pages/videos/VideoImportPage';
import VideoSwipePage from './pages/VideoSwipe';
import EquipmentsPage from './pages/EquipmentsPage';
import EquipmentDetailsPage from './pages/EquipmentDetailsPage';
import ScientificArticlesPage from './pages/ScientificArticles';
import FluidaRoteiristPage from './pages/FluidaRoteiristsPage';
import ScriptGeneratorPage from './pages/ScriptGeneratorPage';
import ScriptValidationPage from './pages/ScriptValidationPage';
import ScriptApprovedPage from './pages/ScriptApprovedPage';
import ContentPlannerPage from './pages/ContentPlannerPage';
import ContentIdeasPage from './pages/ContentIdeas';
import ContentStrategyPage from './pages/ContentStrategy';
import MarketingConsultantPage from './pages/MarketingConsultant';
import ReportsPage from './pages/ReportsPage';
import DiagnosticHistoryPage from './pages/DiagnosticHistory';
import ConsultantPanelPage from './pages/consultant/ConsultantPanel';

// Admin Pages
import AdminVideosPage from './pages/admin/videos';
import AdminEquipmentsPage from './pages/admin/AdminEquipments';
import AdminEquipmentCreatePage from './pages/admin/CreateEquipment';
import AdminEquipmentEditPage from './pages/admin/EditEquipment';
import AdminContentPage from './pages/admin/AdminContent';
import AdminAiPage from './pages/admin/AdminAIPanel';
import AdminSystemDiagnosticsPage from './pages/admin/SystemDiagnostics';
import AdminSystemIntelligencePage from './pages/admin/SystemIntelligence';
import AdminVimeoSettingsPage from './pages/admin/VimeoSettings';
import AdminWorkspacePage from './pages/admin/WorkspaceSettings';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
          <Route path="/workspace-settings" element={<PrivateRoute><Layout><WorkspaceSettingsPage /></Layout></PrivateRoute>} />
          
          {/* Content Routes */}
          <Route path="/script-generator" element={<PrivateRoute><Layout><ScriptGeneratorPage /></Layout></PrivateRoute>} />
          <Route path="/script-validation" element={<PrivateRoute><Layout><ScriptValidationPage /></Layout></PrivateRoute>} />
          <Route path="/roteiros-aprovados" element={<PrivateRoute><Layout><ScriptApprovedPage /></Layout></PrivateRoute>} />
          <Route path="/fluidaroteirista" element={<PrivateRoute><Layout><FluidaRoteiristPage /></Layout></PrivateRoute>} />
          <Route path="/content-planner" element={<PrivateRoute><Layout><ContentPlannerPage /></Layout></PrivateRoute>} />
          <Route path="/content-ideas" element={<PrivateRoute><Layout><ContentIdeasPage /></Layout></PrivateRoute>} />
          <Route path="/content-strategy" element={<PrivateRoute><Layout><ContentStrategyPage /></Layout></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Layout><CalendarPage /></Layout></PrivateRoute>} />

          {/* Video Routes */}
          <Route path="/video-player" element={<PrivateRoute><Layout><VideoPlayerPage /></Layout></PrivateRoute>} />
          <Route path="/videos/storage" element={<PrivateRoute><Layout><VideoStoragePage /></Layout></PrivateRoute>} />
          <Route path="/videos/batch" element={<PrivateRoute><Layout><VideoBatchPage /></Layout></PrivateRoute>} />
          <Route path="/videos/import" element={<PrivateRoute><Layout><VideoImportPage /></Layout></PrivateRoute>} />
          <Route path="/videos/swipe" element={<PrivateRoute><Layout><VideoSwipePage /></Layout></PrivateRoute>} />

          {/* Equipment Routes */}
          <Route path="/equipments" element={<PrivateRoute><Layout><EquipmentsPage /></Layout></PrivateRoute>} />
          <Route path="/equipments/:id" element={<PrivateRoute><Layout><EquipmentDetailsPage /></Layout></PrivateRoute>} />

          {/* Media and Articles */}
          <Route path="/media" element={<PrivateRoute><Layout><MediaLibraryPage /></Layout></PrivateRoute>} />
          <Route path="/scientific-articles" element={<PrivateRoute><Layout><ScientificArticlesPage /></Layout></PrivateRoute>} />
          
          {/* Marketing Routes */}
          <Route path="/marketing-consultant" element={<PrivateRoute><Layout><MarketingConsultantPage /></Layout></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Layout><ReportsPage /></Layout></PrivateRoute>} />
          <Route path="/diagnostic-history" element={<PrivateRoute><Layout><DiagnosticHistoryPage /></Layout></PrivateRoute>} />

          {/* Consultant Routes */}
          <Route path="/consultant-panel" element={<PrivateRoute><Layout><ConsultantPanelPage /></Layout></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/videos" element={<AdminRoute><Layout><AdminVideosPage /></Layout></AdminRoute>} />
          <Route path="/admin/equipments" element={<AdminRoute><Layout><AdminEquipmentsPage /></Layout></AdminRoute>} />
          <Route path="/admin/equipments/create" element={<AdminRoute><Layout><AdminEquipmentCreatePage /></Layout></AdminRoute>} />
          <Route path="/admin/equipments/edit/:id" element={<AdminRoute><Layout><AdminEquipmentEditPage /></Layout></AdminRoute>} />
          <Route path="/admin/content" element={<AdminRoute><Layout><AdminContentPage /></Layout></AdminRoute>} />
          <Route path="/admin/ai" element={<AdminRoute><Layout><AdminAiPage /></Layout></AdminRoute>} />
          <Route path="/admin/system-diagnostics" element={<AdminRoute><Layout><AdminSystemDiagnosticsPage /></Layout></AdminRoute>} />
          <Route path="/admin/system-intelligence" element={<AdminRoute><Layout><AdminSystemIntelligencePage /></Layout></AdminRoute>} />
          <Route path="/admin/vimeo-settings" element={<AdminRoute><Layout><AdminVimeoSettingsPage /></Layout></AdminRoute>} />
          <Route path="/admin/workspace" element={<AdminRoute><Layout><AdminWorkspacePage /></Layout></AdminRoute>} />
        </Routes>
        
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
