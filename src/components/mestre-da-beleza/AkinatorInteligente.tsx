import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { ArrowRight, RotateCcw, Sparkles, Brain, Zap, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import GenioMestreHeader from "./components/GenioMestreHeader";
import AuroraParticles from "./components/AuroraParticles";
import { mysticalIntroPhrases, mysticalThinkingPhrases } from "./genioPhrases";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [sessionStarted, setSessionStarted] = useState(false);
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

  const startSession = async () => {
    setSessionStarted(true);
    setIsThinking(true);
    
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `🧠 **MEGA CÉREBRO ativado!**\n\nSou um ChatGPT especializado em estética com múltiplos módulos:\n\n🎬 **Roteirista IA** - Crio conteúdo para Instagram\n👩‍🏫 **Professor Virtual** - Ensino protocolos da Academy\n🔍 **Consultor** - Recomendo equipamentos\n📹 **Curador** - Encontro vídeos específicos\n🔬 **Pesquisador** - Acesso estudos científicos\n\n**Como posso ajudá-lo hoje?**`,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages([welcomeMessage]);
      setIsThinking(false);
      setProgress(10);
    }, 2000);
  };

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
      console.log('🧠 [MEGA CÉREBRO] Enviando mensagem para IA...');
      
      // Usar o novo MEGA CÉREBRO em vez do sistema antigo
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
      
      // Atualizar estatísticas do MEGA CÉREBRO
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
    setMessages([]);
    setSessionStarted(false);
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
    <div className="flex flex-col h-screen bg-background">
      <AuroraParticles />

      {/* Header fixo no topo com melhor contraste */}
      <div className="relative z-10 p-4 border-b border-border/30 bg-background/95 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <span className="rounded-full p-2 bg-gradient-to-br from-primary/20 via-primary/30 to-primary/40 border border-primary/40 backdrop-blur-sm">
              <Brain className="text-primary" size={24} />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-foreground">MEGA CÉREBRO</h1>
              <p className="text-sm text-muted-foreground">ChatGPT Especializado</p>
            </div>
          </div>
          
          {sessionStarted && (
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs bg-muted/60 text-foreground border-border/40">
                <BookOpen className="w-3 h-3 mr-1 text-primary" />
                {aiStats.artigosConsultados}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-muted/60 text-foreground border-border/40">
                <Zap className="w-3 h-3 mr-1 text-primary" />
                {aiStats.equipamentosUsados}
              </Badge>
            </div>
          )}
          
          <div className="flex rounded-lg border border-border/40 overflow-hidden bg-muted/30 backdrop-blur-sm">
            <button
              onClick={() => setAiMode('standard')}
              className={`px-3 py-1 text-xs transition-all duration-200 ${aiMode === 'standard' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              Padrão
            </button>
            <button
              onClick={() => setAiMode('gpt5')}
              className={`px-3 py-1 text-xs transition-all duration-200 ${aiMode === 'gpt5' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              GPT-5
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!sessionStarted ? (
          /* Tela inicial */
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex items-center justify-center p-4"
          >
            <div className="max-w-2xl text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-foreground">🧠 MEGA CÉREBRO</h2>
                <p className="text-lg text-muted-foreground">
                  ChatGPT especializado em estética com base científica completa
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <Brain className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-medium text-foreground">Roteirista IA</div>
                  <div className="text-muted-foreground">Cria conteúdo</div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-medium text-foreground">Professor</div>
                  <div className="text-muted-foreground">Ensina protocolos</div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-medium text-foreground">Consultor</div>
                  <div className="text-muted-foreground">Equipamentos</div>
                </div>
              </div>
              
              <Button
                onClick={startSession}
                size="lg"
                className="text-base px-8"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Começar conversa
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Interface de chat - similar ao ChatGPT */
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Área das mensagens com scroll melhorado */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-4">
                <div className="space-y-6 py-6">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-sm border ${
                          message.role === 'user'
                            ? 'bg-primary/90 text-primary-foreground ml-12 border-primary/20 shadow-lg shadow-primary/10'
                            : 'bg-card/80 text-card-foreground mr-12 border-border/30 shadow-lg shadow-background/10'
                        }`}
                      >
                        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                          message.role === 'user' ? 'text-primary-foreground' : 'text-foreground'
                        }`}>
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
                        <div className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
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
                      <div className="bg-card/80 backdrop-blur-sm p-4 rounded-2xl mr-12 border border-border/30 shadow-lg">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 animate-pulse text-primary" />
                          <span className="text-sm text-foreground">
                            Analisando base científica...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Sugestões de perguntas */}
                {messages.length === 1 && !isThinking && (
                  <div className="pb-6">
                    <div className="text-sm text-foreground mb-3 font-medium">💡 Sugestões:</div>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => sendMessage(question)}
                          className="text-xs h-auto py-2 px-3 rounded-full bg-card/50 border-border/40 text-foreground hover:bg-card/80 hover:border-primary/30 transition-all duration-200"
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input fixo na parte inferior - estilo ChatGPT otimizado */}
            <div className="sticky bottom-0 border-t border-border/30 p-4 bg-background/95 backdrop-blur-lg">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Faça uma pergunta..."
                    disabled={isThinking}
                    className="w-full p-4 pr-12 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm text-sm text-foreground placeholder-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-50 shadow-lg transition-all duration-200"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!currentInput.trim() || isThinking}
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90 shadow-md"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-center mt-3">
                  <Button
                    onClick={resetSession}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Nova conversa
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AkinatorInteligente;