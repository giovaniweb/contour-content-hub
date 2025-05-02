
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { validateScript, getValidation } from '@/utils/ai-validation';
import { ScriptResponse } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, Loader2, Sparkles } from 'lucide-react';

interface ScriptValidationProps {
  script: ScriptResponse;
}

const ScriptValidation: React.FC<ScriptValidationProps> = ({ script }) => {
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
      const existingValidation = await getValidation(script.id);
      if (existingValidation) {
        setValidation(existingValidation);
      }
    };
    
    checkExistingValidation();
  }, [script.id]);

  const handleValidate = async () => {
    try {
      setIsLoading(true);
      const result = await validateScript(script);
      setValidation(result);
      toast({
        title: "Roteiro validado",
        description: "A análise do roteiro foi concluída",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível validar o roteiro",
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

  return (
    <Card className="mb-6">
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
                { label: "Gancho Inicial", score: validation.gancho },
                { label: "Clareza da Mensagem", score: validation.clareza },
                { label: "Eficácia do CTA", score: validation.cta },
                { label: "Conexão Emocional", score: validation.emocao },
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.score.toFixed(1)}/10</span>
                  </div>
                  <Progress value={item.score * 10} className={getScoreColor(item.score)} />
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium">Pontuação Total</span>
                <div className="flex items-center">
                  <span className="text-xl font-bold">{validation.total.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground ml-1">/10</span>
                </div>
              </div>
              <Progress value={validation.total * 10} className={getScoreColor(validation.total)} />
              <p className="text-right text-sm mt-1">{getScoreText(validation.total)}</p>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-md mt-4">
              <h4 className="font-medium mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Sugestões de melhoria
              </h4>
              <p className="text-sm whitespace-pre-line">{validation.sugestoes}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p>Analisando seu roteiro com IA...</p>
              </div>
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Roteiro ainda não validado</h3>
                <p className="text-muted-foreground mb-4">
                  Descubra se seu roteiro está pronto para o público ou precisa de ajustes
                </p>
                <Button onClick={handleValidate}>
                  <Sparkles className="mr-2 h-4 w-4" />
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
