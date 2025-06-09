
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BrainCircuit, 
  Lightbulb, 
  Calendar,
  Palette,
  Puzzle,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  WifiOff
} from "lucide-react";
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { useAIDiagnostic } from "@/hooks/useAIDiagnostic";
import LoadingMessages from "./LoadingMessages";

interface StructuredDiagnosticSectionProps {
  diagnostic: string;
  state?: any;
  onDiagnosticUpdate?: (newDiagnostic: string) => void;
}

const StructuredDiagnosticSection: React.FC<StructuredDiagnosticSectionProps> = ({ 
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
      console.log(`🔄 Tentativa ${retryCount + 1} - Regenerando diagnóstico`);
      
      toast.info("🎯 Regenerando diagnóstico com Consultor Fluida...", {
        description: `Tentativa ${retryCount + 1} - Pode levar até 60 segundos`,
        id: "retry-diagnostic"
      });
      
      const newDiagnostic = await generateDiagnostic(state);
      
      if (newDiagnostic && newDiagnostic.trim() !== '' && !newDiagnostic.includes('temporariamente indisponível')) {
        onDiagnosticUpdate?.(newDiagnostic);
        toast.success("✅ Diagnóstico regenerado com sucesso!", {
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
      toast.error("❌ Erro ao regenerar", {
        description: `Tentativa ${retryCount + 1} falhou.`,
        id: "retry-diagnostic"
      });
    } finally {
      setIsRetrying(false);
    }
  };

  // Função para extrair seções do diagnóstico
  const extractSections = (text: string) => {
    const sections = {
      estrategico: '',
      conteudo: '',
      planoAcao: '',
      marca: '',
      enigma: '',
      insights: ''
    };

    // Regex patterns para cada seção obrigatória
    const patterns = {
      estrategico: /📊 Diagnóstico Estratégico.*?(?=💡|$)/s,
      conteudo: /💡 Sugestões de Conteúdo.*?(?=📅|$)/s,
      planoAcao: /📅 Plano de Ação.*?(?=🎨|$)/s,
      marca: /🎨 Avaliação de Marca.*?(?=🧩|$)/s,
      enigma: /🧩 Enigma do Mentor.*?(?=📈|$)/s,
      insights: /📈 Insights Estratégicos.*?$/s
    };

    // Extrair cada seção
    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = text.match(pattern);
      if (match) {
        sections[key as keyof typeof sections] = match[0].trim();
      }
    });

    return sections;
  };

  const renderSection = (title: string, content: string, icon: React.ReactNode, color: string) => {
    if (!content) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className={`aurora-card border-${color}/30`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white font-semibold">
              <div className={`p-2 bg-${color}/20 rounded-lg`}>
                {icon}
              </div>
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              {content.split('\n').map((line, index) => {
                if (line.trim() === '') return <br key={index} />;
                
                // Headers
                if (line.startsWith('##')) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-white mt-6 mb-3">
                      {line.replace('##', '').trim()}
                    </h3>
                  );
                }
                
                // Lista com bullet points
                if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                  return (
                    <div key={index} className="flex items-start gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-aurora-sage mt-1 flex-shrink-0" />
                      <span className="text-white text-sm">
                        {line.replace(/^[•\-*]\s*/, '').trim()}
                      </span>
                    </div>
                  );
                }
                
                // Semanas do plano de ação
                if (line.includes('Semana')) {
                  return (
                    <div key={index} className="bg-aurora-electric-purple/10 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-white mb-2">
                        {line.trim()}
                      </h4>
                    </div>
                  );
                }
                
                // Parágrafo normal
                return (
                  <p key={index} className="text-white mb-3 leading-relaxed">
                    {line.trim()}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Mostrar loading messages durante geração
  if (!diagnostic || diagnostic === 'Diagnóstico sendo processado...' || isGenerating || isRetrying) {
    return <LoadingMessages isLoading={true} />;
  }

  // Verificar se é o diagnóstico temporário/fallback
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
                      🎯 Tentar Regenerar com Consultor Fluida
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

  const sections = extractSections(diagnostic);

  return (
    <div className="space-y-8">
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
        </div>
      </div>

      {renderSection(
        "📊 Diagnóstico Estratégico da Clínica",
        sections.estrategico,
        <BrainCircuit className="h-5 w-5 text-aurora-electric-purple" />,
        "aurora-electric-purple"
      )}

      {renderSection(
        "💡 Sugestões de Conteúdo Personalizado",
        sections.conteudo,
        <Lightbulb className="h-5 w-5 text-aurora-sage" />,
        "aurora-sage"
      )}

      {renderSection(
        "📅 Plano de Ação Semanal",
        sections.planoAcao,
        <Calendar className="h-5 w-5 text-aurora-deep-purple" />,
        "aurora-deep-purple"
      )}

      {renderSection(
        "🎨 Avaliação de Marca e Atendimento",
        sections.marca,
        <Palette className="h-5 w-5 text-pink-400" />,
        "pink-400"
      )}

      {renderSection(
        "🧩 Enigma do Mentor",
        sections.enigma,
        <Puzzle className="h-5 w-5 text-yellow-400" />,
        "yellow-400"
      )}

      {renderSection(
        "📈 Insights Estratégicos Fluida",
        sections.insights,
        <TrendingUp className="h-5 w-5 text-green-400" />,
        "green-400"
      )}

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

export default StructuredDiagnosticSection;
