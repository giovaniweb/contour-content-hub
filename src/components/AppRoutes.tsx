
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AuroraLoadingSkeleton from '@/components/aurora/AuroraLoadingSkeleton';
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';

// Lazy loading dos componentes principais
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const ScientificArticles = React.lazy(() => import('@/pages/ScientificArticles'));
const AdminScientificArticles = React.lazy(() => import('@/pages/admin/AdminScientificArticles'));
const Equipments = React.lazy(() => import('@/pages/Equipments'));

const Videos = React.lazy(() => import('@/pages/Videos'));
const MarketingConsultant = React.lazy(() => import('@/pages/MarketingConsultant'));
const ContentPlanner = React.lazy(() => import('@/pages/ContentPlanner'));
const ContentScripts = React.lazy(() => import('@/pages/ContentScripts'));
const Photos = React.lazy(() => import('@/pages/Photos'));
const Arts = React.lazy(() => import('@/pages/Arts'));
const AdminPanel = React.lazy(() => import('@/pages/admin/AdminPanel'));
const AdminEquipments = React.lazy(() => import('@/pages/admin/AdminEquipments'));

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <Login />
          </Suspense>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <Suspense fallback={<AuroraLoadingSkeleton />}>
            <Register />
          </Suspense>
        } 
      />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />}
        />
        
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

        <Route 
          path="/equipments" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Equipments />
              </Suspense>
            </AppLayout>
          } 
        />


        <Route 
          path="/videos" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Videos />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/marketing-consultant" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <MarketingConsultant />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/content-planner" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <ContentPlanner />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/content/scripts" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <ContentScripts />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/photos" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Photos />
              </Suspense>
            </AppLayout>
          } 
        />

        <Route 
          path="/arts" 
          element={
            <AppLayout>
              <Suspense fallback={<AuroraLoadingSkeleton />}>
                <Arts />
              </Suspense>
            </AppLayout>
          } 
        />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route 
            path="/admin" 
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminPanel />
                </Suspense>
              </AppLayout>
            } 
          />

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

          <Route 
            path="/admin/equipments" 
            element={
              <AppLayout requireAdmin={true}>
                <Suspense fallback={<AuroraLoadingSkeleton />}>
                  <AdminEquipments />
                </Suspense>
              </AppLayout>
            } 
          />
        </Route>
      </Route>

      {/* Catch all route */}
      <Route 
        path="*" 
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
