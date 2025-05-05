
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/use-permissions";

interface AdminRouteProps {
  element: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Verificar se o usuário está autenticado e se é admin
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se autenticado mas não é admin, redirecionar para o dashboard
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{element}</>;
};

export default AdminRoute;
