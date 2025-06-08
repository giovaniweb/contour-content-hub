
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
          etapa: 'Etapa 1',
          title: 'Diagnóstico Estratégico',
          subtitle: 'Especialista Ativado',
          description: 'Realizando análise profunda dos dados da clínica para identificar oportunidades de crescimento e pontos de melhoria estratégicos.',
          actionText: 'Executando estratégia',
          actionColor: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: 'diagnostico',
          status: 'Ativo'
        },
        {
          etapa: 'Etapa 2',
          title: 'Sugestões de Conteúdo',
          subtitle: 'Especialista Ativado',
          description: 'Criando sugestões de conteúdo baseadas no perfil da clínica e objetivos definidos para maximizar o engajamento.',
          actionText: 'Executando estratégia',
          actionColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
          icon: 'criativo',
          status: 'Ativo'
        }
      ];
    }

    // Processar dados da IA para extrair especialistas
    const specialistText = aiSections.ativacao_especialistas;
    
    // Dividir por seções que começam com números ou "Expert"
    const sections = specialistText.split(/(?=\d+\.\s+\*\*|\*\*Expert)/);
    
    const specialists = sections
      .filter((section: string) => section.trim().length > 0)
      .slice(0, 4)
      .map((section: string, index: number) => {
        // Limpar e extrair informações da seção
        const cleanSection = section.replace(/[*#-]/g, '').trim();
        const lines = cleanSection.split('\n').filter((line: string) => line.trim());
        
        // Extrair título (primeira linha significativa)
        let title = `Especialista ${index + 1}`;
        let description = 'Estratégia sendo desenvolvida para sua clínica.';
        
        if (lines.length > 0) {
          // Procurar por título na primeira linha
          const firstLine = lines[0];
          if (firstLine.includes('Expert') || firstLine.includes('Especialista')) {
            title = firstLine.replace(/^\d+\.\s*/, '').trim();
          } else if (firstLine.length > 5) {
            title = firstLine.replace(/^\d+\.\s*/, '').trim();
          }
          
          // Procurar por descrição nas linhas seguintes
          const descriptionLines = lines.slice(1).filter((line: string) => 
            line.length > 20 && 
            !line.includes('Missão:') && 
            !line.includes('Mini diagnóstico:') &&
            !line.includes('Ação prática:')
          );
          
          if (descriptionLines.length > 0) {
            description = descriptionLines[0].trim();
          }
        }
        
        // Se ainda não temos uma boa descrição, usar informações específicas do diagnóstico
        if (description.length < 30) {
          const diagnosticTexts = [
            'A clínica está enfrentando alguns desafios chave: a frequência rara de conteúdo e a falta de variedade nos equipamentos disponíveis estão limitando seu potencial de crescimento.',
            'A dependência de sessões avulsas pode ser um entrave para a fidelização, pois clientes tendem a buscar pacotes ou planos de tratamento contínuos.',
            'O foco no público feminino é uma excelente oportunidade para criar conteúdo emocional e inspirador, alinhado ao estilo premium da clínica.',
            'A meta de aumentar o faturamento em 50% é ambiciosa, mas alcançável com uma estratégia bem direcionada.'
          ];
          description = diagnosticTexts[index] || diagnosticTexts[0];
        }

        const actionColors = [
          'bg-green-500/20 text-green-400 border-green-500/30',
          'bg-orange-500/20 text-orange-400 border-orange-500/30',
          'bg-pink-500/20 text-pink-400 border-pink-500/30',
          'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
        ];

        const icons = ['diagnostico', 'criativo', 'fidelizacao', 'conversao'];

        return {
          etapa: `Etapa ${index + 1}`,
          title: title.length > 60 ? title.substring(0, 60) + '...' : title,
          subtitle: 'Especialista Ativado',
          description: description.length > 150 ? description.substring(0, 150) + '...' : description,
          actionText: 'Executando estratégia',
          actionColor: actionColors[index % actionColors.length],
          icon: icons[index % icons.length],
          status: 'Ativo'
        };
      });

    return specialists.length > 0 ? specialists : [
      {
        etapa: 'Carregando',
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
    <section data-section="specialists-activated" className="space-y-8">
      {/* Enhanced Title Section */}
      <div className="flex items-center gap-4 mb-10">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🧠</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-background animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground mb-1">
            Especialistas Ativados
          </h2>
          <p className="text-foreground/60 text-lg">
            IA especializada trabalhando em suas estratégias personalizadas
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-foreground/80">Sistema Ativo</span>
        </div>
      </div>

      {/* Specialists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {specialistData.map((specialist, index) => {
          const IconComponent = getSpecialistIcon(specialist.icon);
          
          return (
            <Card 
              key={index} 
              className="group relative overflow-hidden aurora-glass border-purple-500/30 bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center border border-purple-500/40 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-aurora-electric-purple" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-2">
                          {specialist.title}
                        </h4>
                        <p className="text-sm text-foreground/60 font-medium">
                          {specialist.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`${specialist.actionColor} text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm`}
                  >
                    {specialist.actionText}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 relative z-10">
                <p className="text-sm text-foreground/80 leading-relaxed mb-6 line-height-relaxed">
                  {specialist.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/60 font-medium">
                      Status: 
                    </span>
                    <span className="text-aurora-electric-purple font-semibold text-sm">
                      {specialist.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse animation-delay-150"></div>
                    <div className="w-1 h-1 bg-green-200 rounded-full animate-pulse animation-delay-300"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Progress indicator */}
      <div className="mt-10 p-6 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-aurora-electric-purple to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-aurora-electric-purple to-pink-500 rounded-full animate-ping opacity-20"></div>
          </div>
          
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground mb-1">
              🧠 Análise Fluida em Andamento
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Os especialistas estão processando seus dados para gerar estratégias personalizadas e insights únicos para sua clínica
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-aurora-electric-purple rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2.5 h-2.5 bg-aurora-electric-purple rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2.5 h-2.5 bg-aurora-electric-purple rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialistsActivatedSection;
