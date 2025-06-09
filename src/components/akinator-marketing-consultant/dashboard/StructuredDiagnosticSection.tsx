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
  AlertCircle
} from "lucide-react";
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { useAIDiagnostic } from "@/hooks/useAIDiagnostic";

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
  const { generateDiagnostic } = useAIDiagnostic();

  const handleRetryDiagnostic = async () => {
    if (!state) {
      toast.error("Dados do diagnóstico não disponíveis para regenerar");
      return;
    }

    setIsRetrying(true);
    try {
      toast.info("🤖 Tentando regenerar diagnóstico com IA...");
      
      const newDiagnostic = await generateDiagnostic(state);
      
      if (newDiagnostic && newDiagnostic.trim() !== '') {
        onDiagnosticUpdate?.(newDiagnostic);
        toast.success("✅ Diagnóstico regenerado com sucesso!");
      } else {
        toast.error("❌ Não foi possível regenerar o diagnóstico via IA");
      }
    } catch (error) {
      console.error('Erro ao regenerar diagnóstico:', error);
      toast.error("❌ Erro ao tentar regenerar diagnóstico");
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

    // Regex patterns para cada seção
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
            <CardTitle className="flex items-center gap-3 aurora-heading">
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
                    <h3 key={index} className="text-lg font-semibold aurora-heading mt-6 mb-3 text-aurora-electric-purple">
                      {line.replace('##', '').trim()}
                    </h3>
                  );
                }
                
                // Lista com bullet points
                if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                  return (
                    <div key={index} className="flex items-start gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-aurora-sage mt-1 flex-shrink-0" />
                      <span className="aurora-body text-sm">
                        {line.replace(/^[•\-*]\s*/, '').trim()}
                      </span>
                    </div>
                  );
                }
                
                // Semanas do plano de ação
                if (line.includes('Semana')) {
                  return (
                    <div key={index} className="bg-aurora-electric-purple/10 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-aurora-electric-purple mb-2">
                        {line.trim()}
                      </h4>
                    </div>
                  );
                }
                
                // Parágrafo normal
                return (
                  <p key={index} className="aurora-body mb-3 leading-relaxed">
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

  if (!diagnostic || diagnostic === 'Diagnóstico sendo processado...') {
    return (
      <div className="text-center py-12">
        <div className="aurora-glass rounded-xl p-8">
          <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-aurora-electric-purple animate-pulse" />
          <h3 className="text-lg font-medium aurora-heading mb-2">Processando Diagnóstico</h3>
          <p className="text-sm aurora-body opacity-75">
            O Consultor Fluida está analisando suas respostas...
          </p>
        </div>
      </div>
    );
  }

  // Verificar se é o diagnóstico temporário/fallback
  if (diagnostic.includes('temporariamente indisponível') || diagnostic.includes('Diagnóstico temporariamente indisponível')) {
    return (
      <div className="text-center py-12">
        <Card className="aurora-card border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-amber-500" />
            </div>
            
            <h3 className="text-xl font-semibold aurora-heading mb-3 text-amber-400">
              ⚠️ Diagnóstico IA Temporariamente Indisponível
            </h3>
            
            <p className="aurora-body mb-6 opacity-90 leading-relaxed">
              A IA do Consultor Fluida está momentaneamente indisponível. Suas respostas foram <strong>salvas com segurança</strong> e você pode ver as análises básicas nos cards acima.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 aurora-glass rounded-lg">
                  <h4 className="font-medium text-aurora-sage mb-2">✅ O que funciona:</h4>
                  <ul className="text-left space-y-1 opacity-80">
                    <li>• Análise básica do perfil</li>
                    <li>• Cards informativos</li>
                    <li>• Dados salvos</li>
                  </ul>
                </div>
                
                <div className="p-3 aurora-glass rounded-lg">
                  <h4 className="font-medium text-amber-400 mb-2">⏳ Temporariamente off:</h4>
                  <ul className="text-left space-y-1 opacity-80">
                    <li>• Diagnóstico completo da IA</li>
                    <li>• Sugestões personalizadas</li>
                    <li>• Plano de ação detalhado</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleRetryDiagnostic}
                  disabled={isRetrying || !state}
                  className="aurora-button mr-3"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Regenerando...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      Tentar Regenerar IA
                    </>
                  )}
                </Button>
                
                <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Seus dados estão seguros
                </Badge>
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
            <h2 className="text-3xl font-bold aurora-heading mb-1">
              🧠 Diagnóstico Completo
            </h2>
            <p className="aurora-body opacity-80">
              Análise estratégica personalizada do Consultor Fluida
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
        <Badge variant="outline" className="border-aurora-electric-purple/30 text-aurora-electric-purple px-6 py-2">
          <Sparkles className="h-4 w-4 mr-2" />
          Diagnóstico validado pela IA
        </Badge>
      </div>
    </div>
  );
};

export default StructuredDiagnosticSection;
