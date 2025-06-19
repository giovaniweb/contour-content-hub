
import React from 'react';
import { Navigate } from 'react-router-dom';

interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  // For now, we'll just render children since we don't have authentication set up
  // In a real app, you'd check if user is authenticated and redirect to dashboard
  const isAuthenticated = false; // TODO: Replace with real auth check
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
