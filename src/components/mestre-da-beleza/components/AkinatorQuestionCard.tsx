
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Target, Brain, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Option {
  label: string;
  value: string;
}

interface Question {
  id: string;
  text: string;
  context: string;
  options: string[];
  type?: string;
}

interface AkinatorQuestionCardProps {
  isThinking: boolean;
  currentQuestion: Question | null;
  handleAnswer: (option: string) => void;
  handleReset: () => void;
  progress: number;
  confidence: number;
  mysticalPhrase: string;
  currentIndex: number;
}

const AkinatorQuestionCard: React.FC<AkinatorQuestionCardProps> = ({
  isThinking,
  currentQuestion,
  handleAnswer,
  handleReset,
  progress,
  confidence,
  mysticalPhrase,
  currentIndex
}) => (
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
        Pergunta {currentIndex + 1}
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
      <p className="text-purple-300 italic text-sm">
        "{mysticalPhrase}"
      </p>
    </motion.div>
    {/* Card da pergunta */}
    <Card className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-sm border-2 border-purple-400/50">
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
                      onClick={() => handleAnswer(option)}
                      variant="outline"
                      className="w-full p-6 text-left h-auto hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300"
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
        onClick={handleReset}
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

export default AkinatorQuestionCard;
