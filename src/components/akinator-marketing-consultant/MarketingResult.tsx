
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, FileText, Calendar, RotateCcw } from "lucide-react";
import { MarketingConsultantState } from './types';

interface MarketingResultProps {
  state: MarketingConsultantState;
  onGenerateStrategy: () => void;
  onGeneratePlan: () => void;
  onReset: () => void;
}

const MarketingResult: React.FC<MarketingResultProps> = ({
  state,
  onGenerateStrategy,
  onGeneratePlan,
  onReset
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            Diagnóstico Personalizado Concluído
          </CardTitle>
          <Badge variant="outline" className="w-fit mx-auto">
            Consultor Fluida AI
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line text-sm bg-muted/50 p-6 rounded-lg mb-6 max-h-96 overflow-y-auto">
            {state.generatedDiagnostic}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onGenerateStrategy}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              📋 Gerar Estratégia Completa
            </Button>
            
            <Button 
              onClick={onGeneratePlan}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              📅 Criar Plano de Ação
            </Button>
            
            <Button 
              onClick={onReset}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Novo Diagnóstico
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingResult;
