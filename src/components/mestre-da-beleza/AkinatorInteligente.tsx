import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

interface GuidedQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'objective' | 'bodyArea' | 'skinType' | 'budget' | 'experience';
}

interface UserProfile {
  objective?: string;
  bodyArea?: string;
  skinType?: string;
  budget?: string;
  experience?: string;
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
  const [guidedMode, setGuidedMode] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const genieName = useRef(genieNames[Math.floor(Math.random() * genieNames.length)]).current;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const startSession = async () => {
    setSessionStarted(true);
    setIsThinking(true);
    setGuidedMode(true);
    setCurrentQuestion(0);
    
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `🔮 **Olá! Sou ${genieName}**\n\n• IA com base científica completa\n• Diagnóstico personalizado em 4 passos\n• Recomendações precisas\n\n**Vamos começar com algumas perguntas rápidas para te conhecer melhor!**`,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages([welcomeMessage]);
      setIsThinking(false);
      setProgress(10);
    }, 1500);
  };

  const handleGuidedAnswer = async (answer: string, category: string) => {
    setUserProfile(prev => ({ ...prev, [category]: answer }));
    
    const userMessage: Message = {
      role: 'user',
      content: answer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setProgress(prev => Math.min(prev + 20, 80));
    
    if (currentQuestion < guidedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeout(() => {
        const nextQuestion = guidedQuestions[currentQuestion + 1];
        const assistantMessage: Message = {
          role: 'assistant',
          content: `✅ **Perfeito!**\n\n${nextQuestion.question}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    } else {
      // Finalizar modo guiado e gerar diagnóstico
      setGuidedMode(false);
      setIsThinking(true);
      
      setTimeout(async () => {
        try {
          const contextMessage = `Perfil do usuário: ${Object.entries({...userProfile, [category]: answer}).map(([key, value]) => `${key}: ${value}`).join(', ')}. Com base nestas informações, forneça uma análise detalhada e recomendações específicas.`;
          
          const { data, error } = await supabase.functions.invoke('mestre-da-beleza-ai', {
            body: {
              messages: [
                ...messages,
                userMessage,
                { role: 'user', content: contextMessage }
              ].map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              currentPath: 'diagnóstico_completo',
              userProfile: user ? 'autenticado' : 'anonimo',
              user_id: user?.id
            }
          });

          if (error) throw error;

          const finalMessage: Message = {
            role: 'assistant',
            content: `🎯 **Diagnóstico Completo**\n\n${data.content}\n\n**💬 Agora você pode fazer perguntas específicas ou solicitar mais detalhes!**`,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, finalMessage]);
          setProgress(100);
          
          if (data.equipamentosUsados !== undefined && data.artigosConsultados !== undefined) {
            setAiStats({
              equipamentosUsados: data.equipamentosUsados,
              artigosConsultados: data.artigosConsultados
            });
          }
        } catch (error) {
          console.error('❌ Erro no diagnóstico:', error);
          const errorMessage: Message = {
            role: 'assistant',
            content: `😔 **Erro no diagnóstico.** Vou ajudar você de forma livre. Pode fazer suas perguntas!`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
          setGuidedMode(false);
        } finally {
          setIsThinking(false);
        }
      }, 2000);
    }
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
    setProgress(prev => Math.min(prev + 10, 95));

    try {
      console.log('🧠 [AkinatorInteligente] Enviando mensagem para IA...');
      
      const contextualMessages = [
        ...messages,
        newUserMessage
      ];
      
      // Adicionar contexto do perfil se existir
      if (Object.keys(userProfile).length > 0) {
        const profileContext = `Contexto do usuário: ${Object.entries(userProfile).map(([key, value]) => `${key}: ${value}`).join(', ')}`;
        contextualMessages.unshift({
          role: 'assistant',
          content: profileContext,
          timestamp: new Date()
        });
      }
      
      const { data, error } = await supabase.functions.invoke('mestre-da-beleza-ai', {
        body: {
          messages: contextualMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          currentPath: `conversa_${messages.length}`,
          userProfile: user ? 'autenticado' : 'anonimo',
          user_id: user?.id
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
    setGuidedMode(true);
    setCurrentQuestion(0);
    setUserProfile({});
    setProgress(0);
    setAiStats({ equipamentosUsados: 0, artigosConsultados: 0 });
    setCurrentInput('');
  };

  const guidedQuestions: GuidedQuestion[] = [
    {
      id: 'objective',
      question: '🎯 Qual seu principal objetivo estético?',
      options: ['Rejuvenescimento', 'Contorno Corporal', 'Tratamento Facial', 'Redução de Gordura', 'Melhoria da Pele'],
      category: 'objective'
    },
    {
      id: 'bodyArea',
      question: '📍 Qual área deseja tratar?',
      options: ['Rosto/Pescoço', 'Abdômen', 'Coxas/Glúteos', 'Braços', 'Corpo Todo'],
      category: 'bodyArea'
    },
    {
      id: 'skinType',
      question: '✨ Como você descreveria sua pele?',
      options: ['Oleosa', 'Seca', 'Mista', 'Sensível', 'Normal'],
      category: 'skinType'
    },
    {
      id: 'budget',
      question: '💰 Qual seu orçamento previsto?',
      options: ['Até R$ 500', 'R$ 500-1500', 'R$ 1500-3000', 'Acima R$ 3000', 'Sem limite'],
      category: 'budget'
    }
  ];

  const quickQuestions = [
    "Quero tratar flacidez no rosto",
    "Tenho gordura localizada na barriga", 
    "Preciso reduzir celulite",
    "Quero definir o contorno facial",
    "Tenho manchas na pele"
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center aurora-gradient-bg px-2 py-8">
      <AuroraParticles />

      <div className="relative z-10 mx-auto w-full max-w-4xl flex flex-col gap-6 py-6 px-2 sm:px-4">
        
        {/* Header com Stats */}
        <motion.div
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <span className="animate-pulse crystal-pulse rounded-full p-4 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 border-4 border-cyan-400/30">
              <Brain className="text-white drop-shadow" size={52} />
            </span>
            <div className="text-center">
              <GenioMestreHeader 
                step={isThinking ? "thinking" : sessionStarted ? "question" : "intro"} 
                phrase={isThinking ? mysticalThinkingPhrases[0] : `${genieName} - IA Científica`}
              />
              {sessionStarted && (
                <div className="flex gap-4 mt-2">
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {aiStats.artigosConsultados} Estudos
                  </Badge>
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200">
                    <Zap className="w-3 h-3 mr-1" />
                    {aiStats.equipamentosUsados} Equipamentos
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {sessionStarted && (
            <div className="w-full max-w-md">
              <div className="flex justify-between text-sm text-purple-200 mb-1">
                <span>Análise Científica</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-purple-900/40 magical-glow" />
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!sessionStarted ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <Card className="aurora-card border-2 border-purple-400/50 shadow-xl backdrop-blur-lg">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-4 font-playfair">
                    🧠 Mestre da Beleza 2.0
                  </h2>
                  <p className="text-purple-200 text-lg mb-6">
                    Powered by IA + Base Científica Completa
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="bg-purple-800/30 p-3 rounded-lg">
                      <Brain className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-cyan-200 font-semibold">IA Avançada</div>
                      <div className="text-purple-300">OpenAI GPT-4</div>
                    </div>
                    <div className="bg-purple-800/30 p-3 rounded-lg">
                      <BookOpen className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                      <div className="text-pink-200 font-semibold">Base Científica</div>
                      <div className="text-purple-300">Estudos + Equipamentos</div>
                    </div>
                  </div>
                  <Button
                    onClick={startSession}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
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

                  {/* Guided Questions */}
                  {guidedMode && messages.length > 0 && !isThinking && currentQuestion < guidedQuestions.length && (
                    <div className="mb-4">
                      <div className="text-xs text-purple-300 mb-2">📋 Escolha uma opção:</div>
                      <div className="grid grid-cols-1 gap-2">
                        {guidedQuestions[currentQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleGuidedAnswer(option, guidedQuestions[currentQuestion].category)}
                            className="justify-start text-sm bg-purple-800/20 hover:bg-purple-700/40 border-purple-500/30 text-purple-200 h-10 transition-all duration-200"
                          >
                            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center mr-3">
                              {index + 1}
                            </span>
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Questions for Free Chat */}
                  {!guidedMode && messages.length >= 2 && messages[messages.length - 1].content.includes('perguntas específicas') && !isThinking && (
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

                  {/* Input - Only show when not in guided mode or after guided questions */}
                  {(!guidedMode || currentQuestion >= guidedQuestions.length) && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder={guidedMode ? "Aguarde as perguntas guiadas..." : "Faça sua pergunta específica..."}
                        disabled={isThinking || guidedMode}
                        className="flex-1 p-3 rounded-lg bg-purple-900/30 border border-purple-500/30 text-white text-sm placeholder-purple-300 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                      />
                      <Button
                        onClick={() => sendMessage()}
                        disabled={!currentInput.trim() || isThinking || guidedMode}
                        className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
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