
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Languages, 
  MessageSquare, 
  BookOpen, 
  Lightbulb, 
  Book,
  Video,
  Instagram,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TechnicalDocument } from '@/types/document';
import { SUPABASE_BASE_URL, supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentActionsProps {
  document: TechnicalDocument;
  onDocumentUpdate: (document: TechnicalDocument) => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({ document, onDocumentUpdate }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('pt');
  const [question, setQuestion] = useState('');
  const [contentType, setContentType] = useState<'video_script' | 'story' | 'big_idea'>('video_script');
  const { toast } = useToast();
  
  const handleTranslateDocument = async () => {
    if (document.idiomas_traduzidos?.includes(targetLanguage)) {
      toast({
        description: `Este documento já foi traduzido para ${getLanguageLabel(targetLanguage)}.`,
      });
      return;
    }
    
    try {
      setIsLoading('translate');
      
      // Call edge function to translate document
      const token = (await supabase.auth.getSession()).data.session?.access_token || '';
      
      const response = await fetch(`${SUPABASE_BASE_URL}/functions/v1/translate-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId: document.id,
          targetLanguage
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na tradução');
      }
      
      // Update document with new translation
      const updatedDoc = {
        ...document,
        idiomas_traduzidos: [...(document.idiomas_traduzidos || []), targetLanguage]
      };
      onDocumentUpdate(updatedDoc);
      
      toast({
        title: "Sucesso",
        description: `Documento traduzido para ${getLanguageLabel(targetLanguage)}.`,
      });
    } catch (err: any) {
      console.error('Error translating document:', err);
      toast({
        variant: "destructive",
        title: "Erro na tradução",
        description: err.message || "Não foi possível traduzir o documento."
      });
    } finally {
      setIsLoading(null);
    }
  };
  
  const handleSummarizeDocument = async () => {
    try {
      setIsLoading('summarize');
      
      // Call edge function to summarize document
      const token = (await supabase.auth.getSession()).data.session?.access_token || '';
      
      const response = await fetch(`${SUPABASE_BASE_URL}/functions/v1/summarize-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId: document.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar resumo');
      }
      
      const result = await response.json();
      
      // Show toast with result.summary
      toast({
        title: "Resumo gerado",
        description: "O resumo do documento foi gerado com sucesso.",
      });
      
      // In a real app, you would show the summary in the UI
      
    } catch (err: any) {
      console.error('Error summarizing document:', err);
      toast({
        variant: "destructive",
        title: "Erro ao gerar resumo",
        description: err.message || "Não foi possível resumir o documento."
      });
    } finally {
      setIsLoading(null);
    }
  };
  
  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        description: "Por favor, digite uma pergunta.",
      });
      return;
    }
    
    try {
      setIsLoading('ask');
      
      // Call edge function to ask question about document
      const token = (await supabase.auth.getSession()).data.session?.access_token || '';
      
      const response = await fetch(`${SUPABASE_BASE_URL}/functions/v1/ask-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId: document.id,
          question: question.trim()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar pergunta');
      }
      
      const result = await response.json();
      
      // Here you would update the UI with the answer
      // In a real app, you might pass this back to a parent component
      
      // Clear the question input
      setQuestion('');
      
    } catch (err: any) {
      console.error('Error asking question:', err);
      toast({
        variant: "destructive",
        title: "Erro ao processar pergunta",
        description: err.message || "Não foi possível responder à pergunta."
      });
    } finally {
      setIsLoading(null);
    }
  };
  
  const handleGenerateContent = async () => {
    try {
      setIsLoading('generate');
      
      // Call edge function to generate content based on document
      const token = (await supabase.auth.getSession()).data.session?.access_token || '';
      
      const response = await fetch(`${SUPABASE_BASE_URL}/functions/v1/generate-content-from-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId: document.id,
          contentType
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar conteúdo');
      }
      
      // Here you would handle the generated content
      // e.g., navigate to content editor, etc.
      
      toast({
        title: "Conteúdo gerado",
        description: "O conteúdo foi gerado com sucesso."
      });
      
    } catch (err: any) {
      console.error('Error generating content:', err);
      toast({
        variant: "destructive",
        title: "Erro ao gerar conteúdo",
        description: err.message || "Não foi possível gerar o conteúdo."
      });
    } finally {
      setIsLoading(null);
    }
  };
  
  const getLanguageLabel = (code: string) => {
    switch(code) {
      case 'pt': return 'Português';
      case 'en': return 'Inglês';
      case 'es': return 'Espanhol';
      default: return code;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Translate Section */}
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <Languages className="h-4 w-4 mr-2" /> Traduzir
          </h3>
          <div className="space-y-2">
            <Select
              value={targetLanguage}
              onValueChange={setTargetLanguage}
              disabled={isLoading === 'translate'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">Inglês</SelectItem>
                <SelectItem value="es">Espanhol</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="w-full"
              onClick={handleTranslateDocument}
              disabled={isLoading === 'translate' || document.idiomas_traduzidos?.includes(targetLanguage)}
            >
              {isLoading === 'translate' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Traduzindo...
                </>
              ) : (
                'Traduzir Documento'
              )}
            </Button>
          </div>
        </div>
        
        {/* Summarize Section */}
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-2" /> Resumo & Explicação
          </h3>
          <div className="space-y-2">
            <Button 
              className="w-full"
              variant="outline"
              onClick={handleSummarizeDocument}
              disabled={isLoading === 'summarize'}
            >
              {isLoading === 'summarize' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Resumo'
              )}
            </Button>
          </div>
        </div>
        
        {/* Ask Questions Section */}
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" /> Perguntas
          </h3>
          <div className="space-y-2">
            <Input
              placeholder="Faça uma pergunta sobre o documento..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading === 'ask'}
            />
            <Button 
              className="w-full"
              variant="outline"
              onClick={handleAskQuestion}
              disabled={isLoading === 'ask' || !question.trim()}
            >
              {isLoading === 'ask' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                'Perguntar'
              )}
            </Button>
          </div>
        </div>
        
        {/* Generate Content Section */}
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <Sparkles className="h-4 w-4 mr-2" /> Gerar Conteúdo
          </h3>
          <div className="space-y-2">
            <Select
              value={contentType}
              onValueChange={(value: 'video_script' | 'story' | 'big_idea') => setContentType(value)}
              disabled={isLoading === 'generate'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Conteúdo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video_script" className="flex items-center">
                  <Video className="h-4 w-4 mr-2" /> Roteiro para Vídeo
                </SelectItem>
                <SelectItem value="story" className="flex items-center">
                  <Instagram className="h-4 w-4 mr-2" /> Story de Venda
                </SelectItem>
                <SelectItem value="big_idea" className="flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" /> Big Idea
                </SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="w-full"
              onClick={handleGenerateContent}
              disabled={isLoading === 'generate'}
            >
              {isLoading === 'generate' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Conteúdo'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentActions;
