
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requireAuth = true,
  title
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-reelline-light">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-reelline-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-reelline-neutral">Loading ReelLine...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-6">
          {title && (
            <h1 className="text-2xl md:text-3xl font-bold mb-6">{title}</h1>
          )}
          {children}
        </main>
      </ScrollArea>
      
      <footer className="py-4 px-6 bg-white border-t border-gray-100 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} ReelLine | Your creative studio, in one click.</p>
      </footer>
    </div>
  );
};

export default Layout;
