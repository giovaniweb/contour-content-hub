
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
  Sparkles
} from "lucide-react";
import { MarketingStep } from './types';

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

  const handleOpenSubmit = () => {
    if (openAnswer.trim()) {
      onOptionSelect(openAnswer.trim());
      setOpenAnswer('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleOpenSubmit();
    }
  };

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
          {stepData.isOpen ? (
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
              {stepData.options.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="justify-start h-auto p-4 text-left hover:bg-primary/5"
                  onClick={() => onOptionSelect(option.value)}
                >
                  <span>{option.label}</span>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back Button */}
      {canGoBack && (
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
