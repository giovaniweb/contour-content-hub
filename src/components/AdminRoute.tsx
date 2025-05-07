
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin } = usePermissions();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated && isAdmin() ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
