
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
  // Parse do diagnóstico da IA para extrair seções
  const parseAIDiagnostic = (diagnostic: string) => {
    if (!diagnostic) return null;

    const sections = {
      diagnostico: '',
      ideias: [],
      plano: '',
      satira: ''
    };

    // Extrair seção de diagnóstico
    const diagnosticoMatch = diagnostic.match(/## 📊 DIAGNÓSTICO ESTRATÉGICO DA CLÍNICA([\s\S]*?)(?=## |$)/);
    if (diagnosticoMatch) {
      sections.diagnostico = diagnosticoMatch[1].trim();
    }

    // Extrair ideias de conteúdo
    const ideiasMatch = diagnostic.match(/## 💡 IDEIAS DE CONTEÚDO SUPER PERSONALIZADAS([\s\S]*?)(?=## |$)/);
    if (ideiasMatch) {
      const ideiasText = ideiasMatch[1];
      const ideiasList = ideiasText.split(/\d+\./).filter(item => item.trim());
      sections.ideias = ideiasList.map(idea => idea.trim()).slice(0, 4);
    }

    // Extrair plano de ação
    const planoMatch = diagnostic.match(/## 📅 PLANO DE AÇÃO - 3 SEMANAS ESPECÍFICO([\s\S]*?)(?=## |$)/);
    if (planoMatch) {
      sections.plano = planoMatch[1].trim();
    }

    // Extrair sátira do mentor
    const satiraMatch = diagnostic.match(/## 🧩 SÁTIRA DO MENTOR[\s\S]*?ENIGMA SATÍRICO:\*\*([\s\S]*?)(?=⚠️|$)/);
    if (satiraMatch) {
      sections.satira = satiraMatch[1].trim();
    }

    return sections;
  };

  const aiSections = parseAIDiagnostic(state.generatedDiagnostic || '');
  
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

  const renderAIDiagnosticSummary = () => {
    if (!aiSections || !aiSections.diagnostico) {
      return (
        <div className="text-muted-foreground text-sm">
          Diagnóstico IA não disponível
        </div>
      );
    }

    // Pegar as primeiras linhas do diagnóstico
    const summaryLines = aiSections.diagnostico.split('\n').slice(0, 3);
    
    return (
      <div className="space-y-2">
        {summaryLines.map((line, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            {line.replace(/[•\-]/g, '').trim()}
          </p>
        ))}
      </div>
    );
  };

  const renderAIContentIdeas = () => {
    if (!aiSections || !aiSections.ideias.length) {
      return (
        <div className="text-center text-muted-foreground p-4">
          <p>Ideias de conteúdo não disponíveis</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiSections.ideias.slice(0, 4).map((idea, index) => {
          // Extrair título e descrição da ideia
          const lines = idea.split('\n').filter(line => line.trim());
          const title = lines[0] || `Ideia ${index + 1}`;
          const description = lines.slice(1).join(' ') || 'Descrição da estratégia';

          const icons = [
            <Play className="h-4 w-4" />,
            <Camera className="h-4 w-4" />,
            <MessageSquare className="h-4 w-4" />,
            <Users className="h-4 w-4" />
          ];

          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {icons[index]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderAIStrategicActions = () => {
    if (!aiSections || !aiSections.plano) {
      return (
        <div className="text-center text-muted-foreground p-4">
          <p>Plano de ação não disponível</p>
        </div>
      );
    }

    // Extrair ações do plano
    const actions = aiSections.plano.split(/SEMANA \d+:/).filter(section => section.trim());
    const actionsList = [];

    actions.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim() && line.includes('-'));
      lines.forEach(line => {
        const action = line.replace(/^[\-•\*]\s*/, '').trim();
        if (action) actionsList.push(action);
      });
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actionsList.slice(0, 4).map((action, index) => (
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
    );
  };

  const renderAIMentorSatire = () => {
    if (!aiSections || !aiSections.satira) {
      return enigma; // Fallback para o enigma padrão
    }

    return aiSections.satira;
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

          <Card className="border-l-4 border-l-purple-500 md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-purple-500" />
                🤖 Análise IA Personalizada
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderAIDiagnosticSummary()}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-orange-500" />
                🎯 Público-Alvo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {state.targetAudience ? `Público Definido: ${state.targetAudience}` : 'Público-alvo ainda não foi definido claramente'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ideias de Conteúdo da IA */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          💡 Ideias de Conteúdo Personalizadas pela IA
        </h2>
        {renderAIContentIdeas()}
      </section>

      {/* Ações Estratégicas da IA */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📈 Plano de Ação Personalizado
        </h2>
        {renderAIStrategicActions()}
      </section>

      {/* Mentor Identificado e Enigma da IA */}
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
              "Se <strong>{mentor.name}</strong> olhasse esses dados ia fazer muitas sugestões boas, porque você tem muito potencial. {renderAIMentorSatire()}"
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
