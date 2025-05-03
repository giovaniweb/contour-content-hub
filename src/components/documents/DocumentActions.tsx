
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DocumentActionsProps {
  document: TechnicalDocument;
  onDocumentUpdate: (document: TechnicalDocument) => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({ document, onDocumentUpdate }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('pt');
  const [question, setQuestion] = useState('');
  const [contentType, setContentType] = useState<'video_script' | 'story' | 'big_idea'>('video_script');
  const [resultContent, setResultContent] = useState<string | null>(null);
  const [resultTitle, setResultTitle] = useState<string>('');
  const [resultModalOpen, setResultModalOpen] = useState(false);
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
      
      // Simulated translation for demonstration (normally would call backend API)
      await new Promise(r => setTimeout(r, 1500));
      
      setResultTitle(`Tradução para ${getLanguageLabel(targetLanguage)}`);
      
      const translatedContent = `# ${document.titulo} (${getLanguageLabel(targetLanguage)})

## Resumo
Este é um conteúdo traduzido simulado para ${getLanguageLabel(targetLanguage)}.
      
O documento original está em ${getLanguageLabel(document.idioma_original)}.

Em uma implementação real, o texto seria traduzido usando uma API de tradução.

## Conteúdo traduzido
${document.conteudo_extraido?.substring(0, 200)}...

Esta é apenas uma simulação da tradução. Em uma implementação real, todo o conteúdo seria traduzido para ${getLanguageLabel(targetLanguage)}.`;
      
      setResultContent(translatedContent);
      setResultModalOpen(true);
      
      // Update the document with new translation (normally would update in DB)
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
      
      // Simulate API call delay
      await new Promise(r => setTimeout(r, 1500));
      
      // Create mock response for the summary
      const summary = `# Resumo do documento "${document.titulo}"
      
## Principais pontos abordados:
- Análise de resultados científicos
- Metodologia aplicada no estudo
- Conclusões relevantes para a área

## Resumo executivo
${document.descricao || 'Este documento não possui uma descrição.'}

Em uma implementação real, este resumo seria gerado analisando o conteúdo completo do documento.`;
      
      setResultTitle("Resumo do Documento");
      setResultContent(summary);
      setResultModalOpen(true);
      
      toast({
        title: "Resumo gerado",
        description: "O resumo do documento foi gerado com sucesso.",
      });
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
      
      // Simulate a response delay
      await new Promise(r => setTimeout(r, 1500));
      
      const answer = `# Resposta à pergunta:
      
## Pergunta: "${question}"

Baseado no documento "${document.titulo}", a resposta seria:

Esta é uma resposta simulada. Em uma implementação real, a resposta seria gerada com base no conteúdo completo do documento, utilizando técnicas de processamento de linguagem natural para extrair as informações relevantes.

O documento contém informações sobre ${document.descricao?.substring(0, 100) || 'o assunto principal'}.

## Informações relacionadas:
- Este documento está classificado como ${getDocumentTypeLabel(document.tipo)}
- Foi escrito em ${getLanguageLabel(document.idioma_original)}
${document.keywords?.length ? `- Palavras-chave: ${document.keywords.join(', ')}` : ''}`;
      
      setResultTitle("Resposta à Pergunta");
      setResultContent(answer);
      setResultModalOpen(true);
      
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
      
      // Simulate content generation delay
      await new Promise(r => setTimeout(r, 2000));
      
      let contentTypeLabel = '';
      let generatedContent = '';
      
      switch (contentType) {
        case 'video_script':
          contentTypeLabel = 'Roteiro para Vídeo';
          generatedContent = `# Roteiro para Vídeo: "${document.titulo}"

## Introdução (0:00 - 0:30)
"Olá pessoal! Hoje vamos falar sobre um tema muito interessante: ${document.titulo}."
"Este conteúdo foi baseado em um documento técnico, mas vamos explicar de forma simples."

## Desenvolvimento (0:30 - 2:00)
"Os principais pontos que precisamos entender são:"
- Ponto 1: Explicação básica do conceito
- Ponto 2: Aplicações práticas
- Ponto 3: Impactos e resultados

## Conclusão (2:00 - 2:30)
"Para finalizar, lembre-se que este tema é fundamental para..."
"Se você gostou deste conteúdo, deixe seu like e compartilhe!"
`;
          break;
        case 'story':
          contentTypeLabel = 'Story de Venda';
          generatedContent = `# Story para Instagram: "${document.titulo}"

## Slide 1
🔍 NOVO CONTEÚDO DISPONÍVEL!
Você já conhece sobre ${document.titulo}?

## Slide 2
🧠 Este material técnico explica como...
${document.descricao?.substring(0, 100) || 'Tópico especializado explicado de forma simples'}

## Slide 3
💡 BENEFÍCIOS:
- Entenda conceitos complexos facilmente
- Aplique técnicas avançadas
- Melhore seus resultados

## Slide 4
👉 ACESSE AGORA!
Link na bio
`;
          break;
        case 'big_idea':
          contentTypeLabel = 'Big Idea';
          generatedContent = `# Big Idea: "${document.titulo}"

## Conceito Principal
A grande ideia por trás de "${document.titulo}" é transformar o entendimento sobre...

## Por que isso importa?
Este conceito revoluciona a maneira como enxergamos...

## Aplicação Prática
Você pode implementar estes conceitos através de...

## Próximos Passos
1. Entenda os fundamentos apresentados
2. Aplique em um projeto piloto
3. Mensure resultados e adapte

## Conclusão
Esta abordagem representa uma oportunidade única de...
`;
          break;
      }
      
      setResultTitle(contentTypeLabel);
      setResultContent(generatedContent);
      setResultModalOpen(true);
      
      toast({
        title: "Conteúdo gerado",
        description: `${contentTypeLabel} foi gerado com sucesso.`
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
  
  const getDocumentTypeLabel = (type: string) => {
    switch(type) {
      case 'artigo_cientifico': return 'Artigo Científico';
      case 'ficha_tecnica': return 'Ficha Técnica';
      case 'protocolo': return 'Protocolo';
      default: return 'Outro';
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
    <>
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
      
      {/* Result Modal */}
      <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{resultTitle}</DialogTitle>
          </DialogHeader>
          <div className="markdown-content prose prose-sm max-w-none dark:prose-invert">
            {resultContent && (
              <div className="whitespace-pre-line">
                {resultContent.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentActions;
