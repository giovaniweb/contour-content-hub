
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lightbulb, Target, Users, TrendingUp, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketingQuestionProps } from './types';

const MarketingQuestion: React.FC<MarketingQuestionProps> = ({
  stepData,
  currentStep,
  onOptionSelect,
  onGoBack,
  canGoBack = false,
  progress,
  totalQuestions
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswering(false);
  }, [stepData.id]);

  const handleAnswerSelect = useCallback((answerId: string) => {
    if (isAnswering) return;
    
    setSelectedAnswer(answerId);
    setIsAnswering(true);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      try {
        onOptionSelect(answerId);
      } catch (error) {
        console.error('Error handling answer:', error);
        const errorMessage = typeof error === 'string' ? error : error instanceof Error ? error.message : 'Erro ao processar resposta';
        // Handle error appropriately
        setIsAnswering(false);
        setSelectedAnswer(null);
      }
    }, 300);
  }, [onOptionSelect, isAnswering]);

  const getQuestionIcon = (type: string) => {
    switch (type) {
      case 'profile':
        return Users;
      case 'intention':
        return Target;
      case 'diagnosis':
        return TrendingUp;
      case 'nostalgia':
        return MessageCircle;
      case 'technical':
        return Lightbulb;
      default:
        return Sparkles;
    }
  };

  const IconComponent = getQuestionIcon('default');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full bg-gradient-to-r from-slate-800 to-slate-700 rounded-full h-2 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        {canGoBack && onGoBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
            {progress?.toFixed(0)}% Completo
          </Badge>
          <Badge variant="outline" className="text-slate-400 border-slate-500/30">
            {Math.ceil((progress || 0) / 100 * (totalQuestions || 10))} de {totalQuestions || 10}
          </Badge>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <Card className="aurora-glass border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <IconComponent className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {stepData.question}
                </h2>
              </div>
            </div>

            {/* Answers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {stepData.options?.map((option, index) => (
                  <motion.div
                    key={option.value || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                        selectedAnswer === option.value
                          ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-slate-600/50 hover:border-cyan-500/50 bg-slate-800/50'
                      } ${isAnswering ? 'pointer-events-none' : ''}`}
                      onClick={() => handleAnswerSelect(option.value)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className={`font-semibold text-lg ${
                            selectedAnswer === option.value
                              ? 'text-cyan-300'
                              : 'text-white'
                          }`}>
                            {option.label}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Loading State */}
            {isAnswering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center mt-6 p-4"
              >
                <div className="flex items-center gap-3 text-cyan-400">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Processando resposta...</span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MarketingQuestion;
