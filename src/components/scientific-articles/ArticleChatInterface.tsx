
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, Loader2, Bot, User, Sparkles, ArrowLeft, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface ArticleChatInterfaceProps {
  documentId: string;
  documentTitle: string;
  isOpen: boolean;
  onClose?: () => void;
}

const ArticleChatInterface: React.FC<ArticleChatInterfaceProps> = ({
  documentId,
  documentTitle,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Olá! Eu sou seu assistente de IA especializado em artigos científicos. Faça perguntas sobre "${documentTitle}" e eu te ajudarei a entender melhor o conteúdo.`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, documentTitle, messages.length]);

  const suggestedQuestions = [
    "Objetivo principal",
    "Principais resultados", 
    "Metodologia utilizada",
    "Conclusões do estudo",
    "Limitações mencionadas"
  ];

  const handleSubmitQuestion = async (questionToSubmit?: string) => {
    const question = questionToSubmit || currentQuestion.trim();
    
    if (!question || isLoading) return;

    setIsLoading(true);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setCurrentQuestion('');

    try {
      const { data, error } = await supabase.functions.invoke('ask-document', {
        body: {
          documentId: documentId,
          question: question
        }
      });

      if (error) throw error;

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, content: data.answer, isLoading: false }
          : msg
      ));

    } catch (error) {
      console.error('Error asking question:', error);
      
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { 
              ...msg, 
              content: "Desculpe, não foi possível processar sua pergunta no momento. Tente novamente em alguns instantes.", 
              isLoading: false 
            }
          : msg
      ));

      toast.error("Erro ao processar pergunta", {
        description: "Não foi possível obter uma resposta. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="w-full h-[600px] aurora-glass-enhanced border-aurora-electric-purple/30 backdrop-blur-xl bg-aurora-void-black/80 flex flex-col overflow-hidden">
      {/* Header aprimorado */}
      <CardHeader className="aurora-glass-enhanced border-b border-aurora-electric-purple/20 pb-3 bg-gradient-to-r from-aurora-deep-purple/20 to-aurora-void-black/40 shrink-0">
        <CardTitle className="flex items-center gap-3">
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-aurora-electric-purple/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl aurora-glass-enhanced border border-aurora-electric-purple/30 flex items-center justify-center bg-gradient-to-br from-aurora-electric-purple/30 to-aurora-neon-blue/30 shadow-lg shadow-aurora-electric-purple/20">
              <BookOpen className="h-5 w-5 text-aurora-electric-purple" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl aurora-text-gradient-enhanced font-bold">Fluida Científica</h3>
              <p className="text-sm text-slate-400 font-normal">
                Assistente especializado em pesquisa científica
              </p>
            </div>
            <div className="flex items-center gap-1 text-aurora-neon-blue bg-aurora-neon-blue/10 px-2 py-1 rounded-lg border border-aurora-neon-blue/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium">IA</span>
            </div>
          </div>
        </CardTitle>
        
        {/* Título do documento */}
        <div className="mt-2 text-xs text-slate-400 bg-aurora-deep-purple/20 rounded-lg px-3 py-2 border border-aurora-electric-purple/20">
          <span className="font-medium">Analisando:</span> {documentTitle}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 bg-aurora-void-black/20 min-h-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl aurora-glass-enhanced border border-aurora-electric-purple/30 flex items-center justify-center bg-aurora-deep-purple/30 shadow-lg shadow-aurora-electric-purple/20 shrink-0">
                    {message.isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-aurora-electric-purple" />
                    ) : (
                      <Bot className="h-4 w-4 text-aurora-electric-purple" />
                    )}
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-4 rounded-2xl transition-all duration-300 ${
                    message.type === 'user'
                      ? 'aurora-button-enhanced bg-gradient-to-r from-aurora-electric-purple to-aurora-neon-blue text-white shadow-lg'
                      : 'aurora-glass-enhanced border border-aurora-electric-purple/20 text-slate-200 bg-aurora-deep-purple/20'
                  } ${message.isLoading ? 'shadow-lg shadow-aurora-electric-purple/20' : ''}`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-aurora-electric-purple rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-aurora-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-aurora-emerald rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-slate-400">Pensando...</span>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  )}
                  <div className="text-xs opacity-60 mt-2 text-slate-400">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-xl aurora-glass-enhanced border border-aurora-neon-blue/30 flex items-center justify-center bg-aurora-deep-purple/30 shadow-lg shadow-aurora-neon-blue/20 shrink-0">
                    <User className="h-4 w-4 text-aurora-neon-blue" />
                  </div>
                )}
              </div>
            ))}

            {/* Sugestões de perguntas em formato de tags menores */}
            {messages.length === 1 && (
              <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <p className="text-sm text-slate-400 text-center">
                  Sugestões de perguntas:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSubmitQuestion(`Qual é o ${suggestion.toLowerCase()} deste estudo?`)}
                      disabled={isLoading}
                      className="aurora-glass-enhanced border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/10 text-xs px-3 py-1 h-7 hover:border-aurora-neon-blue/40 transition-all duration-300"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 border-t border-aurora-electric-purple/20 aurora-glass-enhanced bg-aurora-deep-purple/10 shrink-0">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              placeholder="Digite sua pergunta sobre o artigo..."
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 resize-none min-h-[60px] aurora-glass-enhanced border-aurora-electric-purple/30 bg-aurora-deep-purple/20 text-slate-200"
              rows={2}
            />
            <Button
              onClick={() => handleSubmitQuestion()}
              disabled={isLoading || !currentQuestion.trim()}
              className="aurora-button-enhanced self-end h-[60px] w-12"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleChatInterface;
