
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ChevronLeft, ChevronRight, Brain, Target, Lightbulb } from 'lucide-react';
import { useEquipments, Equipment } from '@/hooks/useEquipments';
import { getErrorMessage } from '@/utils/errorUtils';

interface MarketingStep {
  id: string;
  text: string;
  type: 'multiple_choice' | 'equipment_selection';
  answers: Answer[];
  phase: string;
}

interface Answer {
  id: string;
  text: string;
  points: number;
  next_question_id?: string;
}

const phaseIcons: { [key: string]: React.ReactNode } = {
  'Definição do Público': <Target className="h-5 w-5 text-yellow-400" />,
  'Necessidades e Desejos': <Lightbulb className="h-5 w-5 text-blue-400" />,
  'Equipamentos Ideais': <Sparkles className="h-5 w-5 text-pink-400" />,
};

const phaseColors: { [key: string]: string } = {
  'Definição do Público': 'bg-yellow-500/20 text-yellow-400 border-yellow-400',
  'Necessidades e Desejos': 'bg-blue-500/20 text-blue-400 border-blue-400',
  'Equipamentos Ideais': 'bg-pink-500/20 text-pink-400 border-pink-400',
};

interface MarketingQuestionProps {
  stepData: MarketingStep;
  currentStep: number;
  onOptionSelect: (value: string) => Promise<void>;
  onGoBack: () => void;
  canGoBack: boolean;
}

const MarketingQuestion: React.FC<MarketingQuestionProps> = ({
  stepData,
  currentStep,
  onOptionSelect,
  onGoBack,
  canGoBack
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { equipments, loading: equipmentsLoading, error: equipmentsError } = useEquipments();

  useEffect(() => {
    setSelectedAnswer(null);
  }, [stepData]);

  const getPhaseIcon = (phase: string) => {
    return phaseIcons[phase] || <Brain className="h-5 w-5 text-gray-400" />;
  };

  const getPhaseColor = (phase: string) => {
    return phaseColors[phase] || 'bg-gray-500/20 text-gray-400 border-gray-400';
  };

  const getEquipmentsByCategory = (equipments: Equipment[], category: 'medico' | 'estetico'): Equipment[] => {
    return equipments.filter(eq => eq.categoria === category);
  };

  const renderAnswerOptions = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stepData.answers.map((answer) => (
          <Card
            key={answer.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              selectedAnswer === answer.id
                ? 'border-aurora-electric-purple bg-aurora-electric-purple/20 aurora-glow'
                : 'border-slate-600 hover:border-aurora-electric-purple aurora-glass'
            }`}
            onClick={() => setSelectedAnswer(answer.id)}
          >
            <CardContent className="p-4">
              <h3 className="font-semibold text-white">{answer.text}</h3>
              <p className="text-sm text-slate-400 mt-1">
                {answer.points} pontos
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) return;

    setIsSubmitting(true);
    try {
      await onOptionSelect(selectedAnswer);
    } catch (error) {
      console.error('Error submitting answer:', getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEquipmentOptions = () => {
    if (equipmentsLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando equipamentos...</p>
        </div>
      );
    }

    if (equipmentsError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{getErrorMessage(equipmentsError)}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      );
    }

    // Filter only akinator-enabled equipments
    const enabledEquipments = equipments.filter(eq => eq.akinator_enabled);
    
    if (enabledEquipments.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-slate-400">Nenhum equipamento disponível para o Akinator</p>
        </div>
      );
    }

    const medicalEquipments = getEquipmentsByCategory(enabledEquipments, 'medico');
    const aestheticEquipments = getEquipmentsByCategory(enabledEquipments, 'estetico');

    return (
      <div className="space-y-6">
        {/* Medical Equipment Section */}
        {medicalEquipments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🏥</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Equipamentos Médicos</h3>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {medicalEquipments.length} disponíveis
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {medicalEquipments.map((equipment) => (
                <Card
                  key={equipment.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                    selectedAnswer === equipment.id
                      ? 'border-blue-500 bg-blue-500/20 aurora-glow'
                      : 'border-slate-600 hover:border-blue-400 aurora-glass'
                  }`}
                  onClick={() => setSelectedAnswer(equipment.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {equipment.nome.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{equipment.nome}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {equipment.tecnologia}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Aesthetic Equipment Section */}
        {aestheticEquipments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-white">Equipamentos Estéticos</h3>
              <Badge variant="secondary" className="bg-pink-500/20 text-pink-400 border-pink-500/30">
                {aestheticEquipments.length} disponíveis
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {aestheticEquipments.map((equipment) => (
                <Card
                  key={equipment.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                    selectedAnswer === equipment.id
                      ? 'border-pink-500 bg-pink-500/20 aurora-glow'
                      : 'border-slate-600 hover:border-pink-400 aurora-glass'
                  }`}
                  onClick={() => setSelectedAnswer(equipment.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {equipment.nome.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{equipment.nome}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {equipment.tecnologia}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Calculate progress - this would need to be passed from parent component
  const progress = ((currentStep + 1) / 20) * 100;
  const currentPhase = stepData.phase;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getPhaseIcon(currentPhase)}
            <div>
              <h2 className="text-xl font-bold text-white">{currentPhase}</h2>
              <p className="text-slate-400 text-sm">Pergunta {currentStep + 1} de 20</p>
            </div>
          </div>
          
          <Badge 
            variant="secondary" 
            className={`${getPhaseColor(currentPhase)} border-opacity-50`}
          >
            {Math.round(progress)}% Completo
          </Badge>
        </div>
        
        <Progress 
          value={progress} 
          className="h-2 bg-slate-700"
        />
      </div>

      {/* Question Card */}
      <Card className="aurora-glass border-aurora-electric-purple/30 mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-start gap-3">
            <Brain className="h-6 w-6 text-aurora-electric-purple mt-1 flex-shrink-0" />
            <span className="leading-relaxed">{stepData.text}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {stepData.type === 'equipment_selection' ? renderEquipmentOptions() : renderAnswerOptions()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        {canGoBack && (
          <Button
            variant="outline"
            onClick={onGoBack}
            disabled={isSubmitting}
            className="aurora-glass border-slate-600 hover:border-slate-500"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        )}
        
        <div className="flex-1" />
        
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer || isSubmitting}
          className="aurora-button aurora-glow hover:aurora-glow-intense"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Processando...
            </>
          ) : (
            <>
              Próxima
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MarketingQuestion;
