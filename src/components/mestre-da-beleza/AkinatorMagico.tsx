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
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMestreDaBeleza } from '@/hooks/useMestreDaBeleza';
import { useMestreDaBelezaAnalytics, ANALYTICS_EVENTS } from '@/hooks/useMestreDaBelezaAnalytics';
import RecommendationDisplay from './RecommendationDisplay';
import './akinator-animations.css';
import AkinatorWelcomeScreen from "./components/AkinatorWelcomeScreen";
import AkinatorQuestionCard from "./components/AkinatorQuestionCard";
import { useAkinatorMystic } from "./hooks/useAkinatorMystic";

const AkinatorMagico: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    getRecommendation,
    resetChat,
    processUserResponse,
    getCurrentQuestion,
    isCompleted,
    getProgress,
    equipments,
    loading: equipmentsLoading,
    error: equipmentsError
  } = useMestreDaBeleza();
  
  const { logEvent } = useMestreDaBelezaAnalytics();
  
  const [isThinking, setIsThinking] = useState(false);
  const [mysticalPhrase, setMysticalPhrase] = useState('Preparando a consulta mágica...');

  const currentQuestion = getCurrentQuestion();
  const currentRecommendation = getRecommendation();
  const progress = getProgress();
  const confidence = Math.min(95, Math.max(40, progress));

  // Debug logs
  useEffect(() => {
    console.log('🔮 [AkinatorMagico] Estado atual:', {
      userProfile: {
        step: userProfile.step,
        primeira_interacao: userProfile.primeira_interacao,
        current_question_index: userProfile.current_question_index,
        session_id: userProfile.session_id
      },
      currentQuestion: currentQuestion?.id,
      isCompleted: isCompleted(),
      equipmentsCount: equipments?.length || 0,
      equipmentsLoading,
      equipmentsError: equipmentsError?.message,
      progress,
      confidence
    });
  }, [userProfile, currentQuestion, isCompleted, equipments, equipmentsLoading, equipmentsError, progress, confidence]);

  // Log de início de sessão
  useEffect(() => {
    if (!equipmentsLoading && userProfile.primeira_interacao && equipments) {
      logEvent(ANALYTICS_EVENTS.SESSION_STARTED, { 
        equipments_available: equipments.length 
      }, userProfile);
      console.log('📊 [AkinatorMagico] Sessão iniciada logada');
    }
  }, [equipmentsLoading, userProfile.primeira_interacao, equipments, logEvent, userProfile]);

  // Frases místicas baseadas no progresso
  const mysticalPhrase = useAkinatorMystic(progress);

  const handleAnswerQuestion = async (answer: string) => {
    if (!currentQuestion || isThinking) return;

    setIsThinking(true);
    
    // Log da resposta
    logEvent(ANALYTICS_EVENTS.QUESTION_ANSWERED, {
      question_id: currentQuestion.id,
      answer,
      question_index: userProfile.current_question_index
    }, userProfile);
    
    console.log('💬 [AkinatorMagico] Resposta selecionada:', { answer, question: currentQuestion.id });
    
    // Simular tempo de "pensamento" do Akinator
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = processUserResponse(answer, currentQuestion.context);
    console.log('✅ [AkinatorMagico] Resposta processada:', result);
    
    setIsThinking(false);
  };

  const handleResetGame = () => {
    console.log('🔄 [AkinatorMagico] Resetando jogo');
    logEvent(ANALYTICS_EVENTS.SESSION_RESET, {}, userProfile);
    resetChat();
  };

  const handleStartNewSession = () => {
    console.log('🚀 [AkinatorMagico] Iniciando nova sessão');
    updateProfile({ 
      step: 'intention',
      primeira_interacao: false 
    });
  };

  const handleContinueFromRecommendation = () => {
    console.log('➡️ [AkinatorMagico] Continuando da recomendação');
  };

  // Loading state
  

  // Error state - quando há erro ao carregar equipamentos
  

  // Error state - quando não há equipamentos disponíveis
  

  

  

  // Determinar fase atual
  const isWelcomePhase = userProfile.step === 'profile' && userProfile.primeira_interacao;
  const isQuestioningPhase = !isWelcomePhase && !isCompleted() && currentQuestion;
  const isCompletedPhase = isCompleted() && currentRecommendation;

  console.log('🎭 [AkinatorMagico] Fase de renderização:', {
    step: userProfile.step,
    isWelcome: isWelcomePhase,
    isQuestioning: isQuestioningPhase,
    isCompleted: isCompletedPhase,
    currentQuestion: currentQuestion?.id,
    currentRecommendation: currentRecommendation?.equipamento?.nome,
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
              <AkinatorWelcomeScreen
                equipmentsCount={equipments?.length || 0}
                onStart={handleStartNewSession}
              />
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
              <AkinatorQuestionCard
                isThinking={isThinking}
                currentQuestion={currentQuestion}
                handleAnswer={handleAnswerQuestion}
                handleReset={handleResetGame}
                progress={progress}
                confidence={confidence}
                mysticalPhrase={mysticalPhrase}
                currentIndex={userProfile.current_question_index}
              />
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
