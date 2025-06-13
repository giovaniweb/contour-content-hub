
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import AppLayout from './components/layout/AppLayout';
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
          
          {/* Private Routes with Sidebar */}
          <Route path="/dashboard" element={<PrivateRoute><AppLayout><DashboardPage /></AppLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><AppLayout><ProfilePage /></AppLayout></PrivateRoute>} />
          <Route path="/workspace-settings" element={<PrivateRoute><AppLayout><WorkspaceSettingsPage /></AppLayout></PrivateRoute>} />
          
          {/* Content Routes with Sidebar */}
          <Route path="/script-generator" element={<PrivateRoute><AppLayout><ScriptGeneratorPage /></AppLayout></PrivateRoute>} />
          <Route path="/script-validation" element={<PrivateRoute><AppLayout><ScriptValidationPage /></AppLayout></PrivateRoute>} />
          <Route path="/roteiros-aprovados" element={<PrivateRoute><AppLayout><ScriptApprovedPage /></AppLayout></PrivateRoute>} />
          <Route path="/fluidaroteirista" element={<PrivateRoute><AppLayout><FluidaRoteiristPage /></AppLayout></PrivateRoute>} />
          <Route path="/content-planner" element={<PrivateRoute><AppLayout><ContentPlannerPage /></AppLayout></PrivateRoute>} />
          <Route path="/content-ideas" element={<PrivateRoute><AppLayout><ContentIdeasPage /></AppLayout></PrivateRoute>} />
          <Route path="/content-strategy" element={<PrivateRoute><AppLayout><ContentStrategyPage /></AppLayout></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><AppLayout><CalendarPage /></AppLayout></PrivateRoute>} />

          {/* Video Routes with Sidebar */}
          <Route path="/video-player" element={<PrivateRoute><AppLayout><VideoPlayerPage /></AppLayout></PrivateRoute>} />
          <Route path="/videos/storage" element={<PrivateRoute><AppLayout><VideoStoragePage /></AppLayout></PrivateRoute>} />
          <Route path="/videos/batch" element={<PrivateRoute><AppLayout><VideoBatchPage /></AppLayout></PrivateRoute>} />
          <Route path="/videos/import" element={<PrivateRoute><AppLayout><VideoImportPage /></AppLayout></PrivateRoute>} />
          <Route path="/videos/swipe" element={<PrivateRoute><AppLayout><VideoSwipePage /></AppLayout></PrivateRoute>} />

          {/* Equipment Routes with Sidebar */}
          <Route path="/equipments" element={<PrivateRoute><AppLayout><EquipmentsPage /></AppLayout></PrivateRoute>} />
          <Route path="/equipments/:id" element={<PrivateRoute><AppLayout><EquipmentDetailsPage /></AppLayout></PrivateRoute>} />

          {/* Media and Articles with Sidebar */}
          <Route path="/media" element={<PrivateRoute><AppLayout><MediaLibraryPage /></AppLayout></PrivateRoute>} />
          <Route path="/scientific-articles" element={<PrivateRoute><AppLayout><ScientificArticlesPage /></AppLayout></PrivateRoute>} />
          
          {/* Marketing Routes with Sidebar */}
          <Route path="/marketing-consultant" element={<PrivateRoute><AppLayout><MarketingConsultantPage /></AppLayout></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><AppLayout><ReportsPage /></AppLayout></PrivateRoute>} />
          <Route path="/diagnostic-history" element={<PrivateRoute><AppLayout><DiagnosticHistoryPage /></AppLayout></PrivateRoute>} />

          {/* Consultant Routes with Sidebar */}
          <Route path="/consultant-panel" element={<PrivateRoute><AppLayout><ConsultantPanelPage /></AppLayout></PrivateRoute>} />

          {/* Admin Routes with Sidebar */}
          <Route path="/admin/videos" element={<AdminRoute><AppLayout requireAdmin><AdminVideosPage /></AppLayout></AdminRoute>} />
          <Route path="/admin/equipments" element={<AdminRoute><AppLayout requireAdmin><AdminEquipmentsPage /></AppLayout></AdminRoute>} />
          <Route path="/admin/equipments/create" element={<AdminRoute><AppLayout requireAdmin><AdminEquipmentCreatePage /></AppLayout></AdminRoute>} />
          <Route path="/admin/equipments/edit/:id" element={<AdminRoute><AppLayout requireAdmin><AdminEquipmentEditPage /></AppLayout></AdminRoute>} />
          <Route path="/admin/content" element={<AdminRoute><AppLayout requireAdmin><AdminContentPage /></AppLayout></AdminRoute>} />
          <Route path="/admin/ai" element={<AdminRoute><AppLayout requireAdmin><AdminAiPage /></AppLayout></AdminRoute>} />
          <Route path="/admin/system-diagnostics" element={<AdminRoute><AppLayout requireAdmin><AdminSystemDiagnosticsPage /></AppLayout></AdminRoute>} />
          <Route path="/admin/system-intelligence" element={<AdminRoute><AppLayout requireAdmin><AdminSystemIntelligencePage /></AppLayout></AdminRoute>} />
          <Route path="/admin/vimeo-settings" element={<AdminRoute><AppLayout requireAdmin><AdminVimeoSettingsPage /></AppLayout></AdminRoute>} />
          <Route path="/admin/workspace" element={<AdminRoute><AppLayout requireAdmin><AdminWorkspacePage /></AppLayout></AdminRoute>} />
        </Routes>
        
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
