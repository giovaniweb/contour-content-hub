
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2,
  Clock,
  Users,
  DollarSign,
  Target,
  AlertCircle,
  CreditCard,
  Smartphone,
  UserCheck,
  Stethoscope,
  Sparkles,
  Loader2
} from "lucide-react";
import { MarketingStep } from './types';
import { useEquipments } from '@/hooks/useEquipments';

interface MarketingQuestionProps {
  stepData: MarketingStep;
  currentStep: number;
  onOptionSelect: (value: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const getIcon = (stepId: string) => {
  const icons = {
    'clinicType': Building2,
    'medicalSpecialty': Stethoscope,
    'medicalEquipments': Building2,
    'medicalProcedures': Sparkles,
    'medicalTicket': DollarSign,
    'medicalModel': Target,
    'medicalObjective': Target,
    'aestheticFocus': Sparkles,
    'aestheticEquipments': Building2,
    'aestheticBestSeller': Target,
    'aestheticSalesModel': CreditCard,
    'aestheticObjective': Target,
    'currentRevenue': DollarSign,
    'revenueGoal': Target,
    'mainService': Sparkles,
    'personalBrand': Smartphone,
    'contentFrequency': Clock,
    'paidTraffic': Target,
    'targetAudience': Users,
    'clinicPosition': Building2
  };
  
  const IconComponent = icons[stepId as keyof typeof icons] || Building2;
  return <IconComponent className="h-6 w-6 text-primary" />;
};

const MarketingQuestion: React.FC<MarketingQuestionProps> = ({
  stepData,
  currentStep,
  onOptionSelect,
  onGoBack,
  canGoBack
}) => {
  const [openAnswer, setOpenAnswer] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEquipment, setCustomEquipment] = useState('');
  const { equipments, loading, error } = useEquipments();

  console.log('MarketingQuestion - stepData.id:', stepData.id);
  console.log('MarketingQuestion - equipments:', equipments);
  console.log('MarketingQuestion - loading:', loading);
  console.log('MarketingQuestion - error:', error);

  const handleOpenSubmit = () => {
    if (openAnswer.trim()) {
      onOptionSelect(openAnswer.trim());
      setOpenAnswer('');
    }
  };

  const handleCustomEquipmentSubmit = () => {
    if (customEquipment.trim()) {
      onOptionSelect(customEquipment.trim());
      setCustomEquipment('');
      setShowCustomInput(false);
    }
  };

  const handleOptionClick = (value: string) => {
    if (value === 'outros' && (stepData.id === 'medicalEquipments' || stepData.id === 'aestheticEquipments')) {
      setShowCustomInput(true);
    } else {
      onOptionSelect(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleOpenSubmit();
    }
  };

  const handleCustomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomEquipmentSubmit();
    }
  };

  // Função para gerar opções de equipamentos dinamicamente
  const getEquipmentOptions = () => {
    console.log('getEquipmentOptions called - loading:', loading, 'equipments:', equipments);
    
    if (loading) {
      return [
        { value: 'loading', label: '⏳ Carregando equipamentos...' }
      ];
    }

    if (error) {
      console.error('Erro ao carregar equipamentos:', error);
      return [
        { value: 'nao_utilizo', label: '❌ Não utilizo equipamentos' },
        { value: 'outros', label: '🔧 Outros Equipamentos' }
      ];
    }

    if (!equipments || equipments.length === 0) {
      console.log('Nenhum equipamento encontrado');
      return [
        { value: 'nao_utilizo', label: '❌ Não utilizo equipamentos' },
        { value: 'outros', label: '🔧 Outros Equipamentos' }
      ];
    }

    console.log('Equipamentos encontrados:', equipments.length);
    
    const equipmentOptions = equipments.map(equipment => ({
      value: equipment.nome.toLowerCase().replace(/\s+/g, '_'),
      label: `🔬 ${equipment.nome}`
    }));

    // Adicionar opções padrão
    return [
      ...equipmentOptions,
      { value: 'outros', label: '🔧 Outros Equipamentos' },
      { value: 'nao_utilizo', label: '❌ Não utilizo equipamentos' }
    ];
  };

  // Determinar se deve usar equipamentos dinâmicos - CORRIGIDO
  const shouldUseDynamicEquipments = stepData.id === 'medicalEquipments' || stepData.id === 'aestheticEquipments';
  
  // Se for uma pergunta de equipamentos e não for campo aberto, usar equipamentos dinâmicos
  const optionsToShow = shouldUseDynamicEquipments && !stepData.isOpen ? getEquipmentOptions() : stepData.options || [];

  console.log('shouldUseDynamicEquipments:', shouldUseDynamicEquipments);
  console.log('stepData.isOpen:', stepData.isOpen);
  console.log('optionsToShow:', optionsToShow);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon(stepData.id)}
          </div>
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
          {showCustomInput ? (
            // Custom equipment input
            <div className="space-y-4">
              <Input
                placeholder="Digite o nome do equipamento..."
                value={customEquipment}
                onChange={(e) => setCustomEquipment(e.target.value)}
                onKeyPress={handleCustomKeyPress}
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleCustomEquipmentSubmit}
                  disabled={!customEquipment.trim()}
                  className="flex-1"
                >
                  Continuar
                </Button>
                <Button 
                  onClick={() => setShowCustomInput(false)}
                  variant="outline"
                >
                  Voltar
                </Button>
              </div>
            </div>
          ) : stepData.isOpen ? (
            // Campo aberto para texto livre
            <div className="space-y-4">
              <Textarea
                placeholder="Digite sua resposta aqui..."
                value={openAnswer}
                onChange={(e) => setOpenAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleOpenSubmit}
                disabled={!openAnswer.trim()}
                className="w-full"
              >
                Continuar
              </Button>
            </div>
          ) : (
            // Opções múltipla escolha
            <div className="grid grid-cols-1 gap-3">
              {loading && shouldUseDynamicEquipments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Carregando equipamentos...</span>
                </div>
              ) : error && shouldUseDynamicEquipments ? (
                <div className="flex items-center justify-center py-8 text-red-500">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  <span>Erro ao carregar equipamentos</span>
                </div>
              ) : optionsToShow.length > 0 ? (
                optionsToShow.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="justify-start h-auto p-4 text-left hover:bg-primary/5"
                    onClick={() => handleOptionClick(option.value)}
                    disabled={option.value === 'loading'}
                  >
                    <span>{option.label}</span>
                  </Button>
                ))
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <span>Nenhuma opção disponível</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back Button */}
      {canGoBack && !showCustomInput && (
        <div className="text-center">
          <Button variant="ghost" onClick={onGoBack}>
            ← Voltar
          </Button>
        </div>
      )}
    </div>
  );
};

export default MarketingQuestion;
