
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScriptResponse } from "@/utils/api";
import { validateScript } from "@/utils/validation/api";
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getIndicatorColor, getIndicatorEmoji } from "@/utils/validation/indicators";
import { ValidationResult } from "@/utils/validation/types";

interface ScriptValidationProps {
  script: ScriptResponse;
  onValidationComplete?: (validation: ValidationResult) => void;
  onValidationError?: (error: string) => void;
  hideTitle?: boolean;
}

const ScriptValidation: React.FC<ScriptValidationProps> = ({ 
  script, 
  onValidationComplete,
  onValidationError,
  hideTitle = false 
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationAttempts, setValidationAttempts] = useState(0);

  // Automaticamente iniciar validação se script for fornecido
  useEffect(() => {
    if (script?.content && !result && !isValidating && validationAttempts === 0) {
      handleValidateScript();
    }
  }, [script]);

  const handleValidateScript = async () => {
    try {
      setIsValidating(true);
      setError(null);
      setValidationAttempts(prev => prev + 1);
      
      const validationResult = await validateScript(script);
      
      if (!validationResult) {
        throw new Error("Resposta de validação vazia");
      }
      
      setResult(validationResult);
      
      if (onValidationComplete) {
        onValidationComplete(validationResult);
      }
    } catch (err) {
      console.error("Error validating script:", err);
      const errorMessage = err instanceof Error ? err.message : "Não foi possível validar o roteiro. Tente novamente mais tarde.";
      setError(errorMessage);
      
      if (onValidationError) {
        onValidationError(errorMessage);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const ScoreIndicator = ({ score, label }: { score: number, label: string }) => {
    const color = getIndicatorColor(score);
    const emoji = getIndicatorEmoji(score);
    
    return (
      <div className="flex flex-col items-center">
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${color}`}
        >
          {emoji}
        </div>
        <div className="mt-2 text-sm text-center font-medium">{label}</div>
        <div className="text-xs text-center text-gray-500">{score}/10</div>
      </div>
    );
  };

  if (isValidating) {
    return (
      <Card>
        {!hideTitle && (
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Validando Roteiro
              <Badge variant="outline" className="ml-2">IA</Badge>
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-4 text-sm text-gray-600">Analisando o conteúdo do roteiro...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        {!hideTitle && (
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              Erro na Validação
              <Badge variant="outline" className="ml-2">IA</Badge>
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <XCircle className="h-8 w-8 text-red-500" />
            <p className="mt-4 text-sm text-gray-600">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleValidateScript}
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  // Extract scores
  const hookScore = result.gancho || 0;
  const clarityScore = result.clareza || 0;
  const ctaScore = result.cta || 0;
  const emotionalScore = result.emocao || 0;
  const overallScore = result.total || result.nota_geral || 0;

  return (
    <Card className="overflow-hidden">
      {!hideTitle && (
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            Validação do Roteiro
            <Badge variant="outline" className="ml-2">IA</Badge>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-sm text-gray-500 mb-1">Pontuação Total</span>
            <div className={`text-3xl font-bold ${getIndicatorColor(overallScore)}`}>
              {overallScore}/10
            </div>
          </div>

          {/* Individual Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreIndicator score={hookScore} label="Abertura" />
            <ScoreIndicator score={clarityScore} label="Clareza" />
            <ScoreIndicator score={ctaScore} label="Call to Action" />
            <ScoreIndicator score={emotionalScore} label="Conexão" />
          </div>

          {/* Analysis and Recommendations */}
          {result.sugestoes && (
            <div>
              <h3 className="font-medium mb-2">Análise</h3>
              <p className="text-sm text-gray-700">{result.sugestoes}</p>
            </div>
          )}

          {result.sugestoes_gerais && result.sugestoes_gerais.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Sugestões de Melhorias</h3>
              <ul className="space-y-2">
                {result.sugestoes_gerais.map((improvement, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mostrar blocos de validação como avisos */}
          {result.blocos && result.blocos.filter(b => b.nota < 6).length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Pontos de Atenção</h3>
              <ul className="space-y-2">
                {result.blocos
                  .filter(b => b.nota < 6)
                  .map((bloco, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 mt-0.5 text-amber-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{bloco.tipo}: </span>
                        <span>{bloco.sugestao || `Melhore esta seção (nota: ${bloco.nota}/10)`}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptValidation;
