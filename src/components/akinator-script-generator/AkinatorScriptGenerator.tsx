
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Wand2, 
  Target, 
  Users, 
  Palette, 
  MessageCircle,
  Video,
  Image,
  Grid3X3,
  Lightbulb,
  Heart,
  Zap,
  Camera,
  BookOpen,
  Crown,
  Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AkinatorStep {
  id: string;
  question: string;
  options: { value: string; label: string; icon?: React.ReactNode }[];
}

interface AkinatorState {
  contentType?: string;
  objective?: string;
  style?: string;
  theme?: string;
  channel?: string;
  currentStep: number;
  isComplete: boolean;
  generatedScript?: string;
  selectedMentor?: string;
  showDisneyOption?: boolean;
  isApproved?: boolean;
}

const STEPS: AkinatorStep[] = [
  {
    id: 'contentType',
    question: '🎭 Que tipo de magia você quer criar hoje?',
    options: [
      { value: 'video', label: 'Vídeo', icon: <Video className="h-4 w-4" /> },
      { value: 'image', label: 'Imagem', icon: <Image className="h-4 w-4" /> },
      { value: 'carousel', label: 'Carrossel', icon: <Grid3X3 className="h-4 w-4" /> },
      { value: 'bigIdea', label: 'Big Idea', icon: <Lightbulb className="h-4 w-4" /> }
    ]
  },
  {
    id: 'objective',
    question: '🎯 Qual é a sua verdadeira intenção?',
    options: [
      { value: 'vender', label: 'Vender', icon: <Zap className="h-4 w-4" /> },
      { value: 'leads', label: 'Capturar Leads', icon: <Target className="h-4 w-4" /> },
      { value: 'engajar', label: 'Engajar', icon: <Heart className="h-4 w-4" /> },
      { value: 'ensinar', label: 'Ensinar', icon: <BookOpen className="h-4 w-4" /> },
      { value: 'posicionar', label: 'Posicionar', icon: <Crown className="h-4 w-4" /> }
    ]
  },
  {
    id: 'style',
    question: '🎨 Que energia você quer transmitir?',
    options: [
      { value: 'emocional', label: 'Emocional/Tocante' },
      { value: 'direto', label: 'Direto/Objetivo' },
      { value: 'criativo', label: 'Criativo/Artístico' },
      { value: 'provocativo', label: 'Provocativo/Ousado' },
      { value: 'didático', label: 'Didático/Claro' },
      { value: 'humoristico', label: 'Divertido/Viral' }
    ]
  },
  {
    id: 'theme',
    question: '💭 Sobre o que vamos falar?',
    options: [
      { value: 'tendencia', label: 'Tendência do Momento' },
      { value: 'dor', label: 'Dor/Problema' },
      { value: 'transformacao', label: 'Transformação' },
      { value: 'curiosidade', label: 'Curiosidade/Segredo' },
      { value: 'autoridade', label: 'Autoridade/Expertise' },
      { value: 'livre', label: 'Tema Livre' }
    ]
  },
  {
    id: 'channel',
    question: '📱 Onde essa obra vai brilhar?',
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'youtube', label: 'YouTube Shorts' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'pinterest', label: 'Pinterest' },
      { value: 'facebook', label: 'Facebook' }
    ]
  }
];

const ENIGMAS = [
  "Você sentiu a virada? Então já sabe quem guiou isso.",
  "Esse roteiro tem cheiro de provocação.",
  "Foi feito para vender. Mas com alma.",
  "Não é sobre marketing. É sobre visão.",
  "Esse gancho? Isso tem assinatura secreta."
];

