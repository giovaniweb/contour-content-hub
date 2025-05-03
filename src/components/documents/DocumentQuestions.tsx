
import React, { useState } from 'react';
import { TechnicalDocument } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Send, Loader2, User, Bot } from 'lucide-react';
import { SUPABASE_BASE_URL, supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentQuestionsProps {
  document: TechnicalDocument;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const DocumentQuestions: React.FC<DocumentQuestionsProps> = ({ document }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  
  const handleSendQuestion = async () => {
    if (!question.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion('');
    setIsLoading(true);
    
    try {
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
          question: currentQuestion.trim()
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar pergunta');
      }
      
      const result = await response.json();
      
      // Add AI response to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.answer || 'Não foi possível responder a esta pergunta com base no documento.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (err: any) {
      console.error('Error asking question:', err);
      toast({
        variant: "destructive",
        title: "Erro ao processar pergunta",
        description: err.message || "Não foi possível responder à pergunta."
      });
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Desculpe, não consegui processar sua pergunta. Por favor, tente novamente.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-[500px]">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Pergunte sobre este documento</h3>
          <p className="text-muted-foreground max-w-md">
            Faça qualquer pergunta relacionada ao conteúdo deste documento e eu tentarei responder com base nas informações contidas nele.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-12' 
                    : 'bg-muted mr-12'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.role === 'user' ? 'Você' : 'Assistente'}
                  </span>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua pergunta sobre o documento..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleSendQuestion();
              }
            }}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendQuestion}
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentQuestions;
