import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LanguageProvider } from '@/context/LanguageContext';
import AppLayout from '@/components/layout/AppLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SlideNotificationProvider } from "@/components/notifications/SlideNotificationProvider";

// Lazy imports - existing pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const BeforeAfterPage = React.lazy(() => import('@/pages/BeforeAfterPage'));
const GamificationDashboard = React.lazy(() => import('@/pages/GamificationDashboard'));
const MestreDaBelezaPage = React.lazy(() => import('@/pages/MestreDaBelezaPage'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Content pages
const FluidaRoteiristPage = React.lazy(() => import('@/pages/FluidaRoteiristsPage'));
const ContentPlannerPage = React.lazy(() => import('@/pages/ContentPlannerPage'));
const ScientificArticles = React.lazy(() => import('@/pages/ScientificArticles'));
const PhotosPage = React.lazy(() => import('@/pages/PhotosPage'));
const ArtsPage = React.lazy(() => import('@/pages/ArtsPage'));

// Marketing pages
const MarketingConsultantHome = React.lazy(() => import('@/components/marketing-consultant/MarketingConsultantHome'));
const Reports = React.lazy(() => import('@/pages/Reports'));

// Video pages
const VideosPage = React.lazy(() => import('@/pages/VideosPage'));
const VideoPlayer = React.lazy(() => import('@/pages/VideoPlayer'));

// Equipment pages
// Import the new page
import EquipmentList from "@/pages/EquipmentList";

// Admin pages
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminEquipments = React.lazy(() => import('@/pages/admin/AdminEquipments')); // Corrigido para admin/AdminEquipments
const AdminContent = React.lazy(() => import('@/pages/admin/AdminContent'));
const AdminVideos = React.lazy(() => import('@/pages/admin/AdminVideos'));
const AdminAI = React.lazy(() => import('@/pages/admin/AdminAI'));
const AdminSystemIntelligence = React.lazy(() => import('@/pages/admin/AdminSystemIntelligence'));
const AdminSystemDiagnostics = React.lazy(() => import('@/pages/admin/AdminSystemDiagnostics'));
const WorkspaceSettings = React.lazy(() => import('@/pages/admin/WorkspaceSettings'));

import { queryClient } from './config/queryClient';

const DiagnosticHistory = React.lazy(() => import('@/pages/DiagnosticHistory'));

function App() {
  return (
    <SlideNotificationProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <SidebarProvider>
              <Router>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Auth Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      {/* Main Dashboard */}
                      <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
                      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                      
                      {/* Main Menu Routes */}
                      <Route path="/mestre-da-beleza" element={<AppLayout><MestreDaBelezaPage /></AppLayout>} />
                      <Route path="/marketing-consultant" element={<AppLayout><MarketingConsultantHome /></AppLayout>} />
                      <Route path="/fluidaroteirista" element={<AppLayout><FluidaRoteiristPage /></AppLayout>} />
                      <Route path="/script-generator" element={<AppLayout><FluidaRoteiristPage /></AppLayout>} />
                      <Route path="/videos" element={<AppLayout><VideosPage /></AppLayout>} />
                      <Route path="/video-player" element={<AppLayout><VideoPlayer /></AppLayout>} />
                      <Route path="/photos" element={<AppLayout><PhotosPage /></AppLayout>} />
                      <Route path="/arts" element={<AppLayout><ArtsPage /></AppLayout>} />
                      <Route path="/content-planner" element={<AppLayout><ContentPlannerPage /></AppLayout>} />
                      {/* TROCA AQUI - Equipamentos */}
                      <Route path="/equipments" element={<AppLayout><EquipmentList /></AppLayout>} />
                      {/* FIM DA TROCA */}
                      
                      {/* Histórico de Diagnósticos */}
                      <Route path="/diagnostic-history" element={<AppLayout><DiagnosticHistory /></AppLayout>} />
                      
                      {/* Content Routes */}
                      <Route path="/scientific-articles" element={<AppLayout><ScientificArticles /></AppLayout>} />
                      
                      {/* Marketing Routes */}
                      <Route path="/reports" element={<AppLayout><Reports /></AppLayout>} />
                      
                      {/* Gamification Routes */}
                      <Route path="/before-after" element={<AppLayout><BeforeAfterPage /></AppLayout>} />
                      <Route path="/gamification" element={<AppLayout><GamificationDashboard /></AppLayout>} />
                      
                      {/* Profile */}
                      <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                      <Route path="/admin/equipments" element={<AdminLayout><AdminEquipments /></AdminLayout>} />
                      <Route path="/admin/content" element={<AdminLayout><AdminContent /></AdminLayout>} />
                      <Route path="/admin/videos" element={<AdminLayout><AdminVideos /></AdminLayout>} />
                      <Route path="/admin/ai" element={<AdminLayout><AdminAI /></AdminLayout>} />
                      <Route path="/admin/system-intelligence" element={<AdminLayout><AdminSystemIntelligence /></AdminLayout>} />
                      <Route path="/admin/system-diagnostics" element={<AdminLayout><AdminSystemDiagnostics /></AdminLayout>} />
                      {/* Arrumado - workspace-settings */}
                      <Route path="/workspace-settings" element={<AdminLayout><WorkspaceSettings /></AdminLayout>} />
                      
                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <Toaster />
                </div>
              </Router>
            </SidebarProvider>
          </AuthProvider>
        </LanguageProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SlideNotificationProvider>
  );
}

export default App;
