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
      content: `🔮 **Olá! Sou ${genieName}**\n\n• Especialista em estética científica\n• Acesso a equipamentos e estudos\n• Diagnóstico personalizado\n\n**Qual sua principal preocupação estética?**`,
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
      console.log('🧠 [AkinatorInteligente] Enviando mensagem para IA...');
      
      const { data, error } = await supabase.functions.invoke('mestre-da-beleza-ai', {
        body: {
          messages: [...messages, newUserMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          currentPath: `consulta_${messages.length}`,
          userProfile: user ? 'autenticado' : 'anonimo',
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
      
      // Atualizar estatísticas da IA
      if (data.equipamentosUsados !== undefined && data.artigosConsultados !== undefined) {
        setAiStats({
          equipamentosUsados: data.equipamentosUsados,
          artigosConsultados: data.artigosConsultados
        });
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
    "Quero tratar flacidez no rosto",
    "Tenho gordura localizada na barriga",
    "Preciso reduzir celulite",
    "Quero definir o contorno facial",
    "Tenho manchas na pele"
  ];

  return (
    <div className="space-y-4">
      <AuroraParticles />

      <div className="relative z-10 w-full max-w-4xl mx-auto space-y-4">
        
        {/* Header com Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-3">
            <span className="animate-pulse crystal-pulse rounded-full p-3 bg-gradient-to-br from-aurora-neon-blue via-aurora-electric-purple to-aurora-cyan border-2 border-aurora-neon-blue/30">
              <Brain className="text-white drop-shadow" size={40} />
            </span>
            <div className="text-center">
              <GenioMestreHeader 
                step={isThinking ? "thinking" : sessionStarted ? "question" : "intro"} 
                phrase={isThinking ? mysticalThinkingPhrases[0] : `${genieName} - IA Científica`}
              />
              {sessionStarted && (
                <div className="flex gap-3 mt-1">
                  <Badge variant="secondary" className="bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {aiStats.artigosConsultados} Estudos
                  </Badge>
                  <Badge variant="secondary" className="bg-aurora-cyan/20 text-aurora-cyan border-aurora-cyan/30">
                    <Zap className="w-3 h-3 mr-1" />
                    {aiStats.equipamentosUsados} Equipamentos
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <div className="mt-2">
            <div className="inline-flex rounded-full border border-aurora-neon-blue/30 overflow-hidden">
              <button
                onClick={() => setAiMode('standard')}
                className={`px-3 py-1 text-sm transition-colors ${aiMode === 'standard' ? 'bg-aurora-neon-blue/20 text-aurora-neon-blue' : 'text-aurora-text-muted'}`}
                aria-pressed={aiMode === 'standard'}
              >
                IA: Padrão
              </button>
              <button
                onClick={() => setAiMode('gpt5')}
                className={`px-3 py-1 text-sm transition-colors ${aiMode === 'gpt5' ? 'bg-aurora-electric-purple/20 text-aurora-electric-purple' : 'text-aurora-text-muted'}`}
                aria-pressed={aiMode === 'gpt5'}
              >
                GPT‑5 (Beta)
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!sessionStarted ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <Card className="aurora-glass border border-aurora-neon-blue/30">
                <CardContent className="p-6 text-center">
                  <h2 className="text-2xl font-bold text-aurora-text-primary mb-3 aurora-heading-enhanced">
                    Mestre da Beleza 2.0
                  </h2>
                  <p className="text-aurora-text-muted text-base mb-4">
                    Powered by IA + Base Científica Completa
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="aurora-glass p-3 rounded-lg">
                      <Brain className="w-6 h-6 text-aurora-neon-blue mx-auto mb-2" />
                      <div className="text-aurora-neon-blue font-semibold">IA Avançada</div>
                      <div className="text-aurora-text-muted">OpenAI GPT-4</div>
                    </div>
                    <div className="aurora-glass p-3 rounded-lg">
                      <BookOpen className="w-6 h-6 text-aurora-cyan mx-auto mb-2" />
                      <div className="text-aurora-cyan font-semibold">Base Científica</div>
                      <div className="text-aurora-text-muted">Estudos + Equipamentos</div>
                    </div>
                  </div>
                  <Button
                    onClick={startSession}
                    className="aurora-button-enhanced px-6 py-2 rounded-full text-base"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Iniciar Consulta Inteligente
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Chat Messages */}
              <Card className="aurora-card border-2 border-purple-400/50 backdrop-blur-lg">
                <CardContent className="p-4">
                  <div className="h-80 overflow-y-auto space-y-3 mb-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-cyan-600/30 text-cyan-100 border border-cyan-500/30'
                              : 'bg-purple-600/30 text-purple-100 border border-purple-500/30'
                          }`}
                        >
                          <div className="text-sm leading-relaxed">
                            {message.content.split('\n').map((line, i) => {
                              // Texto em negrito
                              if (line.includes('**')) {
                                const parts = line.split('**');
                                return (
                                  <div key={i} className="mb-1">
                                    {parts.map((part, j) => 
                                      j % 2 === 1 ? 
                                        <span key={j} className="font-bold text-yellow-200">{part}</span> : 
                                        <span key={j}>{part}</span>
                                    )}
                                  </div>
                                );
                              }
                              // Bullets
                              if (line.startsWith('•')) {
                                return <div key={i} className="ml-2 mb-1 text-purple-100">{line}</div>;
                              }
                              // Emojis importantes
                              if (line.match(/^[🔮✨🎯🧙‍♂️💡]/)) {
                                return <div key={i} className="font-medium mb-1">{line}</div>;
                              }
                              return line ? <div key={i} className="mb-1">{line}</div> : <br key={i} />;
                            })}
                          </div>
                          <div className="text-xs opacity-50 mt-2">
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
                        <div className="bg-purple-600/30 border border-purple-500/30 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 animate-pulse text-purple-300" />
                            <span className="text-purple-200 italic text-sm">
                              Analisando base científica...
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Questions */}
                  {messages.length === 1 && !isThinking && (
                    <div className="mb-4">
                      <div className="text-xs text-purple-300 mb-2">💡 Sugestões:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {quickQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => sendMessage(question)}
                            className="text-xs bg-purple-800/20 hover:bg-purple-700/30 border-purple-500/30 text-purple-200 h-8"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Descreva sua preocupação..."
                      disabled={isThinking}
                      className="flex-1 p-3 rounded-lg bg-purple-900/30 border border-purple-500/30 text-white text-sm placeholder-purple-300 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                    />
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!currentInput.trim() || isThinking}
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reset Button */}
              <div className="text-center">
                <Button
                  onClick={resetSession}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Nova Consulta
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AkinatorInteligente;