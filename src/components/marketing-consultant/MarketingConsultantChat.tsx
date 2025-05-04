
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MarketingConsultantChatProps {
  onStartConsultation: () => void;
}

const MarketingConsultantChat: React.FC<MarketingConsultantChatProps> = ({ 
  onStartConsultation 
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou seu consultor de marketing especializado em clínicas de estética. Estou aqui para ajudar você a crescer seu negócio com estratégias personalizadas. Podemos começar uma análise completa ou você pode me perguntar algo específico sobre marketing para sua clínica.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if there's saved diagnostic data
  const hasSavedData = localStorage.getItem('marketing_diagnostic_data') !== null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Add welcome message about saved diagnostic when component mounts
  useEffect(() => {
    if (hasSavedData) {
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Vejo que você já fez um diagnóstico anteriormente. Você pode continuar de onde parou ou iniciar um novo diagnóstico.' 
        }]);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [hasSavedData]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Hide suggestions after user sends a message
    setShowSuggestions(false);
    
    // Simulate AI thinking
    setTimeout(() => {
      let response = '';
      
      // Incluímos referências ao Fluida Te Entende
      if (userMessage.toLowerCase().includes('fluida te entende') || 
          userMessage.toLowerCase().includes('sugestões personalizadas') ||
          userMessage.toLowerCase().includes('consultor preditivo')) {
        response = 'O "Fluida Te Entende" é nosso consultor preditivo inteligente que analisa seus padrões de uso e interesses para oferecer sugestões personalizadas. Ele monitora quais equipamentos você consulta, vídeos que assiste, e integra isso com suas metas de marketing. Você pode encontrar sugestões personalizadas no seu Dashboard.';
        
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setLoading(false);
        return;
      }
      
      if (userMessage.toLowerCase().includes('diagnóstico') || 
          userMessage.toLowerCase().includes('começar') || 
          userMessage.toLowerCase().includes('analise') ||
          userMessage.toLowerCase().includes('análise') ||
          userMessage.toLowerCase().includes('pronto') ||
          userMessage.toLowerCase().includes('sim')) {
        response = 'Vamos começar uma análise completa da sua clínica. Farei algumas perguntas para entender melhor seu negócio e criar uma estratégia personalizada.';
        
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setLoading(false);
        
        // Inicia o diagnóstico após breve espera
        setTimeout(() => {
          toast({
            title: "Iniciando diagnóstico",
            description: "Preparando formulário de diagnóstico para sua clínica..."
          });
          // Chamamos diretamente a função onStartConsultation que vai mudar o estado em MarketingConsultant
          onStartConsultation();
        }, 1000);
        
        return;
      }
      
      if (userMessage.toLowerCase().includes('continuar') || 
          userMessage.toLowerCase().includes('anterior') || 
          userMessage.toLowerCase().includes('salvo') ||
          userMessage.toLowerCase().includes('volta')) {
          
        if (hasSavedData) {
          response = 'Perfeito! Você pode continuar de onde parou. Vamos para a simulação de lucro com base no seu diagnóstico anterior.';
          
          setMessages(prev => [...prev, { role: 'assistant', content: response }]);
          setLoading(false);
          
          // Direciona para a simulação de lucro após breve espera
          setTimeout(() => {
            toast({
              title: "Recuperando dados anteriores",
              description: "Carregando seu diagnóstico salvo..."
            });
            // Aqui precisaríamos de uma função para ir direto para a etapa de lucro
            // Como não temos acesso direto, vamos sugerir que o usuário clique na etapa
            toast({
              title: "Navegue pelas etapas",
              description: "Você pode clicar em qualquer etapa no menu lateral para navegar"
            });
          }, 1000);
          
          return;
        }
      }
      
      // Default responses based on common questions
      if (userMessage.toLowerCase().includes('instagram')) {
        response = 'O Instagram é uma plataforma essencial para clínicas estéticas. Recomendo uma estratégia com fotos de antes/depois, depoimentos em vídeo e conteúdos educativos sobre procedimentos. Posso ajudar com um plano detalhado para Instagram se iniciarmos um diagnóstico completo.';
      } else if (userMessage.toLowerCase().includes('facebook') || userMessage.toLowerCase().includes('meta')) {
        response = 'O Facebook Ads continua sendo uma ferramenta poderosa para clínicas de estética, especialmente para alcançar um público mais maduro. Anúncios bem segmentados podem trazer leads qualificados para procedimentos específicos. Posso elaborar uma estratégia completa para você.';
      } else if (userMessage.toLowerCase().includes('google') || userMessage.toLowerCase().includes('ads')) {
        response = 'Anúncios no Google são ideais para capturar pessoas que já estão procurando por serviços estéticos. Para clínicas, recomendo campanhas de search focadas em procedimentos específicos e remarketing para quem visitou seu site. Quer iniciar um diagnóstico para uma estratégia detalhada?';
      } else if (hasSavedData && (userMessage.toLowerCase().includes('novo') || userMessage.toLowerCase().includes('reiniciar'))) {
        response = 'Entendi que você deseja iniciar um novo diagnóstico. Isso substituirá seus dados salvos anteriormente. Está certo disso? Podemos começar agora mesmo.';
      } else {
        response = 'Entendi sua questão. Para criar uma estratégia realmente eficaz para sua clínica, precisamos realizar um diagnóstico completo. Posso te guiar por esse processo agora mesmo. Está pronto para começar?';
        // Mostra as sugestões novamente após responder
        setShowSuggestions(true);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  const handleStartDiagnostic = () => {
    // Adicionamos uma mensagem do usuário indicando que quer iniciar
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: 'Estou pronto para iniciar o diagnóstico'
    }]);
    
    // Adicionamos uma resposta do assistente
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: 'Ótimo! Vamos começar o diagnóstico personalizado para sua clínica de estética.'
    }]);
    
    // Notificação para feedback visual
    toast({
      title: "Iniciando diagnóstico",
      description: "Preparando formulário de diagnóstico para sua clínica..."
    });
    
    // Pequeno atraso para permitir que as mensagens sejam vistas
    setTimeout(() => {
      // Chamada para iniciar a consulta
      onStartConsultation();
    }, 1000);
  };

  // Função para preencher o input com sugestões
  const handleSetSuggestion = (text: string) => {
    setInput(text);
  };

  // Respostas sugeridas para facilitar a interação
  const suggestedResponses = hasSavedData ? 
    [
      "Quero iniciar um novo diagnóstico", 
      "Continuar do diagnóstico anterior",
      "Como o Instagram pode ajudar minha clínica?",
      "O que é o Fluida Te Entende?"
    ] : [
      "Quero iniciar o diagnóstico",
      "Como o Instagram pode ajudar minha clínica?",
      "Quais estratégias para atrair mais clientes?",
      "O que é o Fluida Te Entende?"
    ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Consultor de Marketing
          {hasSavedData && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Diagnóstico salvo</span>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Sugestões de resposta */}
          {showSuggestions && !loading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
            <div className="flex flex-wrap gap-2 my-4">
              {suggestedResponses.map((suggestion, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSetSuggestion(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-3 border-t flex-col gap-2">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex w-full justify-between">
          <Button 
            onClick={handleStartDiagnostic} 
            variant="default" 
            className="w-full"
          >
            {hasSavedData ? "Iniciar Novo Diagnóstico" : "Iniciar Diagnóstico Completo"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2" 
            onClick={() => setInput('O que é o Fluida Te Entende?')}
          >
            <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
            Fluida Te Entende
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MarketingConsultantChat;
