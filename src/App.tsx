
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { SlideNotificationProvider } from "@/components/notifications/SlideNotificationProvider";
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from "@/components/PrivateRoute";
import AdminRoute from "@/components/AdminRoute";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load components
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AdminContent = lazy(() => import("@/pages/AdminContent"));
const EquipmentDetails = lazy(() => import("@/pages/EquipmentDetails"));
const MediaLibrary = lazy(() => import("@/pages/MediaLibrary"));
const Profile = lazy(() => import("@/pages/Profile"));
const VideoStorage = lazy(() => import("@/pages/VideoStorage"));
const MarketingConsultant = lazy(() => import("@/pages/MarketingConsultant"));
const CustomGpt = lazy(() => import("@/pages/CustomGpt"));
const Reports = lazy(() => import("@/pages/Reports"));
const ScientificArticleFormPage = lazy(() => import("@/pages/ScientificArticleForm"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <SlideNotificationProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      
                      <Route path="/dashboard" element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/media" element={
                        <PrivateRoute>
                          <MediaLibrary />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/profile" element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/videos" element={
                        <PrivateRoute>
                          <VideoStorage />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/marketing-consultant" element={
                        <PrivateRoute>
                          <MarketingConsultant />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/custom-gpt" element={
                        <PrivateRoute>
                          <CustomGpt />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/reports" element={
                        <PrivateRoute>
                          <Reports />
                        </PrivateRoute>
                      } />
                      
                      <Route path="/equipment/:id" element={
                        <PrivateRoute>
                          <EquipmentDetails />
                        </PrivateRoute>
                      } />

                      <Route path="/scientific-article/new" element={
                        <AdminRoute>
                          <ScientificArticleFormPage />
                        </AdminRoute>
                      } />

                      <Route path="/scientific-article/edit/:id" element={
                        <AdminRoute>
                          <ScientificArticleFormPage />
                        </AdminRoute>
                      } />
                      
                      <Route path="/admin/content" element={
                        <AdminRoute>
                          <AdminContent />
                        </AdminRoute>
                      } />
                    </Routes>
                  </Suspense>
                  
                  <Toaster />
                  <Sonner />
                </div>
              </BrowserRouter>
            </SlideNotificationProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
