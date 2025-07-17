import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  return (
    <div className="w-full space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-background/10 rounded-full h-2 mb-8">
        <motion.div 
          className="h-full bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {/* Step indicator */}
          <Badge variant="outline" className="mb-4">
            Etapa {currentStep + 1} de {totalSteps}
          </Badge>

          {/* Question title and description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{question.title}</h2>
            {question.description && (
              <p className="text-muted-foreground">{question.description}</p>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {question.options.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="p-4 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => onNext(option.value)}
                >
                  <div className="flex items-center gap-4">
                    {option.icon && (
                      <div className="text-primary">{option.icon}</div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{option.label}</h3>
                      {option.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="text-muted-foreground/50" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            {canGoBack ? (
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            ) : <div />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionFlow;