
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
import ConsultantPanel from '@/pages/consultant/ConsultantPanel';
import ReportsPage from '@/pages/ReportsPage';

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
            <Router>
              <ErrorBoundary>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/script-generator" element={
                    <PrivateRoute>
                      <ScriptGeneratorPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/equipments" element={
                    <PrivateRoute>
                      <EquipmentsPage />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/equipment/:id" element={
                    <PrivateRoute>
                      <EquipmentDetailsPage />
                    </PrivateRoute>
                  } />

                  {/* Content Strategy Route */}
                  <Route path="/content-strategy" element={
                    <PrivateRoute>
                      <ContentStrategy />
                    </PrivateRoute>
                  } />

                  {/* Content Scripts Routes */}
                  <Route path="/scripts" element={
                    <PrivateRoute>
                      <ContentScripts />
                    </PrivateRoute>
                  } />

                  <Route path="/content/scripts" element={
                    <PrivateRoute>
                      <ContentScripts />
                    </PrivateRoute>
                  } />

                  {/* Marketing Consultant Route */}
                  <Route path="/marketing-consultant" element={
                    <PrivateRoute>
                      <MarketingConsultant />
                    </PrivateRoute>
                  } />

                  {/* Reports Route */}
                  <Route path="/reports" element={
                    <PrivateRoute>
                      <ReportsPage />
                    </PrivateRoute>
                  } />

                  {/* Consultant Panel Route */}
                  <Route path="/consultant-panel" element={
                    <PrivateRoute>
                      <ConsultantPanel />
                    </PrivateRoute>
                  } />
                  
                  {/* Admin routes */}
                  <Route path="/admin/equipments" element={
                    <AdminRoute>
                      <AdminEquipments />
                    </AdminRoute>
                  } />
                </Routes>
                <Toaster />
              </ErrorBoundary>
            </Router>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
