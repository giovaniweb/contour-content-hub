
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { validateScript, getValidation } from '@/utils/ai-validation';
import { ScriptResponse } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    return "destructive";
  };

  return (
    <Card className="mb-6 border-t-4 border-t-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
          Validação Inteligente do Roteiro
        </CardTitle>
        <CardDescription>
          Análise automática da qualidade do seu roteiro por IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        {validation ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Gancho Inicial", score: validation.gancho, icon: "💫" },
                { label: "Clareza da Mensagem", score: validation.clareza, icon: "🔍" },
                { label: "Eficácia do CTA", score: validation.cta, icon: "👆" },
                { label: "Conexão Emocional", score: validation.emocao, icon: "❤️" },
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <span className="mr-1">{item.icon}</span> 
                      {item.label}
                    </span>
                    <Badge variant={getScoreBadge(item.score) as any}>
                      {item.score.toFixed(1)}/10
                    </Badge>
                  </div>
                  <Progress value={item.score * 10} className={getScoreColor(item.score)} />
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium">Pontuação Total</span>
                <div className="flex items-center">
                  <Badge variant={getScoreBadge(validation.total) as any} className="text-xl py-1 px-3">
                    {validation.total.toFixed(1)}/10
                  </Badge>
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
              Analisar novamente
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <p className="text-muted-foreground">Analisando seu roteiro com IA...</p>
                <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos</p>
              </div>
            ) : (
              <>
                <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-3">Roteiro ainda não validado</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Nossa IA avaliará seu roteiro com base em critérios importantes como gancho inicial, 
                  clareza da mensagem, chamada para ação e conexão emocional.
                </p>
                <Button onClick={handleValidate} size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Validar com IA
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScriptValidation;
