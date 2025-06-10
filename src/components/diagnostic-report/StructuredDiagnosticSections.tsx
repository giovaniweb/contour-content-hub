
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BrainCircuit, 
  RefreshCw,
  WifiOff,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { useAIDiagnostic } from "@/hooks/useAIDiagnostic";
import LoadingMessages from "@/components/akinator-marketing-consultant/dashboard/LoadingMessages";
import { extractDiagnosticSections } from './diagnostic-sections/diagnosticSectionUtils';
import { InsightsSection } from './diagnostic-sections/InsightsSection';
import { MentorEnigmaSection } from './diagnostic-sections/MentorEnigmaSection';
import { BrandEvaluationSection } from './diagnostic-sections/BrandEvaluationSection';
import { StrategicDiagnosticSection } from './diagnostic-sections/StrategicDiagnosticSection';
import { ContentSuggestionsSection } from './diagnostic-sections/ContentSuggestionsSection';
import { ActionPlanSection } from './diagnostic-sections/ActionPlanSection';

interface StructuredDiagnosticSectionsProps {
  diagnostic: string;
  state?: any;
  onDiagnosticUpdate?: (newDiagnostic: string) => void;
}

const StructuredDiagnosticSections: React.FC<StructuredDiagnosticSectionsProps> = ({ 
  diagnostic, 
  state,
  onDiagnosticUpdate 
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { generateDiagnostic, isGenerating } = useAIDiagnostic();

  const handleRetryDiagnostic = async () => {
    if (!state) {
      toast.error("❌ Dados do diagnóstico não disponíveis para regenerar");
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      console.log(`🔄 Tentativa ${retryCount + 1} - Reanalisando com IA Fluida`);
      
      toast.info("🎯 Reanalisando com IA Fluida...", {
        description: `Tentativa ${retryCount + 1} - Pode levar até 60 segundos`,
        id: "retry-diagnostic"
      });
      
      const newDiagnostic = await generateDiagnostic(state);
      
      if (newDiagnostic && newDiagnostic.trim() !== '' && !newDiagnostic.includes('temporariamente indisponível')) {
        onDiagnosticUpdate?.(newDiagnostic);
        toast.success("✅ Diagnóstico reanalisado com sucesso!", {
          description: `Concluído na tentativa ${retryCount + 1}`,
          id: "retry-diagnostic"
        });
        setRetryCount(0);
      } else {
        toast.warning("⚠️ Consultor Fluida ainda indisponível", {
          description: `Tentativa ${retryCount + 1} falhou. Tente novamente em alguns minutos.`,
          id: "retry-diagnostic"
        });
      }
    } catch (error) {
      console.error(`Erro na tentativa ${retryCount + 1}:`, error);
      toast.error("❌ Erro ao reanalisar", {
        description: `Tentativa ${retryCount + 1} falhou.`,
        id: "retry-diagnostic"
      });
    } finally {
      setIsRetrying(false);
    }
  };

  // Show loading messages during generation
  if (!diagnostic || diagnostic === 'Diagnóstico sendo processado...' || isGenerating || isRetrying) {
    return <LoadingMessages isLoading={true} />;
  }

  // Check if it's the temporary/fallback diagnostic
  if (diagnostic.includes('temporariamente indisponível') || diagnostic.includes('Diagnóstico temporariamente indisponível')) {
    return (
      <div className="text-center py-12">
        <Card className="aurora-card border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <WifiOff className="h-16 w-16 text-amber-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              ⚠️ Consultor Fluida Temporariamente Indisponível
            </h3>
            
            <p className="text-white mb-6 leading-relaxed max-w-2xl mx-auto">
              O Consultor Fluida está momentaneamente sobrecarregado ou há problema de conectividade. 
              Suas respostas foram <strong className="text-white">salvas com segurança</strong> e você pode ver as análises básicas nos cards acima.
            </p>

            <div className="space-y-6">
              <div className="pt-4 space-y-4">
                <Button 
                  onClick={handleRetryDiagnostic}
                  disabled={isRetrying || isGenerating || !state}
                  className="aurora-button mr-3"
                  size="lg"
                >
                  {(isRetrying || isGenerating) ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Tentativa {retryCount + 1}... (até 60s)
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      🎯 Reanalisar com IA Fluida
                      {retryCount > 0 && ` (${retryCount} tentativas)`}
                    </>
                  )}
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-sm">
                  <Badge variant="outline" className="border-amber-500/30 text-white bg-amber-500/20">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Dados seguros
                  </Badge>
                  
                  {retryCount > 0 && (
                    <Badge variant="outline" className="border-purple-500/30 text-white bg-purple-500/20">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {retryCount} tentativas
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = extractDiagnosticSections(diagnostic);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-aurora-electric-purple to-aurora-sage rounded-2xl flex items-center justify-center shadow-lg">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-1">
              🎯 Diagnóstico Consultor Fluida
            </h2>
            <p className="text-white">
              Análise estratégica personalizada para sua clínica
            </p>
          </div>
          <Button 
            onClick={handleRetryDiagnostic}
            disabled={isRetrying || isGenerating || !state}
            variant="outline"
            size="sm"
            className="bg-aurora-electric-purple/10 border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20"
          >
            {(isRetrying || isGenerating) ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Reanalisando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reanalisar com IA Fluida
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightsSection content={sections.insights} />
        <MentorEnigmaSection content={sections.enigma} />
        <BrandEvaluationSection content={sections.marca} />
        <StrategicDiagnosticSection content={sections.estrategico} />
        <ContentSuggestionsSection content={sections.conteudo} />
        <ActionPlanSection content={sections.planoAcao} />
      </div>

      {/* Badge de validação */}
      <div className="text-center pt-6">
        <Badge variant="outline" className="border-aurora-electric-purple/30 text-white bg-aurora-electric-purple/20 px-6 py-2">
          <Sparkles className="h-4 w-4 mr-2" />
          Diagnóstico validado pelo Consultor Fluida
        </Badge>
      </div>
    </div>
  );
};

export default StructuredDiagnosticSections;
