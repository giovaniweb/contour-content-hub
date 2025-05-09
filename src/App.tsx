import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { SlideNotificationProvider } from '@/components/notifications/SlideNotificationProvider';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { useAuth } from '@/context/AuthContext';

// Pages
import Dashboard from '@/pages/Dashboard';
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

// Admin Pages
import AdminDashboard from '@/pages/AdminDashboard';
import AdminContent from '@/pages/AdminContent';
import AdminVimeoSettings from '@/pages/AdminVimeoSettings';
import AdminEquipments from '@/pages/AdminEquipments';
import AdminSystemDiagnostics from '@/pages/AdminSystemDiagnostics';
import AdminSystemIntelligence from '@/pages/AdminSystemIntelligence';
import AdminIntegrations from '@/pages/AdminIntegrations';

// Page loading wrapper
const PageLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Carregando..." />
      </div>
    }
  >
    {children}
  </Suspense>
);

// Mock page component for routes not yet implemented
const MockPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground">Esta página ainda está em desenvolvimento.</p>
  </div>
);

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <SlideNotificationProvider>
      <Routes>
        <Route 
          path="/" 
          element={
            <PageLoader>
              <Dashboard />
            </PageLoader>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PageLoader>
              <Dashboard />
            </PageLoader>
          } 
        />
        <Route 
          path="/content-planner" 
          element={
            <PageLoader>
              <ContentPlannerPage />
            </PageLoader>
          } 
        />
        <Route 
          path="/content-ideas" 
          element={
            <PageLoader>
              <IdeaValidatorPage />
            </PageLoader>
          } 
        />
        <Route 
          path="/scripts" 
          element={
            <PageLoader>
              <CustomGpt />
            </PageLoader>
          } 
        />
        <Route 
          path="/script-generator" 
          element={
            <PageLoader>
              <ScriptGenerator />
            </PageLoader>
          } 
        />
        <Route 
          path="/content" 
          element={
            <PageLoader>
              <ContentPage />
            </PageLoader>
          } 
        />
        <Route 
          path="/content-strategy" 
          element={
            <PageLoader>
              <ContentStrategy />
            </PageLoader>
          } 
        />
        <Route 
          path="/articles" 
          element={
            <PageLoader>
              <ScientificArticles />
            </PageLoader>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <PageLoader>
              <ReportsPage />
            </PageLoader>
          } 
        />
        <Route 
          path="/videos" 
          element={
            <PageLoader>
              <VideosPage />
            </PageLoader>
          } 
        />
        <Route 
          path="/media-library" 
          element={
            <PageLoader>
              <MediaLibraryPage />
            </PageLoader>
          } 
        />
        <Route 
          path="/media-files" 
          element={
            <PageLoader>
              <MediaFilesPage />
            </PageLoader>
          } 
        />
        <Route 
          path="/agenda" 
          element={
            <PageLoader>
              <Calendar />
            </PageLoader>
          } 
        />
        <Route 
          path="/equipment" 
          element={
            <PageLoader>
              <MediaFilesPage />
            </PageLoader>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <PageLoader>
              <AdminDashboard />
            </PageLoader>
          } 
        />
        <Route 
          path="/admin/content" 
          element={
            <PageLoader>
              <AdminContent />
            </PageLoader>
          } 
        />
        <Route 
          path="/admin/equipment" 
          element={
            <PageLoader>
              <AdminEquipments />
            </PageLoader>
          } 
        />
        <Route 
          path="/integrations" 
          element={
            <PageLoader>
              <AdminIntegrations />
            </PageLoader>
          } 
        />
        <Route 
          path="/diagnostics" 
          element={
            <PageLoader>
              <AdminSystemDiagnostics />
            </PageLoader>
          } 
        />
        <Route 
          path="/ai-panel" 
          element={
            <PageLoader>
              <AdminSystemIntelligence />
            </PageLoader>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <PageLoader>
              <Settings />
            </PageLoader>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </SlideNotificationProvider>
  );
}

export default App;
