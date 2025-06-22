
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import AuroraLoadingSkeleton from '@/components/aurora/AuroraLoadingSkeleton';

// Lazy loading dos componentes
const ScientificArticles = React.lazy(() => import('@/pages/ScientificArticles'));
const AdminScientificArticles = React.lazy(() => import('@/pages/admin/AdminScientificArticles'));
const VideoLibrary = React.lazy(() => import('@/pages/VideoLibrary'));
const ContentPlanner = React.lazy(() => import('@/pages/ContentPlanner'));
const MarketingDiagnostic = React.lazy(() => import('@/pages/MarketingDiagnostic'));
const ScriptGenerator = React.lazy(() => import('@/pages/ScriptGenerator'));
const CustomGPT = React.lazy(() => import('@/pages/CustomGPT'));
const Equipments = React.lazy(() => import('@/pages/Equipments'));
const BeforeAfter = React.lazy(() => import('@/pages/BeforeAfter'));
const VideoAdmin = React.lazy(() => import('@/pages/admin/VideoAdmin'));
const EquipmentAdmin = React.lazy(() => import('@/pages/admin/EquipmentAdmin'));
const MaterialAdmin = React.lazy(() => import('@/pages/admin/MaterialAdmin'));
const ServiceStatus = React.lazy(() => import('@/pages/admin/ServiceStatus'));
const AIPanel = React.lazy(() => import('@/pages/admin/AIPanel'));

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
      <Route 
        path="/video-library" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <VideoLibrary />
          </Suspense>
        } 
      />
      <Route 
        path="/content-planner" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <ContentPlanner />
          </Suspense>
        } 
      />
      <Route 
        path="/marketing-diagnostic" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <MarketingDiagnostic />
          </Suspense>
        } 
      />
      <Route 
        path="/script-generator" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <ScriptGenerator />
          </Suspense>
        } 
      />
      <Route 
        path="/custom-gpt" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <CustomGPT />
          </Suspense>
        } 
      />
      <Route 
        path="/equipments" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <Equipments />
          </Suspense>
        } 
      />
      <Route 
        path="/before-after" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <BeforeAfter />
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
      <Route 
        path="/admin/videos" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <VideoAdmin />
          </Suspense>
        } 
      />
      <Route 
        path="/admin/equipments" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <EquipmentAdmin />
          </Suspense>
        } 
      />
      <Route 
        path="/admin/materials" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <MaterialAdmin />
          </Suspense>
        } 
      />
      <Route 
        path="/admin/service-status" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <ServiceStatus />
          </Suspense>
        } 
      />
      <Route 
        path="/admin/ai-panel" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <AIPanel />
          </Suspense>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;
