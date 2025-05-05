
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ValidationResult } from '@/utils/validation/types';
import ScriptFormattedBlock from './ScriptFormattedBlock';
import DisneyStructureIndicator from './DisneyStructureIndicator';
import { Sparkles, FileText, RefreshCw, CheckCircle, Target, HeartHandshake, Pencil } from 'lucide-react';
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
  const [adaptedToneNotes, setAdaptedToneNotes] = useState<Record<string, string>>({});
  const [showComparison, setShowComparison] = useState(true);
  
  const overallScore = validationResult.total || validationResult.nota_geral || 0;
  const toneRecommendation = getToneRangeByScore(overallScore);
  
  // In a real implementation, this would call an API to get AI-adapted text
  const handleGenerateAdaptations = async () => {
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const mockAdaptations: Record<string, string> = {};
      const mockToneNotes: Record<string, string> = {};
      
      validationResult.blocos?.forEach(bloco => {
        if (bloco.nota < 8.5) {
          // Simulate different adaptations for different block types
          if (bloco.tipo.toLowerCase().includes('gancho')) {
            mockAdaptations[bloco.tipo] = "Você luta para encontrar uma depilação que funcione de verdade para sua pele? E se ela ainda pudesse rejuvenescer ao mesmo tempo?";
            mockToneNotes[bloco.tipo] = "Tom ajustado: mais próximo, com dor clara e promessa embutida";
          } else if (bloco.tipo.toLowerCase().includes('conflito')) {
            mockAdaptations[bloco.tipo] = "A maioria dos tratamentos promete resultados... mas poucos entregam segurança real para todos os tons de pele — especialmente os mais escuros.";
            mockToneNotes[bloco.tipo] = "Tom ajustado: direto, com foco na frustração recorrente";
          } else if (bloco.tipo.toLowerCase().includes('virada')) {
            mockAdaptations[bloco.tipo] = "Com o Crystal 3D Plus, você tem uma tecnologia de depilação a laser com três comprimentos de onda que respeitam sua pele e ainda estimulam o colágeno.";
            mockToneNotes[bloco.tipo] = "Tom mantido: técnico, claro e promissor";
          } else if (bloco.tipo.toLowerCase().includes('final') || bloco.tipo.toLowerCase().includes('cta')) {
            mockAdaptations[bloco.tipo] = "Agende sua avaliação gratuita e experimente, ainda este mês, uma nova era da estética sem dor — com o Crystal 3D Plus.";
            mockToneNotes[bloco.tipo] = "Tom ajustado: mais ação e senso de oportunidade";
          } else {
            mockAdaptations[bloco.tipo] = `Texto adaptado com tom ${toneRecommendation.tone} para o bloco "${bloco.tipo}" baseado em: ${bloco.texto?.substring(0, 30)}...`;
            mockToneNotes[bloco.tipo] = `Tom ajustado: mais ${toneRecommendation.tone.split('/')[0].trim().toLowerCase()}`;
          }
        }
      });
      
      setAdaptedContent(mockAdaptations);
      setAdaptedToneNotes(mockToneNotes);
      setIsGenerating(false);
    }, 1500);
  };

  // Helper to get the icon for each block type
  const getBlockIcon = (blockType: string) => {
    const type = blockType.toLowerCase();
    if (type.includes('gancho')) return '💡';
    if (type.includes('conflito')) return '❤️';
    if (type.includes('virada')) return '🟩';
    if (type.includes('final') || type.includes('cta')) return '🎯';
    return '✨';
  };

  // Generate improvement suggestions based on scores
  const getImprovementSuggestions = () => {
    const suggestions = [];
    
    const hookBlock = validationResult.blocos?.find(b => 
      b.tipo.toLowerCase().includes('gancho')
    );
    
    if (hookBlock && hookBlock.nota < 8) {
      suggestions.push('**Gancho:** use uma estatística real ou frase mais emocional ("Você merece se sentir confiante na própria pele").');
    }
    
    const conflictBlock = validationResult.blocos?.find(b => 
      b.tipo.toLowerCase().includes('conflito')
    );
    
    if (conflictBlock && conflictBlock.nota < 8) {
      suggestions.push('**Conflito:** traga uma frase de alguém real ("Já tentei de tudo e nada funcionava para meu tom de pele").');
    }
    
    const transformationBlock = validationResult.blocos?.find(b => 
      b.tipo.toLowerCase().includes('virada')
    );
    
    if (transformationBlock && transformationBlock.nota < 8.5) {
      suggestions.push('**Virada:** adicione "aprovado por dermatologistas" ou mencione dados científicos simples.');
    }
    
    const ctaBlock = validationResult.blocos?.find(b => 
      b.tipo.toLowerCase().includes('final') || b.tipo.toLowerCase().includes('cta')
    );
    
    if (ctaBlock && ctaBlock.nota < 8) {
      suggestions.push('**CTA:** traga benefício extra (ex: "garanta sua sessão com bônus") ou urgência ("vagas limitadas para maio").');
    }
    
    // Add general suggestions if we don't have enough
    if (suggestions.length < 2) {
      suggestions.push("Adicione mais elementos de identificação emocional nos primeiros blocos do roteiro.");
    }
    
    if (suggestions.length < 3) {
      suggestions.push("Considere incluir uma breve menção a um caso de sucesso ou experiência de cliente.");
    }
    
    return suggestions;
  };

  // Get metadata for script display
  const getScriptMetadata = () => {
    return {
      type: "Vídeo",
      objective: "Criar Conexão",
      tone: "Empático e confiável",
      platform: "Reels e redes sociais"
    };
  };

  const metadata = getScriptMetadata();
  const hasDisneyStructure = validationResult.blocos?.some(b => 
    b.tipo.toLowerCase().includes('gancho') || 
    b.tipo.toLowerCase().includes('conflito') || 
    b.tipo.toLowerCase().includes('virada') || 
    b.tipo.toLowerCase().includes('final')
  ) || false;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Adaptação de Tom
          <Badge variant="outline" className="ml-2">IA</Badge>
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Switch
              id="comparison-toggle"
              checked={showComparison}
              onCheckedChange={setShowComparison}
              className="scale-75"
            />
            <Label htmlFor="comparison-toggle" className="text-xs">
              Comparar
            </Label>
          </div>
          
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
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-medium">Tom recomendado:</h3>
              <p className="text-xl font-bold">{toneRecommendation.tone}</p>
              <p className="mt-1 text-sm">{toneRecommendation.action}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                <FileText className="h-3.5 w-3.5" />
                <span>{metadata.type}</span>
              </div>
              
              <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md">
                <Target className="h-3.5 w-3.5" />
                <span>{metadata.objective}</span>
              </div>
              
              <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                <HeartHandshake className="h-3.5 w-3.5" />
                <span>{metadata.tone}</span>
              </div>
              
              <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-md">
                <Pencil className="h-3.5 w-3.5" />
                <span>{metadata.platform}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-right">
            <span className="text-sm text-muted-foreground">Pontuação total</span>
            <p className="text-2xl font-bold">{overallScore.toFixed(1)}/10</p>
          </div>
        </div>
        
        {hasDisneyStructure && (
          <DisneyStructureIndicator hasDisneyStructure={true} />
        )}
        
        <div className="space-y-4">
          {validationResult.blocos?.map((bloco, index) => (
            <ScriptFormattedBlock
              key={`${bloco.tipo}-${index}`}
              blockType={`${getBlockIcon(bloco.tipo)} ${bloco.tipo}`}
              score={bloco.nota}
              originalText={bloco.texto || ''}
              adaptedText={adaptedContent[bloco.tipo]}
              toneNote={adaptedToneNotes[bloco.tipo]}
              showAdapted={!!adaptedContent[bloco.tipo]}
              showComparison={showComparison && !!adaptedContent[bloco.tipo]}
            />
          ))}
        </div>
        
        {Object.keys(adaptedContent).length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Sugestões da IA
            </h3>
            
            <ul className="space-y-3">
              {getImprovementSuggestions().map((suggestion, index) => (
                <li key={index} className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div 
                    className="text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: suggestion.replace(
                        /\*\*(.*?)\*\*/g, 
                        '<span class="font-medium">$1</span>'
                      ) 
                    }}
                  />
                </li>
              ))}
            </ul>
            
            <div className="mt-4 pt-3 border-t border-dashed flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Melhorias aplicadas: {Object.keys(adaptedContent).length}/{validationResult.blocos?.length || 0} blocos
              </span>
              
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                Ajustes feitos
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScriptToneAdapter;
