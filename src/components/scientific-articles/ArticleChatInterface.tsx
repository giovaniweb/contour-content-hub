import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, Brain, Lightbulb } from 'lucide-react';
import { UnifiedDocument } from '@/types/document';

interface ArticleChatInterfaceProps {
  article: UnifiedDocument;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ArticleChatInterface: React.FC<ArticleChatInterfaceProps> = ({ article }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: `Olá! 👋 Sou seu assistente especialista em análise científica. Estou aqui para ajudar você a explorar e compreender o artigo "${article.titulo_extraido || 'documento'}". 

Posso explicar conceitos, discutir metodologias, analisar resultados ou responder qualquer pergunta sobre o conteúdo. Como posso ajudar?`,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: inputMessage.trim(),
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      setInputMessage('');

      // Chamar a edge function chat-assistant
      const response = await fetch(`https://mksvzhgqnsjfolvskibq.supabase.co/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rc3Z6aGdxbnNqZm9sdnNraWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjg3NTgsImV4cCI6MjA2MTcwNDc1OH0.ERpPooxjvC4BthjXKus6s1xqE7FAE_cjZbEciS_VD4Q`
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Você é um assistente especialista em análise científica. Analise este documento: 
                       Título: ${article.titulo_extraido}
                       Tipo: ${article.tipo_documento}
                       Conteúdo: ${article.texto_completo || 'Conteúdo não disponível'}`
            },
            ...updatedMessages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            }))
          ]
        })
      });

      const data = await response.json();
      
      if (data.content) {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.content,
          timestamp: new Date()
        };
        
        setMessages([...updatedMessages, botResponse]);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
      
      setIsLoading(false);
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Fallback para resposta de erro
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Desculpe, houve um erro ao processar sua pergunta. Por favor, tente novamente.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Qual é o resumo deste artigo?",
    "Quem são os autores?",
    "Quais as principais conclusões?",
    "Explique a metodologia utilizada",
  ];

  return (
    <div className="h-full flex flex-col aurora-glass-enhanced border-aurora-electric-purple/30 rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-aurora-electric-purple/20 bg-gradient-to-r from-aurora-electric-purple/10 to-aurora-cyan/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-aurora-electric-purple to-aurora-cyan flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h3 className="aurora-text-gradient-enhanced font-semibold">Assistente IA Científico</h3>
            <p className="text-xs text-slate-400">Especialista em análise de documentos</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 aurora-scrollbar">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 aurora-animate-fade-in ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
          }`}>
            <div className={`flex gap-3 max-w-[85%] ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-aurora-electric-purple to-aurora-neon-blue' 
                  : 'bg-gradient-to-br from-aurora-cyan to-aurora-emerald'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-neon-blue/20 border border-aurora-electric-purple/30'
                  : 'bg-gradient-to-br from-aurora-cyan/20 to-aurora-emerald/20 border border-aurora-cyan/30'
              } backdrop-blur-lg`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-white text-sm leading-relaxed mb-0 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex gap-3 justify-start aurora-animate-fade-in">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-emerald flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gradient-to-br from-aurora-cyan/20 to-aurora-emerald/20 border border-aurora-cyan/30 rounded-2xl p-4 backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-aurora-cyan rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-aurora-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-aurora-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-sm text-aurora-cyan">Analisando documento...</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-aurora-electric-purple/10">
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            Sugestões para começar:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(question)}
                className="text-xs border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/10 aurora-animate-scale"
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-aurora-electric-purple/20 bg-gradient-to-r from-aurora-electric-purple/5 to-aurora-cyan/5">
        <div className="flex gap-3">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Faça uma pergunta sobre o documento..."
            className="flex-1 aurora-input border-aurora-electric-purple/30 focus:border-aurora-cyan bg-slate-800/50 backdrop-blur-sm"
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="aurora-button-enhanced bg-gradient-to-r from-aurora-electric-purple to-aurora-cyan hover:from-aurora-electric-purple/80 hover:to-aurora-cyan/80 aurora-animate-scale"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Pressione Enter para enviar • Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
};

export default ArticleChatInterface;