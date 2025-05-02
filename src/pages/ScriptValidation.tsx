
import React, { useState } from "react";
import Layout from "@/components/Layout";
import ScriptEditor from "@/components/script-generator/ScriptEditor";
import ScriptValidation from "@/components/script-generator/ScriptValidation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnnotatedText, { TextAnnotation } from "@/components/script/AnnotatedText";
import { mapValidationToAnnotations } from "@/utils/validation/annotations";

const ScriptValidation: React.FC = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([]);

  const handleValidationComplete = (validation: any) => {
    setValidationResult(validation);
    const annotations = mapValidationToAnnotations(validation);
    setTextAnnotations(annotations);
    setIsValidating(false);

    toast({
      title: "Validação concluída",
      description: "O roteiro foi analisado pela IA",
    });
  };

  const handleValidate = () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Conteúdo vazio",
        description: "Por favor, insira algum texto para validar.",
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Validador de Roteiros</h1>
              <p className="text-muted-foreground">
                Use nossa IA para validar e melhorar seu roteiro de vídeo.
              </p>
            </div>
            
            <Button 
              onClick={handleValidate}
              disabled={!content.trim() || isValidating}
              className="flex gap-2"
            >
              {isValidating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Validar Roteiro
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Editor de roteiro */}
            <Card className="xl:col-span-2">
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
              </CardContent>
            </Card>

            {/* Card de validação */}
            <Card className="xl:col-span-1">
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
                {isValidating ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-muted-foreground">Analisando seu roteiro...</p>
                  </div>
                ) : !validationResult ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-muted-foreground">
                      Escreva seu roteiro e clique em "Validar Roteiro" para receber feedback da IA.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {textAnnotations.length > 0 && (
                      <div className="border rounded-md p-4 bg-gray-50">
                        <AnnotatedText 
                          content={content} 
                          annotations={textAnnotations} 
                        />
                      </div>
                    )}
                    
                    <ScriptValidation
                      script={{id: "temp", content, title: "Roteiro temporário", type: "videoScript", createdAt: new Date().toISOString()}}
                      onValidationComplete={handleValidationComplete}
                      hideTitle={true}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScriptValidation;
