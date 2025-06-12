import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Sparkles } from "lucide-react";

interface EnhancedAkinatorQuestionProps {
  question: string;
  titulo?: string;
  subtitulo?: string;
  descricao?: string;
  options: Array<{
    value: string;
    label: string;
    emoji?: string;
    description?: string;
    exemplo?: string;
    sample?: string;
  }>;
  stepId: string;
  onOptionSelect: (value: string | string[]) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  mentorStyle?: string;
  currentStep: number;
  totalSteps: number;
  isTextInput?: boolean;
  mentorPhrase?: string;
}

const EnhancedAkinatorQuestion: React.FC<EnhancedAkinatorQuestionProps> = ({
  question,
  titulo,
  subtitulo,
  descricao,
  options,
  stepId,
  onOptionSelect,
  onGoBack,
  canGoBack,
  mentorStyle = 'criativo',
  currentStep,
  totalSteps,
  isTextInput = false,
  mentorPhrase
}) => {
  const [textInput, setTextInput] = useState('');

  const getMentorAvatar = () => {
    switch (mentorStyle) {
      case 'cientifico':
        return '🔬';
      case 'inspiracional':
        return '✨';
      case 'conversacional':
        return '💬';
      case 'elementos_universais':
        return '🎯';
      default:
        return '🎨';
    }
  };

  if (isTextInput) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header com mentor */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-aurora-electric-purple to-purple-600 flex items-center justify-center text-3xl">
                {getMentorAvatar()}
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full border-2 border-dashed border-aurora-electric-purple/50"
              />
            </div>
          </motion.div>

          <div className="space-y-2">
            {titulo && (
              <h2 className="text-2xl font-bold text-white">
                {titulo}
              </h2>
            )}
            <h3 className="text-xl text-slate-300">
              {subtitulo || question}
            </h3>
            {descricao && (
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                {descricao}
              </p>
            )}
          </div>
        </div>

        {/* Área de input */}
        <Card className="aurora-glass border-aurora-electric-purple/30 p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Descreva o tema do seu roteiro..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[120px] bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
            />
            
            {mentorPhrase && (
              <div className="p-3 bg-aurora-electric-purple/10 rounded-lg border border-aurora-electric-purple/20">
                <p className="text-sm text-aurora-electric-purple italic">
                  💬 {mentorPhrase}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={onGoBack}
                variant="outline"
                disabled={!canGoBack}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <Button
                onClick={() => onOptionSelect(textInput)}
                disabled={!textInput.trim()}
                className="flex-1 bg-aurora-gradient-primary hover:opacity-90"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Roteiro
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header com mentor */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-aurora-electric-purple to-purple-600 flex items-center justify-center text-3xl">
              {getMentorAvatar()}
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full border-2 border-dashed border-aurora-electric-purple/50"
            />
          </div>
        </motion.div>

        <div className="space-y-2">
          {titulo && (
            <h2 className="text-2xl font-bold text-white">
              {titulo}
            </h2>
          )}
          <h3 className="text-xl text-slate-300">
            {subtitulo || question}
          </h3>
          {descricao && (
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              {descricao}
            </p>
          )}
        </div>
      </div>

      {/* Options Grid */}
      <div className={`grid gap-4 ${options.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 
                                      options.length <= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' :
                                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {options.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="aurora-glass border-aurora-electric-purple/30 hover:border-aurora-electric-purple/60 transition-all cursor-pointer h-full"
                  onClick={() => onOptionSelect(option.value)}>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  {option.emoji && (
                    <span className="text-2xl">{option.emoji}</span>
                  )}
                  <h4 className="font-semibold text-white text-lg">
                    {option.label}
                  </h4>
                </div>
                
                {option.description && (
                  <p className="text-slate-300 text-sm">
                    {option.description}
                  </p>
                )}
                
                {(option.exemplo || option.sample) && (
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-xs text-slate-400 mb-1">Exemplo:</p>
                    <p className="text-sm text-aurora-electric-purple italic">
                      {option.exemplo || option.sample}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-center">
        <Button
          onClick={onGoBack}
          variant="outline"
          disabled={!canGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default EnhancedAkinatorQuestion;
