
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute: Checking access for path:', location.pathname, { isAuthenticated, isLoading });

  if (isLoading) {
    console.log('PrivateRoute: Still loading auth state, showing loading screen');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute: User not authenticated, redirecting to login');
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute: User authenticated, allowing access');
  return <>{children}</>;
};

export default PrivateRoute;
