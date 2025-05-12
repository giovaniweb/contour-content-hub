
import { Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/dashboard';
import Profile from '@/pages/Profile';
import ContentStrategy from '@/pages/ContentStrategy';
import ContentPlannerPage from '@/pages/ContentPlannerPage';
import EquipmentsPage from '@/pages/EquipmentsPage';
import MediaLibraryPage from '@/pages/MediaLibraryPage';
import ScriptGeneratorPage from '@/pages/ScriptGeneratorPage';
import VideoStorage from '@/pages/videos/VideoStorage';
import VideoBatchManage from '@/pages/videos/VideoBatchManage';
import EquipmentDetailsPage from '@/pages/EquipmentDetailsPage';
import ScriptValidationPage from '@/pages/ScriptValidationPage';
import TechnicalDocuments from '@/pages/TechnicalDocuments';
import DocumentDetail from '@/pages/DocumentDetail';
import ReportsPage from '@/pages/ReportsPage';
import IdeaValidatorPage from '@/pages/IdeaValidatorPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminEquipments from '@/pages/admin/AdminEquipments';
import AdminContent from '@/pages/admin/AdminContent';
import AdminAIPanel from '@/pages/admin/AdminAIPanel';
import VimeoSettings from '@/pages/admin/VimeoSettings';
import VimeoCallback from '@/pages/auth/VimeoCallback';
import VideoBatchImport from '@/pages/videos/VideoBatchImport';
import SystemDiagnostics from '@/pages/admin/SystemDiagnostics';
import SystemIntelligence from '@/pages/admin/SystemIntelligence';
import VideoSwipe from '@/pages/videos/VideoSwipe';
import MarketingConsultant from '@/pages/MarketingConsultant';
import ScientificArticles from '@/pages/ScientificArticles';
import VideoPlayer from '@/pages/videos/VideoPlayer';
import InvitesPage from '@/pages/InvitesPage';
import WorkspaceSettings from '@/pages/admin/WorkspaceSettings';
import ConsultantPanel from '@/pages/consultant/ConsultantPanel';
import Calendar from '@/pages/Calendar';
import VideosPage from '@/pages/videos';

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
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.AUTH.VIMEO_CALLBACK} element={<VimeoCallback />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.CONTENT.STRATEGY} element={<ContentStrategy />} />
            <Route path={ROUTES.CONTENT.PLANNER} element={<ContentPlannerPage />} />
            <Route path={ROUTES.EQUIPMENT.LIST} element={<EquipmentsPage />} />
            <Route path={ROUTES.CONTENT.CALENDAR} element={<Calendar />} />
            <Route path={ROUTES.MEDIA} element={<MediaLibraryPage />} />
            <Route path={ROUTES.CONTENT.SCRIPTS.GENERATOR} element={<ScriptGeneratorPage />} />
            <Route path={ROUTES.VIDEOS.STORAGE} element={<VideoStorage />} />
            <Route path={ROUTES.VIDEOS.ROOT} element={<VideosPage />} />
            <Route path={ROUTES.VIDEOS.BATCH} element={<VideoBatchManage />} />
            <Route path={ROUTES.EQUIPMENT.DETAILS()} element={<EquipmentDetailsPage />} />
            <Route path={ROUTES.CONTENT.SCRIPTS.VALIDATION} element={<ScriptValidationPage />} />
            <Route path={ROUTES.DOCUMENTS.ROOT} element={<TechnicalDocuments />} />
            <Route path={ROUTES.DOCUMENTS.DETAILS()} element={<DocumentDetail />} />
            <Route path={ROUTES.MARKETING.REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.CONTENT.IDEAS} element={<IdeaValidatorPage />} />
            <Route path={ROUTES.ADMIN.VIMEO.SETTINGS} element={<VimeoSettings />} />
            <Route path={ROUTES.VIDEOS.IMPORT} element={<VideoBatchImport />} />
            <Route path={ROUTES.VIDEOS.SWIPE} element={<VideoSwipe />} />
            <Route path={ROUTES.MARKETING.CONSULTANT} element={<MarketingConsultant />} />
            <Route path={ROUTES.SCIENTIFIC_ARTICLES} element={<ScientificArticles />} />
            <Route path={ROUTES.VIDEOS.PLAYER} element={<VideoPlayer />} />
            <Route path={ROUTES.INVITES} element={<InvitesPage />} />
            <Route path={ROUTES.WORKSPACE_SETTINGS} element={<WorkspaceSettings />} />
          </Route>

          {/* Consultant Routes */}
          <Route path={ROUTES.CONSULTANT.PANEL} element={<PrivateRoute requiredRole="consultor" />}>
            <Route index element={<ConsultantPanel />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path={ROUTES.ADMIN.ROOT} element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="equipments" element={<AdminEquipments />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="ai" element={<AdminAIPanel />} />
            <Route path="system-diagnostics" element={<SystemDiagnostics />} />
            <Route path="system-intelligence" element={<SystemIntelligence />} />
          </Route>
          
          {/* 404 Route */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
        <Toaster />
      </SlideNotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
