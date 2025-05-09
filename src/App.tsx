
import React, { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { SlideNotificationProvider } from '@/components/notifications/SlideNotificationProvider';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { useAuth } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AnimatePresence, motion } from 'framer-motion';

// Page imports
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ResetPassword from '@/pages/ResetPassword';
import ContentPlannerPage from '@/pages/ContentPlannerPage'; 
import ContentStrategy from '@/pages/ContentStrategy';
import ScientificArticles from '@/pages/ScientificArticles'; 
import ReportsPage from '@/pages/ReportsPage';
import Settings from '@/pages/Settings';
import Calendar from '@/pages/Calendar';
import CustomGpt from '@/pages/CustomGpt';
import IdeaValidatorPage from '@/pages/IdeaValidatorPage';
import VideosPage from '@/pages/VideosPage';
import MediaLibraryPage from '@/pages/MediaLibraryPage';
import MediaFilesPage from '@/pages/MediaFilesPage';
import ContentPage from '@/pages/ContentPage';
import ScriptGenerator from '@/pages/ScriptGenerator';
import ScriptGeneratorPage from '@/pages/ScriptGeneratorPage';

// Admin Pages
import AdminDashboard from '@/pages/AdminDashboard';
import AdminContent from '@/pages/AdminContent';
import AdminVimeoSettings from '@/pages/AdminVimeoSettings';
import AdminEquipments from '@/pages/AdminEquipments';
import AdminSystemDiagnostics from '@/pages/AdminSystemDiagnostics';
import AdminSystemIntelligence from '@/pages/AdminSystemIntelligence';
import AdminIntegrations from '@/pages/AdminIntegrations';

// Define routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/reset-password',
];

// Page loading wrapper with error boundary
const PageLoader = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" message="Carregando..." />
        </div>
      }
    >
      {children}
    </Suspense>
  </ErrorBoundary>
);

// Route guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !publicRoutes.includes(location.pathname)) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Verificando autenticação..." />
      </div>
    );
  }

  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

// Page transition animation
const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};

function App() {
  const location = useLocation();

  return (
    <SlideNotificationProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
        >
          <Routes location={location}>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Main Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <Dashboard />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            
            {/* Strategy Group */}
            <Route 
              path="/content-ideas" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <IdeaValidatorPage />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/marketing-consultant" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <ContentStrategy />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/content-planner" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <ContentPlannerPage />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/script-generator" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <ScriptGeneratorPage />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />

            {/* Downloads Group */}
            <Route 
              path="/templates" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <ContentPage />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/videos" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <VideosPage />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/photos" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <MediaFilesPage />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/files" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <MediaFilesPage />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/articles" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <ScientificArticles />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />

            {/* Equipment Group */}
            <Route 
              path="/equipments" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <MediaFilesPage />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <AdminDashboard />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/content" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <AdminContent />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/equipment" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <AdminEquipments />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <PageLoader>
                    <Settings />
                  </PageLoader>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Toaster />
    </SlideNotificationProvider>
  );
}

export default App;
