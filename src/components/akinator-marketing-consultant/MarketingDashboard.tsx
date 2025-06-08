
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
  History
} from "lucide-react";
import { MarketingConsultantState } from './types';

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

  const getContentIdeas = () => {
    const isClinicaMedica = state.clinicType === 'clinica_medica';
    
    if (isClinicaMedica) {
      return [
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
        }
      ];
    } else {
      return [
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
        }
      ];
    }
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

  const getMentorEnigma = () => {
    return "Se {mentor} olhasse esses dados ia fazer muitas sugestões boas, porque você tem muito potencial. 🚀💡";
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
          {getContentIdeas().map((idea, index) => (
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

      {/* Enigma do Mentor */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-dashed border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            🧩 Enigma do Mentor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic text-purple-600 leading-relaxed">
            {getMentorEnigma()}
          </p>
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
