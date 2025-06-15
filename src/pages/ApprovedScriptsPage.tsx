
import React from 'react';
import ApprovedScriptsManager from '@/components/approved-scripts/ApprovedScriptsManager';
import { Check } from "lucide-react";

const ApprovedScriptsPage: React.FC = () => {
  return (
    // Fundo aurora boreal animado e escuro
    <div className="min-h-screen w-full aurora-gradient-bg aurora-dark-bg animate-aurora-flow flex flex-col">
      <div className="max-w-7xl mx-auto px-0 py-8 flex-1 flex flex-col items-center">
        <div className="w-full md:w-11/12 lg:w-4/5 xl:w-3/4 aurora-glass aurora-card rounded-3xl shadow-2xl p-3 md:p-8 mb-8 mt-6 transition-all duration-500 animate-fade-in">
          {/* Cabeçalho destacado Aurora */}
          <div className="flex flex-col items-center text-center pt-6 pb-2">
            <div className="mb-3 flex items-center justify-center aurora-glass p-3 rounded-full shadow-lg animate-aurora-pulse">
              <Check className="h-10 w-10 text-aurora-emerald" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold aurora-heading aurora-text-gradient mb-2 drop-shadow-md">
              📚 Biblioteca de Roteiros Aprovados
            </h1>
            <p className="text-aurora-lavender max-w-2xl">
              Gerencie seus roteiros aprovados, avalie performance e envie para o planejador de conteúdo.
            </p>
          </div>
          {/* Manager de roteiros: mostra stats, filtros, lista */}
          <div className="mt-2">
            <ApprovedScriptsManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedScriptsPage;
