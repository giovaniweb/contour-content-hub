import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { validateScript, getValidation } from '@/utils/ai-validation';
import { ScriptResponse } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Loader2, Sparkles, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ScriptValidationProps {
  script: ScriptResponse;
  onValidationComplete?: (validation: any) => void;
}

const ScriptValidation: React.FC<ScriptValidationProps> = ({ script, onValidationComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState<{
    gancho: number;
    clareza: number;
    cta: number;
    emocao: number;
    total: number;
    sugestoes: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkExistingValidation = async () => {
      try {
        setIsLoading(true);
        const existingValidation = await getValidation(script.id);
        if (existingValidation) {
          setValidation(existingValidation);
          if (onValidationComplete) {
            onValidationComplete(existingValidation);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar validação existente:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExistingValidation();
  }, [script.id, onValidationComplete]);

  const handleValidate = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Analisando roteiro",
        description: "Estamos utilizando IA avançada para avaliar seu roteiro. Aguarde um momento...",
      });
      
      const result = await validateScript(script);
      setValidation(result);
      
      if (onValidationComplete) {
        onValidationComplete(result);
      }
      
      toast({
        title: "Roteiro validado",
        description: "A análise do roteiro foi concluída com sucesso",
      });
    } catch (error) {
      console.error("Erro ao validar roteiro:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível validar o roteiro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return "Excelente";
    if (score >= 6) return "Bom";
    if (score >= 4) return "Regular";
    return "Precisa melhorar";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return "success";
    if (score >= 6) return "warning";
    if (score >= 4) return "default";
    return "destructive";
  };

  const renderScoreDetail = (score: number) => {
    const descriptions: Record<string, string> = {
      "success": "Esta pontuação indica excelência neste critério",
      "warning": "Esta pontuação é boa, mas há espaço para melhorias",
      "default": "Esta pontuação indica que este critério precisa de atenção",
      "destructive": "Esta pontuação indica que este critério precisa ser significativamente melhorado"
    };
    
    const badgeType = getScoreBadge(score);
    
    return descriptions[badgeType];
  };

  return (
    <TooltipProvider>
      <Card className="mb-6 border-t-4 border-t-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
            Validação Inteligente do Roteiro
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full p-0 ml-2">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Mais informações</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>
                  Este sistema utiliza GPT-4o para analisar seu roteiro com base em critérios de marketing digital.
                  As pontuações variam de 0 a 10 em cada categoria.
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <CardDescription>
            Análise automática da qualidade do seu roteiro por IA avançada
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validation ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Gancho Inicial", score: validation.gancho, icon: "💫", description: "Avalia quão bem o início do roteiro captura atenção" },
                  { label: "Clareza da Mensagem", score: validation.clareza, icon: "🔍", description: "Mede quão clara e objetiva é a mensagem central" },
                  { label: "Eficácia do CTA", score: validation.cta, icon: "👆", description: "Avalia o poder de persuasão da chamada à ação" },
                  { label: "Conexão Emocional", score: validation.emocao, icon: "❤️", description: "Mede o impacto emocional do conteúdo" },
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center">
                        <span className="mr-1">{item.icon}</span> 
                        {item.label}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant={getScoreBadge(item.score) as any}>
                            {item.score.toFixed(1)}/10
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.description}</p>
                          <p className="text-xs mt-1">{renderScoreDetail(item.score)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Progress value={item.score * 10} className={getScoreColor(item.score)} />
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium">Pontuação Total</span>
                  <div className="flex items-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant={getScoreBadge(validation.total) as any} className="text-xl py-1 px-3">
                          {validation.total.toFixed(1)}/10
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Média ponderada de todas as categorias</p>
                        <p className="text-xs mt-1">{renderScoreDetail(validation.total)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <Progress value={validation.total * 10} className={getScoreColor(validation.total)} />
                <p className="text-right text-sm mt-1 font-medium">{getScoreText(validation.total)}</p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md mt-4 border border-muted">
                <h4 className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Sugestões de melhoria
                </h4>
                <p className="text-sm whitespace-pre-line">{validation.sugestoes}</p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleValidate} 
                disabled={isLoading}
                className="mt-2"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Analisar novamente com IA avançada
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              {isLoading ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  <p className="text-muted-foreground">Analisando seu roteiro com IA avançada...</p>
                  <p className="text-xs text-muted-foreground">Este processo pode levar alguns segundos</p>
                </div>
              ) : (
                <>
                  <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-3">Roteiro ainda não validado</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Nossa IA avançada avaliará seu roteiro com base em critérios importantes como gancho inicial, 
                    clareza da mensagem, chamada para ação e conexão emocional.
                  </p>
                  <Button onClick={handleValidate} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Validar com GPT-4o
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ScriptValidation;
