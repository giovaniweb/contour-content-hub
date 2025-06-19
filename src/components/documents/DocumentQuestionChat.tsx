
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Loader2 } from 'lucide-react';
import { TechnicalDocument } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

interface DocumentQuestionChatProps {
  document: TechnicalDocument;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentQuestionChat: React.FC<DocumentQuestionChatProps> = ({ 
  document, 
  isOpen, 
  onClose 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentQuestion.trim() || isLoading) return;

    setIsLoading(true);
    const question = currentQuestion.trim();
    setCurrentQuestion('');

    try {
      const { data, error } = await supabase.functions.invoke('pdf-question-answer', {
        body: {
          documentId: document.id,
          question: question
        }
      });

      if (error) throw error;

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        question: question,
        answer: data.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua pergunta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "Qual é o objetivo principal deste estudo?",
    "Quais são os principais resultados encontrados?",
    "Qual foi a metodologia utilizada?",
    "Quais são as conclusões do estudo?",
    "Quais são as limitações mencionadas?"
  ];

  if (!isOpen) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Perguntas sobre: {document.titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-96 border rounded-lg p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">Faça uma pergunta sobre este documento</p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Sugestões:</p>
                {suggestedQuestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs mx-1"
                    onClick={() => setCurrentQuestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-900">Pergunta:</p>
                    <p className="text-blue-800">{message.question}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-900">Resposta:</p>
                    <p className="text-gray-800 whitespace-pre-wrap">{message.answer}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSubmitQuestion} className="flex gap-2">
          <Input
            placeholder="Digite sua pergunta sobre o documento..."
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !currentQuestion.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentQuestionChat;
