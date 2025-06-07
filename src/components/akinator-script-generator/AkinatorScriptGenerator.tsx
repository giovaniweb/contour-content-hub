
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

interface MentorProfile {
  estilo: string;
  tom: string;
  exemplos: string[];
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

const MENTORS: Record<string, MentorProfile> = {
  viral: {
    estilo: "Divertido e envolvente",
    tom: "Descontraído, com humor inteligente",
    exemplos: ["Gente, isso aqui vai viralizar", "Prepara que vem textão", "Alguém mais passou por isso?"]
  },
  vendedor: {
    estilo: "Direto e persuasivo",
    tom: "Confiante, focado em resultados",
    exemplos: ["Vou direto ao ponto", "Isso aqui vai mudar sua vida", "Última chance de garantir"]
  },
  emocional: {
    estilo: "Conectivo e tocante",
    tom: "Empático, com profundidade emocional",
    exemplos: ["Você já se sentiu assim?", "Essa história me tocou profundamente", "Não estamos sozinhos nisso"]
  },
  criativo: {
    estilo: "Inovador e artístico",
    tom: "Inspirador, com visão única",
    exemplos: ["Vou mostrar uma perspectiva diferente", "Arte é transformação", "Beleza está nos detalhes"]
  },
  educador: {
    estilo: "Didático e claro",
    tom: "Acessível, focado no aprendizado",
    exemplos: ["Vou te ensinar passo a passo", "Conhecimento é poder", "Simplificando para você"]
  },
  visionario: {
    estilo: "Inspirador e estratégico",
    tom: "Assertivo, com visão de futuro",
    exemplos: ["O futuro já chegou", "Liderança é sobre visão", "Inovação começa com coragem"]
  },
  estrategista: {
    estilo: "Analítico e estruturado",
    tom: "Metodológico, baseado em dados",
    exemplos: ["Os números não mentem", "Estratégia é tudo", "Planejamento é chave do sucesso"]
  }
};

const ENIGMAS = [
  "Foi feito pra vender. Mas com alma.",
  "Esse roteiro? Você não lê, você sente.",
  "Quem entende de narrativa vai sacar quem passou por aqui.",
  "Foi só uma virada... mas mudou tudo."
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

  const generateSpecificScript = (answers: AkinatorState, mentorKey: string) => {
    const mentor = MENTORS[mentorKey];
    
    // Estruturas específicas baseadas no mentor e contexto
    let gancho = "";
    let conflito = "";
    let virada = "";
    let cta = "";

    if (mentorKey === 'viral') {
      gancho = "Gente, 73% das pessoas fazem isso errado todo santo dia...";
      conflito = "E aí que mora o drama: você gasta uma fortuna achando que tá certo, mas na verdade tá sabotando tudo.";
      virada = "Descobri um truque de 30 segundos que economiza 80% do tempo e dobra o resultado.";
      cta = "Comenta AÍ embaixo se você quer que eu mostre o passo a passo!";
    } else if (mentorKey === 'vendedor') {
      gancho = "Vou te mostrar como faturar R$ 5.000 a mais este mês sem sair de casa.";
      conflito = "O problema é que 90% das pessoas tentam vender sem entender a dor real do cliente.";
      virada = "Quando você aplica a fórmula dos 3 gatilhos mentais, as vendas disparam automaticamente.";
      cta = "Clica no link da bio e garante sua vaga no treinamento gratuito que acontece hoje às 20h.";
    } else if (mentorKey === 'emocional') {
      gancho = "Essa foto mudou minha vida. E eu quero te contar por quê.";
      conflito = "Durante anos eu carreguei uma culpa que me consumia por dentro, achando que nunca seria suficiente.";
      virada = "Foi quando entendi que nossa maior fraqueza pode se tornar nossa maior força.";
      cta = "Se você também carrega algo assim, me manda uma DM. Você não está sozinho.";
    } else if (mentorKey === 'criativo') {
      gancho = "Transformei um objeto do lixo numa obra de arte que vale R$ 2.000.";
      conflito = "Vivemos numa sociedade que descarta o que poderia ser recriado com um olhar diferente.";
      virada = "Arte não está no material caro, está na visão de quem cria.";
      cta = "Marca alguém que precisa ver que criatividade não tem limite!";
    } else if (mentorKey === 'educador') {
      gancho = "Em 60 segundos você vai aprender algo que deveria ter aprendido na escola.";
      conflito = "O sistema educacional ensina fórmulas, mas esquece de ensinar como aplicar na vida real.";
      virada = "Quando você domina esse conceito, problemas complexos viram exercícios simples.";
      cta = "Salva esse post e compartilha com alguém que precisa aprender isso também!";
    } else if (mentorKey === 'visionario') {
      gancho = "Em 2030, quem não souber isso vai ficar para trás.";
      conflito = "Enquanto todos se preocupam com tendências passageiras, o futuro já está sendo construído.";
      virada = "Visão não é prever o futuro, é criar ele.";
      cta = "Me segue para não perder as próximas previsões que vão virar realidade.";
    } else { // estrategista
      gancho = "Analisei 10.000 casos e descobri o padrão que 99% ignora.";
      conflito = "Dados mostram que intuição sem estratégia leva ao fracasso em 87% dos casos.";
      virada = "Quando você segue o método baseado em evidências, o sucesso deixa de ser sorte.";
      cta = "Quer acesso à planilha com o framework completo? Link na bio.";
    }

    return { gancho, conflito, virada, cta, mentor };
  };

  const handleOptionSelect = (value: string) => {
    const newState = { ...state, [currentStepData.id]: value };
    
    if (state.currentStep < STEPS.length - 1) {
      setState({ ...newState, currentStep: state.currentStep + 1 });
    } else {
      // Gerar roteiro
      const mentorKey = selectMentor(newState);
      const script = generateSpecificScript(newState, mentorKey);
      const enigma = ENIGMAS[Math.floor(Math.random() * ENIGMAS.length)];
      
      setState({
        ...newState,
        isComplete: true,
        generatedScript: `🎬 Gancho:\n${script.gancho}\n\n🎯 Conflito:\n${script.conflito}\n\n🔁 Virada:\n${script.virada}\n\n📣 CTA:\n${script.cta}\n\n🔮 Enigma do Mentor:\n"${enigma}"`,
        selectedMentor: mentorKey
      });
    }
  };

  const handleDisneyMagic = () => {
    if (!state.generatedScript) return;
    
    // Aplicar estrutura Disney com conteúdo específico
    const disneyScript = `🎬 Gancho (Era uma vez...):\nHavia uma pessoa que acreditava que tinha encontrado a solução perfeita...\n\n🎯 Conflito (Até que um dia...):\nMas descobriu que estava cometendo o mesmo erro que 90% das pessoas cometem...\n\n🔁 Virada (Então ela descobriu...):\nQuando aplicou o método dos especialistas, tudo mudou em questão de dias...\n\n📣 CTA (E eles viveram felizes...):\nAgora é sua vez de descobrir esse segredo. Me chama no direct!`;
    
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
