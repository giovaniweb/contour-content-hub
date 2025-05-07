
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ScriptValidation from '@/components/script-generator/ScriptValidation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { PlusCircle, FileText, RefreshCw, ArrowLeft } from 'lucide-react';
import { ScriptResponse, ScriptType } from '@/utils/api';
import { validateScript, getValidation } from '@/utils/validation/api';
import { useToast } from '@/hooks/use-toast';
import ScriptChatAssistant from '@/components/script/ScriptChatAssistant';
import { ValidationResult } from '@/utils/validation/types';

const ScriptValidationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [script, setScript] = useState<ScriptResponse | null>(null);
  const [scriptContent, setScriptContent] = useState('');
  const [scriptTitle, setScriptTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch script if ID provided
  useEffect(() => {
    if (id) {
      fetchScript(id);
    }
  }, [id]);

  const fetchScript = async (scriptId: string) => {
    try {
      setIsLoading(true);
      
      // Primeiro tente buscar a validação existente
      const existingValidation = await getValidation(scriptId);
      
      if (existingValidation) {
        setValidationResult(existingValidation);
      }
      
      // Buscar roteiro da API
      const response = await fetch(`/api/scripts/${scriptId}`);
      
      if (!response.ok) {
        throw new Error('Não foi possível carregar o roteiro');
      }
      
      const data = await response.json();
      setScript(data);
      setScriptContent(data.content || '');
      setScriptTitle(data.title || '');
    } catch (error) {
      console.error('Erro ao carregar roteiro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o roteiro',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateScript = async () => {
    if (!scriptContent.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira o conteúdo do roteiro",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Criar objeto de roteiro temporário
      const tempScript = {
        id: id || 'temp-' + Date.now(),
        content: scriptContent,
        title: scriptTitle || 'Roteiro sem título',
        type: 'videoScript' as ScriptType
      };
      
      // Validar o roteiro
      const result = await validateScript(tempScript);
      
      setValidationResult(result);
      setShowChat(true);
      
      toast({
        title: "Roteiro validado",
        description: "O conteúdo foi analisado com sucesso!"
      });
    } catch (error) {
      console.error('Erro na validação:', error);
      toast({
        title: "Erro na validação",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprovedScript = (improvedContent: string) => {
    setScriptContent(improvedContent);
    toast({
      title: "Roteiro atualizado",
      description: "O roteiro foi aprimorado pelo assistente IA"
    });
  };

  return (
    <Layout>
      <div className="container max-w-7xl py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              {id ? "Validação de Roteiro" : "Novo Roteiro para Validação"}
            </h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda: Editor e Validação */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    {id ? "Editar Roteiro" : "Novo Roteiro"}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Título do Roteiro"
                      value={scriptTitle}
                      onChange={(e) => setScriptTitle(e.target.value)}
                      className="mb-3"
                    />
                    <Textarea
                      placeholder="Cole ou digite o conteúdo do roteiro aqui..."
                      value={scriptContent}
                      onChange={(e) => setScriptContent(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleValidateScript} 
                    disabled={isLoading || !scriptContent.trim()}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Validar Roteiro
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Componente de Validação se houver resultado */}
            {validationResult && (
              <ScriptValidation 
                script={{ 
                  id: id || 'temp-script', 
                  content: scriptContent,
                  title: scriptTitle,
                  type: 'videoScript' as ScriptType,
                  createdAt: new Date().toISOString(),
                  suggestedVideos: [],
                  captionTips: []
                }} 
                onValidationComplete={setValidationResult}
              />
            )}
          </div>
          
          {/* Coluna Direita: Assistente IA */}
          <div>
            <ScriptChatAssistant 
              content={scriptContent}
              validationResult={validationResult}
              onImprovedScript={handleImprovedScript}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScriptValidationPage;
