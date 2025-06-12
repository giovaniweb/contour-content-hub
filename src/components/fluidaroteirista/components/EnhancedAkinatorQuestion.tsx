
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, Square, ArrowLeft } from 'lucide-react';
import ConditionalFormatSelector from './ConditionalFormatSelector';

interface QuestionData {
  pergunta: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  options?: any[];
  conditional?: boolean;
  multiSelect?: boolean;
  isTextInput?: boolean;
  placeholder?: string;
  mentorPhrase?: string;
}

interface EnhancedAkinatorQuestionProps {
  questionData: QuestionData;
  currentStep: string;
  answers: Record<string, any>;
  onAnswer: (value: string | string[]) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

const EnhancedAkinatorQuestion: React.FC<EnhancedAkinatorQuestionProps> = ({
  questionData,
  currentStep,
  answers,
  onAnswer,
  onBack,
  canGoBack = false
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');

  // CORREÇÃO: Mapear os passos corretamente
  const getStepNumber = (step: string) => {
    const stepMap: Record<string, number> = {
      'canal': 1,
      'formato': 2, 
      'objetivo': 3,
      'estilo': 4,
      'equipamento': 5,
      'tema': 6
    };
    return stepMap[step] || 1;
  };

  // Para formatos condicionais (baseados no canal)
  const getConditionalOptions = () => {
    if (currentStep === 'formato' && questionData.conditional) {
      const canal = answers.canal;
      return questionData.options?.[canal] || [];
    }
    return questionData.options || [];
  };

  const handleSingleSelect = (value: string) => {
    onAnswer(value);
  };

  const handleMultiSelect = (value: string) => {
    const newSelection = selectedOptions.includes(value)
      ? selectedOptions.filter(item => item !== value)
      : [...selectedOptions, value];
    
    setSelectedOptions(newSelection);
  };

  const handleConfirmMultiSelect = () => {
    onAnswer(selectedOptions);
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onAnswer(textInput.trim());
    }
  };

  const options = getConditionalOptions();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        {canGoBack && onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-cyan-400 hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        )}
        <div className="flex-1">
          <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 mb-2">
            Passo {getStepNumber(currentStep)} de 6
          </Badge>
        </div>
      </div>

      {/* Título da pergunta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold text-cyan-300">
          {questionData.titulo}
        </h2>
        <p className="text-xl text-cyan-400/80">
          {questionData.subtitulo}
        </p>
        <p className="text-slate-300 max-w-2xl mx-auto">
          {questionData.descricao}
        </p>
      </motion.div>

      {/* Campo de texto livre */}
      {questionData.isTextInput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="aurora-glass border border-cyan-500/30">
            <CardContent className="p-6 space-y-4">
              <Textarea
                placeholder={questionData.placeholder || "Digite aqui..."}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[120px] bg-slate-900/50 border-slate-600 text-slate-200 resize-none"
              />
              
              {questionData.mentorPhrase && (
                <div className="text-center p-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-purple-400 text-sm font-medium">
                    💡 {questionData.mentorPhrase}
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Gerar Roteiro ✨
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Seletor de formato condicional */}
      {currentStep === 'formato' && questionData.conditional && (
        <ConditionalFormatSelector
          canal={answers.canal}
          formatOptions={options}
          onSelect={handleSingleSelect}
          selectedFormat={answers.formato}
        />
      )}

      {/* Opções normais */}
      {!questionData.isTextInput && !(currentStep === 'formato' && questionData.conditional) && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`aurora-glass border cursor-pointer transition-all duration-300 hover:scale-105 ${
                    questionData.multiSelect
                      ? selectedOptions.includes(option.value)
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-cyan-500/30 hover:border-cyan-400/50'
                      : 'border-cyan-500/30 hover:border-cyan-400/50'
                  }`}
                  onClick={() => questionData.multiSelect 
                    ? handleMultiSelect(option.value)
                    : handleSingleSelect(option.value)
                  }
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      {questionData.multiSelect && (
                        selectedOptions.includes(option.value) 
                          ? <CheckSquare className="h-5 w-5 text-cyan-400" />
                          : <Square className="h-5 w-5 text-slate-400" />
                      )}
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-cyan-300">{option.label}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-slate-300 text-sm">{option.description}</p>
                    {option.exemplo && (
                      <p className="text-slate-400 text-xs italic">
                        Ex: {option.exemplo}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Botão confirmar para seleção múltipla */}
          {questionData.multiSelect && selectedOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Button
                onClick={handleConfirmMultiSelect}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8"
              >
                Confirmar Seleção ({selectedOptions.length})
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedAkinatorQuestion;
