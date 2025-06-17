import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from "@/components/ui/toaster"

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import WorkspaceSettings from './pages/WorkspaceSettings';

import Scripts from './pages/content/Scripts';
import ScriptGenerator from './pages/content/ScriptGenerator';
import ScriptValidation from './pages/content/ScriptValidation';
import FluidaRoteirista from './pages/content/FluidaRoteirista';
import ContentPlanner from './pages/content/ContentPlanner';
import ContentIdeas from './pages/content/ContentIdeas';
import ContentStrategy from './pages/content/ContentStrategy';
import Calendar from './pages/content/Calendar';

import Videos from './pages/videos/Videos';
import CreateVideo from './pages/videos/CreateVideo';
import VideoPlayer from './pages/videos/VideoPlayer';
import VideoStorage from './pages/videos/VideoStorage';
import BatchVideos from './pages/videos/BatchVideos';
import ImportVideos from './pages/videos/ImportVideos';
import SwipeVideos from './pages/videos/SwipeVideos';

import Equipments from './pages/Equipments';
import EquipmentDetails from './pages/EquipmentDetails';

import Media from './pages/Media';
import ScientificArticles from './pages/ScientificArticles';

import MarketingConsultant from './pages/marketing/MarketingConsultant';
import Reports from './pages/marketing/Reports';
import DiagnosticHistory from './pages/marketing/DiagnosticHistory';

import ConsultantPanel from './pages/ConsultantPanel';

import BatchDownloads from './pages/BatchDownloads';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEquipments from './pages/admin/AdminEquipments';
import CreateEquipment from './pages/admin/CreateEquipment';
import EditEquipment from './pages/admin/EditEquipment';
import AdminContent from './pages/AdminContent';
import AdminAI from './pages/admin/AdminAI';
import AdminSystemDiagnostics from './pages/admin/AdminSystemDiagnostics';
import AdminSystemIntelligence from './pages/admin/AdminSystemIntelligence';
import AdminVimeoSettings from './pages/admin/AdminVimeoSettings';
import AdminWorkspace from './pages/admin/AdminWorkspace';

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
          <Route path="/content/scripts" element={<Scripts />} />
          <Route path="/script-generator" element={<ScriptGenerator />} />
          <Route path="/script-validation" element={<ScriptValidation />} />
          <Route path="/fluidaroteirista" element={<FluidaRoteirista />} />
          <Route path="/content-planner" element={<ContentPlanner />} />
          <Route path="/content-ideas" element={<ContentIdeas />} />
          <Route path="/content-strategy" element={<ContentStrategy />} />
          <Route path="/calendar" element={<Calendar />} />

          {/* Video Routes */}
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/create" element={<CreateVideo />} />
          <Route path="/video-player" element={<VideoPlayer />} />
          <Route path="/videos/storage" element={<VideoStorage />} />
          <Route path="/videos/batch" element={<BatchVideos />} />
          <Route path="/videos/import" element={<ImportVideos />} />
          <Route path="/videos/swipe" element={<SwipeVideos />} />

          {/* Equipments Routes */}
          <Route path="/equipments" element={<Equipments />} />
          <Route path="/equipments/:id" element={<EquipmentDetails />} />

          <Route path="/media" element={<Media />} />
          <Route path="/scientific-articles" element={<ScientificArticles />} />

          {/* Marketing Routes */}
          <Route path="/marketing-consultant" element={<MarketingConsultant />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/diagnostic-history" element={<DiagnosticHistory />} />

          <Route path="/consultant-panel" element={<ConsultantPanel />} />

          <Route path="/downloads/batch" element={<BatchDownloads />} />

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
          <Route path="/admin/vimeo-settings" element={<AdminVimeoSettings />} />
          <Route path="/admin/workspace" element={<AdminWorkspace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
