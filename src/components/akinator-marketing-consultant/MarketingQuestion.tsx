import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Clock, Users, DollarSign, Target, AlertCircle, CreditCard, Smartphone, UserCheck, Stethoscope, Sparkles, Loader2, ArrowLeft, ChevronRight, CheckCircle2, Zap } from "lucide-react";
import { MarketingStep } from './types';
import { useSlideNotifications } from '@/components/notifications/SlideNotificationProvider';
import { toast } from 'sonner';
import { mockEquipments } from './data/mockEquipments';
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
    'medicalEquipments': Sparkles,
    'medicalProcedures': Zap,
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
  return <IconComponent className="h-6 w-6 text-aurora-electric-purple" />;
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const {
    showNotification
  } = useSlideNotifications();

  // Buscar equipamentos reais do banco de dados
  const {
    equipments,
    loading: equipmentsLoading,
    error: equipmentsError
  } = useEquipments();

  // Debug dos equipamentos
  useEffect(() => {
    if (stepData.id === 'medicalEquipments' || stepData.id === 'aestheticEquipments') {
      console.log('🔧 DEBUG EQUIPAMENTOS:');
      console.log('- Step ID:', stepData.id);
      console.log('- Equipamentos carregados:', equipments);
      console.log('- Loading state:', equipmentsLoading);
      console.log('- Error state:', equipmentsError);
      console.log('- Mock equipments fallback:', mockEquipments);
    }
  }, [stepData.id, equipments, equipmentsLoading, equipmentsError]);

  // Efeito para mostrar notificação de boas-vindas na primeira pergunta
  useEffect(() => {
    if (currentStep === 0) {
      toast.success("🚀 Vamos começar seu diagnóstico personalizado!", {
        description: "Responda às perguntas para receber insights únicos."
      });
    }
  }, [currentStep]);
  const handleOpenSubmit = () => {
    if (openAnswer.trim()) {
      setIsAnimating(true);
      showNotification({
        title: "✨ Resposta registrada!",
        message: "Sua resposta foi salva com sucesso.",
        type: "success"
      });
      setTimeout(() => {
        onOptionSelect(openAnswer.trim());
        setOpenAnswer('');
        setIsAnimating(false);
      }, 600);
    } else {
      toast.error("Ops! 📝", {
        description: "Por favor, digite uma resposta antes de continuar."
      });
    }
  };
  const handleCustomEquipmentSubmit = () => {
    if (customEquipment.trim()) {
      setIsAnimating(true);
      showNotification({
        title: "🔧 Equipamento personalizado adicionado!",
        message: `${customEquipment} foi registrado com sucesso.`,
        type: "success"
      });
      setTimeout(() => {
        onOptionSelect(customEquipment.trim());
        setCustomEquipment('');
        setShowCustomInput(false);
        setIsAnimating(false);
      }, 600);
    } else {
      toast.warning("Atenção! ⚠️", {
        description: "Digite o nome do equipamento antes de continuar."
      });
    }
  };
  const handleOptionClick = (value: string, label: string) => {
    if (value === 'outros' && (stepData.id === 'medicalEquipments' || stepData.id === 'aestheticEquipments')) {
      setShowCustomInput(true);
      toast.info("🎯 Personalize sua escolha", {
        description: "Digite o equipamento específico que você utiliza."
      });
    } else {
      setSelectedOption(value);
      setIsAnimating(true);
      showNotification({
        title: "✅ Opção selecionada!",
        message: `${label.replace(/[🔬🎯❌🔧]/g, '').trim()} foi registrado.`,
        type: "success"
      });
      setTimeout(() => {
        onOptionSelect(value);
        setSelectedOption(null);
        setIsAnimating(false);
      }, 600);
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
  const getEquipmentOptions = () => {
    if (stepData.id !== 'medicalEquipments' && stepData.id !== 'aestheticEquipments') {
      return stepData.options || [];
    }
    console.log('🔧 Gerando opções de equipamentos...');

    // Primeiro, tentar usar equipamentos do banco de dados
    let availableEquipments = [];
    if (equipments && equipments.length > 0) {
      console.log('✅ Usando equipamentos do banco de dados:', equipments.length);

      // LOG das categorias dos equipamentos para debugging
      equipments.forEach(eq => {
        console.log('🩺 Equipamento:', eq.nome, 'Categoria:', eq.categoria);
      });

      availableEquipments = equipments;
    } else {
      console.log('⚠️ Banco vazio ou com erro, usando mock equipments:', mockEquipments.length);
      availableEquipments = mockEquipments;
    }

    // Tornar o filtro mais robusto para medical e estetico
    const filteredEquipments = availableEquipments.filter(equipment => {
      // Categoria pode vir em diferentes formatos
      const cat = typeof equipment.categoria === 'string' ? equipment.categoria.toLowerCase() : '';
      if (stepData.id === 'aestheticEquipments') {
        return cat === 'estetico' || cat === 'estético'; // aceita acentuação
      }
      if (stepData.id === 'medicalEquipments') {
        return cat === 'medico' || cat === 'médico' || !cat; // aceita acento e vazio
      }
      return true; // fallback: inclui tudo se não definido
    });
    console.log('🔧 Equipamentos após filtro:', filteredEquipments.length);

    const equipmentOptions = filteredEquipments.map(equipment => ({
      value: equipment.nome.toLowerCase().replace(/\s+/g, '_'),
      label: `🔬 ${equipment.nome}`
    }));

    // Adicionar opções fixas
    const finalOptions = [
      ...equipmentOptions,
      {
        value: 'outros',
        label: '🔧 Outros Equipamentos'
      },
      {
        value: 'nao_utilizo',
        label: '❌ Não utilizo equipamentos'
      }
    ];
    console.log('🔧 Opções finais geradas:', finalOptions.length);
    return finalOptions;
  };
  const shouldUseDynamicEquipments = stepData.id === 'medicalEquipments' || stepData.id === 'aestheticEquipments';
  const optionsToShow = shouldUseDynamicEquipments ? getEquipmentOptions() : stepData.options || [];
  return <div className="max-w-4xl mx-auto p-6">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => <motion.div key={i} className="absolute w-2 h-2 bg-aurora-electric-purple/30 rounded-full" animate={{
        y: [0, -100, 0],
        x: [0, Math.random() * 100 - 50, 0],
        opacity: [0.3, 0.8, 0.3]
      }} transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2
      }} style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }} />)}
      </div>

      {/* Progress Bar */}
      <motion.div className="mb-8" initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-aurora-electric-purple font-medium">
            Progresso do Diagnóstico
          </span>
          <span className="text-sm text-aurora-sage font-medium">
            {currentStep + 1} de {20}
          </span>
        </div>
        <div className="h-2 bg-aurora-deep-purple/30 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-aurora-electric-purple to-aurora-sage rounded-full" initial={{
          width: 0
        }} animate={{
          width: `${(currentStep + 1) / 20 * 100}%`
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }} />
        </div>
      </motion.div>

      {/* Question Card */}
      <motion.div initial={{
      opacity: 0,
      scale: 0.95
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.5
    }} className="aurora-card mb-8">
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="text-center pb-6">
            <motion.div className="flex justify-center mb-6" whileHover={{
            scale: 1.1,
            rotate: 5
          }} transition={{
            type: "spring",
            stiffness: 300
          }}>
              <div className="p-4 bg-aurora-gradient-primary rounded-full shadow-lg aurora-glow bg-slate-50">
                {getIcon(stepData.id)}
              </div>
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.h2 key={currentStep} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.4
            }} className="text-2xl font-light aurora-heading leading-relaxed">
                {stepData.question}
              </motion.h2>
            </AnimatePresence>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {showCustomInput ? <motion.div className="space-y-6" initial={{
            opacity: 0,
            scale: 0.95
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.3
          }}>
                <div className="aurora-glass p-4 rounded-xl">
                  <Input placeholder="Digite o nome do equipamento..." value={customEquipment} onChange={e => setCustomEquipment(e.target.value)} onKeyPress={handleCustomKeyPress} autoFocus className="aurora-input bg-transparent border-aurora-electric-purple/30 focus:border-aurora-sage text-white placeholder:text-white/50" />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleCustomEquipmentSubmit} disabled={!customEquipment.trim() || isAnimating} className="aurora-button flex-1 h-12">
                    {isAnimating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle2 className="h-5 w-5 mr-2" />}
                    Confirmar
                  </Button>
                  <Button onClick={() => setShowCustomInput(false)} variant="outline" className="aurora-glass border-aurora-electric-purple/30 text-white hover:bg-aurora-electric-purple/20">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Voltar
                  </Button>
                </div>
              </motion.div> : stepData.isOpen ? <motion.div className="space-y-6" initial={{
            opacity: 0,
            scale: 0.95
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.3
          }}>
                <div className="aurora-glass p-4 rounded-xl">
                  <Textarea placeholder="Digite sua resposta aqui..." value={openAnswer} onChange={e => setOpenAnswer(e.target.value)} onKeyPress={handleKeyPress} className="min-h-[120px] aurora-input bg-transparent border-aurora-electric-purple/30 focus:border-aurora-sage text-white placeholder:text-white/50 resize-none" />
                </div>
                <Button onClick={handleOpenSubmit} disabled={!openAnswer.trim() || isAnimating} className="aurora-button w-full h-12 text-lg">
                  {isAnimating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
                  Continuar
                </Button>
              </motion.div> : <div className="space-y-4">
                {equipmentsLoading && shouldUseDynamicEquipments ? <motion.div className="flex items-center justify-center py-12" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }}>
                    <div className="flex items-center gap-3 text-aurora-electric-purple">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-lg">Carregando equipamentos...</span>
                    </div>
                  </motion.div> : optionsToShow.length > 0 ? <div className="grid grid-cols-1 gap-4">
                    {optionsToShow.map((option, index) => <motion.div key={option.value} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.4,
                delay: index * 0.1
              }}>
                        <Button variant="outline" className={`
                            justify-start h-auto p-6 text-left w-full
                            aurora-glass border-aurora-electric-purple/30 
                            hover:border-aurora-sage hover:bg-aurora-electric-purple/10
                            transition-all duration-300 group
                            ${selectedOption === option.value ? 'border-aurora-sage bg-aurora-electric-purple/20' : ''}
                          `} onClick={() => handleOptionClick(option.value, option.label)} disabled={isAnimating}>
                          <div className="flex items-center justify-between w-full">
                            <span className="aurora-body text-base group-hover:text-aurora-sage transition-colors">
                              {option.label}
                            </span>
                            {selectedOption === option.value ? <CheckCircle2 className="h-5 w-5 text-aurora-sage" /> : <ChevronRight className="h-5 w-5 text-aurora-electric-purple/60 group-hover:text-aurora-sage transition-colors" />}
                          </div>
                        </Button>
                      </motion.div>)}
                  </div> : <motion.div className="text-center py-12" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }}>
                    <div className="aurora-glass p-8 rounded-xl">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-aurora-electric-purple/60" />
                      <h3 className="text-lg font-medium aurora-heading mb-2">Equipamentos não encontrados</h3>
                      <p className="text-sm aurora-body opacity-75 mb-4">
                        Não foi possível carregar a lista de equipamentos.
                      </p>
                      {equipmentsError && <p className="text-xs text-red-400 mb-4">
                          Erro: {equipmentsError.message}
                        </p>}
                      <Button onClick={() => setShowCustomInput(true)} className="aurora-button">
                        <Zap className="h-4 w-4 mr-2" />
                        Adicionar Equipamento Manual
                      </Button>
                    </div>
                  </motion.div>}
              </div>}
          </CardContent>
        </Card>
      </motion.div>

      {/* Back Button */}
      {canGoBack && !showCustomInput && <motion.div className="text-center" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5,
      delay: 0.2
    }}>
          <Button variant="ghost" onClick={onGoBack} className="aurora-glass border-aurora-electric-purple/30 text-aurora-electric-purple hover:bg-aurora-electric-purple/10 px-8 py-3">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Button>
        </motion.div>}
    </div>;
};
export default MarketingQuestion;
