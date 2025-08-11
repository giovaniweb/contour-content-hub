import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Star, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { SurveyQuestion, SurveyResponse, useAcademySurvey } from '@/hooks/useAcademySurvey';

interface SurveyPlayerProps {
  courseId: string;
  courseTitle: string;
  onComplete: () => void;
  onBack: () => void;
}

export const SurveyPlayer: React.FC<SurveyPlayerProps> = ({
  courseId,
  courseTitle,
  onComplete,
  onBack
}) => {
  const { questions, submitSurvey, isLoading } = useAcademySurvey(courseId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, SurveyResponse>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleResponseChange = (questionId: string, response: Partial<SurveyResponse>) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        question_id: questionId,
        ...prev[questionId],
        ...response
      }
    }));
  };

  const canProceed = () => {
    if (!currentQuestion) return false;
    const response = responses[currentQuestion.id];
    
    if (!currentQuestion.is_required) return true;
    
    if (currentQuestion.question_type === 'rating') {
      return response?.rating !== undefined;
    }
    
    return response?.response_value && response.response_value.trim() !== '';
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
    const responseArray = Object.values(responses);
    setIsSubmitting(true);
    
    try {
      await submitSurvey(responseArray);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
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
          <p className="text-muted-foreground">Carregando pesquisa...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">Nenhuma pesquisa disponível para este curso.</p>
        <Button onClick={onBack}>Voltar ao Curso</Button>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Obrigado!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Sua pesquisa de satisfação foi enviada com sucesso.
            </p>
            <p className="text-muted-foreground">
              Seu feedback é muito importante para melhorarmos nossos cursos.
            </p>
            <Button onClick={handleFinish} className="mt-6">
              Finalizar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const currentResponse = responses[currentQuestion.id];

    switch (currentQuestion.question_type) {
      case 'rating':
        return (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Clique nas estrelas para avaliar (1-5)
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleResponseChange(currentQuestion.id, { rating })}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      currentResponse?.rating && currentResponse.rating >= rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {currentResponse?.rating && (
              <p className="text-center text-sm text-muted-foreground">
                Avaliação: {currentResponse.rating}/5
              </p>
            )}
          </div>
        );

      case 'text':
        return (
          <Textarea
            placeholder="Digite sua resposta..."
            value={currentResponse?.response_value || ''}
            onChange={(e) => handleResponseChange(currentQuestion.id, { response_value: e.target.value })}
            rows={4}
          />
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={currentResponse?.response_value || ''}
            onValueChange={(value) => handleResponseChange(currentQuestion.id, { response_value: value })}
          >
            {currentQuestion.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Curso
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Pesquisa de Satisfação</h1>
            <p className="text-muted-foreground">{courseTitle}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Pergunta {currentQuestionIndex + 1} de {questions.length}</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {currentQuestion?.question_text}
            {currentQuestion?.is_required && (
              <span className="text-red-500 text-sm">*</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderQuestionInput()}
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
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Pesquisa'}
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