
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
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TechnicalDocument } from '@/types/document';
import { SUPABASE_BASE_URL, supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert } from '@/components/ui/alert';

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
  
  // Function to check if document has content
  const hasContent = (): boolean => {
    if (!document.conteudo_extraido) {
      toast({
        variant: "destructive",
        title: "Sem conteúdo",
        description: "Este documento ainda não tem conteúdo extraído. Por favor, extraia o conteúdo primeiro."
      });
      return false;
    }
    return true;
  };
  
  const handleTranslateDocument = async () => {
    if (!hasContent()) return;
    
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
    if (!hasContent()) return;
    
    try {
      setIsLoading('summarize');
      
      // Create mock response for the summary when function doesn't exist
      const summary = `Este é um resumo simulado do documento "${document.titulo}".
      
      Principais pontos abordados:
      - Análise de resultados científicos
      - Metodologia aplicada no estudo
      - Conclusões relevantes para a área
      
      Em uma implementação real, este resumo seria gerado analisando o conteúdo completo do documento.`;
      
      // Simulate a delay
      await new Promise(r => setTimeout(r, 1500));
      
      // Show toast with summary
      toast({
        title: "Resumo gerado",
        description: "O resumo do documento foi gerado com sucesso.",
      });
      
      // In a real app, we would show the summary in the UI
      alert(summary);
      
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
    if (!hasContent()) return;
    
    if (!question.trim()) {
      toast({
        description: "Por favor, digite uma pergunta.",
      });
      return;
    }
    
    try {
      setIsLoading('ask');
      
      // Simulate a response for demonstration purposes
      await new Promise(r => setTimeout(r, 1500));
      
      const answer = `Baseado no documento "${document.titulo}", a resposta para sua pergunta "${question}" seria:
      
      Esta é uma resposta simulada. Em uma implementação real, a resposta seria gerada com base no conteúdo completo do documento, utilizando técnicas de processamento de linguagem natural para extrair as informações relevantes.`;
      
      // Here you would update the UI with the answer
      // For now, we'll just show an alert
      alert(answer);
      
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
    if (!hasContent()) return;
    
    try {
      setIsLoading('generate');
      
      // Simulate content generation for demonstration
      await new Promise(r => setTimeout(r, 2000));
      
      let contentTypeLabel = '';
      switch (contentType) {
        case 'video_script':
          contentTypeLabel = 'Roteiro para Vídeo';
          break;
        case 'story':
          contentTypeLabel = 'Story de Venda';
          break;
        case 'big_idea':
          contentTypeLabel = 'Big Idea';
          break;
      }
      
      toast({
        title: "Conteúdo gerado",
        description: `${contentTypeLabel} foi gerado com sucesso.`
      });
      
      // In a real app, we would route to a content editor or show the content
      alert(`Conteúdo do tipo "${contentTypeLabel}" gerado com base no documento "${document.titulo}"`);
      
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
  
  const needsContent = !document.conteudo_extraido;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {needsContent && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 mr-2" />
            <div>
              <p className="font-medium">Conteúdo não extraído</p>
              <p className="text-sm">Este documento não tem conteúdo extraído. Por favor, clique em "Extrair Conteúdo" no cabeçalho do documento.</p>
            </div>
          </Alert>
        )}
        
        {/* Translate Section */}
        <div>
          <h3 className="font-medium mb-2 flex items-center">
            <Languages className="h-4 w-4 mr-2" /> Traduzir
          </h3>
          <div className="space-y-2">
            <Select
              value={targetLanguage}
              onValueChange={setTargetLanguage}
              disabled={isLoading === 'translate' || needsContent}
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
              disabled={isLoading === 'translate' || document.idiomas_traduzidos?.includes(targetLanguage) || needsContent}
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
              disabled={isLoading === 'summarize' || needsContent}
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
              disabled={isLoading === 'ask' || needsContent}
            />
            <Button 
              className="w-full"
              variant="outline"
              onClick={handleAskQuestion}
              disabled={isLoading === 'ask' || !question.trim() || needsContent}
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
              disabled={isLoading === 'generate' || needsContent}
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
              disabled={isLoading === 'generate' || needsContent}
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
