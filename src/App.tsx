import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Auth & Navigation
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipments from './pages/AdminEquipments';
import AdminContent from './pages/AdminContent';
import CustomGpt from './pages/CustomGpt';
import MediaLibrary from './pages/MediaLibrary';
import TechnicalDocuments from './pages/TechnicalDocuments';
import DocumentDetail from './pages/DocumentDetail';
import ScriptGenerator from './pages/ScriptGenerator';
import ScriptHistory from './pages/ScriptHistory';
import Calendar from './pages/Calendar';
import ContentStrategy from './pages/ContentStrategy';
import AdminIntegrations from './pages/AdminIntegrations';
import MarketingConsultant from './pages/MarketingConsultant';
import SystemDiagnostics from './pages/SystemDiagnostics';
import ScriptValidationPage from './pages/ScriptValidationPage';
import EquipmentDetailsPage from './pages/EquipmentDetailsPage';
import EquipmentDetails from './pages/EquipmentDetails';
import EquipmentsPage from './pages/EquipmentsPage';
import VideoBatchImport from './pages/VideoBatchImport';
import VimeoSettings from './pages/VimeoSettings';
import Settings from './pages/Settings';
import SystemIntelligence from './pages/SystemIntelligence';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import ClientList from './pages/seller/ClientList';
import ClientDetail from './pages/seller/ClientDetail';

// Not Found
import NotFound from './pages/NotFound';

// Theme Provider
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { TooltipProvider } from './components/ui/tooltip';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Private Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/media" element={<PrivateRoute><MediaLibrary /></PrivateRoute>} />
                <Route path="/documents" element={<PrivateRoute><TechnicalDocuments /></PrivateRoute>} />
                <Route path="/documents/:id" element={<PrivateRoute><DocumentDetail /></PrivateRoute>} />
                <Route path="/script-generator" element={<PrivateRoute><ScriptGenerator /></PrivateRoute>} />
                <Route path="/script-history" element={<PrivateRoute><ScriptHistory /></PrivateRoute>} />
                
                {/* Corrigindo as rotas de validação de roteiro */}
                <Route path="/script-validation" element={<PrivateRoute><ScriptValidationPage /></PrivateRoute>} />
                <Route path="/script-validation/:id" element={<PrivateRoute><ScriptValidationPage /></PrivateRoute>} />
                
                <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
                <Route path="/content-strategy" element={<PrivateRoute><ContentStrategy /></PrivateRoute>} />
                <Route path="/marketing-consultant" element={<PrivateRoute><MarketingConsultant /></PrivateRoute>} />
                <Route path="/custom-gpt" element={<PrivateRoute><CustomGpt /></PrivateRoute>} />
                <Route path="/equipments" element={<PrivateRoute><EquipmentsPage /></PrivateRoute>} />
                
                {/* Fixed Route: Changed from /equipment/:id/* to /equipments/:id (to match current URL pattern) */}
                <Route path="/equipments/:id" element={<PrivateRoute><EquipmentDetails /></PrivateRoute>} />
                
                {/* Keeping both routes for backward compatibility */}
                <Route path="/equipment/:id" element={<PrivateRoute><EquipmentDetailsPage /></PrivateRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/equipments" element={<AdminRoute><AdminEquipments /></AdminRoute>} />
                <Route path="/admin/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
                <Route path="/admin/integrations" element={<AdminRoute><AdminIntegrations /></AdminRoute>} />
                <Route path="/admin/vimeo-settings" element={<AdminRoute><VimeoSettings /></AdminRoute>} />
                <Route path="/admin/system" element={<AdminRoute><SystemDiagnostics /></AdminRoute>} />
                <Route path="/admin/videos/batch-import" element={<AdminRoute><VideoBatchImport /></AdminRoute>} />
                <Route path="/admin/system-intelligence" element={<AdminRoute><SystemIntelligence /></AdminRoute>} />

                {/* Seller Routes */}
                <Route path="/seller" element={<AdminRoute><SellerDashboard /></AdminRoute>} />
                <Route path="/seller/clients" element={<AdminRoute><ClientList /></AdminRoute>} />
                <Route path="/seller/clients/:id" element={<AdminRoute><ClientDetail /></AdminRoute>} />

                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
            <SonnerToaster position="top-right" expand={false} richColors />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
