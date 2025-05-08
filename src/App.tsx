
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ContentPlannerPage from "./pages/ContentPlannerPage";
import EquipmentsPage from "./pages/EquipmentsPage";
import EquipmentDetails from "./pages/EquipmentDetails";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import MediaLibrary from "./pages/MediaLibrary";
import { ErrorBoundary } from './components/ErrorBoundary';
import ScriptValidation from './pages/ScriptValidation';
import CustomGpt from './pages/CustomGpt';
import VideosPage from "./pages/VideosPage";
import VideoStorage from './pages/VideoStorage';
import TechnicalDocuments from './pages/TechnicalDocuments';
import ContentStrategy from './pages/ContentStrategy';
import Calendar from './pages/Calendar';
import { LoadingSpinner } from './components/ui/loading-spinner';
import AdminEquipments from './pages/AdminEquipments';
import AdminContent from './pages/AdminContent';
import AdminVimeoSettings from './pages/AdminVimeoSettings';
import AdminDashboard from './pages/AdminDashboard';
import AdminSystemIntelligence from './pages/AdminSystemIntelligence';
import AdminSystemDiagnostics from './pages/AdminSystemDiagnostics';
import AdminIntegrations from './pages/AdminIntegrations';
import { SlideNotificationProvider } from './components/notifications/SlideNotificationProvider';
import IdeaValidatorPage from './pages/IdeaValidatorPage';
import ScientificArticles from './pages/ScientificArticles';

// Suspense fallback for lazy-loaded routes
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner message="Carregando..." submessage="Aguarde um momento..." />
  </div>
);

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          message="Inicializando Fluida..." 
          submessage="Configurando sua experiência..." 
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SlideNotificationProvider>
        <Router>
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
              />
              <Route 
                path="/register" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
              />
              <Route 
                path="/forgot-password" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} 
              />
              <Route 
                path="/reset-password/:token" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPassword />} 
              />

              {/* Private Routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/content-planner" element={
                <PrivateRoute>
                  <ContentPlannerPage />
                </PrivateRoute>
              } />
              <Route path="/idea-validator" element={
                <PrivateRoute>
                  <IdeaValidatorPage />
                </PrivateRoute>
              } />
              <Route path="/equipments" element={
                <PrivateRoute>
                  <EquipmentsPage />
                </PrivateRoute>
              } />
              <Route path="/equipments/:id" element={
                <PrivateRoute>
                  <EquipmentDetails />
                </PrivateRoute>
              } />
              <Route path="/media" element={
                <PrivateRoute>
                  <MediaLibrary />
                </PrivateRoute>
              } />
              <Route path="/custom-gpt" element={
                <PrivateRoute>
                  <CustomGpt />
                </PrivateRoute>
              } />
              <Route path="/script-validation" element={
                <PrivateRoute>
                  <ScriptValidation />
                </PrivateRoute>
              } />
              <Route path="/videos" element={
                <PrivateRoute>
                  <VideosPage />
                </PrivateRoute>
              } />
              <Route path="/video-storage" element={
                <PrivateRoute>
                  <VideoStorage />
                </PrivateRoute>
              } />
              <Route path="/technical-documents" element={
                <PrivateRoute>
                  <TechnicalDocuments />
                </PrivateRoute>
              } />
              <Route path="/content-strategy" element={
                <PrivateRoute>
                  <ContentStrategy />
                </PrivateRoute>
              } />
              <Route path="/calendar" element={
                <PrivateRoute>
                  <Calendar />
                </PrivateRoute>
              } />
              <Route path="/scientific-articles" element={
                <PrivateRoute>
                  <ScientificArticles />
                </PrivateRoute>
              } />
              <Route path="/marketing-consultant" element={
                <PrivateRoute>
                  <ContentStrategy />
                </PrivateRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } />
              <Route path="/admin/equipments" element={
                <PrivateRoute>
                  <AdminEquipments />
                </PrivateRoute>
              } />
              <Route path="/admin/content" element={
                <PrivateRoute>
                  <AdminContent />
                </PrivateRoute>
              } />
              <Route path="/admin/integrations" element={
                <PrivateRoute>
                  <AdminIntegrations />
                </PrivateRoute>
              } />
              <Route path="/admin/system-intelligence" element={
                <PrivateRoute>
                  <AdminSystemIntelligence />
                </PrivateRoute>
              } />
              <Route path="/admin/system-diagnostics" element={
                <PrivateRoute>
                  <AdminSystemDiagnostics />
                </PrivateRoute>
              } />
              <Route path="/admin/vimeo-settings" element={
                <PrivateRoute>
                  <AdminVimeoSettings />
                </PrivateRoute>
              } />
              
              {/* Root redirect for authenticated users */}
              <Route 
                path="/" 
                element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
              />
              
              {/* Not Found Route - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </SlideNotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
