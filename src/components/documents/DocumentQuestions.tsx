
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Loader2, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface DocumentQuestionsProps {
  document: TechnicalDocument;
}

const DocumentQuestions: React.FC<DocumentQuestionsProps> = ({ document }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { 
      role: 'assistant', 
      content: 'Olá! Eu sou um assistente especializado neste documento. Como posso ajudar você a entender melhor o conteúdo?' 
    }
  ]);

  const handleSubmitQuestion = async () => {
    if (!question.trim() || !document.conteudo_extraido) return;

    // Add user question to messages
    const userQuestion = question;
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setQuestion('');
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API endpoint to process the question
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: `Baseado no documento "${document.titulo}", posso informar que esta é uma resposta simulada. Em uma implementação real, eu processaria sua pergunta utilizando o conteúdo completo do documento e forneceria uma resposta precisa.
          
O documento trata sobre ${document.descricao || 'um tópico especializado'} e contém informações relevantes sobre esse assunto.`
        }
      ]);
      
      toast("Pergunta processada", {
        description: "Sua pergunta foi respondida com base no conteúdo do documento."
      });
    } catch (error) {
      console.error("Error processing question:", error);
      toast("Erro", {
        description: "Não foi possível processar sua pergunta. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion();
    }
  };

  // Handle case when document has no content
  if (!document.conteudo_extraido) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Este documento não tem conteúdo extraído. Por favor, clique em "Extrair Conteúdo" no topo da página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] min-h-[500px]">
      <ScrollArea className="flex-1 pr-4 mb-4">
        <div className="space-y-4 pb-4">
          {messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                {msg.content.split('\n').map((text, i) => (
                  <React.Fragment key={i}>
                    {text}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-muted flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processando sua pergunta...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex gap-2 items-end">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Faça uma pergunta sobre este documento..."
          className="resize-none"
          rows={3}
        />
        <Button 
          onClick={handleSubmitQuestion} 
          disabled={!question.trim() || isLoading}
          size="icon"
          className="h-10 w-10"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DocumentQuestions;
