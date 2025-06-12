
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Sparkles, Wand2, Loader2 } from "lucide-react";
import { useUserEquipments } from '@/hooks/useUserEquipments';
import { MENTOR_PHRASES } from '../constants/intentionTree';

interface QuestionOption {
  value: string;
  label: string;
  emoji: string;
  description: string;
  sample?: string;
  leads_to?: string;
  imageUrl?: string;
}

interface EnhancedAkinatorQuestionProps {
  question: string;
  options: QuestionOption[];
  stepId: string;
  onOptionSelect: (value: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  mentorStyle?: string;
  currentStep: number;
  totalSteps: number;
}

const EnhancedAkinatorQuestion: React.FC<EnhancedAkinatorQuestionProps> = ({
  question,
  options,
  stepId,
  onOptionSelect,
  onGoBack,
  canGoBack,
  mentorStyle = 'criativo',
  currentStep,
  totalSteps
}) => {
  const [themeText, setThemeText] = useState('');
  const [mentorPhrase, setMentorPhrase] = useState('');
  const { equipments, loading: equipmentsLoading } = useUserEquipments();

  useEffect(() => {
    if (stepId === 'tema') {
      const phrases = MENTOR_PHRASES[mentorStyle] || MENTOR_PHRASES.criativo;
      setMentorPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  }, [stepId, mentorStyle]);

  const handleThemeSubmit = () => {
    if (themeText.trim()) {
      onOptionSelect(themeText.trim());
    }
  };

  const getEquipmentOptions = () => {
    console.log('🎯 [EnhancedAkinatorQuestion] getEquipmentOptions chamado');
    console.log('🎯 [EnhancedAkinatorQuestion] stepId:', stepId);
    console.log('🎯 [EnhancedAkinatorQuestion] equipmentsLoading:', equipmentsLoading);
    console.log('🎯 [EnhancedAkinatorQuestion] equipments:', equipments);
    
    if (stepId !== 'equipamento') {
      console.log('🎯 [EnhancedAkinatorQuestion] Não é step de equipamento, retornando options originais');
      return options;
    }
    
    if (equipmentsLoading) {
      console.log('🎯 [EnhancedAkinatorQuestion] Ainda carregando equipamentos...');
      return [];
    }

    if (!equipments || equipments.length === 0) {
      console.log('🎯 [EnhancedAkinatorQuestion] Nenhum equipamento encontrado, usando fallback');
      // Fallback para equipamentos básicos se não conseguir carregar
      return [
        {
          value: 'ultraformer',
          label: 'Ultraformer',
          emoji: '🔧',
          description: 'Tecnologia HIFU para lifting facial',
        },
        {
          value: 'laser-co2',
          label: 'Laser CO2',
          emoji: '🔧',
          description: 'Resurfacing fracionado',
        },
        {
          value: 'radiofrequencia',
          label: 'Radiofrequência',
          emoji: '🔧',
          description: 'Aquecimento profundo da pele',
        }
      ];
    }
    
    const equipmentOptions = equipments.map(equipment => ({
      value: equipment.id,
      label: equipment.nome,
      emoji: '🔧',
      description: equipment.tecnologia || 'Equipamento profissional',
      imageUrl: equipment.image_url || equipment.thumbnail_url
    }));
    
    console.log('🎯 [EnhancedAkinatorQuestion] Equipment options criadas:', equipmentOptions);
    return equipmentOptions;
  };

  const currentOptions = getEquipmentOptions();

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02, 
      y: -2,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.98 }
  };

  const iconVariants = {
    hover: {
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1.1, 1.1, 1],
      transition: { duration: 0.5 }
    }
  };

  if (stepId === 'tema') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div 
              className="p-3 bg-aurora-gradient-primary rounded-full"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Wand2 className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-light text-white mb-2">{question}</h2>
          {mentorPhrase && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-aurora-electric-purple italic"
            >
              {mentorPhrase}
            </motion.p>
          )}
        </motion.div>

        <Card className="aurora-glass border-aurora-electric-purple/30">
          <CardContent className="p-6">
            <Textarea
              placeholder="Ex: Como eliminar melasma em 30 dias, Protocolo anti-idade revolucionário..."
              value={themeText}
              onChange={(e) => setThemeText(e.target.value)}
              className="min-h-[120px] bg-slate-800/50 border-aurora-electric-purple/30 text-white placeholder-slate-400 resize-none focus:border-aurora-sage"
            />
            
            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleThemeSubmit}
                disabled={!themeText.trim()}
                className="flex-1 bg-aurora-gradient-primary hover:opacity-90 text-white h-12"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Gerar Roteiro FLUIDA
              </Button>
              
              {canGoBack && (
                <Button
                  onClick={onGoBack}
                  variant="outline"
                  className="aurora-glass border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-aurora-electric-purple font-medium">
            Progresso da Criação
          </span>
          <span className="text-sm text-aurora-sage font-medium">
            {currentStep} de {totalSteps}
          </span>
        </div>
        <div className="h-2 bg-aurora-deep-purple/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-aurora-electric-purple to-aurora-sage rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Question Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-light text-white leading-relaxed">
          {question}
        </h2>
      </motion.div>

      {/* Loading state para equipamentos */}
      {stepId === 'equipamento' && equipmentsLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-aurora-electric-purple">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando equipamentos...</span>
          </div>
        </div>
      )}

      {/* Options Grid */}
      {(!equipmentsLoading || stepId !== 'equipamento') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <AnimatePresence>
            {currentOptions.map((option, index) => (
              <TooltipProvider key={option.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className="aurora-glass border-aurora-electric-purple/20 hover:border-aurora-electric-purple/40 cursor-pointer transition-all h-full"
                        onClick={() => onOptionSelect(option.value)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            {/* Equipment Image or Emoji */}
                            {option.imageUrl ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                                <img 
                                  src={option.imageUrl} 
                                  alt={option.label}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.log('🖼️ Erro ao carregar imagem:', option.imageUrl);
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                                <div className="hidden w-full h-full flex items-center justify-center text-2xl">
                                  {option.emoji}
                                </div>
                              </div>
                            ) : (
                              <motion.div
                                className="text-3xl flex-shrink-0"
                                variants={iconVariants}
                                whileHover="hover"
                              >
                                {option.emoji}
                              </motion.div>
                            )}
                            
                            <div className="flex-1">
                              <h3 className="text-white font-medium mb-2">{option.label}</h3>
                              <p className="text-sm text-slate-400">{option.description}</p>
                              
                              {option.sample && (
                                <div className="mt-3 p-2 bg-aurora-electric-purple/10 rounded-lg">
                                  <p className="text-xs text-aurora-electric-purple italic">
                                    "{option.sample}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TooltipTrigger>
                  
                  {option.sample && (
                    <TooltipContent>
                      <p className="max-w-xs">{option.sample}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Fallback message se não houver equipamentos */}
      {stepId === 'equipamento' && !equipmentsLoading && currentOptions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">
            Nenhum equipamento encontrado para sua conta.
          </p>
          <Button onClick={onGoBack} variant="outline" className="aurora-glass border-aurora-electric-purple/30 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      )}

      {/* Back Button */}
      {canGoBack && stepId !== 'equipamento' && (
        <div className="text-center">
          <Button 
            onClick={onGoBack}
            variant="ghost" 
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedAkinatorQuestion;
