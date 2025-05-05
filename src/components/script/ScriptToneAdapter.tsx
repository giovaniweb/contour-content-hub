
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ValidationResult } from '@/utils/validation/types';
import ScriptFormattedBlock from './ScriptFormattedBlock';
import { Sparkles, FileText, RefreshCw } from 'lucide-react';
import { getToneRangeByScore } from './utils/toneAdaptationUtils';

interface ScriptToneAdapterProps {
  validationResult: ValidationResult;
  content: string;
}

const ScriptToneAdapter: React.FC<ScriptToneAdapterProps> = ({
  validationResult,
  content
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [adaptedContent, setAdaptedContent] = useState<Record<string, string>>({});
  
  const overallScore = validationResult.total || validationResult.nota_geral || 0;
  const toneRecommendation = getToneRangeByScore(overallScore);
  
  // In a real implementation, this would call an API to get AI-adapted text
  const handleGenerateAdaptations = async () => {
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const mockAdaptations: Record<string, string> = {};
      
      validationResult.blocos?.forEach(bloco => {
        if (bloco.nota < 8.5) {
          mockAdaptations[bloco.tipo] = `Texto adaptado com tom ${toneRecommendation.tone} para o bloco "${bloco.tipo}" baseado em: ${bloco.texto?.substring(0, 30)}...`;
        }
      });
      
      setAdaptedContent(mockAdaptations);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Adaptação de Tom
          <Badge variant="outline" className="ml-2">IA</Badge>
        </CardTitle>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateAdaptations}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Adaptar Tom
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Tom recomendado:</h3>
              <p className="text-xl font-bold">{toneRecommendation.tone}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Pontuação total</span>
              <p className="text-2xl font-bold">{overallScore.toFixed(1)}/10</p>
            </div>
          </div>
          <p className="mt-2 text-sm">{toneRecommendation.action}</p>
        </div>
        
        <div className="space-y-4">
          {validationResult.blocos?.map((bloco, index) => (
            <ScriptFormattedBlock
              key={`${bloco.tipo}-${index}`}
              blockType={bloco.tipo}
              score={bloco.nota}
              originalText={bloco.texto || ''}
              adaptedText={adaptedContent[bloco.tipo]}
              showAdapted={!!adaptedContent[bloco.tipo]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptToneAdapter;
