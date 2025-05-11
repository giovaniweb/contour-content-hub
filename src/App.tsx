
import { Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import ContentStrategy from '@/pages/ContentStrategy';
import ContentPlannerPage from '@/pages/ContentPlannerPage';
import EquipmentsPage from '@/pages/EquipmentsPage';
import MediaLibraryPage from '@/pages/MediaLibraryPage';
import ScriptGeneratorPage from '@/pages/ScriptGeneratorPage';
import VideoStorage from '@/pages/VideoStorage';
import VideoBatchManage from '@/pages/VideoBatchManage';
import EquipmentDetailsPage from '@/pages/EquipmentDetailsPage';
import ScriptValidationPage from '@/pages/ScriptValidationPage';
import TechnicalDocuments from '@/pages/TechnicalDocuments';
import DocumentDetail from '@/pages/DocumentDetail';
import ReportsPage from '@/pages/ReportsPage';
import IdeaValidatorPage from '@/pages/IdeaValidatorPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminEquipments from '@/pages/AdminEquipments';
import AdminContent from '@/pages/AdminContent';
import AdminAIPanel from '@/pages/AdminAIPanel';
import VimeoSettings from '@/pages/VimeoSettings';
import VimeoCallback from '@/pages/auth/VimeoCallback';
import VideoBatchImport from '@/pages/VideoBatchImport';
import SystemDiagnostics from '@/pages/SystemDiagnostics';
import SystemIntelligence from '@/pages/SystemIntelligence';
import VideoSwipe from '@/pages/VideoSwipe';
import MarketingConsultant from '@/pages/MarketingConsultant';
import ScientificArticles from '@/pages/ScientificArticles';
import VideoPlayer from '@/pages/VideoPlayer';
import InvitesPage from '@/pages/InvitesPage';
import WorkspaceSettings from '@/pages/WorkspaceSettings';
import ConsultantPanel from '@/pages/consultant/ConsultantPanel';

import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorBoundaryGeneric from '@/components/ErrorBoundaryGeneric';

// Routes
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';

// Provider context
import { SlideNotificationProvider } from '@/components/notifications/SlideNotificationProvider';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryGeneric}>
      <SlideNotificationProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/vimeo/callback" element={<VimeoCallback />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/content-strategy" element={<ContentStrategy />} />
            <Route path="/content-planner" element={<ContentPlannerPage />} />
            <Route path="/equipments" element={<EquipmentsPage />} />
            <Route path="/media" element={<MediaLibraryPage />} />
            <Route path="/script-generator" element={<ScriptGeneratorPage />} />
            <Route path="/video-storage" element={<VideoStorage />} />
            <Route path="/video-batch" element={<VideoBatchManage />} />
            <Route path="/equipment/:id" element={<EquipmentDetailsPage />} />
            <Route path="/script-validation" element={<ScriptValidationPage />} />
            <Route path="/documents" element={<TechnicalDocuments />} />
            <Route path="/document/:id" element={<DocumentDetail />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/idea-validator" element={<IdeaValidatorPage />} />
            <Route path="/vimeo-settings" element={<VimeoSettings />} />
            <Route path="/vimeo-import" element={<VideoBatchImport />} />
            <Route path="/video-swipe" element={<VideoSwipe />} />
            <Route path="/marketing-consultant" element={<MarketingConsultant />} />
            <Route path="/scientific-articles" element={<ScientificArticles />} />
            <Route path="/video-player" element={<VideoPlayer />} />
            <Route path="/invites" element={<InvitesPage />} />
            <Route path="/workspace-settings" element={<WorkspaceSettings />} />
          </Route>

          {/* Consultant Routes */}
          <Route path="/consultant" element={<PrivateRoute requiredRole="consultor" />}>
            <Route index element={<ConsultantPanel />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="equipments" element={<AdminEquipments />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="ai" element={<AdminAIPanel />} />
            <Route path="system-diagnostics" element={<SystemDiagnostics />} />
            <Route path="system-intelligence" element={<SystemIntelligence />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </SlideNotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
