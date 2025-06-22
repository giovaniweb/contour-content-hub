
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import AuroraLoadingSkeleton from '@/components/aurora/AuroraLoadingSkeleton';

// Lazy loading apenas dos componentes que existem
const ScientificArticles = React.lazy(() => import('@/pages/ScientificArticles'));
const AdminScientificArticles = React.lazy(() => import('@/pages/admin/AdminScientificArticles'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Dashboard />} />
      
      {/* Main Application Routes */}
      <Route 
        path="/scientific-articles" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <ScientificArticles />
          </Suspense>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/scientific-articles" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <AdminScientificArticles />
          </Suspense>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;
