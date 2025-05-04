
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
  examples?: string[];
}

interface DiagnosticChatProps {
  onComplete: (data: any) => void;
}

type QuestionStage = 
  | 'welcome'
  | 'clinic_name'
  | 'years_in_business' 
  | 'team_size'
  | 'main_services'
  | 'equipments'
  | 'location'
  | 'revenue'
  | 'revenue_goal'
  | 'weekly_clients'
  | 'most_profitable'
  | 'sales_model'
  | 'social_media'
  | 'posting_frequency'
  | 'paid_ads'
  | 'content_comfort'
  | 'website'
  | 'main_challenge'
  | 'improvement_goal'
  | 'marketing_results'
  | 'feeling'
  | 'routine_change'
  | 'solution_desire'
  | 'conclusion';

const DiagnosticChat: React.FC<DiagnosticChatProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<QuestionStage>('welcome');
  const [diagnosticData, setDiagnosticData] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const totalStages = 23; // Total number of stages including welcome and conclusion

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // When component mounts, start the conversation
  useEffect(() => {
    startDiagnostic();
  }, []);

  // Update progress bar whenever stage changes
  useEffect(() => {
    const stageToProgressMap: Record<QuestionStage, number> = {
      welcome: 1,
      clinic_name: 2,
      years_in_business: 3,
      team_size: 4,
      main_services: 5,
      equipments: 6,
      location: 7,
      revenue: 8,
      revenue_goal: 9,
      weekly_clients: 10,
      most_profitable: 11,
      sales_model: 12,
      social_media: 13,
      posting_frequency: 14,
      paid_ads: 15,
      content_comfort: 16,
      website: 17,
      main_challenge: 18,
      improvement_goal: 19,
      marketing_results: 20,
      feeling: 21,
      routine_change: 22,
      solution_desire: 23,
      conclusion: 24
    };

    const currentProgress = stageToProgressMap[currentStage] || 0;
    setProgress(Math.floor((currentProgress / totalStages) * 100));
  }, [currentStage]);

  const startDiagnostic = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Olá! Vamos começar o diagnóstico da sua clínica de estética. Vou fazer algumas perguntas para entender melhor seu negócio e criar uma estratégia personalizada de marketing e crescimento.'
      }
    ]);
    
    // After a brief delay, ask the first question
    setTimeout(() => {
      askNextQuestion();
    }, 800);
  };

  const handleUserResponse = (response: string) => {
    // Add user's response to messages
    setMessages(prev => [...prev, { role: 'user', content: response }]);
    
    // Save the response to the diagnostic data
    setDiagnosticData(prev => ({
      ...prev,
      [currentStage]: response
    }));
    
    // Move to next question after a brief delay
    setTimeout(() => {
      advanceStage();
    }, 800);
  };
  
  const handleOptionsClick = (option: string) => {
    handleUserResponse(option);
  };

  const handleInputSubmit = () => {
    if (!input.trim()) return;
    handleUserResponse(input);
    setInput('');
  };

  const advanceStage = () => {
    const stageProgression: Record<QuestionStage, QuestionStage> = {
      welcome: 'clinic_name',
      clinic_name: 'years_in_business',
      years_in_business: 'team_size',
      team_size: 'main_services',
      main_services: 'equipments',
      equipments: 'location',
      location: 'revenue',
      revenue: 'revenue_goal',
      revenue_goal: 'weekly_clients',
      weekly_clients: 'most_profitable',
      most_profitable: 'sales_model',
      sales_model: 'social_media',
      social_media: 'posting_frequency',
      posting_frequency: 'paid_ads',
      paid_ads: 'content_comfort',
      content_comfort: 'website',
      website: 'main_challenge',
      main_challenge: 'improvement_goal',
      improvement_goal: 'marketing_results',
      marketing_results: 'feeling',
      feeling: 'routine_change',
      routine_change: 'solution_desire',
      solution_desire: 'conclusion',
      conclusion: 'conclusion' // End state
    };
    
    const nextStage = stageProgression[currentStage];
    setCurrentStage(nextStage);
    
    if (nextStage === 'conclusion') {
      finalizeDiagnostic();
    } else {
      askNextQuestion();
    }
  };
  
  const askNextQuestion = () => {
    setLoading(true);
    
    const questions: Record<QuestionStage, { content: string, options?: string[], examples?: string[] }> = {
      welcome: {
        content: 'Vamos começar pelo perfil da sua clínica. Qual é o nome da sua clínica?',
        examples: ['Espaço Beleza & Saúde', 'Clínica Estética Renascer', 'Estética Avançada Dra. Ana']
      },
      clinic_name: {
        content: 'Ótimo! Há quanto tempo a clínica está no mercado?',
        examples: ['2 anos', '6 meses', 'Estamos começando agora', '10 anos']
      },
      years_in_business: {
        content: 'Quantos profissionais fazem parte da sua equipe atualmente?',
        examples: ['Só eu', '3 profissionais', 'Temos 5 pessoas na equipe']
      },
      team_size: {
        content: 'Quais são os principais procedimentos oferecidos pela sua clínica?',
        examples: ['Botox, preenchimento e limpeza de pele', 'Tratamentos corporais e faciais', 'Laser, depilação e microagulhamento']
      },
      main_services: {
        content: 'Quais equipamentos estéticos você utiliza atualmente na sua clínica?',
        examples: ['HIFU, radiofrequência e ultrassom', 'Não temos equipamentos', 'Laser para depilação e criolipólise']
      },
      equipments: {
        content: 'Em qual cidade sua clínica está localizada e qual é seu público-alvo principal?',
        examples: ['São Paulo, mulheres 30-50 anos classe B', 'Rio de Janeiro, público feminino e masculino', 'Fortaleza, foco em noivas e debutantes']
      },
      location: {
        content: 'Vamos falar sobre a situação financeira e comercial. Qual é o faturamento médio mensal atual da sua clínica?',
        examples: ['R$ 15.000', 'Entre R$ 5.000 e R$ 8.000', 'Cerca de R$ 30.000 mensais']
      },
      revenue: {
        content: 'Qual seria sua meta ideal de faturamento mensal?',
        examples: ['R$ 25.000', 'Dobrar o atual, para R$ 60.000', 'No mínimo R$ 10.000']
      },
      revenue_goal: {
        content: 'Quantos atendimentos sua clínica realiza por semana, em média?',
        examples: ['15 atendimentos', 'Entre 20 e 30', 'Menos de 10 atualmente']
      },
      weekly_clients: {
        content: 'Quais são os procedimentos mais lucrativos da sua clínica atualmente?',
        examples: ['Botox e preenchimento', 'Pacotes de emagrecimento', 'Tratamentos corporais com aparelhos']
      },
      most_profitable: {
        content: 'Você vende pacotes ou trabalha por sessão única?',
        options: ['Pacotes', 'Sessão única', 'Ambos']
      },
      sales_model: {
        content: 'Agora vamos falar sobre marketing e comunicação. Você usa redes sociais para divulgar seus serviços?',
        options: ['Sim', 'Não']
      },
      social_media: {
        content: 'Com que frequência você publica conteúdos nas redes sociais?',
        options: ['Diariamente', '2-3x por semana', 'Raramente', 'Nunca']
      },
      posting_frequency: {
        content: 'Você investe em tráfego pago ou anúncios para atrair clientes?',
        options: ['Sim', 'Não', 'Já tentei mas não funcionou']
      },
      paid_ads: {
        content: 'Você se sente confortável criando conteúdo para suas redes sociais?',
        options: ['Sim', 'Mais ou menos', 'Não sei o que postar']
      },
      content_comfort: {
        content: 'Sua clínica possui site ou landing page de captação?',
        options: ['Sim', 'Não']
      },
      website: {
        content: 'Qual é o maior desafio da sua clínica hoje?',
        options: ['Atrair mais clientes', 'Converter leads em clientes', 'Criar conteúdo relevante', 'Fidelizar clientes existentes', 'Precificar serviços', 'Outro (especifique)'],
        examples: ['Não consigo fechar as vendas quando o cliente chega', 'Tenho dificuldade em fazer os clientes voltarem']
      },
      main_challenge: {
        content: 'O que você gostaria de melhorar na sua clínica nos próximos 3 meses?',
        examples: ['Aumentar o faturamento em 30%', 'Ter mais agendamentos por semana', 'Melhorar minha presença nas redes sociais']
      },
      improvement_goal: {
        content: 'Quais resultados você considera satisfatórios com marketing?',
        options: ['Mais pacientes novos', 'Mais pacotes vendidos', 'Mais seguidores e engajamento', 'Maior autoridade no mercado', 'Outro (especifique)']
      },
      marketing_results: {
        content: 'Como você está se sentindo em relação ao seu negócio hoje?',
        options: ['Animado(a)', 'Satisfeito(a)', 'Preocupado(a)', 'Frustrado(a)', 'Esgotado(a)', 'Outro (especifique)'],
        examples: ['Estou preocupada porque o movimento caiu nos últimos meses']
      },
      feeling: {
        content: 'O que você gostaria de mudar na sua rotina como profissional?',
        examples: ['Ter mais tempo para atendimentos e menos para tarefas administrativas', 'Não precisar me preocupar tanto com captação de clientes', 'Trabalhar menos horas por dia']
      },
      routine_change: {
        content: 'Se tivesse uma solução agora para seu maior problema, o que ela faria?',
        examples: ['Traria mais clientes qualificados para a clínica', 'Automatizaria o processo de captação', 'Me ajudaria a criar conteúdo facilmente']
      },
      solution_desire: {
        content: 'Obrigado por todas essas informações! Agora tenho uma visão completa da sua clínica e seus desafios.'
      },
      conclusion: {
        content: 'Estou finalizando sua análise e preparando seu diagnóstico personalizado...'
      }
    };
    
    const question = questions[currentStage];
    if (question) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: question.content,
          options: question.options,
          examples: question.examples
        }]);
        setLoading(false);
      }, 800);
    }
  };
  
  const finalizeDiagnostic = () => {
    // Prepare final message
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: 'Diagnóstico completo! Baseado nas suas respostas, vou gerar um relatório com análise de crescimento potencial e estratégias personalizadas para sua clínica.'
    }]);
    
    // Process data if needed, for example convert revenue string to number
    const processedData = {
      ...diagnosticData,
      // Map some values for the profit calculator
      clinicName: diagnosticData.clinic_name,
      currentRevenue: diagnosticData.revenue,
      yearsInBusiness: diagnosticData.years_in_business,
      teamSize: diagnosticData.team_size,
      mainServices: diagnosticData.main_services,
      equipments: diagnosticData.equipments,
      location: diagnosticData.location,
      revenueGoal: diagnosticData.revenue_goal,
      weeklyClients: diagnosticData.weekly_clients,
      mostProfitable: diagnosticData.most_profitable,
      salesModel: diagnosticData.sales_model?.toLowerCase(),
      usesSocialMedia: diagnosticData.social_media?.toLowerCase(),
      postingFrequency: diagnosticData.posting_frequency,
      paidAds: diagnosticData.paid_ads?.toLowerCase().includes('sim') ? 'yes' : 'no',
      contentComfort: diagnosticData.content_comfort,
      hasWebsite: diagnosticData.website?.toLowerCase().includes('sim') ? 'yes' : 'no',
      mainChallenge: diagnosticData.main_challenge?.toLowerCase().includes('atrair') ? 'attract' : 
                     diagnosticData.main_challenge?.toLowerCase().includes('conteúdo') ? 'content' :
                     diagnosticData.main_challenge?.toLowerCase().includes('convert') ? 'convert' : 'other',
      improvementGoal: diagnosticData.improvement_goal,
      marketingResults: diagnosticData.marketing_results,
      feeling: diagnosticData.feeling,
      routineChange: diagnosticData.routine_change,
      solutionDesire: diagnosticData.solution_desire
    };
    
    // Show success message
    toast({
      title: "Diagnóstico concluído!",
      description: "Preparando sua análise personalizada...",
    });
    
    // Pass the collected data back to the parent component
    setTimeout(() => {
      onComplete(processedData);
    }, 1500);
  };

  // Helper function to handle showing examples as clickable suggestions
  const renderExamples = (examples: string[]) => {
    if (!examples || examples.length === 0) return null;
    
    return (
      <div className="mt-3">
        <div className="text-xs text-muted-foreground mb-1 flex items-center">
          <span>Exemplos de respostas:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 ml-1">
                <HelpCircle className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <p className="text-xs">
                Clique em um exemplo para usar ou digite sua própria resposta no campo abaixo.
              </p>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, idx) => (
            <Button
              key={idx}
              size="sm"
              variant="outline"
              onClick={() => handleOptionsClick(example)}
              className="text-xs bg-background hover:bg-muted/80"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Diagnóstico Conversacional
          <div className="text-sm font-normal text-muted-foreground ml-auto">
            {progress}% completo
          </div>
        </CardTitle>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
                
                {message.options && message.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.options.map((option, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant="outline"
                        onClick={() => handleOptionsClick(option)}
                        className="text-xs"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {message.role === 'assistant' && message.examples && renderExamples(message.examples)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Digite sua resposta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleInputSubmit();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleInputSubmit} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DiagnosticChat;
