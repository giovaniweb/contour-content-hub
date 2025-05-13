
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/use-permissions';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AdminRouteProps {
  children?: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { isAdmin } = usePermissions();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If auth has loaded and user isn't admin, show toast and redirect
    if (!isLoading && user && !isAdmin()) {
      toast.error("Acesso restrito: apenas administradores podem acessar esta área");
      navigate('/dashboard');
    }
  }, [isLoading, user, isAdmin, navigate]);

  // If auth is still loading, show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user, redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If not admin, already handled by useEffect
  if (!isAdmin()) {
    return null;
  }
  
  // If there are children, render them, otherwise render the outlet
  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
