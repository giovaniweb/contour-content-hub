
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Users, Lightbulb, Heart, Palette, BarChart3 } from "lucide-react";

interface SpecialistsActivatedSectionProps {
  aiSections: any;
}

const SpecialistsActivatedSection: React.FC<SpecialistsActivatedSectionProps> = ({ 
  aiSections 
}) => {
  const getSpecialistIcon = (type: string) => {
    const icons = {
      'conversao': Target,
      'storytelling': Heart,
      'criativo': Lightbulb,
      'trafego': TrendingUp,
      'posicionamento': Brain,
      'fidelizacao': Users,
      'harmonizador': Palette,
      'diagnostico': BarChart3
    };
    return icons[type as keyof typeof icons] || Brain;
  };

  const getSpecialistData = () => {
    if (!aiSections?.ativacao_especialistas) {
      return [
        {
          title: 'Etapa 1 - Diagnóstico Estratégico',
          subtitle: 'Análise Completa do Perfil',
          description: 'Realizando análise profunda dos dados da clínica para identificar oportunidades de crescimento e pontos de melhoria estratégicos.',
          actionText: 'Analisando dados',
          actionColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: 'diagnostico',
          status: 'Processando...'
        },
        {
          title: 'Etapa 2 - Sugestões de Conteúdo',
          subtitle: 'Estratégias Personalizadas',
          description: 'Criando sugestões de conteúdo baseadas no perfil da clínica e objetivos definidos para maximizar o engajamento.',
          actionText: 'Criando estratégias',
          actionColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          icon: 'criativo',
          status: 'Aguardando...'
        }
      ];
    }

    // Processar dados da IA para extrair especialistas
    const specialistText = aiSections.ativacao_especialistas;
    const lines = specialistText.split('\n').filter((line: string) => line.trim());
    
    const specialists = lines
      .filter((line: string) => line.includes('**') || line.includes(':'))
      .slice(0, 4)
      .map((line: string, index: number) => {
        const cleanLine = line.replace(/[*#-]/g, '').trim();
        const parts = cleanLine.split(':');
        const title = parts[0] || `Especialista ${index + 1}`;
        const description = parts[1] || cleanLine;
        
        const actionColors = [
          'bg-green-500/20 text-green-400 border-green-500/30',
          'bg-orange-500/20 text-orange-400 border-orange-500/30',
          'bg-pink-500/20 text-pink-400 border-pink-500/30',
          'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
        ];

        return {
          title: `${index + 1}. ${title}`,
          subtitle: 'Especialista Ativado',
          description: description,
          actionText: 'Executando estratégia',
          actionColor: actionColors[index % actionColors.length],
          icon: 'conversao',
          status: 'Ativo'
        };
      });

    return specialists.length > 0 ? specialists : [
      {
        title: 'Especialistas sendo ativados...',
        subtitle: 'Aguarde o processamento',
        description: 'Os especialistas estão sendo configurados baseados no seu perfil de clínica.',
        actionText: 'Carregando',
        actionColor: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        icon: 'diagnostico',
        status: 'Carregando...'
      }
    ];
  };

  const specialistData = getSpecialistData();

  return (
    <section data-section="specialists-activated" className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          🧠
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Especialistas Ativados
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {specialistData.map((specialist, index) => {
          const IconComponent = getSpecialistIcon(specialist.icon);
          
          return (
            <Card 
              key={index} 
              className="aurora-glass border-purple-500/30 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                      <IconComponent className="h-5 w-5 text-aurora-electric-purple" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground font-semibold leading-tight">
                        {specialist.title}
                      </CardTitle>
                      <p className="text-sm text-foreground/60 mt-1">
                        {specialist.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`${specialist.actionColor} text-xs px-3 py-1 rounded-full font-medium`}
                  >
                    {specialist.actionText}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                  {specialist.description}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                  <span className="text-xs text-foreground/60">
                    Status: <span className="text-aurora-electric-purple font-medium">{specialist.status}</span>
                  </span>
                  
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-aurora-electric-purple rounded-full flex items-center justify-center">
            <Brain className="h-3 w-3 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Análise em andamento
            </p>
            <p className="text-xs text-foreground/60">
              Os especialistas estão processando seus dados para gerar estratégias personalizadas
            </p>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-aurora-electric-purple rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-aurora-electric-purple rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-aurora-electric-purple rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialistsActivatedSection;
