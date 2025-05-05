
import React, { useState } from "react";
import Layout from "@/components/Layout";
import ScriptEditor from "@/components/script-generator/ScriptEditor";
import ScriptValidationComponent from "@/components/script-generator/ScriptValidation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, RefreshCw } from "lucide-react";
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

  const handleValidationComplete = (validation: ValidationResult) => {
    setValidationResult(validation);
    const annotations = mapValidationToAnnotations(validation);
    setTextAnnotations(annotations);
    setIsValidating(false);

    toast({
      title: "Validação concluída",
      description: "O roteiro foi analisado pela IA"
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
              <ScriptEditor 
                content={content}
                onChange={setContent}
                readOnly={false}
              />
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

          {/* Resultados da Validação */}
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
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <p className="text-muted-foreground">Analisando seu roteiro...</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {!isValidating && !validationResult && (
            <Card>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <p className="text-muted-foreground">
                    Escreva seu roteiro e clique em "Validar Roteiro" para receber feedback da IA.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ScriptValidationPage;
