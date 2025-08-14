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
    <div className="flex flex-col flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header fixo no topo - estilo ChatGPT Aurora */}
      <div className="relative z-10 p-4 border-b border-slate-700/50 bg-slate-800/90 backdrop-blur-sm shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Brain className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-100">MEGA CÉREBRO</h1>
            </div>
          </div>
          
          <div className="flex rounded-lg border border-slate-600 overflow-hidden bg-slate-700/50 backdrop-blur-sm">
            <button
              onClick={() => setAiMode('standard')}
              className={`px-4 py-2 text-sm transition-all duration-200 ${aiMode === 'standard' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-slate-300 hover:text-slate-100 hover:bg-slate-600/50'}`}
            >
              Padrão
            </button>
            <button
              onClick={() => setAiMode('gpt5')}
              className={`px-4 py-2 text-sm transition-all duration-200 ${aiMode === 'gpt5' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'text-slate-300 hover:text-slate-100 hover:bg-slate-600/50'}`}
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
            <div className="max-w-2xl text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">🧠 MEGA CÉREBRO</h2>
                <p className="text-xl text-slate-300">
                  ChatGPT especializado em estética com base científica completa
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="p-6 rounded-xl border border-slate-600 bg-slate-800/70 backdrop-blur-sm shadow-lg">
                  <Brain className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="font-semibold text-slate-100 mb-1">Roteirista IA</div>
                  <div className="text-slate-300">Cria conteúdo para redes sociais</div>
                </div>
                <div className="p-6 rounded-xl border border-slate-600 bg-slate-800/70 backdrop-blur-sm shadow-lg">
                  <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <div className="font-semibold text-slate-100 mb-1">Professor Virtual</div>
                  <div className="text-slate-300">Ensina protocolos avançados</div>
                </div>
                <div className="p-6 rounded-xl border border-slate-600 bg-slate-800/70 backdrop-blur-sm shadow-lg">
                  <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <div className="font-semibold text-slate-100 mb-1">Consultor Expert</div>
                  <div className="text-slate-300">Recomenda equipamentos</div>
                </div>
              </div>
              
              <Button
                onClick={startSession}
                size="lg"
                className="text-base px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
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
            {/* Área das mensagens - estilo ChatGPT Aurora */}
            <div className="flex-1 pb-32">
              <div className="max-w-3xl mx-auto px-4">
                <div className="space-y-4 py-6">
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
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-12 shadow-lg'
                            : 'bg-slate-800/80 backdrop-blur-sm text-slate-100 mr-12 border border-slate-600 shadow-lg'
                        }`}
                      >
                        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                          message.role === 'user' ? 'text-white' : 'text-slate-100'
                        }`}>
                          {message.content.split('\n').map((line, i) => {
                            if (line.includes('**')) {
                              const parts = line.split('**');
                              return (
                                  <div key={i} className="mb-1">
                                    {parts.map((part, j) => 
                                      j % 2 === 1 ? 
                                        <span key={j} className={`font-semibold ${message.role === 'user' ? 'text-blue-100' : 'text-blue-400'}`}>{part}</span> : 
                                        <span key={j}>{part}</span>
                                    )}
                                  </div>
                              );
                            }
                            return line ? <div key={i} className="mb-1">{line}</div> : <br key={i} />;
                          })}
                        </div>
                        <div className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
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
                      <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 shadow-lg p-4 rounded-2xl mr-12">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 animate-pulse text-blue-400" />
                          <span className="text-sm text-slate-100">
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
                    <div className="text-sm text-slate-300 mb-3 font-medium">💡 Sugestões:</div>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(question)}
                          className="text-xs py-2 px-4 rounded-full bg-slate-800/70 backdrop-blur-sm border border-slate-600 text-slate-300 hover:bg-slate-700/70 hover:border-slate-500 transition-all duration-200 shadow-sm"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input fixo na parte inferior - estilo ChatGPT Aurora */}
            <div className="fixed bottom-0 left-0 right-0 ml-0 md:ml-[104px] border-t border-slate-700/50 p-4 bg-slate-800/90 backdrop-blur-sm shadow-xl z-50">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Faça uma pergunta..."
                    disabled={isThinking}
                    className="w-full p-4 pr-12 rounded-xl border border-slate-600 bg-slate-700/70 backdrop-blur-sm text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 shadow-lg transition-all duration-200"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!currentInput.trim() || isThinking}
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-center mt-3">
                  <button
                    onClick={resetSession}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors duration-200 flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Nova conversa
                  </button>
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