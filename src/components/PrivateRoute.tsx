
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log("PrivateRoute - Auth State:", { isAuthenticated, isLoading, userExists: !!user, path: location.pathname });

  // Show loading state while checking authentication
  if (isLoading) {
    console.log("PrivateRoute - Still loading authentication state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Verificando autenticação..." submessage="Aguarde um momento..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log("PrivateRoute - Not authenticated, redirecting to login");
    // Preserve the attempted URL for redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log("PrivateRoute - User authenticated, rendering protected content");
  return <>{children}</>;
};

export default PrivateRoute;
