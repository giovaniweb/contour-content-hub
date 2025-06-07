
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { AkinatorStep } from './types';

interface AkinatorQuestionProps {
  stepData: AkinatorStep;
  currentStep: number;
  onOptionSelect: (value: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const AkinatorQuestion: React.FC<AkinatorQuestionProps> = ({
  stepData,
  currentStep,
  onOptionSelect,
  onGoBack,
  canGoBack
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {stepData.question}
              </motion.div>
            </AnimatePresence>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {stepData.options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="justify-start h-auto p-4 text-left"
                onClick={() => onOptionSelect(option.value)}
              >
                <div className="flex items-center gap-3">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      {canGoBack && (
        <div className="text-center">
          <Button variant="ghost" onClick={onGoBack}>
            ← Voltar
          </Button>
        </div>
      )}
    </div>
  );
};

export default AkinatorQuestion;
