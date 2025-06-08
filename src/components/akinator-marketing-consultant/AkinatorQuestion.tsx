
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Question } from './types';

interface AkinatorQuestionProps {
  question: Question;
  currentStep: number;
  totalSteps: number;
  onAnswer: (answer: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const AkinatorQuestion: React.FC<AkinatorQuestionProps> = ({
  question,
  currentStep,
  totalSteps,
  onAnswer,
  onGoBack,
  canGoBack
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pergunta {currentStep + 1} de {totalSteps}</span>
          <span>{Math.round(progress)}% concluído</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Back Button */}
      {canGoBack && (
        <Button 
          variant="ghost" 
          onClick={onGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      )}

      {/* Question Card */}
      <Card className="border-2 hover:border-primary/50 transition-colors">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onAnswer(option.value)}
              className="w-full justify-start text-left h-auto p-4 hover:bg-primary/5 hover:border-primary/50"
            >
              <div>
                <div className="font-medium">{option.label}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AkinatorQuestion;
