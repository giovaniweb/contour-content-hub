import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useIntentProcessor } from "@/hooks/useIntentProcessor";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import ChatInput from "./components/ChatInput";
import ChatFDAWelcomeScreen from "./components/ChatFDAWelcomeScreen";
import IntentActionsPanel from "./components/IntentActionsPanel";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: {
    category: string;
    action: string;
    confidence: number;
  };
  actions?: {
    type: string;
    label: string;
    data: any;
  }[];
}

interface AIStats {
  equipamentosUsados: number;
  artigosConsultados: number;
}

const genieNames = ["Jasmin AI", "Akinario Quantum", "Mirabella Neural", "O Gênio Científico", "Aura Tech"];

const AkinatorInteligente: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { processIntent } = useIntentProcessor();
  const [messages, setMessages] = useState<Message[]>(() => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `👋 Olá! Sou o ChatFDA. Como posso te ajudar hoje? ✨`,
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
      
      // 1. DETECTAR INTENÇÃO AUTOMATICAMENTE
      let intentResult = null;
      try {
        intentResult = await processIntent({
          mensagem_usuario: userMessage
        });
        console.log('🎯 Intenção detectada:', intentResult);
      } catch (intentError) {
        console.warn('⚠️ Erro na detecção de intenção:', intentError);
      }
      
      // 2. CHAMAR MESTRE DA BELEZA AI
      const { data, error } = await supabase.functions.invoke('mestre-da-beleza-ai', {
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
          modelTier: (typeof window !== 'undefined' && localStorage.getItem('aiMode') === 'gpt5') ? 'gpt5' : 'standard',
          intent: intentResult // Passar intenção detectada
        }
      });

      if (error) {
        throw error;
      }

      // 3. GERAR AÇÕES BASEADAS NA INTENÇÃO
      const actions = generateActionsFromIntent(intentResult, userMessage);

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        intent: intentResult ? {
          category: intentResult.categoria,
          action: intentResult.acao_recomendada,
          confidence: 0.8 // Mock confidence
        } : undefined,
        actions
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (intentResult) {
        console.log(`🎯 Intenção detectada: ${intentResult.intencao} (${intentResult.categoria})`);
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

  // Função para gerar ações baseadas na intenção detectada
  const generateActionsFromIntent = (intentResult: any, userMessage: string) => {
    if (!intentResult) return [];

    const actions = [];
    
    // Detectar palavras-chave para ações específicas
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('roteiro') || lowerMessage.includes('script')) {
      actions.push({
        type: 'generate_script',
        label: '🎬 Gerar Roteiro',
        data: { topic: userMessage }
      });
    }
    
    if (lowerMessage.includes('artigo') || lowerMessage.includes('estudo') || lowerMessage.includes('pesquisa')) {
      actions.push({
        type: 'search_articles',
        label: '📚 Buscar Artigos',
        data: { query: userMessage }
      });
    }
    
    if (lowerMessage.includes('video') || lowerMessage.includes('vídeo')) {
      actions.push({
        type: 'search_videos',
        label: '🎥 Buscar Vídeos',
        data: { query: userMessage }
      });
    }
    
    if (lowerMessage.includes('equipamento') || lowerMessage.includes('aparelho')) {
      actions.push({
        type: 'equipment_info',
        label: '🔧 Ver Equipamentos',
        data: { query: userMessage }
      });
    }
    
    if (lowerMessage.includes('tratamento') || lowerMessage.includes('protocolo') || lowerMessage.includes('paciente')) {
      actions.push({
        type: 'treatment_protocol',
        label: '💉 Ver Protocolos',
        data: { query: userMessage }
      });
    }

    return actions;
  };

  const resetSession = () => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `👋 Olá! Sou o ChatFDA. Como posso te ajudar hoje? ✨`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  // Verificar se deve mostrar welcome screen (sem mensagens do usuário)
  const hasUserMessages = messages.some(msg => msg.role === 'user');
  const showWelcome = !hasUserMessages && !isThinking;

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area - Scroll único com padding para o input fixo */}
      <div className="flex-1 overflow-y-auto aurora-scroll pb-24">
        <div className="max-w-4xl mx-auto px-4">
          {showWelcome ? (
            // Welcome Screen - ChatGPT style
            <ChatFDAWelcomeScreen onSuggestionClick={sendMessage} />
          ) : (
            // Chat Messages
            <>
              {messages.map((message, index) => (
                <div key={index} className="py-4 border-b border-border/10">
                  <MessageBubble message={message} />
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3">
                      <IntentActionsPanel 
                        actions={message.actions}
                        onActionClick={(action) => {
                          console.log('🎯 Ação executada:', action);
                          // Aqui você pode implementar navegação ou outras ações
                          if (action.type === 'generate_script') {
                            // Redirecionar para gerador de roteiros
                            window.location.href = '/roteirista';
                          } else if (action.type === 'search_articles') {
                            // Buscar artigos relacionados
                            sendMessage(`Mostre-me artigos científicos sobre: ${action.data.query}`);
                          } else if (action.type === 'search_videos') {
                            // Buscar vídeos relacionados
                            sendMessage(`Mostre-me vídeos sobre: ${action.data.query}`);
                          } else if (action.type === 'equipment_info') {
                            // Mostrar informações de equipamentos
                            sendMessage(`Quais equipamentos são recomendados para: ${action.data.query}`);
                          } else if (action.type === 'treatment_protocol') {
                            // Mostrar protocolos de tratamento
                            sendMessage(`Qual o melhor protocolo para: ${action.data.query}`);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {isThinking && (
                <div className="py-4 border-b border-border/10">
                  <TypingIndicator />
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input fixo no bottom */}
      <div className="flex-shrink-0 border-t border-border/20 bg-card/30 backdrop-blur-sm">
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