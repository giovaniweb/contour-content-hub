import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, RefreshCw, MessageSquare, Lightbulb, CheckCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import PromptManagerDialog from './PromptManagerDialog';
import { ScriptResponse } from '@/utils/api';
import { ValidationResult } from '@/utils/validation/types';
import { supabase } from '@/integrations/supabase/client';

interface ScriptChatAssistantProps {
  script: ScriptResponse | null;
  validationResult: ValidationResult | null;
  onScriptUpdate: (newContent: string) => void;
}

const ScriptChatAssistant: React.FC<ScriptChatAssistantProps> = ({ 
  script, 
  validationResult,
  onScriptUpdate
}) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImprovementLoading, setIsImprovementLoading] = useState(false);
  const [improvedContent, setImprovedContent] = useState<string | null>(null);
  const [showImprovedScript, setShowImprovedScript] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const { toast } = useToast();
  
  // Função para lidar com a seleção de um prompt personalizado
  const handlePromptSelect = useCallback((prompt: string) => {
    setCustomPrompt(prompt);
  }, []);

  // Função para enviar mensagem para o assistente de chat
  const sendChatMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Adicionar mensagem do usuário ao histórico
      const newMessages = [...messages, { role: 'user', content: inputMessage }];
      setMessages(newMessages);
      setInputMessage('');
      
      // Chamar a função Supabase
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { 
          messages: newMessages,
          scriptContent: script?.content,
          validationResult
        }
      });
      
      if (error) {
        console.error("Erro na função chat-assistant:", error);
        toast({
          title: "Erro",
          description: "Não foi possível processar sua mensagem",
          variant: "destructive"
        });
        return;
      }
      
      // Adicionar resposta do assistente ao histórico
      if (data && 'content' in data) {
        setMessages([...newMessages, { role: 'assistant', content: data.content }]);
      } else {
        console.error("Resposta inválida da função chat-assistant:", data);
        toast({
          title: "Erro",
          description: "Resposta inválida do assistente",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro",
        description: "Algo deu errado ao processar sua mensagem",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para melhorar o roteiro
  const improveScript = async () => {
    if (!script || isImprovementLoading) return;
    
    try {
      setIsImprovementLoading(true);
      
      // Chamar a função Supabase para melhorar o roteiro
      const { data, error } = await supabase.functions.invoke('improve-script', {
        body: { 
          content: script.content,
          validationResult,
          prompt: customPrompt || undefined
        }
      });
      
      if (error) {
        console.error("Erro na função improve-script:", error);
        toast({
          title: "Erro",
          description: "Não foi possível melhorar o roteiro",
          variant: "destructive"
        });
        return;
      }
      
      // Mostrar o roteiro melhorado
      if (data && 'improved' in data) {
        setImprovedContent(data.improved);
        setShowImprovedScript(true);
        
        // Aviso sobre aplicar as melhorias
        toast({
          title: "Roteiro melhorado!",
          description: "Avalie as melhorias sugeridas e clique em 'Aplicar Melhorias' se desejar usar este conteúdo.",
        });
      } else {
        console.error("Resposta inválida da função improve-script:", data);
        toast({
          title: "Erro",
          description: "Não foi possível processar as melhorias",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error("Erro ao melhorar roteiro:", error);
      toast({
        title: "Erro",
        description: "Algo deu errado ao processar as melhorias",
        variant: "destructive"
      });
    } finally {
      setIsImprovementLoading(false);
    }
  };

  // Função para aplicar as melhorias ao roteiro
  const applyImprovedScript = () => {
    if (improvedContent && script) {
      onScriptUpdate(improvedContent);
      setShowImprovedScript(false);
      
      toast({
        title: "Melhorias aplicadas",
        description: "O roteiro foi atualizado com as melhorias sugeridas.",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Chat Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Assistente de Roteiro
          </CardTitle>
          <CardDescription>
            Use o assistente para obter sugestões e feedback sobre seu roteiro.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div key={index} className={`p-3 rounded-md ${message.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Escreva sua mensagem..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage(); }}
              disabled={isLoading}
            />
            <Button onClick={sendChatMessage} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Melhoria do Roteiro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Melhorar Roteiro
          </CardTitle>
          <CardDescription>
            Obtenha sugestões de melhoria para o seu roteiro atual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Clique no botão abaixo para obter sugestões de melhoria para o seu roteiro.
            </p>
            <PromptManagerDialog onPromptSelect={handlePromptSelect} />
          </div>
          <Button onClick={improveScript} disabled={isImprovementLoading} variant="secondary">
            {isImprovementLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4 mr-2" />
            )}
            Melhorar Roteiro
          </Button>
        </CardContent>
      </Card>

      {/* Roteiro Melhorado */}
      {showImprovedScript && improvedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Roteiro Melhorado
            </CardTitle>
            <CardDescription>
              Aqui está uma versão melhorada do seu roteiro.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={improvedContent}
              readOnly
              className="min-h-[150px] text-sm"
            />
          </CardContent>
          <CardContent>
            <Button onClick={applyImprovedScript}>
              Aplicar Melhorias
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScriptChatAssistant;
