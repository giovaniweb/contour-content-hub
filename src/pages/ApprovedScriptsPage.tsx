
import React from 'react';
import ApprovedScriptsManager from '@/components/approved-scripts/ApprovedScriptsManager';
import { Check } from "lucide-react";

const ApprovedScriptsPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full aurora-gradient-bg aurora-dark-bg animate-aurora-flow flex flex-col">
      <main className="flex-1 w-full flex flex-col items-center justify-start py-10 sm:py-16 px-2">
        {/* Container centralizado, idêntico ao /fluidaroteirista */}
        <section className="w-full max-w-3xl mx-auto aurora-card aurora-glass rounded-3xl md:rounded-3xl shadow-2xl p-3 sm:p-7 md:p-10 mt-6 mb-10 transition-all duration-500 animate-fade-in">
          {/* Cabeçalho Aurora */}
          <div className="w-full flex flex-col items-center text-center pb-6 pt-2">
            <div className="mb-4 flex items-center justify-center aurora-glass p-3 rounded-full shadow-lg animate-aurora-pulse">
              <Check className="h-10 w-10 text-aurora-emerald" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold aurora-heading aurora-text-gradient mb-2 drop-shadow-md tracking-tight">
              Biblioteca de Roteiros Aprovados
            </h1>
            <p className="text-aurora-lavender max-w-2xl mx-auto font-light md:text-lg">
              Gerencie seus roteiros aprovados, avalie performance e envie para o planejador de conteúdo.
            </p>
          </div>
          {/* Conteúdo dinâmico */}
          <div className="w-full">
            <ApprovedScriptsManager />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ApprovedScriptsPage;

