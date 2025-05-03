
import { Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipments from './pages/AdminEquipments';
import AdminIntegrations from './pages/AdminIntegrations';
import AdminContent from './pages/AdminContent';
import Calendar from './pages/Calendar';
import CustomGpt from './pages/CustomGpt';
import MediaLibrary from './pages/MediaLibrary';
import ScriptHistory from './pages/ScriptHistory';
import ScriptValidation from './pages/ScriptValidation';
import ScriptValidationPage from './pages/ScriptValidationPage';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';
import TechnicalDocumentsPage from './pages/TechnicalDocuments';
import DocumentDetailPage from './pages/DocumentDetail';
import EquipmentDetails from './pages/EquipmentDetails';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="fluida-theme">
      <HelmetProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/equipments" element={<AdminEquipments />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/integrations" element={<AdminIntegrations />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/custom-gpt" element={<CustomGpt />} />
            <Route path="/media" element={<MediaLibrary />} />
            <Route path="/scripts" element={<ScriptHistory />} />
            <Route path="/validate-script" element={<ScriptValidationPage />} />
            <Route path="/script-validation" element={<ScriptValidation />} />
            <Route path="/documents" element={<TechnicalDocumentsPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/equipments/:id" element={<EquipmentDetails />} />
            <Route path="/equipment-details" element={<EquipmentDetails />} />
            <Route path="/equipment-details/:id" element={<EquipmentDetails />} />
            <Route path="/media-library" element={<MediaLibrary />} />
            <Route path="/script-history" element={<ScriptHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </LanguageProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
