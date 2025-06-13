
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import WorkspaceSettingsPage from './pages/WorkspaceSettingsPage';
import CalendarPage from './pages/CalendarPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import VideoStoragePage from './pages/VideoStoragePage';
import VideoBatchPage from './pages/VideoBatchPage';
import VideoImportPage from './pages/VideoImportPage';
import VideoSwipePage from './pages/VideoSwipePage';
import EquipmentsPage from './pages/EquipmentsPage';
import EquipmentDetailsPage from './pages/EquipmentDetailsPage';
import ScientificArticlesPage from './pages/ScientificArticlesPage';
import FluidaRoteiristPage from './pages/FluidaRoteiristsPage';
import ScriptGeneratorPage from './pages/ScriptGeneratorPage';
import ScriptValidationPage from './pages/ScriptValidationPage';
import ScriptApprovedPage from './pages/ScriptApprovedPage';
import ContentPlannerPage from './pages/ContentPlannerPage';
import ContentIdeasPage from './pages/ContentIdeasPage';
import ContentStrategyPage from './pages/ContentStrategyPage';
import MarketingConsultantPage from './pages/MarketingConsultantPage';
import ReportsPage from './pages/ReportsPage';
import DiagnosticHistoryPage from './pages/DiagnosticHistoryPage';
import ConsultantPanelPage from './pages/ConsultantPanelPage';

// Admin Pages
import AdminVideosPage from './pages/admin/AdminVideosPage';
import AdminEquipmentsPage from './pages/admin/AdminEquipmentsPage';
import AdminEquipmentCreatePage from './pages/admin/AdminEquipmentCreatePage';
import AdminEquipmentEditPage from './pages/admin/AdminEquipmentEditPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminAiPage from './pages/admin/AdminAiPage';
import AdminSystemDiagnosticsPage from './pages/admin/AdminSystemDiagnosticsPage';
import AdminSystemIntelligencePage from './pages/admin/AdminSystemIntelligencePage';
import AdminVimeoSettingsPage from './pages/admin/AdminVimeoSettingsPage';
import AdminWorkspacePage from './pages/admin/AdminWorkspacePage';

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
