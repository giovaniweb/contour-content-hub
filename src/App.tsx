
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
