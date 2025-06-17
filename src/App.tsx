
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import WorkspaceSettings from './pages/WorkspaceSettings';

// Import existing pages
import FluidaRoteiristsPage from './pages/FluidaRoteiristsPage';
import ContentPlannerPage from './pages/ContentPlannerPage';
import VideoPlayer from './pages/VideoPlayer';
import VideosPage from './pages/VideosPage';
import PhotosPage from './pages/PhotosPage';

import EquipmentList from './pages/EquipmentList';
import EquipmentDetails from './pages/EquipmentDetails';

import Media from './pages/Media';
import ScientificArticles from './pages/ScientificArticles';

import MarketingConsultant from './pages/MarketingConsultant';
import Reports from './pages/Reports';
import DiagnosticHistory from './pages/DiagnosticHistory';

// Import MestreDaBelezaPage
import MestreDaBelezaPage from './pages/MestreDaBelezaPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEquipments from './pages/admin/AdminEquipments';
import CreateEquipment from './pages/admin/CreateEquipment';
import EditEquipment from './pages/admin/EditEquipment';
import AdminContent from './pages/AdminContent';
import AdminAI from './pages/admin/AdminAI';
import AdminSystemDiagnostics from './pages/admin/AdminSystemDiagnostics';
import AdminSystemIntelligence from './pages/admin/AdminSystemIntelligence';

import AdminScientificArticles from '@/pages/admin/AdminScientificArticles';
import AdminMaterials from '@/pages/admin/AdminMaterials';
import AdminPhotos from '@/pages/admin/AdminPhotos';
import AdminVideos from '@/pages/admin/AdminVideos';

// Video management - using the batch import as the main video registration page
import VideoBatchImport from './pages/videos/VideoBatchImport';

// Layout components
import AppLayout from './components/layout/AppLayout';

const queryClient = new QueryClient();

function App() {
  console.log('🚀 App iniciando...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes without layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes with AppLayout */}
            <Route path="/" element={
              <AppLayout>
                <Home />
              </AppLayout>
            } />
            <Route path="/dashboard" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/profile" element={
              <AppLayout>
                <Profile />
              </AppLayout>
            } />
            <Route path="/workspace-settings" element={
              <AppLayout>
                <WorkspaceSettings />
              </AppLayout>
            } />

            {/* Mestre da Beleza Route */}
            <Route path="/mestre-da-beleza" element={
              <AppLayout>
                <MestreDaBelezaPage />
              </AppLayout>
            } />

            {/* Content Routes with Layout */}
            <Route path="/fluidaroteirista" element={
              <AppLayout>
                <FluidaRoteiristsPage />
              </AppLayout>
            } />
            <Route path="/content-planner" element={
              <AppLayout>
                <ContentPlannerPage />
              </AppLayout>
            } />

            {/* Video Routes with Layout */}
            <Route path="/videos" element={
              <AppLayout>
                <VideosPage />
              </AppLayout>
            } />
            <Route path="/video-player" element={
              <AppLayout>
                <VideoPlayer />
              </AppLayout>
            } />

            {/* Photos Route with Layout */}
            <Route path="/photos" element={
              <AppLayout>
                <PhotosPage />
              </AppLayout>
            } />

            {/* Equipments Routes with Layout */}
            <Route path="/equipments" element={
              <AppLayout>
                <EquipmentList />
              </AppLayout>
            } />
            <Route path="/equipments/:id" element={
              <AppLayout>
                <EquipmentDetails />
              </AppLayout>
            } />

            <Route path="/media" element={
              <AppLayout>
                <Media />
              </AppLayout>
            } />
            <Route path="/scientific-articles" element={
              <AppLayout>
                <ScientificArticles />
              </AppLayout>
            } />

            {/* Marketing Routes with Layout */}
            <Route path="/marketing-consultant" element={
              <AppLayout>
                <MarketingConsultant />
              </AppLayout>
            } />
            <Route path="/reports" element={
              <AppLayout>
                <Reports />
              </AppLayout>
            } />
            <Route path="/diagnostic-history" element={
              <AppLayout>
                <DiagnosticHistory />
              </AppLayout>
            } />

            {/* Admin Routes with Layout and Admin Protection */}
            <Route path="/admin" element={
              <AppLayout requireAdmin={true}>
                <AdminDashboard />
              </AppLayout>
            } />
            <Route path="/admin/content" element={
              <AppLayout requireAdmin={true}>
                <AdminContent />
              </AppLayout>
            } />
            <Route path="/admin/scientific-articles" element={
              <AppLayout requireAdmin={true}>
                <AdminScientificArticles />
              </AppLayout>
            } />
            <Route path="/admin/materials" element={
              <AppLayout requireAdmin={true}>
                <AdminMaterials />
              </AppLayout>
            } />
            <Route path="/admin/photos" element={
              <AppLayout requireAdmin={true}>
                <AdminPhotos />
              </AppLayout>
            } />
            <Route path="/admin/videos" element={
              <AppLayout requireAdmin={true}>
                <AdminVideos />
              </AppLayout>
            } />
            
            {/* Main video registration page - renamed from batch-import */}
            <Route path="/admin/videos/cadastro" element={
              <AppLayout requireAdmin={true}>
                <VideoBatchImport />
              </AppLayout>
            } />
            
            <Route path="/admin/equipments" element={
              <AppLayout requireAdmin={true}>
                <AdminEquipments />
              </AppLayout>
            } />
            <Route path="/admin/equipments/create" element={
              <AppLayout requireAdmin={true}>
                <CreateEquipment />
              </AppLayout>
            } />
            <Route path="/admin/equipments/edit/:id" element={
              <AppLayout requireAdmin={true}>
                <EditEquipment />
              </AppLayout>
            } />
            <Route path="/admin/ai" element={
              <AppLayout requireAdmin={true}>
                <AdminAI />
              </AppLayout>
            } />
            <Route path="/admin/system-diagnostics" element={
              <AppLayout requireAdmin={true}>
                <AdminSystemDiagnostics />
              </AppLayout>
            } />
            <Route path="/admin/system-intelligence" element={
              <AppLayout requireAdmin={true}>
                <AdminSystemIntelligence />
              </AppLayout>
            } />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
