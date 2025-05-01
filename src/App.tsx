
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ScriptGenerator from "./pages/ScriptGenerator";
import MediaLibrary from "./pages/MediaLibrary";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminIntegrations from "./pages/AdminIntegrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para verificar permissões de rotas administrativas
const AdminRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin } = usePermissions();
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{element}</>;
};

// Componente para verificar permissões de rotas operacionais
const OperatorRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOperator, isAdmin } = usePermissions();
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated || !(isOperator() || isAdmin())) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{element}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/script-generator" element={<ScriptGenerator />} />
              <Route path="/media-library" element={<MediaLibrary />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Rotas protegidas por papel de usuário */}
              <Route path="/admin" element={<AdminRoute element={<Navigate to="/admin/integrations" />} />} />
              <Route path="/admin/integrations" element={<AdminRoute element={<AdminIntegrations />} />} />
              <Route path="/operator/*" element={<OperatorRoute element={<div>Área do Operador</div>} />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
