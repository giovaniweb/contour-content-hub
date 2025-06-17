
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"

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
import VideoStorage from './pages/VideoStorage';
import VideosPage from './pages/VideosPage';

import EquipmentList from './pages/EquipmentList';
import EquipmentDetails from './pages/EquipmentDetails';

import Media from './pages/Media';
import ScientificArticles from './pages/ScientificArticles';

import MarketingConsultant from './pages/MarketingConsultant';
import Reports from './pages/Reports';
import DiagnosticHistory from './pages/DiagnosticHistory';

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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/workspace-settings" element={<WorkspaceSettings />} />

          {/* Content Routes */}
          <Route path="/fluidaroteirista" element={<FluidaRoteiristsPage />} />
          <Route path="/content-planner" element={<ContentPlannerPage />} />

          {/* Video Routes */}
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/video-player" element={<VideoPlayer />} />
          <Route path="/videos/storage" element={<VideoStorage />} />

          {/* Equipments Routes */}
          <Route path="/equipments" element={<EquipmentList />} />
          <Route path="/equipments/:id" element={<EquipmentDetails />} />

          <Route path="/media" element={<Media />} />
          <Route path="/scientific-articles" element={<ScientificArticles />} />

          {/* Marketing Routes */}
          <Route path="/marketing-consultant" element={<MarketingConsultant />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/diagnostic-history" element={<DiagnosticHistory />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/scientific-articles" element={<AdminScientificArticles />} />
          <Route path="/admin/materials" element={<AdminMaterials />} />
          <Route path="/admin/photos" element={<AdminPhotos />} />
          <Route path="/admin/videos" element={<AdminVideos />} />
          <Route path="/admin/equipments" element={<AdminEquipments />} />
          <Route path="/admin/equipments/create" element={<CreateEquipment />} />
          <Route path="/admin/equipments/edit/:id" element={<EditEquipment />} />
          <Route path="/admin/ai" element={<AdminAI />} />
          <Route path="/admin/system-diagnostics" element={<AdminSystemDiagnostics />} />
          <Route path="/admin/system-intelligence" element={<AdminSystemIntelligence />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
