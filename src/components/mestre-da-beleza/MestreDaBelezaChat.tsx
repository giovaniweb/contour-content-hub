import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Crown, 
  Send, 
  Sparkles, 
  Heart, 
  Star,
  Wand2,
  MessageCircle,
  Users,
  Stethoscope,
  User,
  RefreshCw
} from "lucide-react";
import { useMestreDaBeleza } from '@/hooks/useMestreDaBeleza';
import RecommendationDisplay from './RecommendationDisplay';

interface Message {
  id: string;
  role: 'user' | 'mestre';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isRecommendation?: boolean;
}

const MestreDaBelezaChat: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    processUserResponse,
    getRecommendation,
    resetChat
  } = useMestreDaBeleza();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'mestre',
      content: 'Vamos brincar de descobrir quem é você nesse mundão da estética? 😄 Primeiro me conta…',
      timestamp: new Date(),
      suggestions: ['Sou médico(a)', 'Não sou médico(a)', 'Prefiro não dizer agora']
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role: 'user' | 'mestre', content: string, suggestions?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (response: string, suggestions?: string[]) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsTyping(false);
    addMessage('mestre', response, suggestions);
  };

  const handleProfileQuestion = async (userResponse: string) => {
    if (userResponse.toLowerCase().includes('médico') || userResponse.toLowerCase().includes('sim')) {
      updateProfile({ perfil: 'medico' });
      await simulateTyping(
        'Que incrível! Um(a) médico(a)! 👨‍⚕️✨ Agora me conta, você tem clínica própria?',
        ['Sim, tenho clínica', 'Não, trabalho em clínica', 'Estou planejando abrir']
      );
    } else {
      await simulateTyping(
        'Entendi! E me conta... você já estudou usando jaleco? 🥼',
        ['Sim, usei jaleco', 'Não, nunca usei', 'Que pergunta engraçada! 😄']
      );
    }
  };

  const handleJalecoQuestion = async (userResponse: string) => {
    if (userResponse.toLowerCase().includes('sim')) {
      await simulateTyping(
        'Aha! Então você trabalha ou já trabalhou em clínica de estética? 💅✨',
        ['Sim, trabalho', 'Já trabalhei', 'Não, nunca trabalhei']
      );
    } else {
      updateProfile({ 
        perfil: 'cliente_final',
        step: 'intention'
      });
      await simulateTyping(
        'Perfeito! Você é nosso cliente especial! 💎 Agora me conta, você quer resolver algo agora, ou tá mais no clima de descobrir coisas novas comigo?',
        ['✅ Quero resolver um problema', '💡 Quero ter uma ideia nova', '🔍 Só tô curiosando mesmo']
      );
    }
  };

  const handleWorkQuestion = async (userResponse: string) => {
    if (userResponse.toLowerCase().includes('sim') || userResponse.toLowerCase().includes('trabalho')) {
      updateProfile({ 
        perfil: 'profissional_estetica',
        step: 'intention'
      });
      await simulateTyping(
        'Que demais! Profissional da área! 💪 Você quer resolver algo agora, ou tá mais no clima de descobrir coisas novas comigo?',
        ['✅ Quero resolver um problema', '💡 Quero ter uma ideia nova', '🔍 Só tô curiosando mesmo']
      );
    } else {
      updateProfile({ 
        perfil: 'cliente_final',
        step: 'intention'
      });
      await simulateTyping(
        'Entendi! Você é nosso cliente especial! 💎 Agora me conta, você quer resolver algo agora, ou tá mais no clima de descobrir coisas novas comigo?',
        ['✅ Quero resolver um problema', '💡 Quero ter uma ideia nova', '🔍 Só tô curiosando mesmo']
      );
    }
  };

  const handleIntentionQuestion = async (userResponse: string) => {
    const responses = { ...userProfile.responses, intencao: userResponse };
    updateProfile({ responses, step: 'diagnosis' });

    if (userResponse.includes('resolver um problema')) {
      if (userProfile.perfil === 'cliente_final') {
        await simulateTyping(
          'Vamos lá! Algo em você incomoda? 🤔',
          ['É o rosto mesmo', 'É o corpo', 'Tô me sentindo derretendo 😭', 'É meio que tudo']
        );
      } else {
        await simulateTyping(
          'Perfeito! Como profissional, você tem enfrentado algum desafio específico? 🎯',
          ['Dificuldade em reter clientes', 'Problemas com equipamentos', 'Questões de marketing', 'Concorrência muito forte']
        );
      }
    } else if (userResponse.includes('ideia nova')) {
      await simulateTyping(
        'Adoro isso! Que tal montar uma campanha criativa? 🚀 Você tem algum equipamento favorito para trabalhar?',
        ['HIPRO', 'Endolaser', 'Peeling', 'Não tenho equipamento específico']
      );
    } else {
      await simulateTyping(
        'Que gostoso! Curiosidade é o primeiro passo para a descoberta! 🔍✨ Quer que eu te conte sobre algum tratamento específico ou prefere que eu te surpreenda?',
        ['Me surpreenda!', 'Quero saber sobre flacidez', 'Fale sobre rejuvenescimento', 'Conte sobre tecnologias novas']
      );
    }
  };

  const handleDiagnosisResponse = async (userResponse: string, context: string) => {
    const { problema, area } = processUserResponse(userResponse, context);
    
    // Se identificou um problema específico, gerar recomendação
    if (problema && userProfile.step === 'diagnosis') {
      const recommendation = getRecommendation();
      
      if (recommendation) {
        setCurrentRecommendation(recommendation);
        updateProfile({ step: 'recommendation' });
        
        await simulateTyping(
          `Interessante! Com base no que você me contou, posso te ajudar de forma mais específica. Que tal conectarmos você com a solução ideal? 🎯✨`,
          ['Quero a solução!', 'Me fale mais detalhes', 'Preciso pensar um pouco']
        );
      } else {
        await simulateTyping(
          'Entendi suas respostas! Me conta mais uma coisa para eu te ajudar melhor...',
          ['Vamos continuar', 'Quero recomeçar']
        );
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    addMessage('user', userMessage);

    // Lógica baseada no step atual
    switch (userProfile.step) {
      case 'profile':
        if (!userProfile.perfil) {
          await handleProfileQuestion(userMessage);
        } else if (userProfile.perfil === 'medico') {
          updateProfile({ step: 'intention' });
          await simulateTyping(
            'Maravilha! Agora me conta, você quer resolver algo agora, ou tá mais no clima de descobrir coisas novas comigo?',
            ['✅ Quero resolver um problema', '💡 Quero ter uma ideia nova', '🔍 Só tô curiosando mesmo']
          );
        } else {
          await handleJalecoQuestion(userMessage);
        }
        break;
        
      case 'intention':
        await handleIntentionQuestion(userMessage);
        break;
        
      case 'diagnosis':
        await handleDiagnosisResponse(userMessage, 'generic_response');
        break;

      case 'recommendation':
        if (userMessage.toLowerCase().includes('solução')) {
          setShowRecommendation(true);
        } else {
          await simulateTyping(
            'Que legal continuar nossa conversa! Como posso te ajudar mais? 😊',
            ['Tenho outra dúvida', 'Quero recomeçar', 'Tá perfeito assim']
          );
        }
        break;
        
      default:
        await simulateTyping(
          'Que legal continuar nossa conversa! Como posso te ajudar mais? 😊',
          ['Tenho outra dúvida', 'Quero recomeçar', 'Tá perfeito assim']
        );
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleEngineAnswer = async (answer: string, context: string) => {
    addMessage('user', answer);
    await handleDiagnosisResponse(answer, context);
  };

  const handleNewChat = () => {
    resetChat();
    setMessages([{
      id: '1',
      role: 'mestre',
      content: 'Vamos brincar de descobrir quem é você nesse mundão da estética? 😄 Primeiro me conta…',
      timestamp: new Date(),
      suggestions: ['Sou médico(a)', 'Não sou médico(a)', 'Prefiro não dizer agora']
    }]);
    setShowRecommendation(false);
    setCurrentRecommendation(null);
  };

  const handleContinueFromRecommendation = () => {
    setShowRecommendation(false);
    simulateTyping(
      'Quer ver outras ideias que combinem com você? 🌟',
      ['Sim, quero mais opções', 'Quero nova consulta', 'Estou satisfeito(a)']
    );
  };

  const getProfileIcon = () => {
    switch (userProfile.perfil) {
      case 'medico': return <Stethoscope className="w-4 h-4" />;
      case 'profissional_estetica': return <Heart className="w-4 h-4" />;
      case 'cliente_final': return <User className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getProfileLabel = () => {
    switch (userProfile.perfil) {
      case 'medico': return 'Médico(a)';
      case 'profissional_estetica': return 'Profissional';
      case 'cliente_final': return 'Cliente';
      default: return 'Descobrindo...';
    }
  };

  // Se há recomendação para mostrar
  if (showRecommendation && currentRecommendation) {
    return (
      <Card className="h-[600px] bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-400/30 shadow-2xl">
        <CardHeader className="pb-4 border-b border-purple-400/20">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Mestre da Beleza</h3>
                <p className="text-purple-200 text-xs">Sua IA mágica e inteligente</p>
              </div>
            </div>
            
            <Button
              onClick={handleNewChat}
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(100%-120px)] p-4">
          <ScrollArea className="flex-1">
            <RecommendationDisplay
              recommendation={currentRecommendation}
              onContinue={handleContinueFromRecommendation}
              onNewChat={handleNewChat}
            />
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-400/30 shadow-2xl">
      <CardHeader className="pb-4 border-b border-purple-400/20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Mestre da Beleza</h3>
              <p className="text-purple-200 text-xs">Sua IA mágica e inteligente</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {userProfile.perfil && (
              <Badge variant="secondary" className="bg-purple-600/30 text-purple-100 border-purple-400/50">
                {getProfileIcon()}
                <span className="ml-1">{getProfileLabel()}</span>
              </Badge>
            )}
            
            <Button
              onClick={handleNewChat}
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col h-[calc(100%-120px)] p-0">
        <ScrollArea className="flex-1 p-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'mestre' && (
                  <Avatar className="mr-3 border-2 border-yellow-400/50">
                    <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white">
                      <Crown className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : ''}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {message.suggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 mt-3"
                    >
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          variant="outline"
                          size="sm"
                          className="bg-white/5 border-purple-400/50 text-purple-100 hover:bg-purple-600/30 hover:border-purple-300 text-xs transition-all duration-200"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-4"
            >
              <Avatar className="mr-3 border-2 border-yellow-400/50">
                <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white">
                  <Crown className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                  <span className="text-white text-sm">Pensando magicamente...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t border-purple-400/20">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Digite sua resposta mágica..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-white/10 border-purple-400/30 text-white placeholder:text-purple-200 focus:border-purple-300"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MestreDaBelezaChat;
