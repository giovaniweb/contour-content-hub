import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import ChatInput from "./components/ChatInput";
import WelcomeSuggestions from "./components/WelcomeSuggestions";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIStats {
  equipamentosUsados: number;
  artigosConsultados: number;
}

const genieNames = ["Jasmin AI", "Akinario Quantum", "Mirabella Neural", "O Gênio Científico", "Aura Tech"];

const AkinatorInteligente: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(() => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `👋 **Olá! Sou o ChatFDA**, sua IA especializada em estética.

🎯 **Posso ajudar você com:**
• **Roteiros** para Instagram e redes sociais
• **Protocolos** e técnicas avançadas
• **Equipamentos** - qual escolher e como usar
• **Vídeos** específicos da nossa base
• **Artigos científicos** e estudos

**Como posso te ajudar hoje?** ✨`,
      timestamp: new Date()
    };
    return [welcomeMessage];
  });
  const [isThinking, setIsThinking] = useState(false);
  const [aiMode, setAiModeState] = useState<'standard' | 'gpt5'>(() => 
    (typeof window !== 'undefined' && localStorage.getItem('aiMode') === 'gpt5') ? 'gpt5' : 'standard'
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const setAiMode = (mode: 'standard' | 'gpt5') => {
    setAiModeState(mode);
    try { localStorage.setItem('aiMode', mode); } catch {}
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isThinking) return;

    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsThinking(true);

    try {
      console.log('🤖 [ChatFDA] Enviando mensagem para IA...');
      
      // Usar o ChatFDA em vez do sistema antigo
      const { data, error } = await supabase.functions.invoke('mega-cerebro-ai', {
        body: {
          messages: [...messages, newUserMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userProfile: {
            id: user?.id,
            authenticated: !!user,
            preferences: JSON.parse(localStorage.getItem('userPreferences') || '{}')
          },
          user_id: user?.id,
          modelTier: (typeof window !== 'undefined' && localStorage.getItem('aiMode') === 'gpt5') ? 'gpt5' : 'standard'
        }
      });

      if (error) {
        throw error;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (data.intent) {
        console.log(`🎯 Intenção detectada: ${data.intent} (${(data.confidence * 100).toFixed(0)}% confiança)`);
      }

    } catch (error) {
      console.error('❌ Erro na consulta com IA:', error);
      toast({
        title: "Erro Místico",
        description: "O gênio teve dificuldades para se conectar com o plano astral. Tente novamente.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        role: 'assistant',
        content: `😔 **Perdão, buscador...** Houve uma interferência nas energias místicas. Por favor, reformule sua pergunta ou tente novamente em alguns instantes.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const resetSession = () => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `👋 **Olá! Sou o ChatFDA**, sua IA especializada em estética.

🎯 **Posso ajudar você com:**
• **Roteiros** para Instagram e redes sociais
• **Protocolos** e técnicas avançadas
• **Equipamentos** - qual escolher e como usar
• **Vídeos** específicos da nossa base
• **Artigos científicos** e estudos

**Como posso te ajudar hoje?** ✨`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4">
          {messages.map((message, index) => (
            <div key={index} className="py-4 border-b border-border/10">
              <MessageBubble message={message} />
            </div>
          ))}
          
          {isThinking && (
            <div className="py-4 border-b border-border/10">
              <TypingIndicator />
            </div>
          )}
          
          {/* Sugestões - apenas na primeira mensagem */}
          {messages.length === 1 && !isThinking && (
            <div className="py-8">
              <WelcomeSuggestions onSuggestionClick={sendMessage} />
            </div>
          )}
        </div>
      </div>

      {/* Input fixo no bottom */}
      <div className="flex-shrink-0 border-t border-border/20 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <ChatInput
            onSendMessage={sendMessage}
            onReset={resetSession}
            disabled={isThinking}
            aiMode={aiMode}
            onModeChange={setAiMode}
          />
        </div>
      </div>
    </div>
  );
};

export default AkinatorInteligente;