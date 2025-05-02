
import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Show loading state with more creative animation
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-contourline-lightGray to-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="h-20 w-20 border-4 border-contourline-mediumBlue border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 bg-contourline-lightBlue/30 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-contourline-darkBlue font-heading font-medium text-xl">Carregando Fluida...</p>
            <p className="text-contourline-mediumBlue text-sm animate-pulse">Tô tirando do forno...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-contourline-lightGray/20">
      <Navbar />
      
      <ScrollArea className="flex-grow">
        <main className={`mx-auto px-4 py-6 ${fullWidth ? 'w-full' : 'container'}`}>
          {title && (
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-contourline-gradient bg-clip-text text-transparent">{title}</h1>
          )}
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </ScrollArea>
      
      <footer className="py-4 px-6 bg-white border-t border-contourline-lightBlue/10 text-center text-sm text-contourline-darkBlue">
        <p>© {new Date().getFullYear()} Fluida | Seu estúdio criativo, em um clique.</p>
      </footer>
    </div>
  );
};

export default Layout;
