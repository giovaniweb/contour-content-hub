
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertCircle, Loader2, Brain, Sparkles, Lightbulb, Check } from 'lucide-react';
import { motion } from "framer-motion";
import { staggerChildren, itemVariants, fadeIn } from "@/lib/animations";

const IdeaValidator: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [platform, setPlatform] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [validationResults, setValidationResults] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (!idea) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira sua ideia para validar",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        score: 82,
        engagement: 78,
        relevance: 85,
        feasibility: 90,
        originality: 76,
        strengths: [
          "Tópico de alto interesse para o público-alvo",
          "Formato adequado para a plataforma escolhida",
          "Possibilidade de transformar em série de conteúdo"
        ],
        weaknesses: [
          "Tema bastante explorado, necessita diferencial",
          "Poderia explorar mais aspectos práticos"
        ],
        suggestions: [
          "Adicionar exemplos específicos de casos reais",
          "Focar em benefícios exclusivos do método apresentado",
          "Considerar formatos visuais para demonstração dos resultados"
        ],
        recommendation: "Recomendamos avançar com esta ideia após incorporar as sugestões de melhoria."
      };

      setValidationResults(mockResults);
      setAnalysisComplete(true);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleClear = () => {
    setIdea('');
    setPlatform('');
    setObjective('');
    setAdditionalContext('');
    setAnalysisComplete(false);
    setValidationResults(null);
  };

  const handleGenerateScript = () => {
    // Navigate to script generator with the validated idea
    navigate('/script-generator', { 
      state: { 
        validatedIdea: {
          topic: idea,
          platform,
          marketingObjective: objective,
          additionalInfo: additionalContext,
          validationScore: validationResults?.score
        } 
      }
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-contourline-darkBlue">Validador de Ideias</h1>
          <p className="text-muted-foreground">Analise e refine suas ideias antes de produzir conteúdo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Sua Ideia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Descreva sua ideia*</label>
              <Textarea
                placeholder="Ex: Vídeo sobre os 5 principais benefícios do tratamento X para rejuvenescimento facial"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={5}
                disabled={analysisComplete}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plataforma</label>
                <Select 
                  value={platform} 
                  onValueChange={setPlatform}
                  disabled={analysisComplete}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="email">E-mail Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Objetivo principal</label>
                <Select 
                  value={objective} 
                  onValueChange={setObjective}
                  disabled={analysisComplete}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="🟡 Atrair Atenção">🟡 Atrair Atenção</SelectItem>
                    <SelectItem value="🟢 Criar Conexão">🟢 Criar Conexão</SelectItem>
                    <SelectItem value="🔴 Fazer Comprar">🔴 Fazer Comprar</SelectItem>
                    <SelectItem value="🔁 Reativar Interesse">🔁 Reativar Interesse</SelectItem>
                    <SelectItem value="✅ Fechar Agora">✅ Fechar Agora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contexto adicional (opcional)</label>
              <Textarea
                placeholder="Adicione qualquer informação contextual relevante"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={3}
                disabled={analysisComplete}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t p-4">
            {!analysisComplete ? (
              <>
                <Button variant="outline" onClick={handleClear} disabled={isAnalyzing}>
                  Limpar
                </Button>
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analisar Ideia
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleClear}>
                  Nova Análise
                </Button>
                <Button onClick={handleGenerateScript} className="flex gap-2">
                  <Sparkles className="h-4 w-4" />
                  Gerar Roteiro
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        <Card>
          {!analysisComplete ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              {isAnalyzing ? (
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Brain className="h-16 w-16 text-muted-foreground animate-pulse mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analisando sua ideia...</h3>
                  <p className="text-muted-foreground mb-4">
                    Nossa IA está avaliando seu conceito sob múltiplas perspectivas
                  </p>
                  <Progress value={45} className="w-full max-w-xs" />
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <Lightbulb className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Compartilhe sua ideia</h3>
                  <p className="text-muted-foreground">
                    Preencha o formulário ao lado e clique em "Analisar Ideia"
                    para receber feedback da nossa IA e melhorar seu conteúdo.
                  </p>
                </div>
              )}
            </div>
          ) : validationResults && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Resultados da Análise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Pontuação Geral</h3>
                    <span className={`text-lg font-bold ${
                      validationResults.score >= 80 ? 'text-green-500' :
                      validationResults.score >= 60 ? 'text-amber-500' : 
                      'text-red-500'
                    }`}>
                      {validationResults.score}/100
                    </span>
                  </div>
                  <Progress 
                    value={validationResults.score} 
                    className={`h-2 ${
                      validationResults.score >= 80 ? 'bg-green-100' :
                      validationResults.score >= 60 ? 'bg-amber-100' : 
                      'bg-red-100'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Engajamento</h4>
                    <Progress value={validationResults.engagement} className="mb-1" />
                    <span className="text-sm text-muted-foreground">{validationResults.engagement}/100</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Relevância</h4>
                    <Progress value={validationResults.relevance} className="mb-1" />
                    <span className="text-sm text-muted-foreground">{validationResults.relevance}/100</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Viabilidade</h4>
                    <Progress value={validationResults.feasibility} className="mb-1" />
                    <span className="text-sm text-muted-foreground">{validationResults.feasibility}/100</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Originalidade</h4>
                    <Progress value={validationResults.originality} className="mb-1" />
                    <span className="text-sm text-muted-foreground">{validationResults.originality}/100</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Pontos Fortes
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-1">
                      {validationResults.strengths.map((strength: string, idx: number) => (
                        <li key={idx} className="text-muted-foreground">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      Pontos a Melhorar
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-1">
                      {validationResults.weaknesses.map((weakness: string, idx: number) => (
                        <li key={idx} className="text-muted-foreground">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
                      Sugestões de Melhoria
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-1">
                      {validationResults.suggestions.map((suggestion: string, idx: number) => (
                        <li key={idx} className="text-muted-foreground">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium flex items-center mb-1">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Recomendação Final
                  </h4>
                  <p className="text-sm">{validationResults.recommendation}</p>
                </div>
              </CardContent>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default IdeaValidator;
