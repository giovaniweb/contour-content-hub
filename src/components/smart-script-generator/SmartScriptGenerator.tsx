
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle, Target, Users, Palette, FileText, Plus, Wrench } from 'lucide-react';
import { useSmartScriptGeneration } from '@/pages/ScriptGeneratorPage/useSmartScriptGeneration';
import { EQUIPMENT_SUGGESTIONS } from './intentionTree';
import { useEquipments } from '@/hooks/useEquipments';

interface SmartScriptGeneratorProps {
  onGenerate: (data: any) => void;
  isGenerating?: boolean;
}

export const SmartScriptGenerator: React.FC<SmartScriptGeneratorProps> = ({ 
  onGenerate, 
  isGenerating = false 
}) => {
  const {
    currentStep,
    intention,
    getCurrentQuestion,
    handleAnswer,
    handleThemeInput
  } = useSmartScriptGeneration();

  const { equipments, loading: equipmentsLoading } = useEquipments();
  const [themeText, setThemeText] = useState('');

  const getStepNumber = () => {
    const steps = ['root', 'objetivo', 'canal', 'estilo', 'equipamento', 'tema'];
    return steps.indexOf(currentStep);
  };

  const getTotalSteps = () => 6;

  const getStepIcon = (stepIndex: number) => {
    const icons = [FileText, Target, Users, Palette, Wrench, MessageCircle];
    return icons[stepIndex] || FileText;
  };

  const getStepTitle = () => {
    const titles = {
      'root': 'Tipo de Conteúdo',
      'objetivo': 'Objetivo',
      'canal': 'Canal',
      'estilo': 'Estilo',
      'equipamento': 'Equipamento',
      'tema': 'Tema'
    };
    return titles[currentStep] || 'Configuração';
  };

  const handleOptionClick = (value: string) => {
    if (currentStep === 'tema') {
      handleThemeInput(value);
    } else {
      handleAnswer(value);
    }
  };

  const handleThemeSubmit = () => {
    if (themeText.trim()) {
      handleThemeInput(themeText);
    }
  };

  const isStepComplete = () => {
    if (currentStep === 'tema') {
      return themeText.trim().length > 0;
    }
    return true;
  };

  // Sugestões baseadas no equipamento selecionado
  const getEquipmentSuggestions = () => {
    if (currentStep === 'tema' && intention.equipamento) {
      // Buscar equipamento selecionado
      const selectedEquipment = equipments.find(eq => eq.id === intention.equipamento);
      if (selectedEquipment) {
        // Gerar sugestões baseadas no equipamento real
        return [
          `Benefícios do ${selectedEquipment.nome} para rejuvenescimento`,
          `Como o ${selectedEquipment.nome} resolve problemas estéticos`,
          `Resultados do ${selectedEquipment.nome} - antes e depois`,
          `${selectedEquipment.nome}: tecnologia ${selectedEquipment.tecnologia}`
        ];
      }
      // Fallback para sugestões genéricas se não encontrar
      return EQUIPMENT_SUGGESTIONS[intention.equipamento] || [];
    }
    return [];
  };

  const renderStepContent = () => {
    const questionData = getCurrentQuestion();
    
    if (currentStep === 'tema') {
      const suggestions = getEquipmentSuggestions();
      
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center mb-6">
            {questionData.question}
          </h3>
          
          {suggestions.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-3">💡 Sugestões baseadas no equipamento selecionado:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setThemeText(suggestion)}
                    className="text-left justify-start text-purple-400 border-purple-500/30"
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <Textarea
            placeholder="Ex: Benefícios do HIFU para rejuvenescimento facial, Como resolver flacidez sem cirurgia..."
            value={themeText}
            onChange={(e) => setThemeText(e.target.value)}
            className="min-h-[120px]"
          />
          
          {intention.mentor_inferido && (
            <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Mentor Detectado</span>
              </div>
              <div className="text-sm">
                <p className="text-gray-400 italic">"{intention.enigma_mentor}"</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Para outros passos, renderizar as opções como cards
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center mb-6">
          {questionData.question}
        </h3>
        
        {currentStep === 'root' && (
          <div className="grid grid-cols-2 gap-4">
            {questionData.options.map((option) => {
              const icons = {
                'bigIdea': '💡',
                'stories': '📱', 
                'carousel': '🎠',
                'image': '🖼️',
                'video': '🎬'
              };
              
              const descriptions = {
                'bigIdea': '5 ideias criativas e virais',
                'stories': 'Roteiro para stories',
                'carousel': 'Textos para múltiplas artes', 
                'image': 'Texto para arte única',
                'video': 'Roteiro completo estruturado'
              };
              
              return (
                <Card
                  key={option.value}
                  className="p-4 cursor-pointer transition-all hover:scale-105 hover:bg-gray-800/50"
                  onClick={() => handleOptionClick(option.value)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{icons[option.value]}</div>
                    <h4 className="font-semibold">{option.label}</h4>
                    <p className="text-sm text-gray-400">{descriptions[option.value]}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {currentStep === 'equipamento' && (
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {equipmentsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-400">Carregando equipamentos...</p>
              </div>
            ) : (
              <>
                {equipments.filter(eq => eq.ativo).map((equipment) => (
                  <Button
                    key={equipment.id}
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => handleOptionClick(equipment.id)}
                  >
                    <span className="mr-3 text-lg">🔧</span>
                    <div className="text-left">
                      <div className="font-medium">{equipment.nome}</div>
                      {equipment.tecnologia && (
                        <div className="text-xs text-gray-400">{equipment.tecnologia}</div>
                      )}
                    </div>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="justify-start h-auto p-4"
                  onClick={() => handleOptionClick('sem_equipamento')}
                >
                  <span className="mr-3 text-lg">🏥</span>
                  Protocolo da clínica (sem equipamento específico)
                </Button>
              </>
            )}
          </div>
        )}
        
        {currentStep !== 'root' && currentStep !== 'equipamento' && (
          <div className="grid grid-cols-1 gap-3">
            {questionData.options.map((option) => {
              const icons = {
                'objetivo': Target,
                'canal': Users,
                'estilo': Palette
              };
              const IconComponent = icons[currentStep] || Target;
              
              return (
                <Button
                  key={option.value}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  onClick={() => handleOptionClick(option.value)}
                >
                  <IconComponent className="mr-3 h-4 w-4" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: getTotalSteps() }, (_, index) => {
            const IconComponent = getStepIcon(index);
            return (
              <div
                key={index}
                className={`flex items-center ${
                  index <= getStepNumber() ? 'text-purple-400' : 'text-gray-500'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= getStepNumber() ? 'bg-purple-500' : 'bg-gray-700'
                }`}>
                  {index < getStepNumber() ? '✓' : index + 1}
                </div>
                {index < getTotalSteps() - 1 && (
                  <div className={`w-8 h-px mx-2 ${
                    index < getStepNumber() ? 'bg-purple-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {getStepTitle()}
          </Badge>
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-6 mb-6 bg-gray-900/50 border-gray-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation */}
      {currentStep === 'tema' && (
        <div className="flex justify-center">
          <Button
            onClick={handleThemeSubmit}
            disabled={!isStepComplete() || isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Analisando intenção...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Roteiro Inteligente
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SmartScriptGenerator;
