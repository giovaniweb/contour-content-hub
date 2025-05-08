
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log("PrivateRoute - Auth State:", { 
    isAuthenticated, 
    isLoading, 
    userExists: !!user, 
    path: location.pathname 
  });

  // Show loading state while checking authentication
  if (isLoading) {
    console.log("PrivateRoute - Still loading authentication state");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          message="Verificando autenticação..." 
          submessage="Aguarde um momento..." 
        />
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
  // Only render children when we're certain the user is authenticated
  // and the user object is available
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error rendering protected route:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao renderizar conteúdo</h2>
          <p className="text-gray-600">Ocorreu um erro ao carregar esta página.</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
};

export default PrivateRoute;
