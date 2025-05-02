
import React from "react";
import { Navigate } from "react-router-dom";
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-contourline-lightGray to-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 border-4 border-contourline-mediumBlue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-contourline-darkBlue font-medium text-lg">Carregando ReelLine...</p>
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
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-contourline-darkBlue">{title}</h1>
          )}
          {children}
        </main>
      </ScrollArea>
      
      <footer className="py-4 px-6 bg-white border-t border-contourline-lightBlue/10 text-center text-sm text-contourline-darkBlue">
        <p>© {new Date().getFullYear()} ReelLine | Seu estúdio criativo, em um clique.</p>
      </footer>
    </div>
  );
};

export default Layout;
