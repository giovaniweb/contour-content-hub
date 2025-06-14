
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  Zap, 
  Eye, 
  Brain, 
  Gem,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAkinatorMagico } from '@/hooks/useAkinatorMagico';
import './akinator-animations.css';

const AkinatorMagico: React.FC = () => {
  const {
    currentQuestion,
    confidence,
    userProfile,
    behavioralProfile,
    currentPhrase,
    currentRecommendation,
    gameState,
    isThinking,
    answerQuestion,
    resetGame,
    startNewSession
  } = useAkinatorMagico();

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
          Vou descobrir seus desejos mais profundos de beleza através de perguntas misteriosas...
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
          <span className="text-sm">Prepare-se para uma experiência mágica</span>
          <Star className="h-5 w-5" />
        </div>
        
        <Button
          onClick={startNewSession}
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
      {/* Confidence and behavioral analysis */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Eye className="h-5 w-5 text-purple-400" />
          <span className="text-sm text-gray-400">
            Clareza Mística: {confidence}%
          </span>
        </div>
        <Badge variant="outline" className="border-purple-400 text-purple-400">
          <Brain className="h-3 w-3 mr-1" />
          {behavioralProfile}
        </Badge>
      </div>

      {/* Current mystical phrase */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-purple-300 italic text-sm thought-bubble">
          "{currentPhrase}"
        </p>
      </motion.div>

      {/* Question card */}
      <Card className="aurora-glass magical-glow">
        <CardContent className="p-8">
          <motion.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                {currentQuestion?.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion?.options?.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => answerQuestion(option.value)}
                    variant="outline"
                    className="w-full p-6 text-left h-auto hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300"
                    disabled={isThinking}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-white">{option.label}</span>
                      <ArrowRight className="h-4 w-4 text-purple-400" />
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Reset option */}
      <div className="text-center">
        <Button
          onClick={resetGame}
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

  const renderThinking = () => (
    <div className="text-center space-y-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
      >
        <Brain className="h-8 w-8 text-white" />
      </motion.div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">
          Analisando sua essência...
        </h3>
        <p className="text-purple-300">
          {currentPhrase}
        </p>
      </div>
    </div>
  );

  const renderRecommendation = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Gem className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-magical">
          🔮 Revelação Mística
        </h2>
        
        <p className="text-lg text-purple-300 italic">
          "Vejo em você uma alma que busca..."
        </p>
      </motion.div>

      <Card className="aurora-glass border-yellow-400/30">
        <CardContent className="p-8 space-y-6">
          {currentRecommendation && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentRecommendation.equipamento}
                </h3>
                <Badge className="bg-yellow-400 text-black">
                  Confiança: {currentRecommendation.confianca}%
                </Badge>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-300 leading-relaxed">
                  {currentRecommendation.explicacao}
                </p>
                
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">
                    Por que esta é sua escolha perfeita:
                  </h4>
                  <p className="text-sm text-gray-300">
                    {currentRecommendation.motivacao}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <Button
          onClick={resetGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Nova Consulta Mágica
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState === 'welcome' && (
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

          {gameState === 'questioning' && (
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

          {gameState === 'thinking' && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center"
            >
              {renderThinking()}
            </motion.div>
          )}

          {gameState === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12"
            >
              {renderRecommendation()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AkinatorMagico;
