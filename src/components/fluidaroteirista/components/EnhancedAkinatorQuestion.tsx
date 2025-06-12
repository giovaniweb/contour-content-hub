
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface QuestionOption {
  value: string;
  label: string;
  emoji?: string;
  description?: string;
  exemplo?: string;
}

interface EnhancedAkinatorQuestionProps {
  question: string;
  titulo?: string;
  subtitulo?: string;
  descricao?: string;
  options?: QuestionOption[];
  stepId: string;
  onOptionSelect: (value: string | string[]) => void;
  onGoBack: () => void;
  canGoBack?: boolean;
  mentorStyle?: 'conversacional' | 'elementos_universais' | 'rocket';
  currentStep?: number;
  totalSteps?: number;
  isTextInput?: boolean;
  mentorPhrase?: string;
  isMultipleChoice?: boolean;
}

const EnhancedAkinatorQuestion: React.FC<EnhancedAkinatorQuestionProps> = ({
  question,
  titulo,
  subtitulo,
  descricao,
  options = [],
  stepId,
  onOptionSelect,
  onGoBack,
  canGoBack = true,
  mentorStyle = 'conversacional',
  currentStep = 1,
  totalSteps = 6,
  isTextInput = false,
  mentorPhrase,
  isMultipleChoice = false
}) => {
  const [textInput, setTextInput] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onOptionSelect(textInput.trim());
      setTextInput('');
    }
  };

  const handleMultipleChoiceSubmit = () => {
    if (selectedOptions.length > 0) {
      onOptionSelect(selectedOptions);
    }
  };

  const toggleOption = (value: string) => {
    setSelectedOptions(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const getMentorColor = () => {
    switch (mentorStyle) {
      case 'elementos_universais': return 'from-purple-600 to-pink-600';
      case 'rocket': return 'from-orange-600 to-red-600';
      default: return 'from-aurora-electric-purple to-purple-600';
    }
  };

  const getMentorIcon = () => {
    switch (mentorStyle) {
      case 'elementos_universais': return '🎯';
      case 'rocket': return '🚀';
      default: return '🤖';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header com progresso */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <span className="text-3xl">{getMentorIcon()}</span>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {titulo || question}
            </h1>
            {subtitulo && (
              <p className="text-aurora-electric-purple font-medium">
                {subtitulo}
              </p>
            )}
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="bg-aurora-electric-purple/20 text-aurora-electric-purple">
            Etapa {currentStep} de {totalSteps}
          </Badge>
          <div className="flex-1 max-w-xs bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full bg-gradient-to-r ${getMentorColor()} rounded-full`}
            />
          </div>
        </div>
      </div>

      {/* Descrição */}
      {descricao && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-slate-300 max-w-2xl mx-auto">
            {descricao}
          </p>
        </motion.div>
      )}

      {/* Mentor Phrase */}
      {mentorPhrase && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-aurora-electric-purple" />
            <p className="text-white font-medium italic">
              "{mentorPhrase}"
            </p>
          </div>
        </motion.div>
      )}

      {/* Área de conteúdo principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        {isTextInput ? (
          // Input de texto
          <div className="space-y-4">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Descreva detalhadamente o tema do seu conteúdo..."
              className="min-h-32 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleTextSubmit();
                }
              }}
            />
            <div className="text-center">
              <Button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className={`bg-gradient-to-r ${getMentorColor()} hover:opacity-90 text-white px-8 py-3`}
              >
                <Send className="h-4 w-4 mr-2" />
                Gerar Roteiro
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                Ou pressione Ctrl + Enter
              </p>
            </div>
          </div>
        ) : (
          // Opções de escolha
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => isMultipleChoice ? toggleOption(option.value) : onOptionSelect(option.value)}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left group ${
                      isMultipleChoice 
                        ? (selectedOptions.includes(option.value)
                            ? 'border-aurora-electric-purple bg-aurora-electric-purple/10 shadow-lg shadow-aurora-electric-purple/20'
                            : 'border-gray-600 bg-gray-800/50 hover:border-aurora-electric-purple/50 hover:bg-gray-700/70')
                        : 'border-gray-600 bg-gray-800/50 hover:border-aurora-electric-purple/50 hover:bg-gray-700/70 hover:shadow-lg hover:shadow-aurora-electric-purple/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {option.emoji && (
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {option.emoji}
                        </span>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2 group-hover:text-aurora-electric-purple transition-colors">
                          {option.label}
                          {isMultipleChoice && selectedOptions.includes(option.value) && (
                            <span className="ml-2 text-aurora-electric-purple">✓</span>
                          )}
                        </h3>
                        {option.description && (
                          <p className="text-gray-400 text-sm mb-2">
                            {option.description}
                          </p>
                        )}
                        {option.exemplo && (
                          <p className="text-gray-500 text-xs italic">
                            Ex: {option.exemplo}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Botão para confirmar seleção múltipla */}
            {isMultipleChoice && (
              <div className="text-center pt-4">
                <Button
                  onClick={handleMultipleChoiceSubmit}
                  disabled={selectedOptions.length === 0}
                  className={`bg-gradient-to-r ${getMentorColor()} hover:opacity-90 text-white px-8 py-3`}
                >
                  Continuar com {selectedOptions.length} equipamento{selectedOptions.length !== 1 ? 's' : ''}
                </Button>
                <p className="text-xs text-gray-400 mt-2">
                  {selectedOptions.length === 0 
                    ? 'Selecione pelo menos um equipamento'
                    : `${selectedOptions.length} equipamento${selectedOptions.length !== 1 ? 's' : ''} selecionado${selectedOptions.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Botão de voltar */}
      {canGoBack && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={onGoBack}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:border-aurora-electric-purple/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedAkinatorQuestion;
