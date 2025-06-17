
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import HomePage from './HomePage';

const Home: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aurora-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-electric-purple"></div>
          <p className="text-slate-50">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se autenticado, redirecionar para dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não autenticado, mostrar homepage
  return <HomePage />;
};

export default Home;
