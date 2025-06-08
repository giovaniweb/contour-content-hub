import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { 
  CheckCircle2,
  Copy,
  Share2,
  Download,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Brain,
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MarketingConsultantState } from './types';
import { Equipment } from '@/types/equipment';
import { supabase } from '@/integrations/supabase/client';

interface MarketingResultProps {
  consultantData: MarketingConsultantState;
  equipments: Equipment[];
}

const MarketingResult: React.FC<MarketingResultProps> = ({ consultantData, equipments }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const generationPhases = [
    {
      icon: Brain,
      title: "Analisando perfil da clínica...",
      subtitle: "🔍 Decodificando seus dados estratégicos",
      motivational: "💡 Cada resposta sua revela oportunidades únicas!"
    },
    {
      icon: Target,
      title: "Identificando oportunidades de crescimento...",
      subtitle: "🎯 Mapeando potencial de mercado",
      motivational: "🚀 Sua clínica tem mais potencial do que imagina!"
    },
    {
      icon: Lightbulb,
      title: "Criando estratégias personalizadas...",
      subtitle: "💡 Desenvolvendo táticas exclusivas",
      motivational: "✨ Estratégias sob medida sendo criadas para você!"
    },
    {
      icon: Sparkles,
      title: "Aplicando inteligência do Consultor Fluida...",
      subtitle: "🧠 Otimizando com expertise especializada",
      motivational: "🔥 O melhor da consultoria está sendo aplicado!"
    },
    {
      icon: TrendingUp,
      title: "Finalizando seu plano de crescimento...",
      subtitle: "📈 Últimos ajustes estratégicos",
      motivational: "🎉 Seu diagnóstico exclusivo está quase pronto!"
    }
  ];

  useEffect(() => {
    generateDiagnostic();
  }, []);

  const generateDiagnostic = async () => {
    setIsGenerating(true);
    setHasError(false);
    setProgress(0);
    setCurrentPhase(0);
    
    // Simulate progress phases
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        // Update phase based on progress
        if (newProgress > 80 && currentPhase < 4) setCurrentPhase(4);
        else if (newProgress > 60 && currentPhase < 3) setCurrentPhase(3);
        else if (newProgress > 40 && currentPhase < 2) setCurrentPhase(2);
        else if (newProgress > 20 && currentPhase < 1) setCurrentPhase(1);
        
        return Math.min(newProgress, 95);
      });
    }, 800);

    try {
      console.log('Generating diagnostic with data:', consultantData);
      
      const { data, error } = await supabase.functions.invoke('generate-marketing-diagnostic', {
        body: {
          ...consultantData,
          equipments: equipments
        }
      });

      console.log('Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      if (data && data.success && data.diagnostic) {
        // Complete progress
        clearInterval(progressInterval);
        setProgress(100);
        setCurrentPhase(4);
        
        // Small delay before showing result
        setTimeout(() => {
          setDiagnosticResult(data.diagnostic);
          setIsGenerating(false);
        }, 1000);
      } else {
        console.error('Invalid response format:', data);
        throw new Error(data?.error || 'Erro desconhecido na geração do diagnóstico');
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error generating diagnostic:', error);
      setHasError(true);
      
      // Fallback diagnostic
      const fallbackDiagnostic = generateFallbackDiagnostic();
      setDiagnosticResult(fallbackDiagnostic);
      setIsGenerating(false);
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar diagnóstico personalizado",
        description: "Usando diagnóstico padrão. Verifique sua conexão e tente novamente.",
      });
    }
  };

  const generateFallbackDiagnostic = () => {
    const clinicType = consultantData.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética';
    const specialty = consultantData.medicalSpecialty || consultantData.aestheticFocus || 'especialização selecionada';
    const service = consultantData.mainService || 'seus serviços principais';
    const revenue = formatRevenue(consultantData.currentRevenue);
    const goal = formatGoal(consultantData.revenueGoal);
    
    return `# 🎯 **DIAGNÓSTICO ESTRATÉGICO - ${clinicType}**

Baseado nas suas respostas, identificamos oportunidades específicas para sua clínica de ${specialty} crescer de forma estratégica e sustentável.

## 📊 **Análise do Perfil**
Sua clínica tem potencial para crescimento através de uma comunicação mais direcionada, especialmente destacando os benefícios de ${service}.

**Situação Atual:** ${revenue}  
**Meta:** ${goal}

## 💡 **Ações Táticas Prioritárias**

1. **Criar conteúdo educativo** sobre ${service} focando nos resultados reais
2. **Desenvolver storytelling** com casos de sucesso de pacientes  
3. **Implementar estratégia de engajamento** nas redes sociais
4. **Otimizar processo de conversão** de leads em consultas
5. **Estabelecer autoridade técnica** através de conteúdo especializado

## 📅 **Cronograma de Implementação**

**Semana 1-2:** Estruturação de conteúdo e linha editorial  
**Semana 3-4:** Execução das primeiras ações e testes  
**Mês 2:** Otimização baseada nos resultados iniciais

## 🎨 **Estratégia de Conteúdo**

Foque em mostrar transformações reais, educar sobre procedimentos e criar conexão emocional com seu público através de comunicação humanizada e próxima.

**Próximo passo:** Implemente as 3 primeiras ações táticas na próxima semana e monitore os resultados.`;
  };

  const formatRevenue = (revenue?: string) => {
    const revenueMap: Record<string, string> = {
      'ate_15k': 'Até R$ 15.000',
      '15k_30k': 'R$ 15.000 - R$ 30.000', 
      '30k_60k': 'R$ 30.000 - R$ 60.000',
      'acima_60k': 'Acima de R$ 60.000'
    };
    return revenueMap[revenue || ''] || 'Não informado';
  };

  const formatGoal = (goal?: string) => {
    const goalMap: Record<string, string> = {
      'dobrar': 'Dobrar o faturamento',
      'crescer_50': 'Crescer 50%',
      'crescer_30': 'Crescer 30%',
      'manter_estavel': 'Manter estabilidade'
    };
    return goalMap[goal || ''] || 'Não informado';
  };

  const handleCopyDiagnostic = () => {
    navigator.clipboard.writeText(diagnosticResult);
    toast({
      title: "✅ Copiado!",
      description: "Diagnóstico copiado para área de transferência",
    });
  };

  const handleShare = () => {
    toast({
      title: "🔗 Compartilhamento",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "📄 Download PDF",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleRetryGeneration = () => {
    generateDiagnostic();
  };

  if (isGenerating) {
    const currentPhaseData = generationPhases[currentPhase];
    const CurrentIcon = currentPhaseData.icon;

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Animated Icon */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-lg"
              >
                <CurrentIcon className="h-10 w-10 text-white" />
              </motion.div>

              {/* Current Phase */}
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h3 className="text-xl font-bold text-foreground">
                  {currentPhaseData.title}
                </h3>
                <p className="text-muted-foreground">
                  {currentPhaseData.subtitle}
                </p>
              </motion.div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <Progress value={progress} className="h-3 bg-secondary" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {Math.round(progress)}% concluído
                  </span>
                  <motion.span 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-primary font-medium"
                  >
                    Fase {currentPhase + 1} de {generationPhases.length}
                  </motion.span>
                </div>
              </div>

              {/* Motivational Message */}
              <motion.div
                key={`motivational-${currentPhase}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20"
              >
                <p className="text-primary font-medium animate-pulse">
                  {currentPhaseData.motivational}
                </p>
              </motion.div>

              {/* Phase Indicators */}
              <div className="flex justify-center space-x-2 pt-4">
                {generationPhases.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index <= currentPhase 
                        ? 'bg-primary shadow-md' 
                        : 'bg-muted'
                    }`}
                    animate={index === currentPhase ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ))}
              </div>

              {/* Footer Message */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  🤖 Consultor Fluida trabalhando para criar seu plano estratégico exclusivo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatMarkdownToHTML = (markdown: string) => {
    return markdown
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-foreground mt-6 mb-4 border-b pb-2">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-6 mb-3 border-b pb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-foreground mt-4 mb-2">$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/^\d+\.\s*\*\*([^*]+)\*\*/gm, '<div class="bg-primary/10 p-3 rounded-lg mb-2 border-l-4 border-primary"><strong class="text-primary">$1</strong></div>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-muted-foreground list-disc">$1</li>')
      .replace(/^\*\s*([^\n]+)/gm, '<li class="ml-4 text-muted-foreground list-disc">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-3 text-muted-foreground">')
      .replace(/^(.+)$/gm, '<p class="mb-3 text-muted-foreground">$1</p>');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              {hasError ? (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
              <CardTitle className="text-lg">
                {hasError ? 'Diagnóstico Padrão' : 'Seu Diagnóstico Estratégico'}
              </CardTitle>
              {hasError && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Modo Offline
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              {hasError && (
                <Button onClick={handleRetryGeneration} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              )}
              <Button onClick={handleCopyDiagnostic} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              <Button onClick={handleDownloadPDF} size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Diagnostic Content */}
      <Card>
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none">
            <div 
              className="whitespace-pre-wrap leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ 
                __html: formatMarkdownToHTML(diagnosticResult)
              }}
            />
          </div>
        </CardContent>
      </Card>

      {hasError && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Diagnóstico Padrão Ativo</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Não foi possível gerar um diagnóstico personalizado com IA. O sistema está usando um modelo padrão baseado nas suas respostas. 
                  Clique em "Tentar Novamente" quando sua conexão estiver estável.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default MarketingResult;
