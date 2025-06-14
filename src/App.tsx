import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LanguageProvider } from '@/context/LanguageContext';
import AppLayout from '@/components/layout/AppLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import { Spinner } from '@/components/ui/loading-spinner';

// Lazy imports
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Login = React.lazy(() => import('@/pages/Login'));
const Register = React.lazy(() => import('@/pages/Register'));
const BeforeAfterPage = React.lazy(() => import('@/pages/BeforeAfterPage'));
const GamificationDashboard = React.lazy(() => import('@/pages/GamificationDashboard'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const Diagnostic = React.lazy(() => import('@/pages/Diagnostic'));
const CreativeAgenda = React.lazy(() => import('@/pages/CreativeAgenda'));
const Integrations = React.lazy(() => import('@/pages/Integrations'));
const Billing = React.lazy(() => import('@/pages/Billing'));
const Pricing = React.lazy(() => import('@/pages/Pricing'));
const Onboarding = React.lazy(() => import('@/pages/Onboarding'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminEquipments = React.lazy(() => import('@/pages/admin/AdminEquipments'));
const AdminEquipmentsCreate = React.lazy(() => import('@/pages/admin/AdminEquipmentsCreate'));
const AdminEquipmentsEdit = React.lazy(() => import('@/pages/admin/AdminEquipmentsEdit'));
const AdminContent = React.lazy(() => import('@/pages/admin/AdminContent'));
const AdminVideos = React.lazy(() => import('@/pages/admin/AdminVideos'));
const AdminAI = React.lazy(() => import('@/pages/admin/AdminAI'));
const AdminSystemDiagnostics = React.lazy(() => import('@/pages/admin/AdminSystemDiagnostics'));
const AdminSystemIntelligence = React.lazy(() => import('@/pages/admin/AdminSystemIntelligence'));
const AdminVimeoSettings = React.lazy(() => import('@/pages/admin/AdminVimeoSettings'));
const AdminWorkspace = React.lazy(() => import('@/pages/admin/AdminWorkspace'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <SidebarProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Suspense fallback={<Spinner />}>
                  <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
                    <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                    <Route path="/before-after" element={<AppLayout><BeforeAfterPage /></AppLayout>} />
                    <Route path="/gamification" element={<AppLayout><GamificationDashboard /></AppLayout>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                    <Route path="/admin/equipments" element={<AdminLayout><AdminEquipments /></AdminLayout>} />
                    <Route path="/admin/equipments/create" element={<AdminLayout><AdminEquipmentsCreate /></AdminLayout>} />
                    <Route path="/admin/equipments/edit/:id" element={<AdminLayout><AdminEquipmentsEdit /></AdminLayout>} />
                    <Route path="/admin/content" element={<AdminLayout><AdminContent /></AdminLayout>} />
                    <Route path="/admin/videos" element={<AdminLayout><AdminVideos /></AdminLayout>} />
                    <Route path="/admin/ai" element={<AdminLayout><AdminAI /></AdminLayout>} />
                    <Route path="/admin/system-diagnostics" element={<AdminLayout><AdminSystemDiagnostics /></AdminLayout>} />
                    <Route path="/admin/system-intelligence" element={<AdminLayout><AdminSystemIntelligence /></AdminLayout>} />
                    <Route path="/admin/vimeo-settings" element={<AdminLayout><AdminVimeoSettings /></AdminLayout>} />
                    <Route path="/admin/workspace" element={<AdminLayout><AdminWorkspace /></AdminLayout>} />
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
  );
}

export default App;
