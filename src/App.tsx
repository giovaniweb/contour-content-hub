
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import Index from './pages/Index';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ScriptGenerator from './pages/ScriptGenerator';
import ScriptHistory from './pages/ScriptHistory';
import MediaLibrary from './pages/MediaLibrary';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipments from './pages/AdminEquipments';
import AdminContent from './pages/AdminContent';
import AdminIntegrations from './pages/AdminIntegrations';
import NotFound from './pages/NotFound';
import CustomGpt from './pages/CustomGpt';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              <Toaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/script-generator" element={<ScriptGenerator />} />
                <Route path="/script-history" element={<ScriptHistory />} />
                <Route path="/media-library" element={<MediaLibrary />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/custom-gpt" element={<CustomGpt />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/equipments" element={<AdminEquipments />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/integrations" element={<AdminIntegrations />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
