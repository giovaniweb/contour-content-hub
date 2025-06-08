
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from "lucide-react";

interface MarketingResultProps {
  onRestart: () => void;
  onContinue: () => void;
}

const MarketingResult: React.FC<MarketingResultProps> = ({
  onRestart,
  onContinue
}) => {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        <Card className="aurora-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold aurora-heading">
              ✨ Diagnóstico Concluído!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg aurora-body">
              Seu diagnóstico de marketing foi processado com sucesso. 
              Agora você pode visualizar o relatório completo no dashboard.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={onContinue} className="aurora-button">
                <ArrowRight className="h-4 w-4 mr-2" />
                Ver Dashboard
              </Button>
              
              <Button 
                onClick={onRestart} 
                variant="outline"
                className="aurora-glass border-aurora-electric-purple/30"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Novo Diagnóstico
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MarketingResult;
