
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AuroraLoadingSkeleton from '@/components/aurora/AuroraLoadingSkeleton';

// Lazy loading apenas dos componentes que existem
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const ScientificArticles = React.lazy(() => import('@/pages/ScientificArticles'));
const AdminScientificArticles = React.lazy(() => import('@/pages/admin/AdminScientificArticles'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      <Route 
        path="/" 
        element={
          <AppLayout>
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <Dashboard />
            </Suspense>
          </AppLayout>
        } 
      />
      
      {/* Main Application Routes with Layout */}
      <Route 
        path="/dashboard" 
        element={
          <AppLayout>
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <Dashboard />
            </Suspense>
          </AppLayout>
        } 
      />
      
      <Route 
        path="/scientific-articles" 
        element={
          <AppLayout>
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <ScientificArticles />
            </Suspense>
          </AppLayout>
        } 
      />

      {/* Admin Routes with Layout */}
      <Route 
        path="/admin/scientific-articles" 
        element={
          <AppLayout requireAdmin={true}>
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <AdminScientificArticles />
            </Suspense>
          </AppLayout>
        } 
      />

      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          <AppLayout>
            <Suspense fallback={<AuroraLoadingSkeleton />}>
              <Dashboard />
            </Suspense>
          </AppLayout>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
