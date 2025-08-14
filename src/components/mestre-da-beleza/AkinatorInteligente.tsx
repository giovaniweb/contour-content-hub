import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Sparkles, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
    // Iniciar com quebra-gelo
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
  const [currentInput, setCurrentInput] = useState('');
  const [aiStats, setAiStats] = useState<AIStats>({ equipamentosUsados: 0, artigosConsultados: 0 });
  const [progress, setProgress] = useState(0);
  const [aiMode, setAiModeState] = useState<'standard' | 'gpt5'>(() => (typeof window !== 'undefined' && localStorage.getItem('aiMode') === 'gpt5') ? 'gpt5' : 'standard');
  const setAiMode = (mode: 'standard' | 'gpt5') => {
    setAiModeState(mode);
    try { localStorage.setItem('aiMode', mode); } catch {}
  };
  const genieName = useRef(genieNames[Math.floor(Math.random() * genieNames.length)]).current;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Função removida - indo direto para o chat

  const sendMessage = async (message?: string) => {
    const userMessage = message || currentInput.trim();
    if (!userMessage || isThinking) return;

    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setCurrentInput('');
    setIsThinking(true);
    setProgress(prev => Math.min(prev + 15, 95));

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
      
      // Atualizar estatísticas do ChatFDA
      setAiStats({
        equipamentosUsados: data.equipmentUsed || 0,
        artigosConsultados: data.articlesConsulted || 0
      });

      // Log da intenção detectada para debug
      if (data.intent) {
        console.log(`🎯 Intenção detectada: ${data.intent} (${(data.confidence * 100).toFixed(0)}% confiança)`);
      }

      setProgress(prev => Math.min(prev + 10, 100));

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
    setProgress(0);
    setAiStats({ equipamentosUsados: 0, artigosConsultados: 0 });
    setCurrentInput('');
  };

  const quickQuestions = [
    "Crie um roteiro para Instagram sobre botox",
    "Me ensine protocolo de harmonização facial", 
    "Qual equipamento é melhor para flacidez?",
    "Mostre vídeos sobre preenchimento labial",
    "Quero estudar radiofrequência",
    "Preciso de artigos sobre criolipólise"
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Interface de chat - direto, sem tela inicial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full"
      >
        {/* Área das mensagens - estilo ChatGPT limpo */}
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="space-y-6 py-6">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card text-card-foreground border border-border shadow-sm'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content.split('\n').map((line, i) => {
                      if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                            <div key={i} className="mb-1">
                              {parts.map((part, j) => 
                                j % 2 === 1 ? 
                                  <span key={j} className="font-semibold text-primary">{part}</span> : 
                                  <span key={j}>{part}</span>
                              )}
                            </div>
                        );
                      }
                      return line ? <div key={i} className="mb-1">{line}</div> : <br key={i} />;
                    })}
                  </div>
                  <div className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-card border border-border shadow-sm p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Analisando base científica...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sugestões flutuantes - aparecem apenas quando só há a mensagem de boas-vindas */}
        {messages.length === 1 && !isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-card rounded-xl shadow-lg border border-border p-4 max-w-md">
              <div className="text-sm text-muted-foreground mb-3 font-medium text-center">💡 Experimente perguntar:</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="text-xs py-2 px-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-200 border border-border"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Input sticky na parte inferior - dentro do container */}
        <div className="sticky bottom-0 left-0 right-0 border-t border-border p-4 bg-background/95 backdrop-blur-sm z-20">
          <div className="relative">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Faça uma pergunta..."
              disabled={isThinking}
              className="w-full p-4 pr-32 rounded-xl border border-border bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:opacity-50 shadow-sm transition-all duration-200"
            />
            
            {/* Controles no input - Padrão/GPT-5 + Enviar */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="flex rounded-lg border border-border overflow-hidden bg-secondary">
                <button
                  onClick={() => setAiMode('standard')}
                  className={`px-3 py-1 text-xs transition-all duration-200 ${aiMode === 'standard' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'}`}
                >
                  Padrão
                </button>
                <button
                  onClick={() => setAiMode('gpt5')}
                  className={`px-3 py-1 text-xs transition-all duration-200 ${aiMode === 'gpt5' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'}`}
                >
                  GPT-5
                </button>
              </div>
              <Button
                onClick={() => sendMessage()}
                disabled={!currentInput.trim() || isThinking}
                size="sm"
                className="rounded-lg w-8 h-8 p-0"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center mt-3">
            <button
              onClick={resetSession}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Nova conversa
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AkinatorInteligente;