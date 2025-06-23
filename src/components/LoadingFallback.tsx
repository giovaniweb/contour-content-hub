
import React from 'react';

interface LoadingFallbackProps {
  message?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Carregando aplicação..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center aurora-dark-bg">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 aurora-glass rounded-2xl flex items-center justify-center mx-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aurora-electric-purple"></div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-medium aurora-text-gradient">
            {message}
          </h2>
          <p className="text-slate-400 aurora-body">
            Configurando autenticação...
          </p>
        </div>
        
        {/* Timeout visual indicator */}
        <div className="w-64 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;
