
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
  MessageSquare
} from "lucide-react";
import { MarketingConsultantState } from './types';

interface MarketingDashboardProps {
  state: MarketingConsultantState;
  onBack: () => void;
  onCreateScript: () => void;
  onGenerateImage: () => void;
  onDownloadPDF: () => void;
}

const MarketingDashboard: React.FC<MarketingDashboardProps> = ({
  state,
  onBack,
  onCreateScript,
  onGenerateImage,
  onDownloadPDF
}) => {
  const getClinicProfile = () => {
    const profiles = {
      'estetica_facial': 'Estética Facial Especializada',
      'estetica_corporal': 'Estética Corporal Focada',
      'completa': 'Clínica Completa (Facial + Corporal)',
      'dermatologia': 'Dermatologia Estética Premium'
    };
    return profiles[state.clinicType as keyof typeof profiles] || 'Perfil Indefinido';
  };

  const getRevenueAnalysis = () => {
    const revenues = {
      'ate_10k': 'Faturamento Inicial - Fase de Crescimento',
      '10k_30k': 'Crescimento Consistente - Expandindo Base',
      '30k_50k': 'Faturamento Sólido - Otimizando Operações',
      'acima_50k': 'Alto Faturamento - Liderança no Mercado'
    };
    return revenues[state.currentRevenue as keyof typeof revenues] || 'Não informado';
  };

  const getMainChallenge = () => {
    const challenges = {
      'atrair_clientes': 'Dificuldade em Atrair Novos Clientes',
      'converter_leads': 'Baixa Conversão de Leads em Vendas',
      'fidelizar': 'Problema na Retenção de Clientes',
      'aumentar_ticket': 'Ticket Médio Abaixo do Potencial'
    };
    return challenges[state.mainChallenge as keyof typeof challenges] || 'Desafio não identificado';
  };

  const getMarketingStatus = () => {
    const budgets = {
      'nada': 'Sem Investimento em Marketing',
      'ate_1k': 'Investimento Básico (até R$ 1.000)',
      '1k_3k': 'Investimento Intermediário (R$ 1.000-3.000)',
      'acima_3k': 'Investimento Avançado (R$ 3.000+)'
    };
    return budgets[state.marketingBudget as keyof typeof budgets] || 'Não informado';
  };

  const getTargetAudience = () => {
    const audiences = {
      'jovens': 'Público Jovem (18-30 anos) - Redes Sociais',
      'adultos': 'Adultos (30-45 anos) - Resultados e Depoimentos',
      'maduros': 'Público Maduro (45+ anos) - Confiança e Experiência',
      'todos': 'Público Diverso - Estratégia Multi-Segmento'
    };
    return audiences[state.targetAudience as keyof typeof audiences] || 'Público não definido';
  };

  const getContentIdeas = () => {
    const ideas = [
      {
        icon: <Play className="h-4 w-4" />,
        title: "Reel: 'Antes e Depois em 30 segundos'",
        description: "Mostre transformações reais com música trending e texto impactante"
      },
      {
        icon: <Camera className="h-4 w-4" />,
        title: "Carrossel: 'Mitos vs Verdades'",
        description: "Desmistifique conceitos sobre tratamentos estéticos de forma educativa"
      },
      {
        icon: <MessageSquare className="h-4 w-4" />,
        title: "Story: 'Dia na Clínica'",
        description: "Bastidores dos atendimentos criando conexão e transparência"
      },
      {
        icon: <Users className="h-4 w-4" />,
        title: "Depoimento: 'Por que escolhi aqui?'",
        description: "Clientes explicando os diferenciais da sua clínica"
      }
    ];
    return ideas;
  };

  const getStrategicActions = () => {
    const actions = [
      "Criar cronograma de 3 posts por semana com mix de conteúdo",
      "Implementar sequência de Stories diários para engajamento",
      "Desenvolver programa de indicação com incentivos",
      "Estabelecer parcerias com influenciadores locais",
      "Criar landing page específica para agendamentos online"
    ];
    return actions.slice(0, 4);
  };

  const getMentorEnigma = () => {
    return "Este diagnóstico foi criado por alguém que transforma dados em estratégias, insights em resultados e clínicas em referências. Consegue descobrir a metodologia por trás dessa análise? 🤔✨";
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
                {state.businessTime === 'iniciante' ? 'Fase de Estabelecimento' : 
                 state.businessTime === 'intermediario' ? 'Crescimento Acelerado' :
                 state.businessTime === 'consolidado' ? 'Operação Consolidada' : 'Liderança no Mercado'}
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
                        state.revenueGoal === '50_porcento' ? 'Crescer 50%' :
                        state.revenueGoal === '100k' ? 'Chegar a R$ 100k' : 'Manter Estabilidade'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                🚨 Principal Desafio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{getMainChallenge()}</p>
              <Badge variant="destructive" className="mt-2 text-xs">
                Prioridade Alta
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                📈 Marketing Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{getMarketingStatus()}</p>
              <p className="text-xs mt-2 text-purple-600">
                Presença Digital: {state.socialMediaPresence === 'inexistente' ? 'Iniciante' :
                                  state.socialMediaPresence === 'basico' ? 'Básica' :
                                  state.socialMediaPresence === 'ativo' ? 'Ativa' : 'Profissional'}
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
              <p className="text-sm text-muted-foreground">{getTargetAudience()}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </section>
    </div>
  );
};

export default MarketingDashboard;
