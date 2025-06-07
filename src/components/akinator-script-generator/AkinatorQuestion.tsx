
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video,
  Image,
  Grid3X3,
  Lightbulb,
  Zap,
  Target,
  Heart,
  BookOpen,
  Crown
} from "lucide-react";
import { AkinatorStep } from './types';

interface AkinatorQuestionProps {
  stepData: AkinatorStep;
  currentStep: number;
  onOptionSelect: (value: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const getIcon = (stepId: string, optionValue: string) => {
  if (stepId === 'contentType') {
    switch (optionValue) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'carousel': return <Grid3X3 className="h-4 w-4" />;
      case 'bigIdea': return <Lightbulb className="h-4 w-4" />;
    }
  }
  
  if (stepId === 'objective') {
    switch (optionValue) {
      case 'vender': return <Zap className="h-4 w-4" />;
      case 'leads': return <Target className="h-4 w-4" />;
      case 'engajar': return <Heart className="h-4 w-4" />;
      case 'ensinar': return <BookOpen className="h-4 w-4" />;
      case 'posicionar': return <Crown className="h-4 w-4" />;
    }
  }
  
  return null;
};

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
                  {getIcon(stepData.id, option.value)}
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
