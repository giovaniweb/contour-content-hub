
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "../navbar/Navbar";

const SIDEBAR_WIDTH = 104; // igual ao Sidebar.tsx (px: w-26)
const NAVBAR_HEIGHT = 64; // altura do navbar (h-16)

interface AppLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || !user) {
      console.log('🔄 Usuário não autenticado, redirecionando para login');
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }
    
    if (requireAdmin && user.role !== "admin") {
      console.log('🔒 Acesso negado para não-admin, redirecionando para dashboard');
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [isAuthenticated, user, isLoading, navigate, location.pathname, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aurora-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-electric-purple"></div>
          <p className="text-slate-50">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-aurora-background">
      {/* Sidebar sempre fixo à esquerda */}
      <Sidebar />
      
      {/* Conteúdo principal, com left margin igual ao sidebar */}
      <div
        className="min-h-screen flex flex-col"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        {/* Topbar fixa */}
        <Navbar />
        
        {/* Main content */}
        <main 
          className="flex-1 overflow-auto px-2 md:px-6 py-4"
          style={{ marginTop: NAVBAR_HEIGHT }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
