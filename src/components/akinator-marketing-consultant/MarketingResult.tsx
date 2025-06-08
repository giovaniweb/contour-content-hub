
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from 'framer-motion';
import { 
  Target, 
  Lightbulb, 
  Calendar,
  TrendingUp,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  Sparkles
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

  useEffect(() => {
    generateDiagnostic();
  }, []);

  const generateDiagnostic = async () => {
    setIsGenerating(true);
    
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

      const data = await response.json();
      
      if (data.success) {
        setDiagnosticResult(data.diagnostic);
      } else {
        throw new Error(data.error || 'Erro ao gerar diagnóstico');
      }
    } catch (error) {
      console.error('Error generating diagnostic:', error);
      
      // Fallback diagnostic
      setDiagnosticResult(generateFallbackDiagnostic());
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar diagnóstico",
        description: "Usando diagnóstico padrão. Tente novamente mais tarde.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackDiagnostic = () => {
    const clinicType = consultantData.clinicType === 'clinica_medica' ? 'Clínica Médica' : 'Clínica Estética';
    const equipment = consultantData.aestheticEquipments ? 
      equipments.find(eq => eq.id === consultantData.aestheticEquipments)?.nome || 'equipamento selecionado' 
      : 'seus equipamentos';
    
    return `
## 🎯 **DIAGNÓSTICO ESTRATÉGICO - ${clinicType}**

Baseado nas suas respostas, identificamos oportunidades específicas para sua clínica crescer de forma estratégica e sustentável.

### 📊 **Análise do Perfil**
Sua clínica tem potencial para crescimento através de uma comunicação mais direcionada, especialmente destacando os benefícios do ${equipment}.

### 💡 **Ações Táticas Prioritárias**

1. **Criar conteúdo educativo** sobre ${equipment} focando nos resultados reais
2. **Desenvolver storytelling** com casos de sucesso de pacientes  
3. **Implementar estratégia de engajamento** nas redes sociais
4. **Otimizar processo de conversão** de leads em consultas
5. **Estabelecer autoridade técnica** através de conteúdo especializado

### 📅 **Cronograma de Implementação**

**Semana 1-2:** Estruturação de conteúdo e linha editorial
**Semana 3-4:** Execução das primeiras ações e testes
**Mês 2:** Otimização baseada nos resultados iniciais

### 🎨 **Estratégia de Conteúdo**

Foque em mostrar transformações reais, educar sobre procedimentos e criar conexão emocional com seu público através de comunicação humanizada e próxima.

**Próximo passo:** Implemente as 3 primeiras ações táticas na próxima semana e monitore os resultados.
`;
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

  if (isGenerating) {
    return (
      <Card className="max-w-4xl mx-auto">
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle>Seu Diagnóstico Estratégico</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
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
              className="whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: diagnosticResult
                  .replace(/##\s*([^#\n]+)/g, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3 border-b pb-2">$1</h2>')
                  .replace(/###\s*([^#\n]+)/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>')
                  .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                  .replace(/^\d+\.\s*\*\*([^*]+)\*\*/gm, '<div class="bg-blue-50 p-3 rounded-lg mb-2 border-l-4 border-blue-400"><strong class="text-blue-900">$1</strong></div>')
                  .replace(/^\*\s*([^\n]+)/gm, '<li class="ml-4 text-gray-700">$1</li>')
                  .replace(/\n\n/g, '</p><p class="mb-3">')
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketingResult;
