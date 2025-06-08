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
    console.log('🔍 Parseando diagnóstico:', diagnostic);
    
    if (!diagnostic) {
      console.log('❌ Diagnóstico vazio');
      return null;
    }

    const sections = {
      diagnostico: '',
      ideias: [],
      plano: '',
      estrategias: [],
      satira: ''
    };

    // Normalizar o texto removendo caracteres especiais e convertendo para maiúsculo para busca
    const normalizedText = diagnostic.replace(/[#*]/g, '').toUpperCase();
    
    // Extrair seção de diagnóstico - procurar por diferentes variações
    const diagnosticoPatterns = [
      /DIAGNÓSTICO ESTRATÉGICO([\s\S]*?)(?=IDEIAS DE CONTEÚDO|PLANO DE AÇÃO|💡|📅|$)/i,
      /PERFIL DA CLÍNICA([\s\S]*?)(?=IDEIAS DE CONTEÚDO|PLANO DE AÇÃO|💡|📅|$)/i,
      /DIAGNÓSTICO([\s\S]*?)(?=IDEIAS DE CONTEÚDO|PLANO DE AÇÃO|💡|📅|$)/i
    ];

    for (const pattern of diagnosticoPatterns) {
      const match = diagnostic.match(pattern);
      if (match && match[1].trim().length > 50) {
        sections.diagnostico = match[1].trim();
        console.log('✅ Diagnóstico extraído:', sections.diagnostico.substring(0, 100));
        break;
      }
    }

    // Extrair ideias de conteúdo - procurar por diferentes variações
    const ideiasPatterns = [
      /IDEIAS DE CONTEÚDO[^a-zA-Z]*PERSONALIZADAS([\s\S]*?)(?=PLANO DE AÇÃO|ESTRATÉGIAS|📅|📈|$)/i,
      /IDEIAS DE CONTEÚDO([\s\S]*?)(?=PLANO DE Ação|ESTRATÉGIAS|📅|📈|$)/i,
      /💡[^a-zA-Z]*IDEIAS([\s\S]*?)(?=PLANO DE AÇÃO|ESTRATÉGIAS|📅|📈|$)/i
    ];

    for (const pattern of ideiasPatterns) {
      const match = diagnostic.match(pattern);
      if (match && match[1]) {
        const ideiasText = match[1];
        // Extrair itens numerados ou com bullets
        const ideiasList = ideiasText.match(/(\d+\..*?(?=\d+\.|$))|([•\-].*?(?=[•\-]|$))/gs);
        if (ideiasList && ideiasList.length > 0) {
          sections.ideias = ideiasList
            .map(idea => idea.replace(/^\d+\.|^[•\-]\s*/, '').trim())
            .filter(idea => idea.length > 20)
            .slice(0, 4);
          console.log('✅ Ideias extraídas:', sections.ideias.length);
          break;
        }
      }
    }

    // Extrair plano de ação
    const planoPatterns = [
      /PLANO DE AÇÃO[^a-zA-Z]*3 SEMANAS([\s\S]*?)(?=ESTRATÉGIAS|SÁTIRA|🧩|$)/i,
      /PLANO DE AÇÃO([\s\S]*?)(?=ESTRATÉGIAS|SÁTIRA|🧩|$)/i,
      /📅[^a-zA-Z]*PLANO([\s\S]*?)(?=ESTRATÉGIAS|SÁTIRA|🧩|$)/i
    ];

    for (const pattern of planoPatterns) {
      const match = diagnostic.match(pattern);
      if (match && match[1].trim().length > 50) {
        sections.plano = match[1].trim();
        console.log('✅ Plano extraído:', sections.plano.substring(0, 100));
        break;
      }
    }

    // Extrair estratégias personalizadas
    const estrategiasPatterns = [
      /ESTRATÉGIAS PERSONALIZADAS([\s\S]*?)(?=SÁTIRA|🧩|$)/i,
      /📈[^a-zA-Z]*ESTRATÉGIAS([\s\S]*?)(?=SÁTIRA|🧩|$)/i
    ];

    for (const pattern of estrategiasPatterns) {
      const match = diagnostic.match(pattern);
      if (match && match[1]) {
        const estrategiasText = match[1];
        const estrategiasList = estrategiasText.match(/([•\-].*?(?=[•\-]|$))|(\d+\..*?(?=\d+\.|$))/gs);
        if (estrategiasList && estrategiasList.length > 0) {
          sections.estrategias = estrategiasList
            .map(estrategia => estrategia.replace(/^\d+\.|^[•\-]\s*/, '').trim())
            .filter(estrategia => estrategia.length > 20)
            .slice(0, 5);
          console.log('✅ Estratégias extraídas:', sections.estrategias.length);
          break;
        }
      }
    }

    // Se não encontrou estratégias específicas, extrair do diagnóstico geral
    if (sections.estrategias.length === 0) {
      const linhasEstrategicas = diagnostic.split('\n')
        .filter(linha => (linha.includes('•') || linha.includes('-')) && linha.length > 30)
        .filter(linha => 
          linha.toLowerCase().includes('conteúdo') ||
          linha.toLowerCase().includes('estratégia') ||
          linha.toLowerCase().includes('marketing') ||
          linha.toLowerCase().includes('autoridade') ||
          linha.toLowerCase().includes('cases') ||
          linha.toLowerCase().includes('educativo') ||
          linha.toLowerCase().includes('redes sociais')
        );
      
      sections.estrategias = linhasEstrategicas
        .map(linha => linha.replace(/[•\-]/g, '').trim())
        .slice(0, 5);
      
      console.log('🔄 Estratégias extraídas do diagnóstico geral:', sections.estrategias.length);
    }

    // Extrair sátira do mentor
    const satiraPatterns = [
      /SÁTIRA DO MENTOR([\s\S]*?)(?=---|\*Diagnóstico|$)/i,
      /🧩[^a-zA-Z]*MENTOR([\s\S]*?)(?=---|\*Diagnóstico|$)/i,
      /ENIGMA SATÍRICO([\s\S]*?)(?=---|\*Diagnóstico|$)/i
    ];

    for (const pattern of satiraPatterns) {
      const match = diagnostic.match(pattern);
      if (match && match[1]) {
        const mentorSection = match[1];
        // Procurar por texto em aspas ou texto após ":" 
        const reflexaoMatch = mentorSection.match(/"([^"]+)"|:([^.]+\.)/) || 
                             mentorSection.match(/["""']([^"""']+)["""']/);
        if (reflexaoMatch) {
          sections.satira = (reflexaoMatch[1] || reflexaoMatch[2] || '').replace(/[*"]/g, '').trim();
          console.log('✅ Sátira extraída:', sections.satira.substring(0, 100));
          break;
        }
      }
    }

    console.log('📊 Seções extraídas:', {
      diagnostico: sections.diagnostico.length > 0,
      ideias: sections.ideias.length,
      plano: sections.plano.length > 0,
      estrategias: sections.estrategias.length,
      satira: sections.satira.length > 0
    });

    return sections;
  };

  const aiSections = parseAIDiagnostic(state.generatedDiagnostic || '');
  
  // Inferir mentor baseado no perfil
  const { mentor, enigma } = MarketingMentorInference.inferMentor(state);

  // Helper functions
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
          <p>📊 Diagnóstico sendo processado pela IA...</p>
          <p className="text-xs mt-1">Dados disponíveis, gerando insights personalizados</p>
        </div>
      );
    }

    // Pegar as primeiras linhas mais significativas do diagnóstico
    const lines = aiSections.diagnostico.split('\n').filter(line => line.trim().length > 20);
    const summaryLines = lines.slice(0, 3);
    
    return (
      <div className="space-y-2">
        {summaryLines.map((line, index) => (
          <p key={index} className="text-sm text-muted-foreground leading-relaxed">
            {line.replace(/[•\-\*]/g, '').trim()}
          </p>
        ))}
        {summaryLines.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Análise personalizada baseada no perfil da clínica e objetivos definidos.
          </p>
        )}
      </div>
    );
  };

  const renderAIContentIdeas = () => {
    if (!aiSections || !aiSections.ideias.length) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="hover:shadow-md transition-shadow border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Ideia {index}</h3>
                    <p className="text-xs text-muted-foreground">Conteúdo personalizado sendo gerado pela IA...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiSections.ideias.slice(0, 4).map((idea, index) => {
          // Extrair título e descrição da ideia
          const lines = idea.split('\n').filter(line => line.trim());
          const title = lines[0] ? lines[0].substring(0, 60) + (lines[0].length > 60 ? '...' : '') : `Ideia ${index + 1}`;
          const description = lines.slice(1).join(' ').substring(0, 100) + '...' || 'Estratégia de conteúdo personalizada';

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
                    {icons[index] || <Lightbulb className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-3">{description}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="border-l-4 border-l-indigo-300 border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-indigo-200 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Ação estratégica sendo gerada...</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // Extrair ações do plano
    const actions = [];
    
    // Procurar por padrões de semanas ou listas
    const weekSections = aiSections.plano.split(/SEMANA \d+/i);
    weekSections.forEach(section => {
      const actionItems = section.match(/[•\-]\s*(.+?)(?=[•\-]|$)/gs);
      if (actionItems) {
        actionItems.forEach(item => {
          const cleanAction = item.replace(/^[•\-]\s*/, '').trim();
          if (cleanAction && cleanAction.length > 10) {
            actions.push(cleanAction);
          }
        });
      }
    });

    // Se não encontrou com padrão de semanas, procurar por listas gerais
    if (actions.length === 0) {
      const generalActions = aiSections.plano.match(/[•\-]\s*(.+?)(?=[•\-]|$)/gs);
      if (generalActions) {
        generalActions.forEach(item => {
          const cleanAction = item.replace(/^[•\-]\s*/, '').trim();
          if (cleanAction && cleanAction.length > 10) {
            actions.push(cleanAction);
          }
        });
      }
    }

    const displayActions = actions.slice(0, 4);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayActions.map((action, index) => (
          <Card key={index} className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-sm font-medium line-clamp-2">{action}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderAIPersonalizedStrategies = () => {
    if (!aiSections || !aiSections.estrategias.length) {
      return (
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="border-l-4 border-l-purple-300 border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-200 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index}
                  </div>
                  <p className="text-sm font-medium flex-1 text-muted-foreground">Estratégia personalizada sendo elaborada pela IA...</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3">
        {aiSections.estrategias.map((estrategia, index) => (
          <Card key={index} className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-sm font-medium flex-1 line-clamp-3">{estrategia}</p>
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
          {/* ... keep existing code (diagnosis cards) */}
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

      {/* Estratégias Personalizadas da IA */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📈 Estratégias Personalizadas pela IA
        </h2>
        {renderAIPersonalizedStrategies()}
      </section>

      {/* Ações Estratégicas da IA */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          📅 Plano de Ação Personalizado
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
