
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  Zap, 
  Eye, 
  Brain, 
  Gem,
  ArrowRight,
  RotateCcw,
  Clock,
  Target,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMestreDaBeleza } from '@/hooks/useMestreDaBeleza';
import RecommendationDisplay from './RecommendationDisplay';
import './akinator-animations.css';

const AkinatorMagico: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    getRecommendation,
    resetChat,
    processUserResponse,
    getCurrentQuestion,
    isCompleted,
    getProgress
  } = useMestreDaBeleza();
  
  const [isThinking, setIsThinking] = useState(false);
  const [mysticalPhrase, setMysticalPhrase] = useState('Preparando a consulta mágica...');

  const currentQuestion = getCurrentQuestion();
  const currentRecommendation = getRecommendation();
  const progress = getProgress();
  const confidence = Math.min(95, Math.max(40, progress));

  // Frases místicas baseadas no progresso
  useEffect(() => {
    const phrases = [
      'Consultando os astros da beleza...',
      'Analisando sua essência estética...',
      'Descobrindo seus desejos secretos...',
      'Conectando com energias transformadoras...',
      'Revelando o equipamento perfeito...',
      'Finalizando o diagnóstico mágico...'
    ];
    
    const phraseIndex = Math.floor((progress / 100) * (phrases.length - 1));
    setMysticalPhrase(phrases[phraseIndex] || phrases[0]);
  }, [progress]);

  const handleAnswerQuestion = async (answer: string) => {
    if (!currentQuestion || isThinking) return;

    setIsThinking(true);
    
    // Simular tempo de "pensamento" do Akinator
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = processUserResponse(answer, currentQuestion.context);
    console.log('Resposta processada:', result);
    
    setIsThinking(false);
  };

  const handleResetGame = () => {
    resetChat();
  };

  const handleStartNewSession = () => {
    console.log('Starting new session...');
    updateProfile({ 
      step: 'intention',
      primeira_interacao: false 
    });
  };

  const handleContinueFromRecommendation = () => {
    // Aqui pode implementar navegação para outras páginas
    console.log('Continuing from recommendation...');
  };

  const renderWelcomeScreen = () => (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6"
          >
            <Gem className="h-12 w-12 text-white crystal-pulse" />
          </motion.div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-6 w-6 text-yellow-400 sparkle-animation" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-magical mb-4">
          🔮 Mestre da Beleza Mágico
        </h1>
        <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
          Vou descobrir o equipamento perfeito para você através de perguntas inteligentes...
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-center space-x-2 text-yellow-400">
          <Star className="h-5 w-5" />
          <span className="text-sm">Prepare-se para uma experiência personalizada</span>
          <Star className="h-5 w-5" />
        </div>
        
        <Button
          onClick={handleStartNewSession}
          size="lg"
          className="magical-glow bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold text-lg"
        >
          <Zap className="mr-2 h-5 w-5" />
          Iniciar Consulta Mágica
        </Button>
      </motion.div>
    </div>
  );

  const renderQuestion = () => (
    <div className="space-y-8">
      {/* Header com progresso e confiança */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Eye className="h-5 w-5 text-purple-400" />
          <span className="text-sm text-gray-400">
            Clareza Mística: {confidence}%
          </span>
        </div>
        <Badge variant="outline" className="border-purple-400 text-purple-400">
          <Target className="h-3 w-3 mr-1" />
          Pergunta {userProfile.current_question_index + 1}
        </Badge>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-purple-300">
          <span>Progresso da consulta</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-3 bg-purple-900/50" />
      </div>

      {/* Frase mística atual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-purple-300 italic text-sm thought-bubble">
          "{mysticalPhrase}"
        </p>
      </motion.div>

      {/* Card da pergunta */}
      <Card className="aurora-glass magical-glow">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {isThinking ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                >
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    Analisando sua resposta...
                  </h3>
                  <p className="text-purple-300">
                    {mysticalPhrase}
                  </p>
                </div>
              </motion.div>
            ) : currentQuestion ? (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {currentQuestion.text}
                  </h2>
                  {currentQuestion.type && (
                    <Badge variant="secondary" className="mb-4">
                      {currentQuestion.type === 'profile' && '👤 Perfil'}
                      {currentQuestion.type === 'intention' && '🎯 Intenção'}
                      {currentQuestion.type === 'diagnosis' && '🔍 Diagnóstico'}
                      {currentQuestion.type === 'nostalgia' && '⏰ Nostalgia'}
                      {currentQuestion.type === 'technical' && '⚙️ Técnica'}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        onClick={() => handleAnswerQuestion(option)}
                        variant="outline"
                        className="w-full p-6 text-left h-auto hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300"
                        disabled={isThinking}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-white text-sm">{option}</span>
                          <ArrowRight className="h-4 w-4 text-purple-400 flex-shrink-0 ml-2" />
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-white">
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-semibold mb-2">Consulta Finalizada!</h3>
                <p className="text-purple-300">Processando sua recomendação personalizada...</p>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Opção de reset */}
      <div className="text-center">
        <Button
          onClick={handleResetGame}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Recomeçar consulta
        </Button>
      </div>
    </div>
  );

  // Determinar fase atual
  const isWelcomePhase = userProfile.step === 'profile' && userProfile.primeira_interacao;
  const isQuestioningPhase = !isWelcomePhase && !isCompleted() && currentQuestion;
  const isCompletedPhase = isCompleted() && currentRecommendation;

  console.log('Estado atual:', {
    step: userProfile.step,
    isWelcome: isWelcomePhase,
    isQuestioning: isQuestioningPhase,
    isCompleted: isCompletedPhase,
    currentQuestion: currentQuestion?.id,
    progress
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {isWelcomePhase && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center"
            >
              {renderWelcomeScreen()}
            </motion.div>
          )}

          {isQuestioningPhase && (
            <motion.div
              key="questioning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12"
            >
              {renderQuestion()}
            </motion.div>
          )}

          {isCompletedPhase && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12"
            >
              <RecommendationDisplay
                recommendation={currentRecommendation}
                onContinue={handleContinueFromRecommendation}
                onNewChat={handleResetGame}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AkinatorMagico;
