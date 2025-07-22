import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BrainCircuit, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full space-y-6"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 bg-transparent"
        >
          <Button 
            variant="outline" 
            onClick={() => {
              setCurrentView('home');
              setForceNewDiagnostic(false);
            }} 
            className="flex items-center gap-2 aurora-glass border-aurora-neon-blue/30 text-aurora-neon-blue hover:bg-aurora-neon-blue/20"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit className="h-8 w-8 text-aurora-neon-blue" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-aurora-text-primary flex items-center gap-2">
                Novo Diagnóstico
                <Sparkles className="h-5 w-5 text-aurora-lime" />
              </h1>
              <p className="text-sm text-aurora-text-muted">
                Vamos descobrir o potencial da sua clínica
              </p>
            </div>
          </div>
        </motion.div>
        <AkinatorMarketingConsultant forceNew={forceNewDiagnostic} />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="home"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full space-y-8"
      >
        {/* Header Section Removed - Now handled by StandardPageHeader */}

        {/* Cards de Ação Principais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ActionCards onStartNewDiagnostic={handleStartNewDiagnostic} />
        </motion.div>

        {/* Seção de Insights Rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <QuickTipsSection />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MarketingConsultantHome;
