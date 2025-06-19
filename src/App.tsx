
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryGeneric } from '@/components/ErrorBoundaryGeneric';

// Pages Imports - only importing existing pages
import HomePage from "@/pages/HomePage";
import ProfileDashboard from "@/pages/ProfileDashboard";
import ScientificArticles from "@/pages/ScientificArticles";
import BeforeAfterPage from "@/pages/BeforeAfterPage";
import VideosPage from "@/pages/VideosPage";
import MarketingConsultant from "@/pages/MarketingConsultant";
import MestreDaBelezaPage from "@/pages/MestreDaBelezaPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminScientificArticles from "@/pages/admin/AdminScientificArticles";
import AdminVideos from "@/pages/admin/AdminVideos";
import AdminEquipments from "@/pages/admin/AdminEquipments";
import AdminContent from "@/pages/admin/AdminContent";
import AdminSystemIntelligence from "@/pages/admin/AdminSystemIntelligence";
import AdminSystemDiagnostics from "@/pages/admin/AdminSystemDiagnostics";
import NewScientificArticle from "@/pages/admin/NewScientificArticle";

// Route Protection
import PrivateRoute from "@/components/PrivateRoute";
import AdminRoute from "@/components/AdminRoute";

// Create placeholder pages for missing ones
const Login = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <p>Login page placeholder</p>
    </div>
  </div>
);

const Register = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <p>Register page placeholder</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary FallbackComponent={ErrorBoundaryGeneric}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Profile Routes */}
                  <Route path="/profile" element={<PrivateRoute><ProfileDashboard /></PrivateRoute>} />
                  
                  {/* Content Routes */}
                  <Route path="/scientific-articles" element={<ScientificArticles />} />
                  <Route path="/before-after" element={<BeforeAfterPage />} />
                  <Route path="/videos" element={<VideosPage />} />
                  
                  {/* IA Routes */}
                  <Route path="/marketing-consultant" element={<MarketingConsultant />} />
                  <Route path="/mestre-da-beleza" element={<MestreDaBelezaPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<PrivateRoute><AdminRoute><AdminDashboard /></AdminRoute></PrivateRoute>} />
                  <Route path="/admin/scientific-articles" element={<PrivateRoute><AdminRoute><AdminScientificArticles /></AdminRoute></PrivateRoute>} />
                  <Route path="/admin/scientific-articles/new" element={<PrivateRoute><AdminRoute><NewScientificArticle /></AdminRoute></PrivateRoute>} />
                  <Route path="/admin/videos" element={<PrivateRoute><AdminRoute><AdminVideos /></AdminRoute></PrivateRoute>} />
                  <Route path="/admin/equipments" element={<PrivateRoute><AdminRoute><AdminEquipments /></AdminRoute></PrivateRoute>} />
                  <Route path="/admin/content" element={<PrivateRoute><AdminRoute><AdminContent /></AdminRoute></PrivateRoute>} />
                  <Route path="/admin/system-intelligence" element={<PrivateRoute><AdminRoute><AdminSystemIntelligence /></AdminRoute></PrivateRoute>} />
                  <Route path="/admin/system-diagnostics" element={<PrivateRoute><AdminRoute><AdminSystemDiagnostics /></AdminRoute></PrivateRoute>} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
