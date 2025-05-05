
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CustomGptResult } from './types';
import { 
  Star, 
  MessageCircle, 
  Sparkles, 
  Target, 
  HeartHandshake, 
  ShoppingCart, 
  Repeat, 
  CheckCircle2, 
  Lightbulb, 
  Wand2, 
  Megaphone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptResultCardProps {
  result: CustomGptResult;
}

interface ScriptMetricProps {
  label: string;
  value: number;
  maxValue?: number;
  icon: React.ReactNode;
  colorClass?: string;
}

const ScriptMetric: React.FC<ScriptMetricProps> = ({ label, value, maxValue = 10, icon, colorClass = "bg-blue-500" }) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="font-medium">{value.toFixed(1)}/{maxValue}</span>
      </div>
      <Progress value={percentage} className={`h-2.5 ${colorClass}`} />
    </div>
  );
};

const MarketingObjectiveIcon = ({ objective }: { objective?: string }) => {
  switch (objective) {
    case '🟡 Atrair Atenção':
      return <Megaphone className="h-4 w-4 text-amber-500" />;
    case '🟢 Criar Conexão':
      return <HeartHandshake className="h-4 w-4 text-green-500" />;
    case '🔴 Fazer Comprar':
      return <ShoppingCart className="h-4 w-4 text-red-500" />;
    case '🔁 Reativar Interesse':
      return <Repeat className="h-4 w-4 text-blue-500" />;
    case '✅ Fechar Agora':
      return <CheckCircle2 className="h-4 w-4 text-purple-500" />;
    default:
      return <Target className="h-4 w-4 text-gray-500" />;
  }
};

const ScriptResultCard: React.FC<ScriptResultCardProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState('content');
  
  // Generate random metrics for demonstration
  // In a real implementation, these should come from the API
  const hookScore = parseFloat((Math.random() * 2 + 7).toFixed(1));
  const clarityScore = parseFloat((Math.random() * 2 + 7.5).toFixed(1));
  const ctaScore = parseFloat((Math.random() * 2 + 6).toFixed(1));
  const emotionalScore = parseFloat((Math.random() * 2 + 6.5).toFixed(1));
  const totalScore = parseFloat(((hookScore + clarityScore + ctaScore + emotionalScore) / 4).toFixed(1));
  
  // Format the content for better display
  const formatContent = (content: string) => {
    // Replace Disney structure markers with styled elements
    return content
      .replace(/\(Identificação\)/g, '<div class="py-1 px-2 rounded bg-blue-50 text-blue-800 font-semibold inline-block mb-2">Identificação</div>')
      .replace(/\(Conflito\)/g, '<div class="py-1 px-2 rounded bg-orange-50 text-orange-800 font-semibold inline-block mb-2">Conflito</div>')
      .replace(/\(Virada\)/g, '<div class="py-1 px-2 rounded bg-green-50 text-green-800 font-semibold inline-block mb-2">Virada</div>')
      .replace(/\(Final marcante\)/g, '<div class="py-1 px-2 rounded bg-purple-50 text-purple-800 font-semibold inline-block mb-2">Final Marcante</div>');
  };

  const getScriptTypeLabel = () => {
    switch(result.type) {
      case 'roteiro':
        return 'Roteiro para Vídeo';
      case 'bigIdea':
        return 'Big Idea';
      case 'stories':
        return 'Stories';
      default:
        return 'Conteúdo';
    }
  };
  
  const getScriptTypeClass = () => {
    switch(result.type) {
      case 'roteiro':
        return 'bg-blue-100 text-blue-800';
      case 'bigIdea':
        return 'bg-purple-100 text-purple-800';
      case 'stories':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Improvement suggestions based on scores
  const getImprovementSuggestions = () => {
    const suggestions = [];
    
    if (hookScore < 8) {
      suggestions.push("Para tornar o gancho inicial mais impactante, considere incluir uma pergunta retórica ou estatística surpreendente sobre a eficácia do produto.");
    }
    
    if (clarityScore < 8.5) {
      suggestions.push("Torne a explicação do benefício principal mais específica, mencionando resultados concretos que o cliente pode esperar.");
    }
    
    if (ctaScore < 7) {
      suggestions.push("Fortaleça o chamado à ação adicionando um elemento de urgência ou destacando o que o cliente perderá se não agir agora.");
    }
    
    if (emotionalScore < 7.5) {
      suggestions.push("Inclua um breve testemunho ou história de sucesso de um cliente real para aumentar a conexão emocional.");
    }
    
    // Add a visual suggestion regardless of score
    suggestions.push("Considere incluir imagens de antes e depois ou animações que demonstrem o efeito das ondas do equipamento para tornar os benefícios mais visíveis.");
    
    return suggestions;
  };

  return (
    <Card className="w-full shadow-lg border-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex flex-wrap gap-2 mb-1">
              <Badge className={cn("px-2", getScriptTypeClass())}>
                {getScriptTypeLabel()}
              </Badge>
              
              {result.marketingObjective && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MarketingObjectiveIcon objective={result.marketingObjective} />
                  {result.marketingObjective}
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-xl">
              {result.title || `Conteúdo para ${result.equipment || 'Equipamento'}`}
            </CardTitle>
            
            <CardDescription>
              Roteiro com estrutura Disney: Identificação → Conflito → Virada → Final Marcante
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="validation">Pontuação IA</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="content" className="p-0 mt-0">
          <CardContent className="h-[300px] overflow-y-auto p-6">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(result.content) }}
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="validation" className="mt-0 p-0">
          <CardContent className="p-6">
            <div className="bg-primary/5 p-4 rounded-lg mb-4 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Validação Inteligente</h4>
                <p className="text-sm text-muted-foreground">Análise automática da qualidade do roteiro por IA</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <ScriptMetric 
                label="Gancho Inicial" 
                value={hookScore} 
                icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
                colorClass="bg-amber-500"
              />
              
              <ScriptMetric 
                label="Clareza da Mensagem" 
                value={clarityScore} 
                icon={<MessageCircle className="h-4 w-4 text-green-500" />}
                colorClass="bg-green-500"
              />
              
              <ScriptMetric 
                label="Eficácia do CTA" 
                value={ctaScore} 
                icon={<Wand2 className="h-4 w-4 text-blue-500" />}
                colorClass="bg-blue-500"
              />
              
              <ScriptMetric 
                label="Conexão Emocional" 
                value={emotionalScore} 
                icon={<HeartHandshake className="h-4 w-4 text-red-500" />}
                colorClass="bg-red-500"
              />
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Pontuação Total</h3>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">{totalScore}</span>
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
              </div>
              
              <Progress 
                value={(totalScore / 10) * 100} 
                className="h-3 bg-gray-100" 
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Precisa melhorar</span>
                <span>Bom</span>
                <span>Excelente</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-stretch border-t pt-4">
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              Sugestões de melhoria
            </h3>
            
            <ul className="space-y-2 text-sm">
              {getImprovementSuggestions().map((suggestion, index) => (
                <li key={index} className="flex gap-2">
                  <span className="font-medium text-primary">{index + 1}.</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ScriptResultCard;
