
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { SlideNotificationProvider } from '@/components/notifications/SlideNotificationProvider';
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import ScriptGeneratorPage from '@/pages/ScriptGeneratorPage';
import EquipmentsPage from '@/pages/EquipmentsPage';
import EquipmentDetailsPage from '@/pages/EquipmentDetailsPage';
import AdminEquipments from '@/pages/admin/AdminEquipments';
import ContentStrategy from '@/pages/ContentStrategy';
import ContentScripts from '@/pages/ContentScripts';
import MarketingConsultant from '@/pages/MarketingConsultant';
import DiagnosticHistory from '@/pages/DiagnosticHistory';
import DiagnosticReport from '@/pages/DiagnosticReport';
import ConsultantPanel from '@/pages/consultant/ConsultantPanel';
import ReportsPage from '@/pages/ReportsPage';
import PhotosPage from '@/pages/PhotosPage';
import ArtsPage from '@/pages/ArtsPage';
import VideosPage from '@/pages/VideosPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ContentPlannerPage from '@/pages/ContentPlannerPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="fluida-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <SlideNotificationProvider>
              <Router>
                <ErrorBoundary>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes - All using AppLayout */}
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <AppLayout>
                          <Dashboard />
                        </AppLayout>
                      </PrivateRoute>
                    } />
                    
                    <Route path="/script-generator" element={
                      <PrivateRoute>
                        <AppLayout>
                          <ScriptGeneratorPage />
                        </AppLayout>
                      </PrivateRoute>
                    } />
                    
                    <Route path="/equipments" element={
                      <PrivateRoute>
                        <AppLayout>
                          <EquipmentsPage />
                        </AppLayout>
                      </PrivateRoute>
                    } />
                    
                    <Route path="/equipment/:id" element={
                      <PrivateRoute>
                        <AppLayout>
                          <EquipmentDetailsPage />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/content-strategy" element={
                      <PrivateRoute>
                        <AppLayout>
                          <ContentStrategy />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/scripts" element={
                      <PrivateRoute>
                        <AppLayout>
                          <ContentScripts />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/content/scripts" element={
                      <PrivateRoute>
                        <AppLayout>
                          <ContentScripts />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/marketing-consultant" element={
                      <PrivateRoute>
                        <AppLayout>
                          <MarketingConsultant />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/diagnostic-history" element={
                      <PrivateRoute>
                        <AppLayout>
                          <DiagnosticHistory />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/diagnostic-report/:sessionId" element={
                      <PrivateRoute>
                        <AppLayout>
                          <DiagnosticReport />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/reports" element={
                      <PrivateRoute>
                        <AppLayout>
                          <ReportsPage />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/consultant-panel" element={
                      <PrivateRoute>
                        <AppLayout>
                          <ConsultantPanel />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/photos" element={
                      <PrivateRoute>
                        <AppLayout>
                          <PhotosPage />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/arts" element={
                      <PrivateRoute>
                        <AppLayout>
                          <ArtsPage />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/videos" element={
                      <PrivateRoute>
                        <AppLayout>
                          <VideosPage />
                        </AppLayout>
                      </PrivateRoute>
                    } />

                    <Route path="/content-planner" element={
                      <PrivateRoute>
                        <AppLayout>
                          <ContentPlannerPage />
                        </AppLayout>
                      </PrivateRoute>
                    } />
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={
                      <AdminRoute>
                        <AppLayout requireAdmin={true}>
                          <AdminDashboard />
                        </AppLayout>
                      </AdminRoute>
                    } />

                    <Route path="/admin/equipments" element={
                      <AdminRoute>
                        <AppLayout requireAdmin={true}>
                          <AdminEquipments />
                        </AppLayout>
                      </AdminRoute>
                    } />
                  </Routes>
                  <Toaster />
                </ErrorBoundary>
              </Router>
            </SlideNotificationProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
