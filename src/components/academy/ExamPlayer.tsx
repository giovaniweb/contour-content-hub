import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { ExamQuestion, useAcademyExams } from '@/hooks/useAcademyExams';

interface ExamPlayerProps {
  courseId: string;
  courseTitle: string;
  onComplete: () => void;
  onBack: () => void;
}

export const ExamPlayer: React.FC<ExamPlayerProps> = ({
  courseId,
  courseTitle,
  onComplete,
  onBack
}) => {
  const { questions, submitExam, isLoading } = useAcademyExams(courseId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const canProceed = () => {
    return currentQuestion && answers[currentQuestion.id];
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitExam(answers);
      setExamResults(result);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting exam:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onComplete();
    onBack();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando prova...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">Nenhuma questão disponível para este curso.</p>
        <Button onClick={onBack}>Voltar ao Curso</Button>
      </div>
    );
  }

  if (showResults && examResults) {
    const percentage = Math.round((examResults.score / questions.reduce((acc, q) => acc + q.points, 0)) * 100);
    const passed = examResults.passed;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {passed ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed ? 'Parabéns!' : 'Prova Concluída'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">
              {percentage}%
            </div>
            <p className="text-lg text-muted-foreground">
              Você acertou {examResults.score} de {questions.reduce((acc, q) => acc + q.points, 0)} pontos
            </p>
            {passed ? (
              <p className="text-green-600">
                Você passou na prova! Agora pode prosseguir para receber seu certificado.
              </p>
            ) : (
              <p className="text-orange-600">
                Você precisa de pelo menos 70% para passar. Revise o conteúdo e tente novamente.
              </p>
            )}
            <Button onClick={handleFinish} className="mt-6">
              Finalizar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Curso
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Prova Final</h1>
            <p className="text-muted-foreground">{courseTitle}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion?.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion?.options && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.option_text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting || Object.keys(answers).length !== questions.length}
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Prova'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Próxima
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};