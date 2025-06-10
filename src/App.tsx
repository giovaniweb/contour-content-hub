import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/Home';
import ContentLayout from './layouts/ContentLayout';
import ContentScripts from './pages/ContentScripts';
import ScriptGeneratorPage from './pages/ScriptGeneratorPage';
import { SlideNotificationProvider } from './contexts/SlideNotificationContext';
import FluiAAkinatorPage from '@/pages/FluiAAkinatorPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Toaster />
            <SlideNotificationProvider />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                <Route path="/update-password/:token" element={<PublicRoute><UpdatePassword /></PublicRoute>} />

                {/* Private routes */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                
                {/* Content routes */}
                <Route path="/content/scripts" element={
                  <PrivateRoute>
                    <ContentLayout>
                      <ContentScripts />
                    </ContentLayout>
                  </PrivateRoute>
                } />
                
                <Route path="/content/scripts/generator" element={
                  <PrivateRoute>
                    <ContentLayout>
                      <ScriptGeneratorPage />
                    </ContentLayout>
                  </PrivateRoute>
                } />
                
                <Route path="/content/scripts/fluia-akinator" element={
                  <PrivateRoute>
                    <ContentLayout>
                      <FluiAAkinatorPage />
                    </ContentLayout>
                  </PrivateRoute>
                } />
                
                {/* Catch-all route to redirect to home */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
