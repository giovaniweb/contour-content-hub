
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import ViteStyleHome from '@/pages/ViteStyleHome';

const SmartLanding: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while determining auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30"></div>
      </div>
    );
  }

  // If authenticated, redirect to dashboard immediately
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // If not authenticated, show landing page
  return <ViteStyleHome />;
};

export default SmartLanding;
