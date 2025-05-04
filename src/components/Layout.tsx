
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "./Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar/Sidebar";
import { LoadingSpinner } from "./ui/loading-spinner";
import { Footer } from "./footer/Footer";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requireAuth = true,
  title,
  fullWidth = false
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  // Gerenciar estado do sidebar com base no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animação de carregamento melhorada com aria-live para acessibilidade
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-contourline-lightGray/20 w-full">
        <Navbar />
        
        <div className="flex flex-1">
          {isAuthenticated && (
            <AppSidebar 
              sidebarCollapsed={sidebarCollapsed} 
              setSidebarCollapsed={setSidebarCollapsed} 
            />
          )}
          
          <ScrollArea className="flex-grow">
            <main id="main-content" className={`mx-auto px-4 py-6 ${fullWidth ? 'w-full' : 'container'}`}>
              {title && (
                <h1 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-contourline-gradient bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              <div className="animate-fade-in">
                {children}
              </div>
            </main>
          </ScrollArea>
        </div>
        
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
