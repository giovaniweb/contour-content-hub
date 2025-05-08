
import React from "react";
import { Navigate } from "react-router-dom";

// Componente simplificado de autenticação
// Em uma implementação real, isto verificaria o estado de autenticação
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Simulando um usuário autenticado para fins de demo
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
