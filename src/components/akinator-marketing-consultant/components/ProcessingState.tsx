
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import LoadingMessages from '../dashboard/LoadingMessages';

interface ProcessingStateProps {
  processingError: string | null;
  onContinueWithoutAI: () => void;
}

const ProcessingState: React.FC<ProcessingStateProps> = ({
  processingError,
  onContinueWithoutAI
}) => {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <LoadingMessages isLoading={true} />
      
      {processingError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 max-w-md mx-auto mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-medium text-yellow-600">IA Temporariamente Indisponível</h3>
          </div>
          <p className="text-sm text-yellow-700 mb-4">
            Não foi possível processar seu diagnóstico com IA, mas você pode continuar e ver as recomendações básicas baseadas em suas respostas.
          </p>
          <Button 
            onClick={onContinueWithoutAI}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Continuar com Diagnóstico Básico
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ProcessingState;
