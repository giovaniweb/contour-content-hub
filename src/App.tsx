
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import ContentScripts from './pages/ContentScripts';
import ScriptGeneratorPage from './pages/ScriptGeneratorPage';
import FluiAAkinatorPage from '@/pages/FluiAAkinatorPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Private routes */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                
                {/* Content routes */}
                <Route path="/content/scripts" element={
                  <PrivateRoute>
                    <ContentScripts />
                  </PrivateRoute>
                } />
                
                <Route path="/content/scripts/generator" element={
                  <PrivateRoute>
                    <ScriptGeneratorPage />
                  </PrivateRoute>
                } />
                
                <Route path="/content/scripts/fluia-akinator" element={
                  <PrivateRoute>
                    <FluiAAkinatorPage />
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
