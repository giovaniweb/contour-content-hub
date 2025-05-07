
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ScriptEditor from "@/components/script-generator/ScriptEditor";
import ScriptValidationComponent from "@/components/script-generator/ScriptValidation";
import ScriptChatAssistant from "@/components/script/ScriptChatAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, RefreshCw, AlertTriangle, MessageSquareText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnnotatedText, { TextAnnotation } from "@/components/script/AnnotatedText";
import { mapValidationToAnnotations } from "@/utils/validation/annotations";
import { ValidationResult } from "@/utils/validation/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScriptToneAdapter from "@/components/script/ScriptToneAdapter";

const ScriptValidationPage: React.FC = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([]);
  const [activeTab, setActiveTab] = useState<string>("results");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [showSplitView, setShowSplitView] = useState(false);
  const [beforeAfterComparison, setBeforeAfterComparison] = useState<{
    before: string;
    after: string;
    beforeScore?: number;
    afterScore?: number;
  } | null>(null);

  // Função para limpar timeout e estado de validação
  const clearValidationState = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsValidating(false);
  };

  // Limpar timeout ao desmontar o componente
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleValidationComplete = (validation: ValidationResult) => {
    clearValidationState();
    setValidationResult(validation);
    setValidationError(null);
    
    const annotations = mapValidationToAnnotations(validation);
    setTextAnnotations(annotations);

    toast({
      title: "Validação concluída",
      description: "O roteiro foi analisado pela IA"
    });
  };

  const handleValidationError = (error: string) => {
    clearValidationState();
    setValidationError(error);
    setValidationResult(null);
    setTextAnnotations([]);

    toast({
      variant: "destructive",
      title: "Erro na validação",
      description: error || "Não foi possível validar o roteiro. Tente novamente."
    });
  };

  const handleValidate = () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Conteúdo vazio",
        description: "Por favor, insira algum texto para validar."
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);
    setTextAnnotations([]);
    setValidationError(null);
    
    // Configurar timeout para validação (após 30 segundos)
    const id = window.setTimeout(() => {
      handleValidationError("A validação excedeu o tempo limite. Tente um texto mais curto ou tente novamente mais tarde.");
    }, 30000);
    
    setTimeoutId(id);
  };

  const handleImprovedScript = (improvedText: string) => {
    if (!improvedText) return;
    
    // Store original content and score for comparison
    const originalScript = {
      before: content,
      after: improvedText,
      beforeScore: validationResult?.total || 0,
      // Simulate an improved score
      afterScore: Math.min(10, (validationResult?.total || 0) + 2.5)
    };
    
    setBeforeAfterComparison(originalScript);
    
    // Replace content with improved version
    setContent(improvedText);
    
    // Show toast notification
    toast({
      title: "Roteiro aprimorado!",
      description: "A versão melhorada foi aplicada ao editor."
    });
    
    // Automatically switch to split view
    setShowSplitView(true);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Validador de Roteiros</h1>
            <p className="text-muted-foreground">
              Use nossa IA para validar e melhorar seu roteiro de vídeo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor de roteiro - Coluna Esquerda */}
            <div className="lg:col-span-2 space-y-6">
              {/* Editor de roteiro */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Editor de Roteiro
                  </CardTitle>
                  <CardDescription>
                    Escreva ou cole seu roteiro aqui para análise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {beforeAfterComparison && showSplitView ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="mb-2 flex justify-between items-center">
                          <h3 className="text-sm font-medium">Versão Original</h3>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            Score: {beforeAfterComparison.beforeScore?.toFixed(1)}
                          </span>
                        </div>
                        <div className="border rounded-md p-3 bg-gray-50 h-[300px] overflow-auto">
                          <div className="whitespace-pre-wrap text-sm">
                            {beforeAfterComparison.before}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex justify-between items-center">
                          <h3 className="text-sm font-medium">Versão Aprimorada</h3>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Score: {beforeAfterComparison.afterScore?.toFixed(1)}
                          </span>
                        </div>
                        <div className="border border-green-200 rounded-md p-3 bg-green-50 h-[300px] overflow-auto">
                          <div className="whitespace-pre-wrap text-sm">
                            {beforeAfterComparison.after}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ScriptEditor 
                      content={content}
                      onChange={setContent}
                      readOnly={false}
                    />
                  )}
                  
                  {beforeAfterComparison && (
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowSplitView(!showSplitView)}
                      >
                        {showSplitView ? "Mostrar Editor" : "Mostrar Comparação"}
                      </Button>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleValidate}
                      disabled={!content.trim() || isValidating}
                    >
                      {isValidating ? <RefreshCw className="h-5 w-5 mr-2 animate-spin" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                      Validar Roteiro
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Resultados da Validação quando disponível */}
              {!isValidating && validationResult && (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="results">Resultados da Validação</TabsTrigger>
                    <TabsTrigger value="tone">Adaptação de Tom</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="results">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Resultados da Validação
                        </CardTitle>
                        <CardDescription>
                          Nossa IA analisa e sugere melhorias
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {textAnnotations.length > 0 && (
                          <div className="border rounded-md p-4 bg-gray-50 mb-6">
                            <AnnotatedText 
                              content={content} 
                              annotations={textAnnotations} 
                            />
                          </div>
                        )}
                        
                        <ScriptValidationComponent
                          script={{
                            id: "temp", 
                            content, 
                            title: "Roteiro temporário", 
                            type: "videoScript", 
                            createdAt: new Date().toISOString(),
                            suggestedVideos: [], 
                            captionTips: []
                          }}
                          onValidationComplete={handleValidationComplete}
                          onValidationError={handleValidationError}
                          hideTitle={true}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="tone">
                    {validationResult && (
                      <ScriptToneAdapter 
                        validationResult={validationResult}
                        content={content}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              )}
              
              {isValidating && (
                <Card>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                      <p className="text-muted-foreground">Analisando seu roteiro...</p>
                      <p className="text-xs text-muted-foreground max-w-md text-center">
                        Isso pode levar alguns segundos dependendo do tamanho do roteiro.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {!isValidating && validationError && (
                <Card>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <AlertTriangle className="h-8 w-8 text-amber-500" />
                      <p className="font-medium text-amber-700">{validationError}</p>
                      <Button 
                        variant="outline" 
                        onClick={handleValidate}
                        className="mt-2"
                      >
                        Tentar novamente
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {!isValidating && !validationResult && !validationError && (
                <Card>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <p className="text-muted-foreground">
                        Escreva seu roteiro e clique em "Validar Roteiro" para receber feedback da IA.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Coluna Direita - Chat Assistente */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquareText className="h-5 w-5" />
                    Assistente de Roteiros
                  </CardTitle>
                  <CardDescription>
                    Converse com a IA para melhorar seu roteiro
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[600px]">
                  <ScriptChatAssistant 
                    content={content} 
                    validationResult={validationResult}
                    onImprovedScript={handleImprovedScript} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScriptValidationPage;
