
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  FileText, 
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { UnifiedDocument } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ArticleChatInterfaceProps {
  document: UnifiedDocument;
}

const ArticleChatInterface: React.FC<ArticleChatInterfaceProps> = ({ document }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Suggested questions based on document content
  const suggestedQuestions = [
    "Qual é o principal objetivo deste artigo?",
    "Quais são as principais conclusões?",
    "Que metodologia foi utilizada?",
    "Quais são as limitações do estudo?",
    "Como posso aplicar isso na prática clínica?"
  ];

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'assistant',
      content: `Olá! Sou a IA da Fluida Científica. Posso ajudar você a entender melhor o artigo "${document.titulo_extraido || 'este documento'}". Faça suas perguntas sobre o conteúdo, metodologia, resultados ou aplicações práticas.`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [document]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response for now
      // In a real implementation, this would call your chat API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Esta é uma resposta simulada sobre "${inputValue}". Em uma implementação real, a IA analisaria o conteúdo do documento "${document.titulo_extraido}" e forneceria uma resposta contextualizada baseada no texto completo e nos dados extraídos.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Erro no Chat",
        description: "Não foi possível processar sua pergunta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-600 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 aurora-glow rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-cyan-400" />
              Fluida Científica
            </h3>
            <p className="text-sm text-slate-400">Chat inteligente sobre o documento</p>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="flex-shrink-0 p-4 border-b border-slate-600/50">
          <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-400" />
            Perguntas sugeridas:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-cyan-500/20 hover:border-cyan-400/50 text-xs px-2 py-1 border-slate-500 text-slate-300 hover:text-cyan-300 transition-colors"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'assistant' && (
                <div className="w-8 h-8 aurora-glow rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-cyan-400" />
                </div>
              )}
              
              <Card className={`max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-cyan-600/20 border-cyan-500/30' 
                  : 'aurora-glass border-slate-600/50'
              }`}>
                <CardContent className="p-3">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {message.content}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </CardContent>
              </Card>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                  <User className="h-4 w-4 text-blue-400" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 aurora-glow rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-cyan-400" />
              </div>
              <Card className="aurora-glass border-slate-600/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-slate-400">Analisando...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-slate-600">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Faça uma pergunta sobre o documento..."
            className="aurora-glass border-slate-600 text-white placeholder:text-slate-400 flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleChatInterface;
