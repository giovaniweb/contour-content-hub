
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, ArrowRight } from "lucide-react";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou seu consultor de marketing especializado em clínicas de estética. Estou aqui para ajudar você a crescer seu negócio com estratégias personalizadas. Podemos começar uma análise completa ou você pode me perguntar algo específico sobre marketing para sua clínica.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Simulate AI thinking
    setTimeout(() => {
      let response = '';
      
      if (userMessage.toLowerCase().includes('diagnóstico') || 
          userMessage.toLowerCase().includes('começar') || 
          userMessage.toLowerCase().includes('analise') ||
          userMessage.toLowerCase().includes('análise')) {
        response = 'Vamos começar uma análise completa da sua clínica. Farei algumas perguntas para entender melhor seu negócio e criar uma estratégia personalizada.';
        
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setLoading(false);
        
        // After a short delay, start the consultation flow
        setTimeout(() => {
          onStartConsultation();
        }, 1500);
        
        return;
      }
      
      // Default responses based on common questions
      if (userMessage.toLowerCase().includes('instagram')) {
        response = 'O Instagram é uma plataforma essencial para clínicas estéticas. Recomendo uma estratégia com fotos de antes/depois, depoimentos em vídeo e conteúdos educativos sobre procedimentos. Posso ajudar com um plano detalhado para Instagram se iniciarmos um diagnóstico completo.';
      } else if (userMessage.toLowerCase().includes('facebook') || userMessage.toLowerCase().includes('meta')) {
        response = 'O Facebook Ads continua sendo uma ferramenta poderosa para clínicas de estética, especialmente para alcançar um público mais maduro. Anúncios bem segmentados podem trazer leads qualificados para procedimentos específicos. Posso elaborar uma estratégia completa para você.';
      } else if (userMessage.toLowerCase().includes('google') || userMessage.toLowerCase().includes('ads')) {
        response = 'Anúncios no Google são ideais para capturar pessoas que já estão procurando por serviços estéticos. Para clínicas, recomendo campanhas de search focadas em procedimentos específicos e remarketing para quem visitou seu site. Quer iniciar um diagnóstico para uma estratégia detalhada?';
      } else {
        response = 'Entendi sua questão. Para criar uma estratégia realmente eficaz para sua clínica, precisamos realizar um diagnóstico completo. Posso te guiar por esse processo agora mesmo. Está pronto para começar?';
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Consultor de Marketing
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
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
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
          <Button onClick={onStartConsultation} variant="outline">
            Iniciar Diagnóstico
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MarketingConsultantChat;
