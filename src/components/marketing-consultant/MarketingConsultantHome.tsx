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
        className="w-full max-w-4xl mx-auto py-6 space-y-8 px-2 sm:px-4 md:px-0"
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
            className="flex items-center gap-2 hover-scale"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <BrainCircuit className="h-8 w-8 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Novo Diagnóstico
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </h1>
              <p className="text-sm text-muted-foreground">
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
        className="w-full max-w-4xl mx-auto py-6 space-y-8 px-2 sm:px-4 md:px-0"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ConsultantHeader />
        </motion.div>

        {/* Cards de Ação Principais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ActionCards onStartNewDiagnostic={handleStartNewDiagnostic} />
        </motion.div>

        {/* Seção de Insights Rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickTipsSection />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MarketingConsultantHome;
