
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/hooks/useUser';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
  examples?: string[];
  suggestions?: string[]; // Add suggestions as another option type
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
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<QuestionStage>('welcome');
  const [diagnosticData, setDiagnosticData] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [prefilledData, setPrefilledData] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputSuggestions, setInputSuggestions] = useState<string[]>([]);
  
  const totalStages = 23; // Total number of stages including welcome and conclusion

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchUserProfile = async () => {
      try {
        if (user) {
          const supabase = createClient(
            import.meta.env.VITE_SUPABASE_URL || '',
            import.meta.env.VITE_SUPABASE_ANON_KEY || ''
          );
          
          const { data, error } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (!error && data) {
            setUserProfile(data);
            
            // Pre-fill data from profile
            const prefilled: Record<string, any> = {};
            if (data.clinica) prefilled.clinic_name = data.clinica;
            if (data.nome) prefilled.user_name = data.nome;
            if (data.cidade) prefilled.location = data.cidade;
            if (data.equipamentos && data.equipamentos.length > 0) {
              prefilled.equipments = data.equipamentos.join(', ');
            }
            
            setPrefilledData(prefilled);
            
            // Update diagnostic data with prefilled info
            setDiagnosticData(prev => ({
              ...prev,
              ...prefilled
            }));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // When component mounts, start the conversation
  useEffect(() => {
    startDiagnostic();
  }, [prefilledData]);

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
    
    // Set input suggestions based on the current stage
    updateInputSuggestions(currentStage);
  }, [currentStage]);
  
  // Update input suggestions based on the current stage
  const updateInputSuggestions = (stage: QuestionStage) => {
    const suggestions: Record<QuestionStage, string[]> = {
      welcome: [],
      clinic_name: ["Clínica Beleza Natural", "Estética Avançada", "Centro de Estética Daiana"],
      years_in_business: ["2 anos", "6 meses", "10 anos"],
      team_size: ["Apenas eu", "3 pessoas", "5 profissionais"],
      main_services: ["Botox e preenchimento", "Tratamentos faciais e corporais", "Depilação a laser"],
      equipments: ["HIFU e radiofrequência", "Criolipólise", "Laser para depilação"],
      location: ["São Paulo, público feminino classe B", "Rio de Janeiro, profissionais 30-50 anos"],
      revenue: ["R$ 15.000", "R$ 5.000", "R$ 30.000"],
      revenue_goal: ["R$ 25.000", "Dobrar para R$ 30.000", "R$ 50.000"],
      weekly_clients: ["15 clientes", "25 atendimentos", "10 pacientes"],
      most_profitable: ["Botox", "Pacotes de emagrecimento", "Tratamentos corporais"],
      sales_model: [],
      social_media: [],
      posting_frequency: [],
      paid_ads: [],
      content_comfort: [],
      website: [],
      main_challenge: ["Atrair mais clientes", "Converter leads em vendas", "Criar conteúdo relevante"],
      improvement_goal: ["Aumentar o faturamento em 30%", "Melhorar presença digital", "Captar mais pacientes"],
      marketing_results: ["Mais pacientes novos", "Vender mais pacotes", "Ganhar autoridade no mercado"],
      feeling: ["Preocupada com a queda de movimento", "Animada, mas preciso de direção"],
      routine_change: ["Menos tempo em tarefas administrativas", "Não me preocupar com captação"],
      solution_desire: ["Trazer mais clientes qualificados", "Automatizar captação", "Sistema de fidelização"],
      conclusion: []
    };
    
    setInputSuggestions(suggestions[stage] || []);
  };

  const startDiagnostic = () => {
    let welcomeMessage = 'Olá! Vamos começar o diagnóstico da sua clínica de estética. Vou fazer algumas perguntas para entender melhor seu negócio e criar uma estratégia personalizada de marketing e crescimento.';
    
    // Personalize welcome message if we have user profile data
    if (prefilledData.user_name) {
      welcomeMessage = `Olá ${prefilledData.user_name}! Vamos fazer o diagnóstico para entender melhor a sua clínica e criar uma estratégia personalizada de marketing.`;
    }
    
    setMessages([
      {
        role: 'assistant',
        content: welcomeMessage
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
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
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
    
    let nextStage = stageProgression[currentStage];
    
    // Skip questions if we already have the prefilled data
    while (prefilledData[nextStage] && nextStage !== 'conclusion') {
      // Auto-fill the answer in the chat
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant',
          content: getQuestionForStage(nextStage).content
        },
        {
          role: 'user',
          content: prefilledData[nextStage]
        }
      ]);
      
      nextStage = stageProgression[nextStage];
    }
    
    setCurrentStage(nextStage);
    
    if (nextStage === 'conclusion') {
      finalizeDiagnostic();
    } else {
      askNextQuestion();
    }
  };
  
  const getQuestionForStage = (stage: QuestionStage) => {
    const questions: Record<QuestionStage, { content: string, options?: string[], examples?: string[], suggestions?: string[] }> = {
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
    
    return questions[stage] || questions.welcome;
  };
  
  const askNextQuestion = () => {
    setLoading(true);
    
    const question = getQuestionForStage(currentStage);
    
    // Customize questions based on previously collected data
    let customizedContent = question.content;
    
    // For example, personalize the clinic name question if we know the user's name
    if (currentStage === 'clinic_name' && prefilledData.user_name) {
      customizedContent = `${prefilledData.user_name}, qual é o nome da sua clínica?`;
    }
    
    // Personalize the main services question if we know the clinic name
    if (currentStage === 'main_services' && diagnosticData.clinic_name) {
      customizedContent = `Quais são os principais procedimentos oferecidos pela ${diagnosticData.clinic_name}?`;
    }
    
    // Personalize the equipment question if we know the main services
    if (currentStage === 'equipments' && diagnosticData.main_services) {
      customizedContent = `Para oferecer ${diagnosticData.main_services}, quais equipamentos você utiliza na sua clínica?`;
    }
    
    // Personalize questions based on previous answers
    if (currentStage === 'revenue_goal' && diagnosticData.revenue) {
      customizedContent = `Atualmente seu faturamento é de ${diagnosticData.revenue}. Qual seria sua meta ideal de faturamento mensal?`;
    }
    
    if (question) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: customizedContent,
          options: question.options,
          examples: question.examples,
          suggestions: question.suggestions
        }]);
        setLoading(false);
      }, 800);
    }
  };
  
  const finalizeDiagnostic = () => {
    // Prepare final message
    let finalMessage = 'Diagnóstico completo! Baseado nas suas respostas, vou gerar um relatório com análise de crescimento potencial e estratégias personalizadas para sua clínica.';
    
    // Personalize the final message based on data collected
    if (diagnosticData.clinic_name) {
      finalMessage = `Diagnóstico da ${diagnosticData.clinic_name} completo! Baseado nas suas respostas, vou gerar um relatório com análise de crescimento potencial e estratégias personalizadas para sua clínica.`;
    }
    
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: finalMessage
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
      solutionDesire: diagnosticData.solution_desire,
      // Add user profile data if available
      userProfile: userProfile || {}
    };
    
    // Show success message
    toast({
      title: `Diagnóstico concluído!`,
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

  // Render suggestion prompts above input field
  const renderSuggestionPrompts = () => {
    if (!inputSuggestions || inputSuggestions.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-2">
        {inputSuggestions.map((suggestion, idx) => (
          <Button
            key={idx}
            size="sm"
            variant="secondary"
            onClick={() => handleSuggestionClick(suggestion)}
            className="text-xs py-1 h-auto"
          >
            {suggestion}
          </Button>
        ))}
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
        <div className="flex flex-col w-full space-y-2">
          {renderSuggestionPrompts()}
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
        </div>
      </CardFooter>
    </Card>
  );
};

export default DiagnosticChat;
