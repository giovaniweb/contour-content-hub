
import React from 'react';
import { Navbar } from '@/components/navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes';
import { SidebarProvider } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  requireAuth = true,
  requireAdmin = false
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Adicionar console log para debug
  console.log('AppLayout rendering', { isAuthenticated, isAdmin, isLoading, requireAuth, requireAdmin });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle authentication requirement
  if (requireAuth && !isAuthenticated) {
    console.log('Redirecting to login: not authenticated');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Handle admin requirement
  if (requireAdmin && (!isAuthenticated || !isAdmin)) {
    console.log('Redirecting to dashboard: not admin');
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-auto p-4 bg-gradient-to-br from-white to-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
