
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Users, Lightbulb, Heart, Palette, BarChart3, CheckCircle2, Clock } from "lucide-react";

interface ActiveStrategiesSectionProps {
  aiSections: any;
  clinicType: string;
}

const ActiveStrategiesSection: React.FC<ActiveStrategiesSectionProps> = ({ 
  aiSections, 
  clinicType 
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

  const getActiveStrategies = () => {
    // Estratégias baseadas no tipo de clínica
    const medicalStrategies = [
      {
        title: 'Especialista em Autoridade Médica',
        description: 'Construindo credibilidade através de conteúdo educativo e cases clínicos validados cientificamente.',
        status: 'Executando estratégia',
        icon: 'diagnostico',
        progress: 85
      },
      {
        title: 'Especialista em Conversão Médica',
        description: 'Otimizando o funil de conversão de consultas através de estratégias de confiança e transparência.',
        status: 'Em andamento',
        icon: 'conversao',
        progress: 70
      },
      {
        title: 'Especialista em Retenção de Pacientes',
        description: 'Desenvolvendo programa de follow-up e acompanhamento pós-procedimento para fidelização.',
        status: 'Iniciando',
        icon: 'fidelizacao',
        progress: 30
      }
    ];

    const aestheticStrategies = [
      {
        title: 'Especialista em Storytelling Estético',
        description: 'Criando narrativas emocionais que conectam transformações físicas com autoestima e bem-estar.',
        status: 'Executando estratégia',
        icon: 'storytelling',
        progress: 90
      },
      {
        title: 'Especialista em Conteúdo Criativo',
        description: 'Desenvolvendo posts visuais impactantes com antes/depois e tutoriais de cuidados.',
        status: 'Executando estratégia',
        icon: 'criativo',
        progress: 75
      },
      {
        title: 'Especialista em Tráfego Pago',
        description: 'Otimizando campanhas para atrair público interessado em procedimentos estéticos.',
        status: 'Em andamento',
        icon: 'trafego',
        progress: 60
      }
    ];

    return clinicType === 'clinica_medica' ? medicalStrategies : aestheticStrategies;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Executando estratégia':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Em andamento':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Iniciando':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Concluído':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const strategies = getActiveStrategies();

  return (
    <section>
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-background animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground mb-1">
            🧠 Estratégias Ativas
          </h2>
          <p className="text-foreground/60 text-lg">
            Especialistas trabalhando em suas estratégias personalizadas
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {strategies.map((strategy, index) => {
          const IconComponent = getSpecialistIcon(strategy.icon);
          
          return (
            <Card 
              key={index} 
              className="group relative overflow-hidden aurora-glass border-purple-500/30 bg-gradient-to-br from-gray-900/60 to-gray-800/40 backdrop-blur-md hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center border border-purple-500/40 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-aurora-electric-purple" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {strategy.title}
                      </h4>
                      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                        {strategy.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-foreground/60">Progresso</span>
                          <span className="text-xs text-aurora-electric-purple font-semibold">
                            {strategy.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-purple-500/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-aurora-electric-purple to-aurora-sage rounded-full transition-all duration-1000"
                            style={{ width: `${strategy.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(strategy.status)} text-xs px-3 py-1 rounded-full font-semibold shadow-sm ml-4`}
                  >
                    {strategy.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ActiveStrategiesSection;
