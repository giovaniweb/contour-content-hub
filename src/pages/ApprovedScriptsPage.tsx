
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ApprovedScriptsManager from '@/components/approved-scripts/ApprovedScriptsManager';

const ApprovedScriptsPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="container-fluid max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            📚 Biblioteca de Roteiros Aprovados
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Gerencie seus roteiros aprovados, avalie performance e envie para o planejador de conteúdo.
          </p>
        </div>
        
        <ApprovedScriptsManager />
      </div>
    </AppLayout>
  );
};

export default ApprovedScriptsPage;
