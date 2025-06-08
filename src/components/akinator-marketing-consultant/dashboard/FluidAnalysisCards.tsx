
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Users, Zap, BarChart3, Lightbulb } from "lucide-react";

interface FluidAnalysisCardsProps {
  state: any;
  aiSections: any;
}

const FluidAnalysisCards: React.FC<FluidAnalysisCardsProps> = ({ 
  state, 
  aiSections 
}) => {
  const getAnalysisCards = () => {
    const baseCards = [
      {
        icon: Target,
        title: "Foco Estratégico",
        subtitle: "Direcionamento Principal",
        content: "Clínica com potencial de crescimento através de estratégias de diferenciação e autoridade no mercado local.",
        color: "text-red-400",
        bgColor: "border-red-500/30",
        badgeColor: "bg-red-500/20 text-red-400 border-red-500/30"
      },
      {
        icon: Users,
        title: "Análise de Público",
        subtitle: "Perfil dos Clientes",
        content: "Público interessado em tratamentos de qualidade, valoriza expertise técnica e resultados comprovados.",
        color: "text-blue-400",
        bgColor: "border-blue-500/30",
        badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30"
      },
      {
        icon: TrendingUp,
        title: "Oportunidades",
        subtitle: "Pontos de Crescimento",
        content: "Mercado em expansão com demanda crescente por procedimentos especializados e atendimento personalizado.",
        color: "text-green-400",
        bgColor: "border-green-500/30",
        badgeColor: "bg-green-500/20 text-green-400 border-green-500/30"
      },
      {
        icon: Zap,
        title: "Diferenciais",
        subtitle: "Vantagens Competitivas",
        content: "Expertise técnica, equipamentos modernos e abordagem personalizada são os principais diferenciais identificados.",
        color: "text-yellow-400",
        bgColor: "border-yellow-500/30",
        badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      },
      {
        icon: BarChart3,
        title: "Performance Atual",
        subtitle: "Situação do Negócio",
        content: `Faturamento atual em ${state.currentRevenue ? 'crescimento' : 'estabilização'}, com meta de expansão definida.`,
        color: "text-purple-400",
        bgColor: "border-purple-500/30",
        badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30"
      },
      {
        icon: Lightbulb,
        title: "Recomendações",
        subtitle: "Próximos Passos",
        content: "Focar em conteúdo educativo, depoimentos de clientes e otimização da presença digital para maximizar resultados.",
        color: "text-cyan-400",
        bgColor: "border-cyan-500/30",
        badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      }
    ];

    // Se houver diagnóstico da IA, tentar extrair insights específicos
    if (aiSections?.diagnostico_estrategico) {
      const diagnosticText = aiSections.diagnostico_estrategico;
      const sentences = diagnosticText.split('.').filter(s => s.trim().length > 20);
      
      if (sentences.length >= 3) {
        return baseCards.map((card, index) => ({
          ...card,
          content: sentences[index] || card.content
        }));
      }
    }

    return baseCards;
  };

  const analysisCards = getAnalysisCards();

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-aurora-electric-purple to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🧠</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-background animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground mb-1">
            Análise Fluida Completa
          </h2>
          <p className="text-foreground/60 text-lg">
            Insights estratégicos baseados no perfil da sua clínica
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-aurora-electric-purple/20 to-pink-500/20 rounded-full border border-aurora-electric-purple/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-foreground/80">Análise Concluída</span>
        </div>
      </div>

      {/* Analysis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analysisCards.map((analysis, index) => {
          const IconComponent = analysis.icon;
          
          return (
            <Card 
              key={index} 
              className={`group relative overflow-hidden aurora-glass ${analysis.bgColor} bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1`}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center border border-purple-500/40 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`h-6 w-6 ${analysis.color}`} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground font-bold leading-tight mb-2">
                        {analysis.title}
                      </CardTitle>
                      <p className="text-sm text-foreground/60 font-medium">
                        {analysis.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`${analysis.badgeColor} text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm`}
                  >
                    Analisado
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 relative z-10">
                <p className="text-sm text-foreground/80 leading-relaxed line-height-relaxed">
                  {analysis.content.replace(/[*#]/g, '').trim()}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-purple-500/20 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/60 font-medium">
                      Status: 
                    </span>
                    <span className="text-aurora-electric-purple font-semibold text-sm">
                      Concluído
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
                    <div className="w-1.5 h-1.5 bg-green-300 rounded-full"></div>
                    <div className="w-1 h-1 bg-green-200 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-8 p-6 bg-gradient-to-r from-aurora-electric-purple/10 via-blue-500/10 to-pink-500/10 rounded-2xl border border-aurora-electric-purple/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-aurora-electric-purple to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground mb-1">
              🎯 Análise Estratégica Finalizada
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Todos os aspectos do seu negócio foram analisados. Agora você tem um panorama completo para tomar decisões estratégicas informadas.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-400 font-medium">Completo</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FluidAnalysisCards;
