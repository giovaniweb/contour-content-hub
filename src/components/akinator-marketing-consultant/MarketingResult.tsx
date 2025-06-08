
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
  // Função para renderizar o conteúdo com markdown básico
  const renderDiagnosticContent = (content: string) => {
    if (!content) return "Diagnóstico não disponível";

    return content.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-primary">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-5 mb-3 text-purple-700">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-blue-600">{line.replace('### ', '')}</h3>;
      }
      
      // Bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      
      // List items
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={index} className="ml-4 mb-1">{line.replace(/^[•-] /, '')}</li>;
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Regular paragraphs
      return <p key={index} className="mb-2 leading-relaxed">{line}</p>;
    });
  };

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
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg mb-6 max-h-[600px] overflow-y-auto border border-purple-100">
            <div className="prose prose-sm max-w-none text-gray-800">
              {renderDiagnosticContent(state.generatedDiagnostic || '')}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onGenerateStrategy}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              📋 Ver Dashboard Estratégico
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
