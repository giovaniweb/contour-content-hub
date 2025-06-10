
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BrainCircuit, ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';
import AkinatorMarketingConsultant from "@/components/akinator-marketing-consultant/AkinatorMarketingConsultant";
import ConsultantHeader from "./components/ConsultantHeader";
import ActionCards from "./components/ActionCards";
import QuickTipsSection from "./components/QuickTipsSection";

type ViewMode = 'home' | 'new-diagnostic';

const MarketingConsultantHome: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [forceNewDiagnostic, setForceNewDiagnostic] = useState(false);

  const handleStartNewDiagnostic = () => {
    setForceNewDiagnostic(true);
    setCurrentView('new-diagnostic');
  };

  if (currentView === 'new-diagnostic') {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center gap-3 mb-6 bg-transparent">
          <Button variant="outline" onClick={() => {
            setCurrentView('home');
            setForceNewDiagnostic(false);
          }} className="flex items-center gap-2 text-slate-50">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-slate-50">Novo Diagnóstico</h1>
          </div>
        </div>
        <AkinatorMarketingConsultant forceNew={forceNewDiagnostic} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <ConsultantHeader />

      {/* Cards de Ação Principais */}
      <ActionCards onStartNewDiagnostic={handleStartNewDiagnostic} />

      {/* Seção de Insights Rápidos */}
      <QuickTipsSection />
    </div>
  );
};

export default MarketingConsultantHome;
