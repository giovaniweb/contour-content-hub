
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface DocumentQuestionsProps {
  document: TechnicalDocument;
}

const DocumentQuestions: React.FC<DocumentQuestionsProps> = ({ document }) => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [questionHistory, setQuestionHistory] = useState<Array<{question: string, answer: string}>>([]);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast("Pergunta vazia", {
        description: "Por favor, digite uma pergunta para continuar."
      });
      return;
    }

    if (!document.id) {
      toast("Erro", {
        description: "ID do documento não disponível."
      });
      return;
    }

    setLoading(true);
    setAnswer(null);
    
    try {
      // In a production environment, this would call the edge function
      const { data, error } = await supabase.functions.invoke('ask-document', {
        body: {
          documentId: document.id,
          question: question.trim()
        }
      });
      
      if (error) throw error;
      
      // Set answer and add to history
      const responseText = data?.answer || "Não foi possível processar sua pergunta.";
      setAnswer(responseText);
      
      // Add to history
      setQuestionHistory(prev => [
        { question: question.trim(), answer: responseText },
        ...prev
      ]);
      
      // Clear question input
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
      toast("Erro", {
        description: "Não foi possível processar sua pergunta."
      });
      
      // Set a fallback answer
      setAnswer("Para uma demonstração, estamos gerando uma resposta simulada. Em um ambiente de produção, esta pergunta seria processada por uma IA treinada com o conteúdo do documento.");
    } finally {
      setLoading(false);
    }
  };
  
  if (!document.conteudo_extraido) {
    return (
      <div className="p-6 text-center">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Perguntas sobre o documento</h3>
        <p className="text-muted-foreground mb-6">
          O conteúdo do documento precisa ser extraído antes que você possa fazer perguntas.
        </p>
        <Button 
          onClick={() => {
            toast("Extraia o conteúdo primeiro", {
              description: "Clique em 'Extrair Conteúdo' na guia Conteúdo."
            });
          }}
        >
          Extrair conteúdo
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Faça uma pergunta sobre este documento..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleAskQuestion} 
          disabled={loading || !question.trim()}
          className="self-end"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Perguntar'
          )}
        </Button>
      </div>
      
      {answer && (
        <Card>
          <CardContent className="pt-4">
            <h4 className="font-medium mb-2">Resposta:</h4>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
      
      {questionHistory.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Histórico de perguntas</h4>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {questionHistory.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <p className="font-medium text-sm">Pergunta:</p>
                    <p className="mb-2">{item.question}</p>
                    <p className="font-medium text-sm">Resposta:</p>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{item.answer}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default DocumentQuestions;
