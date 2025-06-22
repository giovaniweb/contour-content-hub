
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
    
    // Para desenvolvimento, não redirecionar para login
    // if (!isAuthenticated || !user) {
    //   navigate("/login", {
    //     replace: true,
    //     state: { from: location.pathname },
    //   });
    //   return;
    // }
    
    if (requireAdmin && user?.role !== "admin") {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [isAuthenticated, user, isLoading, navigate, location.pathname, requireAdmin]);

  if (isLoading) {
    return (
      <AuroraPageLayout particleIntensity="high" interactive={true}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="aurora-loading-enhanced rounded-full h-12 w-12 border-b-2 border-aurora-electric-purple animate-spin"></div>
            <p className="text-slate-50 aurora-body-enhanced">Verificando autenticação...</p>
          </div>
        </div>
      </AuroraPageLayout>
    );
  }

  return (
    <div className="min-h-screen aurora-enhanced-bg">
      {/* Sidebar sempre fixo à esquerda */}
      <Sidebar />
      {/* Conteúdo principal, com left padding igual ao sidebar */}
      <div
        className="min-h-screen flex flex-col"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        {/* Topbar fixa */}
        <Navbar />
        <main 
          className="flex-1 overflow-auto px-2 md:px-6"
          style={{ paddingTop: NAVBAR_HEIGHT + 8 }} // 8px extra para espaçamento
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
