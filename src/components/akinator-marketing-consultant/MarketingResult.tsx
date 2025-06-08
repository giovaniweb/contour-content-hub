
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { 
  CheckCircle2,
  Copy,
  Share2,
  Download,
  Sparkles,
  AlertCircle,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MarketingConsultantState } from './types';
import { Equipment } from '@/types/equipment';

interface MarketingResultProps {
  consultantData: MarketingConsultantState;
  equipments: Equipment[];
}

const MarketingResult: React.FC<MarketingResultProps> = ({ consultantData, equipments }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    generateDiagnostic();
  }, []);

  const generateDiagnostic = async () => {
    setIsGenerating(true);
    setHasError(false);
    
    try {
      console.log('Generating diagnostic with data:', consultantData);
      
      const response = await fetch('/api/functions/v1/generate-marketing-diagnostic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...consultantData,
          equipments: equipments
        }),
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!responseText.trim()) {
        console.error('Empty response from API');
        throw new Error('API retornou resposta vazia');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text that failed to parse:', responseText);
        throw new Error('Resposta da API não é um JSON válido');
      }
      
      if (data.success && data.diagnostic) {
        setDiagnosticResult(data.diagnostic);
      } else {
        console.error('API returned error:', data);
        throw new Error(data.error || 'Erro desconhecido na geração do diagnóstico');
      }
    } catch (error) {
      console.error('Error generating diagnostic:', error);
      setHasError(true);
      
      // Fallback diagnostic
      const fallbackDiagnostic = generateFallbackDiagnostic();
      setDiagnosticResult(fallbackDiagnostic);
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar diagnóstico personalizado",
        description: "Usando diagnóstico padrão. Verifique sua conexão e tente novamente.",
      });
    } finally {
      setIsGenerating(false);
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
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <Sparkles className="h-8 w-8 animate-spin text-primary mx-auto" />
              <h3 className="text-lg font-medium">Gerando seu diagnóstico personalizado...</h3>
              <p className="text-muted-foreground">
                Analisando suas respostas para criar estratégias específicas
              </p>
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
