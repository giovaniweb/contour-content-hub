
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminContent from './pages/AdminContent';
import AdminEquipments from './pages/AdminEquipments';
import AdminIntegrations from './pages/AdminIntegrations';
import VideoBatchImport from './pages/VideoBatchImport';

// Other dashboard pages
import Dashboard from './pages/Dashboard';
import CustomGpt from './pages/CustomGpt';
import ScriptGenerator from './pages/ScriptGenerator';
import ScriptValidation from './pages/ScriptValidation';
import ScriptValidationPage from './pages/ScriptValidationPage';
import ScriptHistory from './pages/ScriptHistory';
import ContentStrategy from './pages/ContentStrategy';
import Calendar from './pages/Calendar';
import EquipmentsPage from './pages/EquipmentsPage';
import EquipmentDetailsPage from './pages/EquipmentDetailsPage';
import EquipmentDetails from './pages/EquipmentDetails';
import MediaLibrary from './pages/MediaLibrary';
import MarketingConsultant from './pages/MarketingConsultant';
import SystemIntelligence from './pages/SystemIntelligence';
import SystemDiagnostics from './pages/SystemDiagnostics';
import TechnicalDocuments from './pages/TechnicalDocuments';
import DocumentDetail from './pages/DocumentDetail';

// Video storage related pages
import VideoStorage from './pages/VideoStorage';
import VideoSwipe from './pages/VideoSwipe';

// Sellers pages
import SellerDashboard from './pages/seller/SellerDashboard';
import ClientList from './pages/seller/ClientList';
import ClientDetail from './pages/seller/ClientDetail';

// Providers
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/custom-gpt" element={<CustomGpt />} />
              <Route path="/generate-script" element={<ScriptGenerator />} />
              <Route path="/script-validation" element={<ScriptValidation />} />
              <Route path="/script-validation/:id" element={<ScriptValidationPage />} />
              <Route path="/script-history" element={<ScriptHistory />} />
              <Route path="/content-strategy" element={<ContentStrategy />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/equipment" element={<EquipmentsPage />} />
              <Route path="/equipment-details" element={<EquipmentDetails />} />
              <Route path="/equipment/:id" element={<EquipmentDetailsPage />} />
              <Route path="/media-library" element={<MediaLibrary />} />
              <Route path="/marketing-consultant" element={<MarketingConsultant />} />
              <Route path="/system-intelligence" element={<SystemIntelligence />} />
              <Route path="/system-diagnostics" element={<SystemDiagnostics />} />
              <Route path="/documents" element={<TechnicalDocuments />} />
              <Route path="/documents/:id" element={<DocumentDetail />} />
              <Route path="/videos" element={<VideoStorage />} />
              <Route path="/video-swipe" element={<VideoSwipe />} />
            </Route>
            
            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/equipment" element={<AdminEquipments />} />
              <Route path="/admin/videos" element={<VideoBatchImport />} />
              <Route path="/admin/integrations" element={<AdminIntegrations />} />
            </Route>
            
            {/* Seller routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/clients" element={<ClientList />} />
              <Route path="/seller/clients/:id" element={<ClientDetail />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
