
import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CustomGpt from "./pages/CustomGpt";
import ScriptGenerator from "./pages/ScriptGenerator";
import AdminAIPanel from "./pages/AdminAIPanel";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ContentPlannerPage from "./pages/ContentPlannerPage";
import EquipmentDetailsPage from "./pages/EquipmentDetailsPage";
import ContentStrategy from "./pages/ContentStrategy";
import { ErrorBoundaryGeneric } from "./components/ErrorBoundary";
import "./App.css";
import VideoPlayer from "./pages/VideoPlayer";
import VideoSwipe from "./pages/VideoSwipe";
import ContentPage from "./pages/ContentPage";
import MediaLibraryPage from "./pages/MediaLibraryPage";
import VideoStorage from "./pages/VideoStorage";
import VideoBatchImport from "./pages/VideoBatchImport";
import VideoBatchManage from "./pages/VideoBatchManage";
import VimeoSettings from "./pages/VimeoSettings";
import VimeoCallback from "./pages/auth/VimeoCallback";
import AdminRoute from "./components/AdminRoute";
import AdminEquipments from "./pages/AdminEquipments";
import AdminContent from "./pages/AdminContent";
import AdminIntegrations from "./pages/AdminIntegrations";
import TechnicalDocuments from "./pages/TechnicalDocuments";
import DocumentDetail from "./pages/DocumentDetail";
import ScientificArticles from "./pages/ScientificArticles";
import IdeaValidatorPage from "./pages/IdeaValidatorPage";
import NotFound from "./pages/NotFound";
import SystemIntelligence from "./pages/SystemIntelligence";
import SystemDiagnostics from "./pages/SystemDiagnostics";
import ConsultantPanel from "./pages/consultant/ConsultantPanel";
import MarketingConsultant from "./pages/MarketingConsultant";
import SellerDashboard from "./pages/seller/SellerDashboard";
import ClientList from "./pages/seller/ClientList";
import ClientDetail from "./pages/seller/ClientDetail";
import ReportsPage from "./pages/ReportsPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="fluida-theme">
          <ErrorBoundaryGeneric>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/gpt" element={<PrivateRoute><CustomGpt /></PrivateRoute>} />
              <Route path="/content" element={<PrivateRoute><ContentPage /></PrivateRoute>} />
              <Route path="/content-ideas" element={<PrivateRoute><IdeaValidatorPage /></PrivateRoute>} />
              <Route path="/content-planner" element={<PrivateRoute><ContentPlannerPage /></PrivateRoute>} />
              <Route path="/content-strategy" element={<PrivateRoute><ContentStrategy /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/scripts" element={<PrivateRoute><ScriptGenerator /></PrivateRoute>} />
              <Route path="/videos" element={<PrivateRoute><VideoPlayer /></PrivateRoute>} />
              <Route path="/video-swipe" element={<PrivateRoute><VideoSwipe /></PrivateRoute>} />
              <Route path="/media" element={<PrivateRoute><MediaLibraryPage /></PrivateRoute>} />
              <Route path="/video-storage" element={<PrivateRoute><VideoStorage /></PrivateRoute>} />
              <Route path="/vimeo-settings" element={<PrivateRoute><VimeoSettings /></PrivateRoute>} />
              <Route path="/vimeo-callback" element={<VimeoCallback />} />
              <Route path="/video-batch-import" element={<PrivateRoute><VideoBatchImport /></PrivateRoute>} />
              <Route path="/video-batch-manage" element={<PrivateRoute><VideoBatchManage /></PrivateRoute>} />
              <Route path="/documents" element={<PrivateRoute><TechnicalDocuments /></PrivateRoute>} />
              <Route path="/documents/:id" element={<PrivateRoute><DocumentDetail /></PrivateRoute>} />
              <Route path="/articles" element={<PrivateRoute><ScientificArticles /></PrivateRoute>} />
              <Route path="/equipment/:id" element={<PrivateRoute><EquipmentDetailsPage /></PrivateRoute>} />
              <Route path="/marketing-consultant" element={<PrivateRoute><MarketingConsultant /></PrivateRoute>} />
              <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
              
              {/* Consultant Routes */}
              <Route path="/consultant" element={<PrivateRoute><ConsultantPanel /></PrivateRoute>} />
              
              {/* Seller Routes */}
              <Route path="/seller" element={<PrivateRoute><SellerDashboard /></PrivateRoute>} />
              <Route path="/seller/clients" element={<PrivateRoute><ClientList /></PrivateRoute>} />
              <Route path="/seller/clients/:id" element={<PrivateRoute><ClientDetail /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminAIPanel /></AdminRoute>} />
              <Route path="/admin/equipments" element={<AdminRoute><AdminEquipments /></AdminRoute>} />
              <Route path="/admin/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
              <Route path="/admin/integrations" element={<AdminRoute><AdminIntegrations /></AdminRoute>} />
              <Route path="/admin/intelligence" element={<AdminRoute><SystemIntelligence /></AdminRoute>} />
              <Route path="/admin/diagnostics" element={<AdminRoute><SystemDiagnostics /></AdminRoute>} />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundaryGeneric>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
