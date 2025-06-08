import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Lightbulb,
  Target,
  FileText,
  Image,
  Download,
  ArrowLeft,
  Play,
  Camera,
  MessageSquare,
  History,
  Brain
} from "lucide-react";
import { MarketingConsultantState } from './types';
import { MarketingMentorInference } from './mentorInference';

interface MarketingDashboardProps {
  state: MarketingConsultantState;
  onBack: () => void;
  onCreateScript: () => void;
  onGenerateImage: () => void;
  onDownloadPDF: () => void;
  onViewHistory?: () => void;
}

const MarketingDashboard: React.FC<MarketingDashboardProps> = ({
  state,
  onBack,
  onCreateScript,
  onGenerateImage,
  onDownloadPDF,
  onViewHistory
}) => {
  // Inferir mentor baseado no perfil
  const { mentor, enigma } = MarketingMentorInference.inferMentor(state);

  const getClinicProfile = () => {
    if (state.clinicType === 'clinica_medica') {
      const profiles = {
        'dermatologia': 'Dermatologia Estética',
        'nutrologia': 'Nutrologia Especializada',
        'ginecoestetica': 'Ginecoestética',
        'cirurgia_plastica': 'Cirurgia Plástica',
        'medicina_estetica': 'Medicina Estética',
        'outras': 'Medicina Especializada'
      };
      return profiles[state.medicalSpecialty as keyof typeof profiles] || 'Clínica Médica';
    } else {
      const profiles = {
        'corporal': 'Estética Corporal',
        'facial': 'Estética Facial',
        'ambos': 'Estética Completa',
        'depilacao': 'Depilação Especializada'
      };
      return profiles[state.aestheticFocus as keyof typeof profiles] || 'Clínica Estética';
    }
  };

  const getRevenueAnalysis = () => {
    const revenues = {
      'ate_15k': 'Faturamento Inicial - Fase de Crescimento',
      '15k_30k': 'Crescimento Consistente - Expandindo Base',
      '30k_60k': 'Faturamento Sólido - Otimizando Operações',
      'acima_60k': 'Alto Faturamento - Liderança no Mercado'
    };
    return revenues[state.currentRevenue as keyof typeof revenues] || 'Não informado';
  };

  const getMainObjective = () => {
    if (state.clinicType === 'clinica_medica') {
      const objectives = {
        'diferenciacao': 'Diferenciação no Mercado Médico',
        'escala': 'Escalar Atendimentos Médicos',
        'retencao': 'Melhorar Retenção de Pacientes',
        'autoridade': 'Construir Autoridade Médica'
      };
      return objectives[state.medicalObjective as keyof typeof objectives] || 'Objetivo não definido';
    } else {
      const objectives = {
        'mais_leads': 'Atrair Mais Leads Qualificados',
        'recorrencia': 'Aumentar Recorrência de Clientes',
        'ticket_medio': 'Aumentar Ticket Médio',
        'autoridade': 'Construir Autoridade na Região'
      };
      return objectives[state.aestheticObjective as keyof typeof objectives] || 'Objetivo não definido';
    }
  };

  const getContentFrequencyStatus = () => {
    const frequencies = {
      'diario': 'Produção Diária - Excelente Consistência',
      'varios_por_semana': 'Várias Vezes por Semana - Boa Frequência',
      'semanal': 'Semanal - Frequência Básica',
      'irregular': 'Irregular - Necessita Estruturação'
    };
    return frequencies[state.contentFrequency as keyof typeof frequencies] || 'Não informado';
  };

  const getTargetAudienceAnalysis = () => {
    if (state.targetAudience) {
      return `Público Definido: ${state.targetAudience}`;
    }
    return 'Público-alvo ainda não foi definido claramente';
  };

  const getPersonalizedContentIdeas = () => {
    const isClinicaMedica = state.clinicType === 'clinica_medica';
    const ideas = [];

    // Seed para variação baseado no timestamp para evitar sempre as mesmas ideias
    const today = new Date();
    const seed = today.getDate() + today.getMonth();

    if (isClinicaMedica) {
      // Pool de ideias médicas variadas
      const medicalIdeasPool = [
        {
          icon: <Play className="h-4 w-4" />,
          title: "Reel: 'Resultados Médicos em 30s'",
          description: "Antes e depois de procedimentos com narração técnica profissional"
        },
        {
          icon: <Camera className="h-4 w-4" />,
          title: "Carrossel: 'Ciência por trás do tratamento'",
          description: "Educação médica sobre os procedimentos realizados na clínica"
        },
        {
          icon: <MessageSquare className="h-4 w-4" />,
          title: "Story: 'Dia do médico'",
          description: "Bastidores dos atendimentos destacando expertise e cuidado"
        },
        {
          icon: <Users className="h-4 w-4" />,
          title: "Depoimento: 'Por que confio neste médico?'",
          description: "Pacientes explicando a confiança no profissional e resultados"
        },
        {
          icon: <Play className="h-4 w-4" />,
          title: "Reel: 'Mitos vs Verdades Médicas'",
          description: "Desmistificando conceitos sobre sua especialidade médica"
        },
        {
          icon: <Camera className="h-4 w-4" />,
          title: "Carrossel: 'Tecnologia na Medicina'",
          description: "Equipamentos e técnicas avançadas da sua clínica"
        },
        {
          icon: <MessageSquare className="h-4 w-4" />,
          title: "Story: 'Preparação para procedimento'",
          description: "Mostrando cuidados pré e pós procedimento"
        },
        {
          icon: <Users className="h-4 w-4" />,
          title: "Live: 'Tire suas dúvidas médicas'",
          description: "Sessão ao vivo respondendo perguntas da comunidade"
        }
      ];

      // Selecionar ideias baseadas no perfil específico
      if (state.medicalSpecialty === 'dermatologia') {
        ideas.push({
          icon: <Play className="h-4 w-4" />,
          title: "Reel: 'Rotina de skincare médico'",
          description: "Demonstrando cuidados dermatológicos profissionais"
        });
      }

      if (state.medicalObjective === 'autoridade') {
        ideas.push({
          icon: <Camera className="h-4 w-4" />,
          title: "Carrossel: 'Cases clínicos de sucesso'",
          description: "Apresentando resultados científicos e metodologia"
        });
      }

      if (state.personalBrand === 'nunca' || state.personalBrand === 'raramente') {
        ideas.push({
          icon: <MessageSquare className="h-4 w-4" />,
          title: "Story: 'Conheça o médico'",
          description: "Apresentação pessoal e formação acadêmica"
        });
      }

      // Preencher com ideias do pool para completar 4
      const remainingSlots = 4 - ideas.length;
      const shuffledPool = medicalIdeasPool.sort(() => (seed % 2) - 0.5);
      ideas.push(...shuffledPool.slice(0, remainingSlots));

    } else {
      // Pool de ideias estéticas variadas
      const aestheticIdeasPool = [
        {
          icon: <Play className="h-4 w-4" />,
          title: "Reel: 'Transformação em 30 segundos'",
          description: "Antes e depois com música trending e depoimento emocional"
        },
        {
          icon: <Camera className="h-4 w-4" />,
          title: "Carrossel: 'Mitos vs Verdades da Estética'",
          description: "Desmistifique conceitos sobre tratamentos de forma acessível"
        },
        {
          icon: <MessageSquare className="h-4 w-4" />,
          title: "Story: 'Dia na Clínica'",
          description: "Bastidores acolhedores mostrando cuidado e ambiente"
        },
        {
          icon: <Users className="h-4 w-4" />,
          title: "Depoimento: 'Como me senti mais bonita'",
          description: "Clientes falando sobre autoestima e bem-estar"
        },
        {
          icon: <Play className="h-4 w-4" />,
          title: "Reel: 'Processo do tratamento'",
          description: "Mostrando passo a passo de um procedimento popular"
        },
        {
          icon: <Camera className="h-4 w-4" />,
          title: "Carrossel: 'Tendências em estética'",
          description: "Novidades e tecnologias do mercado estético"
        },
        {
          icon: <MessageSquare className="h-4 w-4" />,
          title: "Story: 'Dicas de cuidados'",
          description: "Orientações para manter resultados em casa"
        },
        {
          icon: <Users className="h-4 w-4" />,
          title: "Live: 'Tire suas dúvidas estéticas'",
          description: "Bate-papo ao vivo sobre procedimentos e cuidados"
        }
      ];

      // Selecionar ideias baseadas no perfil específico
      if (state.aestheticFocus === 'corporal') {
        ideas.push({
          icon: <Play className="h-4 w-4" />,
          title: "Reel: 'Verão chegando, corpo em forma'",
          description: "Tratamentos corporais para a temporada"
        });
      }

      if (state.aestheticFocus === 'facial') {
        ideas.push({
          icon: <Camera className="h-4 w-4" />,
          title: "Carrossel: 'Cuidados faciais por idade'",
          description: "Tratamentos específicos para cada faixa etária"
        });
      }

      if (state.aestheticObjective === 'mais_leads') {
        ideas.push({
          icon: <MessageSquare className="h-4 w-4" />,
          title: "Story: 'Promoção especial'",
          description: "Ofertas limitadas para atrair novos clientes"
        });
      }

      if (state.clinicPosition === 'premium') {
        ideas.push({
          icon: <Users className="h-4 w-4" />,
          title: "Depoimento: 'Experiência VIP'",
          description: "Clientes falando sobre atendimento exclusivo"
        });
      }

      // Preencher com ideias do pool para completar 4
      const remainingSlots = 4 - ideas.length;
      const shuffledPool = aestheticIdeasPool.sort(() => (seed % 2) - 0.5);
      ideas.push(...shuffledPool.slice(0, remainingSlots));
    }

    return ideas.slice(0, 4); // Garantir exatamente 4 ideias
  };

  const getStrategicActions = () => {
    const isClinicaMedica = state.clinicType === 'clinica_medica';
    
    if (isClinicaMedica) {
      return [
        "Criar cronograma de conteúdo educativo com base científica",
        "Desenvolver cases clínicos para demonstrar expertise",
        "Estabelecer parcerias com outros médicos especialistas",
        "Implementar sistema de consultas online para triagem"
      ];
    } else {
      return [
        "Criar cronograma de 3 posts por semana com mix emocional",
        "Implementar programa de indicação com incentivos",
        "Desenvolver campanhas sazonais (verão, inverno)",
        "Estabelecer parcerias com influenciadores locais"
      ];
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Diagnóstico
        </Button>
        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50">
          Dashboard Estratégico Fluida
        </Badge>
      </div>

      {/* Diagnóstico em Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📊 Diagnóstico da Clínica
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-blue-500" />
                📁 Perfil do Negócio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{getClinicProfile()}</p>
              <p className="text-xs mt-2 text-blue-600">
                {state.clinicType === 'clinica_medica' ? 'Clínica Médica Especializada' : 'Clínica Estética'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
                💰 Análise Financeira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{getRevenueAnalysis()}</p>
              <p className="text-xs mt-2 text-green-600">
                Meta: {state.revenueGoal === 'dobrar' ? 'Dobrar Faturamento' :
                        state.revenueGoal === 'crescer_50' ? 'Crescer 50%' :
                        state.revenueGoal === 'crescer_30' ? 'Crescer 30%' : 'Manter Estabilidade'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-red-500" />
                🎯 Objetivo Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{getMainObjective()}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                Foco Estratégico
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                📈 Produção de Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{getContentFrequencyStatus()}</p>
              <p className="text-xs mt-2 text-purple-600">
                Aparece em vídeos: {state.personalBrand === 'sim_sempre' ? 'Sempre' :
                                   state.personalBrand === 'as_vezes' ? 'Às vezes' :
                                   state.personalBrand === 'raramente' ? 'Raramente' : 'Nunca'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-orange-500" />
                🎯 Público-Alvo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{getTargetAudienceAnalysis()}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ideias de Conteúdo */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          💡 Ideias de Conteúdo Personalizadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getPersonalizedContentIdeas().map((idea, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {idea.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{idea.title}</h3>
                    <p className="text-xs text-muted-foreground">{idea.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Ações Estratégicas */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📈 Ações Estratégicas Sugeridas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {getStrategicActions().map((action, index) => (
            <Card key={index} className="border-l-4 border-l-indigo-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm font-medium">{action}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mentor Identificado e Enigma */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-dashed border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Brain className="h-5 w-5" />
            🧩 Mentor Estratégico Identificado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-purple-800">{mentor.name}</h3>
                <p className="text-xs text-purple-600">{mentor.focus}</p>
              </div>
            </div>
            <p className="text-sm text-purple-700 mb-2">{mentor.style}</p>
            <div className="flex flex-wrap gap-1">
              {mentor.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
            <p className="text-sm italic text-purple-700 leading-relaxed">
              "Se <strong>{mentor.name}</strong> olhasse esses dados ia fazer muitas sugestões boas, porque você tem muito potencial. {enigma}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTAs Finais */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          ✅ Próximos Passos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={onCreateScript}
            className="h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Criar Roteiro</div>
              <div className="text-xs opacity-90">Baseado neste diagnóstico</div>
            </div>
          </Button>

          <Button 
            onClick={onGenerateImage}
            className="h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Image className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Gerar Imagem</div>
              <div className="text-xs opacity-90">Com base nas ideias</div>
            </div>
          </Button>

          <Button 
            onClick={onDownloadPDF}
            className="h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Download className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Baixar PDF</div>
              <div className="text-xs opacity-90">Estratégia completa</div>
            </div>
          </Button>

          {onViewHistory && (
            <Button 
              onClick={onViewHistory}
              variant="outline"
              className="h-auto p-6 flex flex-col items-center gap-3 border-2 hover:bg-slate-50"
            >
              <History className="h-6 w-6" />
              <div className="text-center">
                <div className="font-semibold">Histórico</div>
                <div className="text-xs opacity-70">Relatórios anteriores</div>
              </div>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default MarketingDashboard;
