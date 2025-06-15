import React from 'react';
import ApprovedScriptsManager from '@/components/approved-scripts/ApprovedScriptsManager';
import { Check } from "lucide-react";
const ApprovedScriptsPage: React.FC = () => {
  return <div className="min-h-screen w-full aurora-gradient-bg aurora-dark-bg animate-aurora-flow flex flex-col">
      <main className="flex-1 w-full flex flex-col items-center justify-start py-6 sm:py-12 px-2 sm:px-4 md:px-0">
        {/* Header - igual ao /marketing-consultant */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-2 mb-10">
          <div className="flex items-center justify-center aurora-glass p-3 rounded-full shadow-lg animate-aurora-pulse mb-4">
            <Check className="h-10 w-10 text-aurora-emerald" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold aurora-heading aurora-text-gradient drop-shadow-md tracking-tight mb-1 text-slate-50">
            Biblioteca de Roteiros Aprovados
          </h1>
          <p className="text-aurora-lavender max-w-2xl mx-auto font-light md:text-lg">
            Gerencie, avalie desempenho e envie roteiros aprovados para o planejador de conteúdo.
          </p>
        </div>
        {/* Container principal com glass + card, igual ao /marketing-consultant */}
        <section className="w-full max-w-3xl mx-auto aurora-card aurora-glass rounded-3xl shadow-2xl p-3 sm:p-7 md:p-10 transition-all duration-500 animate-fade-in">
          <ApprovedScriptsManager />
        </section>
      </main>
    </div>;
};
export default ApprovedScriptsPage;