const AkinatorScriptGenerator: React.FC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<AkinatorState>({
    currentStep: 0,
    isComplete: false
  });

  const currentStepData = STEPS[state.currentStep];

  const selectMentor = (answers: AkinatorState) => {
    const { style, objective, contentType } = answers;
    
    if (style === 'humoristico' || contentType === 'bigIdea') return 'viral';
    if (style === 'direto' || objective === 'vender') return 'vendedor';
    if (style === 'emocional' || style === 'provocativo') return 'emocional';
    if (style === 'criativo' || contentType === 'video') return 'criativo';
    if (style === 'didático' || objective === 'ensinar') return 'educador';
    if (objective === 'posicionar') return 'visionario';
    
    return 'estrategista';
  };

  const generateScript = (answers: AkinatorState) => {
    const mentor = selectMentor(answers);
    
    // Estrutura base do roteiro baseada no tipo de conteúdo e mentor
    let gancho = "";
    let conflito = "";
    let virada = "";
    let cta = "";

    // Ganchos baseados no estilo
    if (answers.style === 'emocional') {
      gancho = "Você já sentiu aquela sensação de que algo está faltando?";
    } else if (answers.style === 'direto') {
      gancho = "Vou te contar algo que ninguém fala sobre isso...";
    } else if (answers.style === 'provocativo') {
      gancho = "Todo mundo está fazendo errado. E eu vou provar.";
    } else if (answers.style === 'humoristico') {
      gancho = "Gente, vocês não vão acreditar no que aconteceu...";
    } else {
      gancho = "Hoje eu descobri algo que mudou tudo...";
    }

    // Conflitos baseados no objetivo
    if (answers.objective === 'vender') {
      conflito = "O problema é que a maioria das pessoas não sabe que existe uma solução simples para isso.";
    } else if (answers.objective === 'engajar') {
      conflito = "E aí que mora o drama: todo mundo quer, mas ninguém sabe como começar.";
    } else {
      conflito = "Mas existe um detalhe que muda tudo e poucos sabem.";
    }

    // Viradas baseadas no tema
    if (answers.theme === 'transformacao') {
      virada = "A virada acontece quando você entende que não é sobre técnica, é sobre mentalidade.";
    } else if (answers.theme === 'curiosidade') {
      virada = "O segredo está em fazer exatamente o oposto do que todo mundo faz.";
    } else {
      virada = "A resposta está bem na sua frente, você só precisa mudar o ângulo.";
    }

    // CTAs baseados no canal
    if (answers.channel === 'instagram') {
      cta = "Salva esse post e me conta nos comentários: você já passou por isso?";
    } else if (answers.channel === 'tiktok') {
      cta = "Comenta AÍ se você quer que eu faça um vídeo só sobre isso!";
    } else {
      cta = "Deixa seu comentário aqui embaixo contando sua experiência!";
    }

    return { gancho, conflito, virada, cta, mentor };
  };

  const handleOptionSelect = (value: string) => {
    const newState = { ...state, [currentStepData.id]: value };
    
    if (state.currentStep < STEPS.length - 1) {
      setState({ ...newState, currentStep: state.currentStep + 1 });
    } else {
      // Gerar roteiro
      const script = generateScript(newState);
      const enigma = ENIGMAS[Math.floor(Math.random() * ENIGMAS.length)];
      
      setState({
        ...newState,
        isComplete: true,
        generatedScript: `🎬 Gancho:\n${script.gancho}\n\n🎯 Conflito:\n${script.conflito}\n\n🔁 Virada:\n${script.virada}\n\n📣 CTA:\n${script.cta}\n\n🔮 Enigma do Mentor:\n"${enigma}"`,
        selectedMentor: script.mentor
      });
    }
  };

  const handleDisneyMagic = () => {
    if (!state.generatedScript) return;
    
    // Aplicar estrutura Disney
    const disneyScript = `🎬 Gancho (Era uma vez...):\nEm um mundo onde todos buscam a mesma coisa, uma pessoa descobriu algo diferente...\n\n🎯 Conflito (Até que um dia...):\nMas ela percebeu que o caminho tradicional não funcionava mais...\n\n🔁 Virada (Então ela descobriu...):\nFoi quando encontrou uma abordagem que ninguém esperava...\n\n📣 CTA (E eles viveram felizes...):\nAgora é sua vez de descobrir esse segredo. Vem comigo!`;
    
    setState({
      ...state,
      generatedScript: disneyScript,
      showDisneyOption: false
    });
    
    toast({
      title: "✨ Magia Disney Aplicada!",
      description: "Seu roteiro agora tem a estrutura narrativa da Disney."
    });
  };

  const handleApproveScript = () => {
    setState({ ...state, isApproved: true });
    toast({
      title: "✅ Roteiro Aprovado!",
      description: "Agora você pode gerar conteúdo adicional."
    });
  };

  const handleGenerateImage = () => {
    toast({
      title: "🖼️ Gerando imagem...",
      description: "Sua arte está sendo criada pela IA!"
    });
  };

  const handleGenerateAudio = () => {
    toast({
      title: "🎧 Gerando áudio...",
      description: "Sua narração está sendo criada!"
    });
  };

  const resetGenerator = () => {
    setState({
      currentStep: 0,
      isComplete: false,
      showDisneyOption: false,
      isApproved: false
    });
  };

  if (state.isComplete) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Wand2 className="h-6 w-6 text-primary" />
              Roteiro Criado pela Magia do Akinator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm bg-muted/50 p-6 rounded-lg mb-6">
              {state.generatedScript}
            </div>
            
            {!state.isApproved && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button 
                  onClick={handleDisneyMagic}
                  variant="outline"
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  ✨ Encantar com Disney
                </Button>
                
                <Button 
                  onClick={handleApproveScript}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  ✅ Aprovar Roteiro
                </Button>
              </div>
            )}
            
            {state.isApproved && (
              <div className="space-y-4">
                <div className="text-center">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Roteiro Aprovado!
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {state.contentType !== 'video' ? (
                    <Button 
                      onClick={handleGenerateImage}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      🖼️ Criar imagem com IA
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleGenerateAudio}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      🎧 Gerar áudio com voz IA
                    </Button>
                  )}
                  
                  <Button 
                    onClick={resetGenerator}
                    variant="outline"
                    className="flex-1"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Novo Roteiro
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= state.currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {index < state.currentStep ? '✓' : index + 1}
            </div>
          ))}
        </div>
        <div className="text-center">
          <Badge variant="outline">
            Etapa {state.currentStep + 1} de {STEPS.length}
          </Badge>
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStepData.question}
              </motion.div>
            </AnimatePresence>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {currentStepData.options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="justify-start h-auto p-4 text-left"
                onClick={() => handleOptionSelect(option.value)}
              >
                <div className="flex items-center gap-3">
                  {option.icon}
                  <span>{option.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      {state.currentStep > 0 && (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setState({ ...state, currentStep: state.currentStep - 1 })}
          >
            ← Voltar
          </Button>
        </div>
      )}
    </div>
  );
};

export default AkinatorScriptGenerator;
