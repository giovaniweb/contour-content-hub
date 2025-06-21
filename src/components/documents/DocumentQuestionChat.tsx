
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface DocumentQuestionChatProps {
  documentId: string;
  documentTitle: string;
}

const DocumentQuestionChat: React.FC<DocumentQuestionChatProps> = ({ 
  documentId,
  documentTitle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Clear messages if documentId changes (e.g user opens chat for a different doc)
  useEffect(() => {
    setMessages([]);
  }, [documentId]);

  const handleSubmitQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!currentQuestion.trim() || isLoading) return;

    setIsLoading(true);
    const question = currentQuestion.trim();

    // Add user's question to chat
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentQuestion(''); // Clear input after sending

    try {
      // Invoke the Supabase function `ask-document` (as per plan, or use existing `pdf-question-answer` if it's adapted)
      // Assuming `ask-document` is the new standard, or that `pdf-question-answer` is updated
      // to work with `unified_documents`.
      const { data, error } = await supabase.functions.invoke('ask-document', { // Or 'pdf-question-answer'
        body: {
          documentId: documentId, // Pass the ID of the document in unified_documents
          question: question,
          // Optionally, pass document_type if the function needs it for context
        }
      });

      if (error) throw error;

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || "Não foi possível encontrar uma resposta.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error('Error asking question:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        text: `Desculpe, ocorreu um erro ao processar sua pergunta: ${error.message || 'Tente novamente.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Erro na Pergunta",
        description: "Não foi possível processar sua pergunta. Verifique os detalhes ou tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "Qual o principal tópico deste documento?",
    "Faça um resumo em 3 frases.",
    "Quais são as palavras-chave?",
    // Add more generic suggestions or type-specific ones if documentType is available
  ];

  return (
    <Card className="w-full h-full flex flex-col shadow-xl bg-slate-800/70 border-slate-700/50 backdrop-blur-md">
      <CardHeader className="border-b border-slate-700/50 p-4">
        <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
          <MessageCircle className="h-5 w-5 text-cyan-400" />
          Perguntar sobre: <span className="truncate font-medium">{documentTitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 flex flex-col items-center justify-center h-full">
              <MessageCircle className="h-12 w-12 opacity-30 mb-4" />
              <p className="mb-4 text-slate-300">Faça uma pergunta sobre este documento.</p>
              <div className="space-y-2 w-full max-w-md">
                <p className="text-sm font-medium text-slate-400">Sugestões:</p>
                {suggestedQuestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-cyan-300 w-full text-left justify-start"
                    onClick={() => {
                        setCurrentQuestion(suggestion);
                        // Optionally auto-submit if desired: handleSubmitQuestion();
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-xl shadow ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-700 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1.5 ${message.sender === 'user' ? 'text-blue-200' : 'text-slate-400'} text-right`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
               {isLoading && (
                <div className="flex justify-start">
                     <div className="max-w-[75%] p-3 rounded-xl shadow bg-slate-700 text-slate-200 rounded-bl-none flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-cyan-400" />
                        <span className="text-sm text-slate-400">Analisando...</span>
                    </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t border-slate-700/50">
        <form onSubmit={handleSubmitQuestion} className="flex gap-2 w-full items-center">
          <Input
            placeholder="Digite sua pergunta..."
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <Button type="submit" disabled={isLoading || !currentQuestion.trim()} className="bg-cyan-500 hover:bg-cyan-600 text-white px-3">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default DocumentQuestionChat;
