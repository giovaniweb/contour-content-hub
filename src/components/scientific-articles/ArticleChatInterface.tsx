import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, Brain, Lightbulb, FileText, Search, BookOpen, TrendingUp, HelpCircle } from 'lucide-react';
import { UnifiedDocument } from '@/types/document';
import { supabase } from '@/integrations/supabase/client';

interface ArticleChatInterfaceProps {
  article: UnifiedDocument;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: string;
}

interface ChatIntention {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  questions: string[];
  category: 'analysis' | 'summary' | 'methodology' | 'results';
}

const ArticleChatInterface: React.FC<ArticleChatInterfaceProps> = ({ article }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntentions, setShowIntentions] = useState(true);
  const [articleContent, setArticleContent] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carregar conteúdo do PDF
  useEffect(() => {
    const loadArticleContent = async () => {
      if (article.file_path) {
        try {
          const response = await fetch(article.file_path);
          const text = await response.text();
          setArticleContent(text);
        } catch (error) {
          console.error('Erro ao carregar PDF:', error);
          setArticleContent(article.raw_text || article.texto_completo || '');
        }
      } else {
        setArticleContent(article.raw_text || article.texto_completo || '');
      }
    };

    loadArticleContent();
  }, [article]);

  // Inicializar chat com mensagem de boas-vindas
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'bot',
        content: `👋 **Olá! Sou sua IA especialista em análise científica.**

Estou aqui para ajudar você com o artigo **"${article.titulo_extraido || 'documento'}"**.

✨ **O que posso fazer por você:**
• Fazer resumos e análises
• Explicar conceitos complexos  
• Discutir metodologias
• Responder perguntas específicas`,
        timestamp: new Date(),
        quickActions: [
          { id: 'resume', label: 'Resumir artigo', icon: <FileText className="h-3 w-3" />, action: 'Faça um resumo executivo deste artigo' },
          { id: 'concepts', label: 'Conceitos principais', icon: <Brain className="h-3 w-3" />, action: 'Quais são os principais conceitos abordados?' },
          { id: 'methodology', label: 'Metodologia', icon: <Search className="h-3 w-3" />, action: 'Explique a metodologia utilizada' }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [article, messages.length]);

  const chatIntentions: ChatIntention[] = [
    {
      id: 'summary',
      title: 'Resumo & Análise',
      description: 'Obtenha resumos e análises gerais',
      icon: <FileText className="h-4 w-4" />,
      category: 'summary',
      questions: [
        'Faça um resumo executivo deste artigo',
        'Quais são os pontos principais?',
        'Qual é a contribuição científica deste trabalho?'
      ]
    },
    {
      id: 'concepts',
      title: 'Conceitos & Definições', 
      description: 'Explore conceitos e terminologias',
      icon: <Brain className="h-4 w-4" />,
      category: 'analysis',
      questions: [
        'Quais são os principais conceitos abordados?',
        'Defina os termos técnicos mencionados',
        'Como esses conceitos se relacionam?'
      ]
    },
    {
      id: 'methodology',
      title: 'Metodologia',
      description: 'Entenda métodos e procedimentos',
      icon: <Search className="h-4 w-4" />,
      category: 'methodology', 
      questions: [
        'Explique a metodologia utilizada',
        'Quais foram os critérios de seleção?',
        'Como os dados foram coletados?'
      ]
    },
    {
      id: 'results',
      title: 'Resultados & Conclusões',
      description: 'Analise resultados e implicações',
      icon: <TrendingUp className="h-4 w-4" />,
      category: 'results',
      questions: [
        'Quais foram os principais resultados?',
        'Quais são as conclusões do estudo?',
        'Quais as implicações práticas?'
      ]
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    try {
      setIsLoading(true);
      setShowIntentions(false);
      
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: messageToSend,
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      if (!customMessage) setInputMessage('');

      // Usar supabase client para chamar edge function
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          messages: [
            {
              role: 'system',
              content: `Você é um assistente especialista em análise científica. Seja conciso, objetivo e útil. Use formatação markdown para destacar informações importantes.

IMPORTANTE: Responda de forma estruturada e concisa (máximo 300 palavras por resposta). Se for um resumo, foque nos pontos principais. Se for uma pergunta específica, seja direto.

Documento para análise:
Título: ${article.titulo_extraido}
Tipo: ${article.tipo_documento}
Conteúdo: ${articleContent || 'Analisando documento...'}`
            },
            ...updatedMessages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content.replace(/\*\*/g, '').replace(/^👋.*$/gm, '').trim()
            }))
          ]
        }
      });

      if (error) throw error;
      
      if (data?.content) {
        // Gerar quick actions baseadas na resposta
        const quickActions = generateQuickActions(messageToSend);
        
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: data.content,
          timestamp: new Date(),
          quickActions
        };
        
        setMessages([...updatedMessages, botResponse]);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '⚠️ **Erro temporário.** Tente novamente em alguns segundos.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuickActions = (userQuestion: string): QuickAction[] => {
    const question = userQuestion.toLowerCase();
    
    if (question.includes('resumo')) {
      return [
        { id: 'details', label: 'Mais detalhes', icon: <Search className="h-3 w-3" />, action: 'Pode detalhar melhor os pontos principais?' },
        { id: 'methodology', label: 'Metodologia', icon: <Brain className="h-3 w-3" />, action: 'Como foi a metodologia utilizada?' }
      ];
    }
    
    if (question.includes('conceito') || question.includes('definição')) {
      return [
        { id: 'examples', label: 'Exemplos práticos', icon: <Lightbulb className="h-3 w-3" />, action: 'Pode dar exemplos práticos?' },
        { id: 'applications', label: 'Aplicações', icon: <TrendingUp className="h-3 w-3" />, action: 'Quais são as aplicações práticas?' }
      ];
    }
    
    return [
      { id: 'elaborate', label: 'Explicar melhor', icon: <HelpCircle className="h-3 w-3" />, action: 'Pode explicar de forma mais simples?' },
      { id: 'related', label: 'Tópicos relacionados', icon: <BookOpen className="h-3 w-3" />, action: 'Quais outros tópicos estão relacionados?' }
    ];
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleIntentionSelect = (intention: ChatIntention) => {
    setShowIntentions(false);
    const firstQuestion = intention.questions[0];
    handleSendMessage(firstQuestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              <div className={`space-y-3 ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-neon-blue/20 border border-aurora-electric-purple/30'
                    : 'bg-gradient-to-br from-aurora-cyan/20 to-aurora-emerald/20 border border-aurora-cyan/30'
                } backdrop-blur-lg`}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div 
                      className="text-white text-sm leading-relaxed mb-0 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-aurora-cyan">$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/•/g, '◦')
                          .replace(/(\d+\.)/g, '<span class="text-aurora-electric-purple font-semibold">$1</span>')
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                {/* Quick Actions */}
                {message.type === 'bot' && message.quickActions && message.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-2">
                    {message.quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.action)}
                        className="text-xs border-aurora-cyan/30 text-aurora-cyan hover:bg-aurora-cyan/10 aurora-animate-scale"
                        disabled={isLoading}
                      >
                        {action.icon}
                        <span className="ml-1">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                )}
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

      {/* Chat Intentions */}
      {showIntentions && messages.length === 1 && (
        <div className="px-4 py-4 border-t border-aurora-electric-purple/10 bg-gradient-to-r from-aurora-electric-purple/5 to-aurora-cyan/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-aurora-cyan" />
            <span className="text-sm font-medium text-aurora-cyan">Como posso ajudar você hoje?</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {chatIntentions.map((intention) => (
              <Card
                key={intention.id}
                className="cursor-pointer aurora-glass-enhanced border-aurora-electric-purple/20 hover:border-aurora-cyan/40 transition-all duration-300 aurora-animate-scale group"
                onClick={() => handleIntentionSelect(intention)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aurora-electric-purple/20 to-aurora-cyan/20 flex items-center justify-center group-hover:from-aurora-electric-purple/30 group-hover:to-aurora-cyan/30 transition-colors">
                      {intention.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{intention.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{intention.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            onClick={() => handleSendMessage()}
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