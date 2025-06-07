import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/AuthContext';
import { SlideNotificationProvider } from '@/components/notifications/SlideNotificationProvider';
import { Toaster } from 'sonner';

// Import pages
import Dashboard from '@/pages/Dashboard';
import HomePage from '@/pages/HomePage';
import ContentScripts from '@/pages/ContentScripts';
import VideosPage from '@/pages/VideosPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ContentPlanner from '@/pages/ContentPlanner';
import ContentIdeas from '@/pages/ContentIdeas';
import ScriptGeneratorPage from '@/pages/ScriptGeneratorPage';
import AdminContent from '@/pages/AdminContent';
import Profile from '@/pages/Profile';
import WorkspaceSettings from '@/pages/WorkspaceSettings';
import ConsultantPanel from '@/pages/consultant/ConsultantPanel';

// Import components
import PrivateRoute from '@/components/PrivateRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      {/* Protected routes */}
                      <Route path="/dashboard" element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/content/scripts" element={
                        <PrivateRoute>
                          <ContentScripts />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/script-generator" element={
                        <PrivateRoute>
                          <ScriptGeneratorPage />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/content-planner" element={
                        <PrivateRoute>
                          <ContentPlanner />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/content-ideas" element={
                        <PrivateRoute>
                          <ContentIdeas />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/videos" element={
                        <PrivateRoute>
                          <VideosPage />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/admin" element={
                        <PrivateRoute requiredRole="admin">
                          <AdminContent />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/profile" element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/workspace-settings" element={
                        <PrivateRoute requiredRole="admin">
                          <WorkspaceSettings />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/consultant" element={
                        <PrivateRoute requiredRole="consultor">
                          <ConsultantPanel />
                        </PrivateRoute>
                      } />

                      {/* Catch all - redirect to home */}
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
