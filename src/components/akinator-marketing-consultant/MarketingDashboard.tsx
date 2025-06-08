
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Brain,
  BarChart3,
  Eye,
  ChevronRight
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
  const [selectedContent, setSelectedContent] = useState<any>(null);

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
        <div className="text-foreground/80 text-sm">
          <p>📊 Diagnóstico sendo processado pela IA...</p>
          <p className="text-xs mt-1 text-foreground/60">Dados disponíveis, gerando insights personalizados</p>
        </div>
      );
    }

    // Pegar as primeiras linhas mais significativas do diagnóstico
    const lines = aiSections.diagnostico.split('\n').filter(line => line.trim().length > 20);
    const summaryLines = lines.slice(0, 3);
    
    return (
      <div className="space-y-2">
        {summaryLines.map((line, index) => (
          <p key={index} className="text-sm text-foreground/80 leading-relaxed">
            {line.replace(/[•\-\*]/g, '').trim()}
          </p>
        ))}
        {summaryLines.length === 0 && (
          <p className="text-sm text-foreground/80">
            Análise personalizada baseada no perfil da clínica e objetivos definidos.
          </p>
        )}
      </div>
    );
  };

  const cleanText = (text: string) => {
    return text
      .replace(/\*\*/g, '') // Remove **
      .replace(/\*/g, '') // Remove *
      .replace(/^[•\-]\s*/, '') // Remove bullets no início
      .trim();
  };

  const formatTitle = (text: string) => {
    // Remove asteriscos e formata títulos
    return cleanText(text);
  };

  const renderAIContentIdeas = () => {
    // Ideias padrão mais elaboradas quando a IA não retorna ideias específicas
    const defaultIdeas = [
      {
        title: "Before & After com Storytelling",
        description: "Casos reais de transformação com a jornada emocional da paciente, mostrando não apenas o resultado físico, mas o impacto na autoestima e confiança.",
        icon: <Camera className="h-5 w-5" />,
        category: "Transformação",
        engagement: "Alto",
        difficulty: "Médio",
        format: "Reel",
        details: "Combine vídeos curtos mostrando o antes e depois dos procedimentos, incluindo depoimentos emocionais das pacientes sobre como se sentem após o tratamento. Use música inspiradora e transições suaves."
      },
      {
        title: "Lives Educativas Semanais",
        description: "Transmissões ao vivo abordando dúvidas comuns, mitos sobre procedimentos e dicas de cuidados, criando conexão direta com o público.",
        icon: <Play className="h-5 w-5" />,
        category: "Educativo",
        engagement: "Muito Alto",
        difficulty: "Baixo",
        format: "Story",
        details: "Realize lives semanais de 15-20 minutos respondendo dúvidas do público. Crie um cronograma fixo (ex: terças às 19h) e promova antecipadamente. Salve as melhores perguntas para posts futuros."
      },
      {
        title: "Depoimentos em Vídeo Autênticos",
        description: "Pacientes reais compartilhando suas experiências completas, desde a consulta até os resultados, transmitindo confiança e credibilidade.",
        icon: <MessageSquare className="h-5 w-5" />,
        category: "Social Proof",
        engagement: "Alto",
        difficulty: "Baixo",
        format: "Carrossel",
        details: "Grave depoimentos curtos (30-60s) com pacientes satisfeitas. Foque na jornada emocional, medos iniciais e satisfação final. Use legendas para maior alcance."
      },
      {
        title: "Bastidores dos Procedimentos",
        description: "Conteúdo mostrando a preparação, cuidados e profissionalismo por trás dos tratamentos, desmistificando procedimentos e criando transparência.",
        icon: <Users className="h-5 w-5" />,
        category: "Transparência",
        engagement: "Médio",
        difficulty: "Médio",
        format: "Reel",
        details: "Mostre a preparação do ambiente, higienização, cuidados pré-procedimento. Explique cada etapa de forma didática, criando confiança através da transparência."
      },
      {
        title: "Dicas de Autocuidado Sazonal",
        description: "Conteúdo adaptado às estações do ano com cuidados específicos para cada período, posicionando a clínica como especialista em beleza integral.",
        icon: <Lightbulb className="h-5 w-5" />,
        category: "Lifestyle",
        engagement: "Médio",
        difficulty: "Baixo",
        format: "Story",
        details: "Crie posts temáticos por estação: verão (proteção solar, hidratação), inverno (combate ao ressecamento), etc. Use cores e elementos visuais da estação."
      },
      {
        title: "Comparativo de Tratamentos",
        description: "Análises educativas comparando diferentes opções de tratamento para a mesma preocupação, ajudando pacientes a tomar decisões informadas.",
        icon: <BarChart3 className="h-5 w-5" />,
        category: "Educativo",
        engagement: "Alto",
        difficulty: "Alto",
        format: "Carrossel",
        details: "Crie carrosséis comparativos mostrando prós, contras, indicações e resultados esperados de diferentes tratamentos. Use infográficos claros e linguagem acessível."
      }
    ];

    let ideas = [];
    
    if (!aiSections || !aiSections.ideias.length) {
      ideas = defaultIdeas.slice(0, 6);
    } else {
      ideas = aiSections.ideias.slice(0, 3).map((idea, index) => {
        const lines = idea.split('\n').filter(line => line.trim());
        const title = cleanText(lines[0] ? lines[0].substring(0, 50) + (lines[0].length > 50 ? '...' : '') : `Ideia Personalizada ${index + 1}`);
        const description = cleanText(lines.slice(1).join(' ').substring(0, 120) + '...' || 'Estratégia de conteúdo desenvolvida especificamente para seu perfil de clínica');

        return {
          title,
          description,
          icon: [<Camera className="h-5 w-5" />, <Play className="h-5 w-5" />, <MessageSquare className="h-5 w-5" />][index],
          category: "IA Personalizada",
          engagement: "Alto",
          difficulty: "Médio",
          format: ["Reel", "Story", "Carrossel"][index],
          details: `Estratégia personalizada baseada no diagnóstico da sua clínica: ${cleanText(idea.substring(0, 200))}`
        };
      });
      
      ideas = [...ideas, ...defaultIdeas.slice(0, 3)];
    }

    const getEngagementColor = (engagement: string) => {
      switch (engagement) {
        case "Muito Alto": return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700";
        case "Alto": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700";
        case "Médio": return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700";
        default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
      }
    };

    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) {
        case "Baixo": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
        case "Médio": return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
        case "Alto": return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
        default: return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      }
    };

    const getFormatIcon = (format: string) => {
      switch (format) {
        case "Reel": return "📱";
        case "Story": return "📸";
        case "Carrossel": return "🎠";
        default: return "📄";
      }
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ideas.map((idea, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 aurora-glass border-purple-500/30 overflow-hidden relative">
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-card/90 text-xs border-purple-400/50 text-foreground">
                {getFormatIcon(idea.format)} {idea.format}
              </Badge>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-aurora-electric-purple to-aurora-neon-blue text-white rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {idea.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2 group-hover:text-aurora-electric-purple transition-colors">
                    {formatTitle(idea.title)}
                  </h3>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`text-xs px-2 py-1 ${getEngagementColor(idea.engagement)}`}>
                  📈 {idea.engagement}
                </Badge>
                <Badge variant="outline" className={`text-xs px-2 py-1 ${getDifficultyColor(idea.difficulty)}`}>
                  ⚙️ {idea.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 mb-4">
                {cleanText(idea.description)}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Badge variant="secondary" className="text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                  {idea.category}
                </Badge>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs hover:bg-aurora-electric-purple/10 hover:text-aurora-electric-purple flex items-center gap-1"
                      onClick={() => setSelectedContent(idea)}
                    >
                      <Eye className="h-3 w-3" />
                      Ver Detalhes
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl aurora-glass border-purple-500/30">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-foreground">
                        {idea.icon}
                        {formatTitle(idea.title)}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getEngagementColor(idea.engagement)}>
                          📈 Engajamento {idea.engagement}
                        </Badge>
                        <Badge className={getDifficultyColor(idea.difficulty)}>
                          ⚙️ Dificuldade {idea.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-purple-400/50 text-foreground">
                          {getFormatIcon(idea.format)} {idea.format}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground">Descrição:</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {cleanText(idea.description)}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground">Como Executar:</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {cleanText(idea.details)}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <Button className="w-full bg-aurora-electric-purple hover:bg-aurora-electric-purple/90 text-white">
                          Adicionar ao Planejador de Conteúdo
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderAIStrategicActions = () => {
    if (!aiSections || !aiSections.plano) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="border-l-4 border-l-aurora-electric-purple/50 aurora-glass border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-aurora-electric-purple/20 text-aurora-electric-purple rounded-full flex items-center justify-center text-sm font-bold">
                    {index}
                  </div>
                  <p className="text-sm font-medium text-foreground/80">Ação estratégica sendo gerada...</p>
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
          const cleanAction = cleanText(item);
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
          const cleanAction = cleanText(item);
          if (cleanAction && cleanAction.length > 10) {
            actions.push(cleanAction);
          }
        });
      }
    }

    const displayActions = actions.slice(0, 4);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayActions.map((action, index) => (
          <Card key={index} className="border-l-4 border-l-aurora-neon-blue aurora-glass hover:shadow-md transition-shadow border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-aurora-neon-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm font-medium line-clamp-2 flex-1 text-foreground">{formatTitle(action)}</p>
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
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="border-l-4 border-l-aurora-electric-purple/50 aurora-glass border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-aurora-electric-purple/20 text-aurora-electric-purple rounded-full flex items-center justify-center text-sm font-bold">
                    {index}
                  </div>
                  <p className="text-sm font-medium flex-1 text-foreground/80">Estratégia personalizada sendo elaborada pela IA...</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {aiSections.estrategias.map((estrategia, index) => (
          <Card key={index} className="border-l-4 border-l-aurora-electric-purple aurora-glass hover:shadow-md transition-shadow border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-aurora-electric-purple text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm font-medium flex-1 line-clamp-3 text-foreground">{formatTitle(estrategia)}</p>
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

    return cleanText(aiSections.satira);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-foreground hover:text-aurora-electric-purple">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Diagnóstico
        </Button>
        <Badge variant="outline" className="aurora-gradient-bg text-white border-aurora-electric-purple/50">
          Dashboard Estratégico Fluida
        </Badge>
      </div>

      {/* Diagnóstico em Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
          📊 Diagnóstico da Clínica
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-aurora-neon-blue aurora-glass border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Building2 className="h-5 w-5 text-aurora-neon-blue" />
                Perfil do Negócio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{getClinicProfile()}</p>
              <p className="text-xs mt-2 text-aurora-neon-blue">
                {state.clinicType === 'clinica_medica' ? 'Clínica Médica Especializada' : 'Clínica Estética'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-aurora-emerald aurora-glass border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <DollarSign className="h-5 w-5 text-aurora-emerald" />
                Análise Financeira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{getRevenueAnalysis()}</p>
              <p className="text-xs mt-2 text-aurora-emerald">
                Meta: {state.revenueGoal === 'dobrar' ? 'Dobrar Faturamento' :
                        state.revenueGoal === 'crescer_50' ? 'Crescer 50%' :
                        state.revenueGoal === 'crescer_30' ? 'Crescer 30%' : 'Manter Estabilidade'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 aurora-glass border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Target className="h-5 w-5 text-red-400" />
                Objetivo Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{getMainObjective()}</p>
              <Badge variant="secondary" className="mt-2 text-xs bg-red-500/20 text-red-400 border-red-500/30">
                Foco Estratégico
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-aurora-electric-purple md:col-span-2 aurora-glass border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Brain className="h-5 w-5 text-aurora-electric-purple" />
                Análise IA Personalizada
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderAIDiagnosticSummary()}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 aurora-glass border-purple-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <Users className="h-5 w-5 text-orange-400" />
                Público-Alvo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">
                {state.targetAudience ? `Público Definido: ${state.targetAudience}` : 'Público-alvo ainda não foi definido claramente'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ideias de Conteúdo da IA - Melhorado */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
              💡 Ideias de Conteúdo Personalizadas
            </h2>
            <p className="text-foreground/80 mt-1">
              Estratégias de conteúdo desenvolvidas especificamente para o perfil da sua clínica
            </p>
          </div>
          <Badge variant="outline" className="aurora-gradient-bg text-white border-aurora-electric-purple/50">
            {aiSections?.ideias.length > 0 ? 'IA Personalizada' : 'Sugestões Inteligentes'}
          </Badge>
        </div>
        {renderAIContentIdeas()}
      </section>

      {/* Estratégias Personalizadas da IA */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
          📈 Estratégias Personalizadas
        </h2>
        {renderAIPersonalizedStrategies()}
      </section>

      {/* Ações Estratégicas da IA */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
          📅 Plano de Ação Personalizado
        </h2>
        {renderAIStrategicActions()}
      </section>

      {/* Mentor Identificado e Enigma da IA */}
      <Card className="aurora-gradient-bg border-2 border-aurora-electric-purple/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5" />
            🧩 Mentor Estratégico Identificado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-aurora-electric-purple/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-aurora-electric-purple text-white rounded-full flex items-center justify-center font-bold text-sm">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                <p className="text-xs text-foreground/70">{mentor.focus}</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 mb-2">{mentor.style}</p>
            <div className="flex flex-wrap gap-1">
              {mentor.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="aurora-gradient-bg rounded-lg p-4">
            <p className="text-sm italic text-white leading-relaxed">
              "Se <strong>{mentor.name}</strong> olhasse esses dados ia fazer muitas sugestões boas, porque você tem muito potencial. {renderAIMentorSatire()}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTAs Finais */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
          ✅ Próximos Passos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={onCreateScript}
            className="h-auto p-6 flex flex-col items-center gap-3 aurora-gradient-bg hover:opacity-90 text-white"
          >
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Criar Roteiro</div>
              <div className="text-xs opacity-90">Baseado neste diagnóstico</div>
            </div>
          </Button>

          <Button 
            onClick={onGenerateImage}
            className="h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-r from-aurora-neon-blue to-aurora-cyan hover:opacity-90 text-white"
          >
            <Image className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Gerar Imagem</div>
              <div className="text-xs opacity-90">Com base nas ideias</div>
            </div>
          </Button>

          <Button 
            onClick={onDownloadPDF}
            className="h-auto p-6 flex flex-col items-center gap-3 bg-gradient-to-r from-aurora-electric-purple to-primary hover:opacity-90 text-white"
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
              className="h-auto p-6 flex flex-col items-center gap-3 border-2 hover:bg-aurora-electric-purple/10 border-aurora-electric-purple/50 text-foreground"
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
