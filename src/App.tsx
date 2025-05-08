
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

// Admin Pages
import AdminContent from '@/pages/AdminContent';
import AdminVimeoSettings from '@/pages/AdminVimeoSettings';
import AdminEquipments from '@/pages/AdminEquipments';
import AdminSystemDiagnostics from '@/pages/AdminSystemDiagnostics';
import AdminSystemIntelligence from '@/pages/AdminSystemIntelligence';
import AdminIntegrations from '@/pages/AdminIntegrations';

// Mock pages for routes that don't have components yet
const MockPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{title} Page</h1>
      <p className="text-muted-foreground">This page is coming soon.</p>
    </div>
  </div>
);

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
          path="/content" 
          element={
            <PageLoader>
              <MockPage title="Content" />
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
              <MockPage title="Videos" />
            </PageLoader>
          } 
        />
        <Route 
          path="/media-library" 
          element={
            <PageLoader>
              <MockPage title="Media Library" />
            </PageLoader>
          } 
        />
        <Route 
          path="/media-files" 
          element={
            <PageLoader>
              <MockPage title="Media Files" />
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
              <MockPage title="Equipment" />
            </PageLoader>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <PageLoader>
              <MockPage title="Admin Dashboard" />
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
