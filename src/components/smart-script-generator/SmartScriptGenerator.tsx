
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle, Target, Users, Palette, FileText, Plus } from 'lucide-react';

interface SmartScriptGeneratorProps {
  onGenerate: (data: ScriptGenerationData) => void;
  isGenerating?: boolean;
}

export interface ScriptGenerationData {
  contentType: 'bigIdea' | 'stories' | 'carousel' | 'image' | 'video';
  objective: string;
  channel: string;
  style: string;
  theme: string;
  additionalNotes: string;
  selectedMentor: string;
}

const CONTENT_TYPES = [
  { id: 'bigIdea', label: 'Big Idea', icon: '💡', description: '5 ideias criativas e virais' },
  { id: 'stories', label: 'Stories', icon: '📱', description: 'Roteiro para stories' },
  { id: 'carousel', label: 'Carrossel', icon: '🎠', description: 'Textos para múltiplas artes' },
  { id: 'image', label: 'Imagem', icon: '🖼️', description: 'Texto para arte única' },
  { id: 'video', label: 'Vídeo', icon: '🎬', description: 'Roteiro completo estruturado' }
];

const OBJECTIVES = [
  'Atrair novos seguidores',
  'Vender produto/serviço',
  'Engajar a audiência',
  'Ensinar/educar',
  'Construir autoridade',
  'Gerar leads'
];

const CHANNELS = [
  'Instagram Reels',
  'Instagram Feed',
  'TikTok',
  'YouTube Shorts',
  'LinkedIn',
  'Facebook'
];

const STYLES = [
  'Divertido/Humorístico',
  'Direto/Objetivo',
  'Didático/Educativo',
  'Emocional/Inspirador',
  'Criativo/Artístico',
  'Casual/Descontraído'
];

const MENTORS = {
  'leandro_ladeira': { name: 'Leandro Ladeira', focus: 'Gatilhos mentais e CTAs fortes' },
  'icaro_carvalho': { name: 'Ícaro de Carvalho', focus: 'Storytelling emocional' },
  'paulo_cuenca': { name: 'Paulo Cuenca', focus: 'Criatividade audiovisual' },
  'pedro_sobral': { name: 'Pedro Sobral', focus: 'Clareza lógica e antecipação' },
  'camila_porto': { name: 'Camila Porto', focus: 'Linguagem acessível' },
  'hyeser_souza': { name: 'Hyeser Souza', focus: 'Humor viral' },
  'washington_olivetto': { name: 'Washington Olivetto', focus: 'Big ideas publicitárias' }
};

export const SmartScriptGenerator: React.FC<SmartScriptGeneratorProps> = ({ 
  onGenerate, 
  isGenerating = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ScriptGenerationData>>({});

  const steps = [
    { id: 'contentType', title: 'Tipo de Conteúdo', icon: FileText },
    { id: 'objective', title: 'Objetivo', icon: Target },
    { id: 'channel', title: 'Canal', icon: Users },
    { id: 'style', title: 'Estilo', icon: Palette },
    { id: 'theme', title: 'Tema', icon: MessageCircle },
    { id: 'notes', title: 'Observações', icon: Plus }
  ];

  const selectMentor = (data: Partial<ScriptGenerationData>) => {
    const { style, objective, contentType } = data;
    
    if (style?.includes('Humorístico') || contentType === 'stories') {
      return 'hyeser_souza';
    }
    if (style?.includes('Direto') || objective?.includes('Vender')) {
      return 'leandro_ladeira';
    }
    if (style?.includes('Emocional') || style?.includes('Inspirador')) {
      return 'icaro_carvalho';
    }
    if (style?.includes('Criativo') || contentType === 'video') {
      return 'paulo_cuenca';
    }
    if (style?.includes('Didático')) {
      return 'camila_porto';
    }
    if (objective?.includes('autoridade')) {
      return 'washington_olivetto';
    }
    
    return 'pedro_sobral'; // Default
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const selectedMentor = selectMentor(formData);
      const completeData = {
        ...formData,
        selectedMentor
      } as ScriptGenerationData;
      
      onGenerate(completeData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepComplete = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case 'contentType': return !!formData.contentType;
      case 'objective': return !!formData.objective;
      case 'channel': return !!formData.channel;
      case 'style': return !!formData.style;
      case 'theme': return !!formData.theme;
      case 'notes': return true; // Optional step
      default: return false;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'contentType':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-6">
              Qual tipo de conteúdo você quer criar?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {CONTENT_TYPES.map((type) => (
                <Card
                  key={type.id}
                  className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                    formData.contentType === type.id
                      ? 'ring-2 ring-purple-500 bg-purple-500/10'
                      : 'hover:bg-gray-800/50'
                  }`}
                  onClick={() => updateFormData('contentType', type.id)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <h4 className="font-semibold">{type.label}</h4>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'objective':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-6">
              Qual o objetivo do seu conteúdo?
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {OBJECTIVES.map((objective) => (
                <Button
                  key={objective}
                  variant={formData.objective === objective ? 'default' : 'outline'}
                  className="justify-start h-auto p-4"
                  onClick={() => updateFormData('objective', objective)}
                >
                  <Target className="mr-3 h-4 w-4" />
                  {objective}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'channel':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-6">
              Onde será publicado?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {CHANNELS.map((channel) => (
                <Button
                  key={channel}
                  variant={formData.channel === channel ? 'default' : 'outline'}
                  className="justify-start h-auto p-4"
                  onClick={() => updateFormData('channel', channel)}
                >
                  <Users className="mr-3 h-4 w-4" />
                  {channel}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-6">
              Qual estilo de comunicação?
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {STYLES.map((style) => (
                <Button
                  key={style}
                  variant={formData.style === style ? 'default' : 'outline'}
                  className="justify-start h-auto p-4"
                  onClick={() => updateFormData('style', style)}
                >
                  <Palette className="mr-3 h-4 w-4" />
                  {style}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-6">
              Qual o tema ou assunto principal?
            </h3>
            <Textarea
              placeholder="Ex: Benefícios do equipamento X, Como resolver problema Y, Dicas para..."
              value={formData.theme || ''}
              onChange={(e) => updateFormData('theme', e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center mb-6">
              Alguma observação adicional?
              <span className="text-sm text-gray-400 block mt-2">(Opcional)</span>
            </h3>
            <Textarea
              placeholder="Ex: Tom mais inspirador, incluir dados científicos, focar no público feminino..."
              value={formData.additionalNotes || ''}
              onChange={(e) => updateFormData('additionalNotes', e.target.value)}
              className="min-h-[120px]"
            />
            
            {formData.style && (
              <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">Mentor Selecionado</span>
                </div>
                <div className="text-sm">
                  <strong>{MENTORS[selectMentor(formData)]?.name}</strong>
                  <p className="text-gray-400">{MENTORS[selectMentor(formData)]?.focus}</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index <= currentStep ? 'text-purple-400' : 'text-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep ? 'bg-purple-500' : 'bg-gray-700'
              }`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px mx-2 ${
                  index < currentStep ? 'bg-purple-500' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {steps[currentStep].title}
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
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Voltar
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!isStepComplete() || isGenerating}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : currentStep === steps.length - 1 ? (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar Roteiro
            </>
          ) : (
            'Continuar'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SmartScriptGenerator;
