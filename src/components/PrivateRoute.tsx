
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/use-permissions';
import { ROUTES } from '@/routes';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackPath?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requiredPermission,
  fallbackPath = ROUTES.LOGIN 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasPermission } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
