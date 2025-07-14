
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "../navbar/Navbar";
import AuroraPageLayout from "./AuroraPageLayout";

const SIDEBAR_WIDTH = 104; // igual ao Sidebar.tsx (px: w-26)
const NAVBAR_HEIGHT = 64; // altura do navbar (h-16)

interface AppLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  particleIntensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  requireAdmin = false,
  particleIntensity = 'medium',
  interactive = true,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    
    if (requireAdmin && user?.role !== "admin") {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [isAuthenticated, user, isLoading, navigate, location.pathname, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen aurora-enhanced-bg">
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="aurora-loading-enhanced rounded-full h-12 w-12 border-b-2 border-aurora-electric-purple animate-spin"></div>
            <p className="text-slate-50 aurora-body-enhanced">Verificando autenticação...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen aurora-enhanced-bg">
      {/* Sidebar sempre fixo à esquerda */}
      <div className="relative z-30">
        <Sidebar />
      </div>
      
      {/* Conteúdo principal, com left padding igual ao sidebar */}
      <div
        className="min-h-screen flex flex-col relative z-20"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        {/* Topbar fixa */}
        <div className="relative z-25">
          <Navbar />
        </div>
        
        <main 
          className="flex-1 overflow-y-auto px-2 md:px-6 relative z-20"
          style={{ paddingTop: NAVBAR_HEIGHT + 8 }} // 8px extra para espaçamento
        >
          <div className="relative z-20 clickable min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
