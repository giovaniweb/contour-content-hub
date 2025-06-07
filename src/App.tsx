
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/AuthContext';
import { SlideNotificationProvider } from '@/components/notifications/SlideNotificationProvider';
import { Toaster } from 'sonner';
import { ROUTES } from '@/routes';

// Import pages
import Dashboard from '@/pages/Dashboard';
import ViteStyleHome from '@/pages/ViteStyleHome';
import ContentScripts from '@/pages/ContentScripts';
import VideosPage from '@/pages/VideosPage';

// Import auth pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Import components
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';
import ErrorBoundary from '@/components/ErrorBoundary';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <div className="aurora-dark-theme min-h-screen">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SlideNotificationProvider>
              <SidebarProvider>
                <Router>
                  <div className="min-h-screen w-full aurora-dark-bg">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<ViteStyleHome />} />
                      <Route path={ROUTES.LOGIN} element={<Login />} />
                      <Route path={ROUTES.REGISTER} element={<Register />} />
                      
                      {/* Protected routes */}
                      <Route path={ROUTES.DASHBOARD} element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      } />
                      
                      <Route path={ROUTES.CONTENT.SCRIPTS.ROOT} element={
                        <PrivateRoute>
                          <ContentScripts />
                        </PrivateRoute>
                      } />
                      
                      <Route path={ROUTES.VIDEOS.ROOT} element={
                        <PrivateRoute>
                          <VideosPage />
                        </PrivateRoute>
                      } />

                      {/* Catch all - redirect to dashboard if authenticated, otherwise to home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    
                    <Toaster 
                      position="top-right"
                      theme="dark"
                      toastOptions={{
                        style: {
                          background: 'rgba(26, 11, 46, 0.9)',
                          border: '1px solid rgba(107, 70, 193, 0.3)',
                          color: 'white',
                        },
                      }}
                    />
                  </div>
                </Router>
              </SidebarProvider>
            </SlideNotificationProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
