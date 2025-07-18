import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface QuestionFlowProps {
  question: {
    title: string;
    description?: string;
    options: {
      label: string;
      value: string;
      description?: string;
      icon?: React.ReactNode;
    }[];
    isOpen?: boolean;
  };
  currentStep: number;
  totalSteps: number;
  onNext: (value: string) => void;
  onBack: () => void;
  canGoBack: boolean;
}

const QuestionFlow: React.FC<QuestionFlowProps> = ({
  question,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  canGoBack
}) => {
  const [openAnswer, setOpenAnswer] = useState('');

  const handleOpenAnswerSubmit = () => {
    if (openAnswer.trim()) {
      onNext(openAnswer.trim());
    }
  };

  const isOpenQuestion = question.isOpen || question.options.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-3 mb-2 shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-lg"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-sm text-white/70 mt-2">
          <span>Início</span>
          <span>Diagnóstico Completo</span>
        </div>
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Step indicator */}
          <div className="text-center">
            <Badge 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm font-medium backdrop-blur-sm"
            >
              Etapa {currentStep + 1} de {totalSteps}
            </Badge>
          </div>

          {/* Question title and description */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {question.title}
            </h2>
            {question.description && (
              <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                {question.description}
              </p>
            )}
          </div>

          {/* Options or Open Input */}
          {isOpenQuestion ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-4">
                <label className="block text-lg font-medium text-white text-center">
                  Sua resposta:
                </label>
                {question.title.toLowerCase().includes('descreva') ? (
                  <Textarea
                    value={openAnswer}
                    onChange={(e) => setOpenAnswer(e.target.value)}
                    placeholder="Digite sua resposta detalhada aqui..."
                    className="min-h-[120px] bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 rounded-xl text-lg p-4"
                  />
                ) : (
                  <Input
                    value={openAnswer}
                    onChange={(e) => setOpenAnswer(e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 rounded-xl text-lg p-4 h-14"
                  />
                )}
              </div>
              <Button
                onClick={handleOpenAnswerSubmit}
                disabled={!openAnswer.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {question.options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="p-6 cursor-pointer bg-white/10 backdrop-blur-sm border-white/20 hover:border-purple-400 hover:bg-white/15 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl group"
                    onClick={() => onNext(option.value)}
                  >
                    <div className="flex items-center gap-4">
                      {option.icon && (
                        <div className="text-purple-400 group-hover:text-pink-400 transition-colors duration-300 text-2xl">
                          {option.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg group-hover:text-purple-200 transition-colors duration-300">
                          {option.label}
                        </h3>
                        {option.description && (
                          <p className="text-sm text-white/70 mt-2 leading-relaxed">
                            {option.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="text-white/40 group-hover:text-purple-400 transition-all duration-300 group-hover:translate-x-1" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center items-center mt-12">
            {canGoBack && (
              <Button 
                variant="outline" 
                onClick={onBack}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 hover:border-white/30 rounded-xl px-6 py-3 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionFlow;