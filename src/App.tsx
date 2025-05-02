
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip";

// Auth pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Lazy loaded app pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ScriptGenerator = lazy(() => import('./pages/ScriptGenerator'));
const ScriptHistory = lazy(() => import('./pages/ScriptHistory'));
const MediaLibrary = lazy(() => import('./pages/MediaLibrary'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const CustomGpt = lazy(() => import('./pages/CustomGpt'));
const EquipmentDetails = lazy(() => import('./pages/EquipmentDetails'));

// Lazy loaded admin pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminEquipments = lazy(() => import('./pages/AdminEquipments'));
const AdminContent = lazy(() => import('./pages/AdminContent'));
const AdminIntegrations = lazy(() => import('./pages/AdminIntegrations'));

// Lazy loaded seller pages
const SellerDashboard = lazy(() => import('./pages/seller/SellerDashboard'));
const ClientList = lazy(() => import('./pages/seller/ClientList'));
const ClientDetail = lazy(() => import('./pages/seller/ClientDetail'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-blue-200 animate-pulse"></div>
        </div>
      </div>
      <p className="text-lg font-medium text-gray-700">Carregando...</p>
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Seller Route component
const SellerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!user || (user.role !== 'vendedor' && user.role !== 'admin')) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public Route component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Get the intended destination from state, or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              <TooltipProvider>
                <Toaster />
                <Routes>
                  {/* Rotas públicas (usuários não autenticados) */}
                  <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                  <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                  <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                  
                  {/* Rotas protegidas (usuários autenticados) */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Dashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/script-generator" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <ScriptGenerator />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/script-history" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <ScriptHistory />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/media-library" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <MediaLibrary />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Calendar />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/custom-gpt" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <CustomGpt />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/equipment-details" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <EquipmentDetails />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Profile />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Settings />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  
                  {/* Rotas administrativas (apenas admin) */}
                  <Route path="/admin/dashboard" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <AdminDashboard />
                      </Suspense>
                    </AdminRoute>
                  } />
                  <Route path="/admin/equipments" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <AdminEquipments />
                      </Suspense>
                    </AdminRoute>
                  } />
                  <Route path="/admin/content" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <AdminContent />
                      </Suspense>
                    </AdminRoute>
                  } />
                  <Route path="/admin/integrations" element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <AdminIntegrations />
                      </Suspense>
                    </AdminRoute>
                  } />
                  
                  {/* Rotas de vendedor (apenas vendedores e admins) */}
                  <Route path="/seller/dashboard" element={
                    <SellerRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <SellerDashboard />
                      </Suspense>
                    </SellerRoute>
                  } />
                  <Route path="/seller/clients" element={
                    <SellerRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <ClientList />
                      </Suspense>
                    </SellerRoute>
                  } />
                  <Route path="/seller/client/:id" element={
                    <SellerRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <ClientDetail />
                      </Suspense>
                    </SellerRoute>
                  } />
                  
                  {/* Rota de redirecionamento para página inicial */}
                  <Route path="/index" element={<Navigate to="/" replace />} />
                  
                  {/* Rota para páginas não encontradas */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
