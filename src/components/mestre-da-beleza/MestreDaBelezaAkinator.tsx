import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Sparkles, 
  Star,
  Trophy,
  Wand2,
  RefreshCw,
  ArrowLeft,
  User,
  Stethoscope,
  Heart
} from "lucide-react";
import { useMestreDaBeleza } from '@/hooks/useMestreDaBeleza';
import RecommendationDisplay from './RecommendationDisplay';
import GamificationDisplay from '@/components/gamification/GamificationDisplay';
import { useGamification } from '@/hooks/useGamification';
import { questionBank, getNextQuestionId } from './questionBank';
import { useMestreDaBelezaSession } from '@/hooks/useMestreDaBelezaSession';
import { logEvent } from '@/hooks/useMestreDaBelezaAnalytics';

const MestreDaBelezaAkinator: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    processUserResponse,
    getRecommendation,
    resetChat
  } = useMestreDaBeleza();

  const { userProgress } = useGamification();
  // Renamed to avoid conflict with question object
  const [currentQuestionText, setCurrentQuestionText] = useState<string>('');
  const [currentOptions, setCurrentOptions] = useState<string[]>([
    'Sou médico(a)', 
    'Não sou médico(a)', 
    'Prefiro não dizer agora'
  ]);
  const [questionProgress, setQuestionProgress] = useState(0);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);

  const sessionUtils = useMestreDaBelezaSession();

  // Estado com base no banco configurável de perguntas
  const [qIndex, setQIndex] = React.useState(0);
  const [userResponses, setUserResponses] = React.useState<{[ctx: string]: string}>({});
  const [analyticsSent, setAnalyticsSent] = React.useState(false);

  // Carregar sessão ao abrir
  React.useEffect(() => {
    const s = sessionUtils.load();
    if (s && s.responses) {
      setUserResponses(s.responses);
      setQIndex(s.qIndex || 0);
    }
  }, []);

  // Salvar sessão a cada resposta
  React.useEffect(() => {
    sessionUtils.save({ responses: userResponses, qIndex });
  }, [userResponses, qIndex]);

  // Capta pergunta corrente do questionBank
  const currentQuestionObj = questionBank[qIndex];

  React.useEffect(() => {
    if (userProfile.step === 'profile' && !userProfile.perfil) {
      setCurrentQuestionText('Vamos brincar de descobrir quem é você nesse mundão da estética? 😄');
      setQuestionProgress(10);
    }
  }, [userProfile.step, userProfile.perfil]);

  const getProfileIcon = () => {
    switch (userProfile.perfil) {
      case 'medico': return <Stethoscope className="w-5 h-5" />;
      case 'profissional_estetica': return <Heart className="w-5 h-5" />;
      case 'cliente_final': return <User className="w-5 h-5" />;
      default: return <Crown className="w-5 h-5" />;
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

  const getAdvancedQuestions = () => {
    const { perfil, responses, step } = userProfile;
    
    // Perguntas específicas baseadas no perfil e contexto
    if (step === 'diagnosis' && perfil && responses.intencao) {
      
      // Para clientes finais com problemas
      if (perfil === 'cliente_final' && responses.intencao?.includes('problema')) {
        
        // Fluxo para detectar flacidez facial
        if (responses.area_problema?.includes('rosto') || responses.area_problema?.includes('derretendo')) {
          if (!responses.emagreceu_rapido) {
            return {
              question: 'Você emagreceu rápido nos últimos meses? 🏃‍♀️',
              options: ['Sim, bastante', 'Um pouco', 'Não emagreceu'],
              context: 'emagreceu_rapido'
            };
          }
          if (!responses.perdeu_firmeza) {
            return {
              question: 'Já se olhou no espelho e pensou que perdeu firmeza? 😔',
              options: ['Sim, muito', 'Às vezes', 'Não'],
              context: 'perdeu_firmeza'
            };
          }
          if (!responses.brasiltricampeao) {
            return {
              question: 'Você já viu o Brasil ser tetra? ⚽ (pergunta nostálgica!)',
              options: ['Claro! 1994 ❤️', 'Não era nascido(a)', 'Prefiro não dizer'],
              context: 'brasiltricampeao'
            };
          }
        }
        
        // Perguntas gerais para corpo
        if (responses.area_problema?.includes('corpo')) {
          if (!responses.corpo_flacido) {
            return {
              question: 'Você sente que seu corpo está flácido? 💪',
              options: ['Sim, muito', 'Um pouco', 'Não sinto isso'],
              context: 'corpo_flacido'
            };
          }
          if (!responses.gordura_localizada) {
            return {
              question: 'Tem alguma gordurinha localizada que te incomoda? 🎯',
              options: ['Sim, me incomoda', 'Um pouco', 'Não'],
              context: 'gordura_localizada'
            };
          }
        }
      }
      
      // Para profissionais com problemas
      if ((perfil === 'medico' || perfil === 'profissional_estetica') && responses.intencao?.includes('problema')) {
        if (!responses.desafio_principal) {
          return {
            question: 'Qual seu maior desafio atual? 🎯',
            options: ['Reter clientes', 'Equipamentos', 'Marketing', 'Concorrência'],
            context: 'desafio_principal'
          };
        }
        if (responses.desafio_principal === 'Reter clientes' && !responses.problema_retencao) {
          return {
            question: 'Seus clientes voltam com frequência? 🔄',
            options: ['Poucos voltam', 'Alguns voltam', 'A maioria volta'],
            context: 'problema_retencao'
          };
        }
      }
      
      // Para ideias novas
      if (responses.intencao?.includes('ideia')) {
        if (!responses.equipamento_favorito) {
          return {
            question: 'Você tem algum equipamento favorito para trabalhar? ⚡',
            options: ['HIPRO', 'Endolaser', 'Peeling', 'Não tenho específico'],
            context: 'equipamento_favorito'
          };
        }
        if (!responses.tipo_campanha) {
          return {
            question: 'Que tipo de campanha te anima mais? 🚀',
            options: ['Antes e depois', 'Educativa', 'Promocional', 'Testemunhos'],
            context: 'tipo_campanha'
          };
        }
      }
    }
    
    return null;
  };

  const handleAnswer = async (answer: string) => {
    const progress = Math.min(questionProgress + 15, 100);
    setQuestionProgress(progress);

    // Lógica baseada no step atual
    switch (userProfile.step) {
      case 'profile':
        if (!userProfile.perfil) {
          if (answer.toLowerCase().includes('médico') || answer.toLowerCase().includes('sim')) {
            updateProfile({ perfil: 'medico', step: 'intention' });
            setCurrentQuestionText('Que incrível! Um(a) médico(a)! 👨‍⚕️✨ Você quer resolver algo agora, ou tá mais no clima de descobrir coisas novas comigo?');
            setCurrentOptions(['✅ Quero resolver um problema', '💡 Quero ter uma ideia nova', '🔍 Só tô curiosando mesmo']);
          } else {
            setCurrentQuestionText('Entendi! E me conta... você já estudou usando jaleco? 🥼');
            setCurrentOptions(['Sim, usei jaleco', 'Não, nunca usei', 'Que pergunta engraçada! 😄']);
          }
        } else {
          // Pergunta sobre jaleco
          if (answer.toLowerCase().includes('sim')) {
            setCurrentQuestionText('Aha! Então você trabalha ou já trabalhou em clínica de estética? 💅✨');
            setCurrentOptions(['Sim, trabalho', 'Já trabalhei', 'Não, nunca trabalhei']);
          } else {
            updateProfile({ perfil: 'cliente_final', step: 'intention' });
            setCurrentQuestionText('Perfeito! Você é nosso cliente especial! 💎 Você quer resolver algo agora, ou tá mais no clima de descobrir coisas novas comigo?');
            setCurrentOptions(['✅ Quero resolver um problema', '💡 Quero ter uma ideia nova', '🔍 Só tô curiosando mesmo']);
          }
        }
        break;

      case 'intention':
        const responses = { ...userProfile.responses, intencao: answer };
        updateProfile({ responses, step: 'diagnosis' });
        
        if (answer.includes('resolver um problema')) {
          if (userProfile.perfil === 'cliente_final') {
            setCurrentQuestionText('Vamos lá! Algo em você incomoda? 🤔');
            setCurrentOptions(['É o rosto mesmo', 'É o corpo', 'Tô me sentindo derretendo 😭', 'É meio que tudo']);
          } else {
            setCurrentQuestionText('Perfeito! Como profissional, você tem enfrentado algum desafio específico? 🎯');
            setCurrentOptions(['Dificuldade em reter clientes', 'Problemas com equipamentos', 'Questões de marketing', 'Concorrência muito forte']);
          }
        } else if (answer.includes('ideia nova')) {
          setCurrentQuestionText('Adoro isso! Que tal montar uma campanha criativa? 🚀 Você tem algum equipamento favorito para trabalhar?');
          setCurrentOptions(['HIPRO', 'Endolaser', 'Peeling', 'Não tenho equipamento específico']);
        } else {
          setCurrentQuestionText('Que gostoso! Curiosidade é o primeiro passo para a descoberta! 🔍✨ Quer que eu te conte sobre algum tratamento específico ou prefere que eu te surpreenda?');
          setCurrentOptions(['Me surpreenda!', 'Quero saber sobre flacidez', 'Fale sobre rejuvenescimento', 'Conte sobre tecnologias novas']);
        }
        break;

      case 'diagnosis':
        // Processar resposta e identificar contexto
        const advancedQuestion = getAdvancedQuestions();
        let context = 'generic_response';
        
        if (advancedQuestion) {
          context = advancedQuestion.context;
        }
        
        // Fix: get problema from processUserResponse return value
        const { problema } = processUserResponse(answer, context);
        
        // Verificar se ainda há perguntas específicas para fazer
        const nextAdvancedQuestion = getAdvancedQuestions();
        
        if (nextAdvancedQuestion) {
          setCurrentQuestionText(nextAdvancedQuestion.question);
          setCurrentOptions(nextAdvancedQuestion.options);
        } else if (problema && userProfile.step === 'diagnosis') {
          // Tentar gerar recomendação
          const recommendation = getRecommendation();
          
          if (recommendation) {
            setCurrentRecommendation(recommendation);
            updateProfile({ step: 'recommendation' });
            setShowRecommendation(true);
            setQuestionProgress(100);
          } else {
            setCurrentQuestionText('Interessante! Me conta mais uma coisa para eu te ajudar melhor...');
            setCurrentOptions(['Vamos continuar', 'Quero recomeçar']);
          }
        } else {
          // Perguntas de finalização
          setCurrentQuestionText('Ótimo! Com base no que você me contou, posso te ajudar de forma mais específica! 🎯✨');
          setCurrentOptions(['Quero a solução!', 'Me fale mais detalhes', 'Preciso pensar um pouco']);
        }
        break;
    }
  };

  const handleNewGame = () => {
    resetChat();
    setShowRecommendation(false);
    setCurrentRecommendation(null);
    setQuestionProgress(0);
    setCurrentQuestionText('Vamos brincar de descobrir quem é você nesse mundão da estética? 😄');
    setCurrentOptions(['Sou médico(a)', 'Não sou médico(a)', 'Prefiro não dizer agora']);
    setUserResponses({});
    setQIndex(0);
    setAnalyticsSent(false);
    sessionUtils.clear();
  };

  const handleContinueFromRecommendation = () => {
    setShowRecommendation(false);
    setCurrentQuestionText('Quer ver outras ideias que combinem com você? 🌟');
    setCurrentOptions(['Sim, quero mais opções', 'Quero nova consulta', 'Estou satisfeito(a)']);
  };

  // Se há recomendação para mostrar
  if (showRecommendation && currentRecommendation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              onClick={handleNewGame}
              variant="outline"
              className="bg-white/10 border-purple-400/30 text-white hover:bg-purple-600/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </motion.div>

          <RecommendationDisplay
            recommendation={currentRecommendation}
            onContinue={handleContinueFromRecommendation}
            onNewChat={handleNewGame}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header com Gamificação */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 shadow-2xl flex items-center justify-center"
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Mestre da Beleza
              </h1>
              <p className="text-white/80">Sua inteligência mágica descobridora</p>
            </div>
          </div>

          {userProgress && (
            <div className="w-80">
              <GamificationDisplay progress={userProgress} compact />
            </div>
          )}
        </motion.div>

        {/* Layout Centralizado */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Card Principal da Pergunta - Expandido */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur-sm border border-purple-400/30 shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-white">
                      <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500">
                        {getProfileIcon()}
                      </div>
                      <div>
                        <span className="text-2xl">{getProfileLabel()}</span>
                        {userProfile.perfil && (
                          <Badge className="ml-3 bg-purple-600/30 text-purple-100 border-purple-400/50">
                            <Star className="w-3 h-3 mr-1" />
                            Identificado
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                    
                    <Button
                      onClick={handleNewGame}
                      variant="ghost"
                      size="sm"
                      className="text-purple-200 hover:text-white"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Barra de Progresso */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">Descobrindo você...</span>
                      <span className="text-yellow-300">{questionProgress}%</span>
                    </div>
                    <Progress 
                      value={questionProgress} 
                      className="h-3 bg-purple-900/50"
                    />
                  </div>

                  {/* Pergunta */}
                  <motion.div
                    key={currentQuestionText}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="text-2xl text-white font-medium leading-relaxed">
                      {currentQuestionText || 'Vamos brincar de descobrir quem é você nesse mundão da estética? 😄'}
                    </div>
                    
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <span className="text-purple-200 text-sm">
                        Pense bem antes de responder...
                      </span>
                      <Wand2 className="w-5 h-5 text-pink-300" />
                    </div>
                  </motion.div>

                  {/* Opções de Resposta */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 gap-3"
                  >
                    <AnimatePresence mode="wait">
                      {currentOptions.map((option, index) => (
                        <motion.div
                          key={`${option}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Button
                            onClick={() => handleAnswer(option)}
                            variant="outline"
                            className="w-full h-auto p-4 bg-white/5 border-purple-400/50 text-purple-100 hover:bg-purple-600/30 hover:border-purple-300 text-left justify-start text-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              <span>{option}</span>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Painel Lateral - Apenas Informativo */}
          <div className="space-y-6">
            {/* Dicas Mágicas - Informativo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-sm border border-cyan-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-cyan-400" />
                    Dicas Mágicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-cyan-100 text-sm space-y-2">
                  <p>✨ Seja sincero(a) nas suas respostas</p>
                  <p>🎯 Cada pergunta me ajuda a te conhecer melhor</p>
                  <p>🔮 No final, terei a solução perfeita para você</p>
                  <p>⚡ Baseado em dados reais da plataforma Fluida</p>
                  {userProfile.perfil && (
                    <div className="mt-4 p-3 bg-cyan-800/30 rounded-lg">
                      <p className="font-semibold text-cyan-200">🎭 Perfil Identificado:</p>
                      <p className="text-xs">{getProfileLabel()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Progresso da Sessão */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm border border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-green-400" />
                    Progresso
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-100 text-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${userProfile.perfil ? 'bg-green-400' : 'bg-gray-500'}`} />
                    <span>Perfil identificado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${userProfile.responses.intencao ? 'bg-green-400' : 'bg-gray-500'}`} />
                    <span>Intenção definida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${userProfile.problema_identificado ? 'bg-green-400' : 'bg-gray-500'}`} />
                    <span>Diagnóstico completo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${showRecommendation ? 'bg-green-400' : 'bg-gray-500'}`} />
                    <span>Recomendação gerada</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MestreDaBelezaAkinator;
