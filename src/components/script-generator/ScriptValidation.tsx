
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { validateScript, getValidation, mapValidationToAnnotations, ValidationResult } from '@/utils/ai-validation';
import { ScriptResponse, updateScript } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  Sparkles, 
  Info, 
  RefreshCcw, 
  Check, 
  ThumbsUp, 
  Edit 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AnnotatedText, { TextAnnotation } from '@/components/script/AnnotatedText';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScriptValidationProps {
  script: ScriptResponse;
  onValidationComplete?: (validation: any) => void;
}

const ScriptValidation: React.FC<ScriptValidationProps> = ({ script, onValidationComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [improvedScript, setImprovedScript] = useState<string | null>(null);
  const [suggestionsApplied, setSuggestionsApplied] = useState(false);
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([]);
  const { toast } = useToast();

  // Extract annotations from validation feedback
  useEffect(() => {
    if (!validation) return;
    setTextAnnotations(mapValidationToAnnotations(validation));
  }, [validation, script.content]);

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

  const handleApplySuggestion = async (originalText: string, newText: string) => {
    try {
      // Replace the original text with the new text in the script
      const updatedContent = script.content.replace(originalText, newText);
      
      // Update script content
      setImprovedScript(updatedContent);
      
      toast({
        title: "Sugestão aplicada",
        description: "O roteiro foi atualizado com a sugestão da IA",
      });
      
      // In a real implementation, you would save this to the database
      await updateScript(script.id, updatedContent);
      
      // Set flag to indicate suggestions were applied
      setSuggestionsApplied(true);
      
    } catch (error) {
      console.error("Erro ao aplicar sugestão:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aplicar a sugestão ao roteiro.",
      });
    }
  };

  const applySuggestions = async () => {
    try {
      setIsApplyingSuggestions(true);
      toast({
        title: "Aplicando melhorias",
        description: "Nossa IA está implementando as sugestões para melhorar o roteiro...",
      });
      
      let updatedContent = script.content;
      
      // Apply all suggestions from blocks
      if (validation?.blocos) {
        for (const bloco of validation.blocos) {
          if (bloco.sugestao && bloco.substituir === true) {
            updatedContent = updatedContent.replace(bloco.texto, bloco.sugestao);
          }
        }
      }
      
      setImprovedScript(updatedContent);
      setSuggestionsApplied(true);
      
      // Update the script content
      await updateScript(script.id, updatedContent);
      
      toast({
        title: "Melhorias aplicadas",
        description: "As sugestões foram implementadas no roteiro com sucesso.",
      });
      
    } catch (error) {
      console.error("Erro ao aplicar sugestões:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aplicar as melhorias ao roteiro.",
      });
    } finally {
      setIsApplyingSuggestions(false);
    }
  };

  const revalidateScript = async () => {
    try {
      setIsRevalidating(true);
      toast({
        title: "Reavaliando roteiro",
        description: "Estamos analisando a nova versão do roteiro após as melhorias...",
      });
      
      // Create a modified script object with the improved content
      const improvedScriptObj = {
        ...script,
        content: improvedScript || script.content
      };
      
      const result = await validateScript(improvedScriptObj);
      setValidation(result);
      
      if (onValidationComplete) {
        onValidationComplete(result);
      }
      
      toast({
        title: "Reavaliação concluída",
        description: `Nova pontuação: ${result.nota_geral.toFixed(1)}/10 (${result.nota_geral > 7 ? 'Melhorou!' : 'Ainda precisa de ajustes'})`,
      });
      
    } catch (error) {
      console.error("Erro ao revalidar roteiro:", error);
      toast({
        variant: "destructive", 
        title: "Erro",
        description: "Não foi possível revalidar o roteiro.",
      });
    } finally {
      setIsRevalidating(false);
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
              <Tabs defaultValue="analise">
                <TabsList className="mb-4">
                  <TabsTrigger value="analise">Análise por Blocos</TabsTrigger>
                  <TabsTrigger value="visualizacao">Visualização Anotada</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analise">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Gancho Inicial", score: validation.gancho, icon: "🎣", description: "Avalia quão bem o início do roteiro captura atenção" },
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
                    
                    {/* Blocos analisados */}
                    {validation.blocos && validation.blocos.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h3 className="font-medium text-lg">Análise por Blocos do Roteiro</h3>
                        <div className="grid gap-4">
                          {validation.blocos.map((bloco, index) => (
                            <div key={index} className="border rounded-md p-3 relative">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <span className="mr-2">
                                    {bloco.tipo === 'gancho' && '🎣'}
                                    {bloco.tipo === 'conflito' && '⚡'}
                                    {bloco.tipo === 'virada' && '🔄'}
                                    {bloco.tipo === 'cta' && '👆'}
                                  </span>
                                  <span className="font-medium capitalize">{bloco.tipo}</span>
                                </div>
                                <Badge variant={getScoreBadge(bloco.nota) as any} className="ml-2">
                                  {bloco.nota.toFixed(1)}/10
                                </Badge>
                              </div>
                              
                              <div className={`p-2 rounded-md text-sm ${
                                bloco.nota >= 8 ? 'bg-green-50' : 
                                bloco.nota >= 6 ? 'bg-yellow-50' : 
                                'bg-amber-50'
                              }`}>
                                {bloco.texto}
                              </div>
                              
                              {bloco.sugestao && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium mb-1">Sugestão:</p>
                                  <div className="bg-blue-50 p-2 rounded-md text-sm">
                                    {bloco.sugestao}
                                  </div>
                                  
                                  {bloco.substituir && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => handleApplySuggestion(bloco.texto, bloco.sugestao || "")}
                                      className="mt-2 h-8 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Aplicar Sugestão
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-medium">Pontuação Total</span>
                        <div className="flex items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant={getScoreBadge(validation.nota_geral || validation.total) as any} className="text-xl py-1 px-3">
                                {(validation.nota_geral || validation.total).toFixed(1)}/10
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Média ponderada de todas as categorias</p>
                              <p className="text-xs mt-1">{renderScoreDetail(validation.nota_geral || validation.total)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <Progress value={(validation.nota_geral || validation.total) * 10} className={getScoreColor(validation.nota_geral || validation.total)} />
                      <p className="text-right text-sm mt-1 font-medium">{getScoreText(validation.nota_geral || validation.total)}</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md mt-4 border border-muted">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2 text-blue-500" />
                        Sugestões de melhoria
                      </h4>
                      <ul className="space-y-2 pl-5 list-disc">
                        {(validation.sugestoes_gerais && Array.isArray(validation.sugestoes_gerais)) ? 
                          validation.sugestoes_gerais.map((sugestao, idx) => (
                            <li key={idx} className="text-sm">{sugestao}</li>
                          )) :
                          validation.sugestoes?.split('\n').map((sugestao, idx) => (
                            <li key={idx} className="text-sm">{sugestao}</li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="visualizacao">
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-md mt-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Texto Avaliado com Anotações
                      </h4>
                      <div className="border rounded-md p-4 bg-white">
                        <AnnotatedText 
                          content={improvedScript || script.content} 
                          annotations={textAnnotations}
                          onApplySuggestion={handleApplySuggestion}
                          onEditText={(text) => {
                            toast({
                              title: "Edição manual",
                              description: "Você pode editar o texto manualmente no modo de edição",
                            });
                          }}
                          onIgnoreSuggestion={(text) => {
                            toast({
                              title: "Sugestão ignorada",
                              description: "Você optou por manter o texto original",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {!suggestionsApplied ? (
                  <Button 
                    variant="default" 
                    onClick={applySuggestions} 
                    disabled={isApplyingSuggestions || !(validation.blocos && validation.blocos.length > 0)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isApplyingSuggestions ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ThumbsUp className="h-4 w-4 mr-2" />
                    )}
                    Aplicar Todas as Melhorias
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    onClick={revalidateScript} 
                    disabled={isRevalidating}
                  >
                    {isRevalidating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-4 w-4 mr-2" />
                    )}
                    Revalidar Roteiro
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleValidate} 
                  disabled={isLoading}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analisar novamente com IA avançada
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-auto"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Manualmente
                </Button>
              </div>
              
              {improvedScript && (
                <div className="bg-green-50 p-4 rounded-md mt-4 border border-green-100">
                  <h4 className="font-medium mb-2 flex items-center text-green-800">
                    <Check className="h-4 w-4 mr-2" />
                    Melhorias aplicadas com sucesso!
                  </h4>
                  <p className="text-sm text-green-700">
                    O roteiro foi atualizado com as sugestões da IA. Você pode revalidá-lo para ver o novo score.
                  </p>
                </div>
              )}
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
