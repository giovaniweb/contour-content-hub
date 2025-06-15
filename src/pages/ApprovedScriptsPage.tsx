
import React from 'react';
import ApprovedScriptsManager from '@/components/approved-scripts/ApprovedScriptsManager';
import { Check } from "lucide-react";

const ApprovedScriptsPage: React.FC = () => {
  return (
    // Fundo gradiente claro (como nos dashboards consultor)
    <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-zinc-100">
      <div className="max-w-7xl mx-auto px-3 py-6 space-y-8">
        {/* Cabeçalho destacado */}
        <div className="flex flex-col items-center text-center pt-6 pb-2">
          <div className="mb-3 flex items-center justify-center aurora-glass p-3 rounded-full shadow-lg">
            <Check className="h-10 w-10 text-aurora-emerald" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold aurora-heading text-aurora-electric-purple mb-2">
            📚 Biblioteca de Roteiros Aprovados
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Gerencie seus roteiros aprovados, avalie performance e envie para o planejador de conteúdo.
          </p>
        </div>
        {/* Manager de roteiros: mostra stats, filtros, lista */}
        <ApprovedScriptsManager />
      </div>
    </div>
  );
};

export default ApprovedScriptsPage;
