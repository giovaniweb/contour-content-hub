
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Users, Lightbulb, Heart, Palette } from "lucide-react";

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
      'harmonizador': Palette
    };
    return icons[type as keyof typeof icons] || Brain;
  };

  const getSpecialistBadgeColor = (index: number) => {
    const colors = [
      'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'bg-green-500/20 text-green-400 border-green-500/30',
      'bg-orange-500/20 text-orange-400 border-orange-500/30'
    ];
    return colors[index % colors.length];
  };

  const renderSpecialists = () => {
    if (!aiSections?.ativacao_especialistas) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Expert em Conversão', mission: 'Leads e Agendamento', description: 'Aumentar leads e agendamentos.' },
            { name: 'Especialista em Storytelling', mission: 'Autoridade Emocional', description: 'Construir autoridade emocional.' },
            { name: 'Gestor de Tráfego', mission: 'Anúncios e Performance', description: 'Melhorar anúncios e performance.' }
          ].map((specialist, index) => (
            <Card key={index} className="aurora-glass border-purple-500/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base text-foreground">
                    {React.createElement(getSpecialistIcon('conversao'), { className: "h-5 w-5 text-aurora-electric-purple" })}
                    {specialist.name}
                  </CardTitle>
                  <Badge variant="outline" className={getSpecialistBadgeColor(index)}>
                    {specialist.mission}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 mb-3">
                  **Missão:** {specialist.description}
                </p>
                <p className="text-xs text-foreground/60 italic">
                  Especialista sendo ativado...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    // Se temos dados da IA, renderizar com base no conteúdo
    const specialistText = aiSections.ativacao_especialistas;
    const lines = specialistText.split('\n').filter((line: string) => line.trim());
    
    // Extrair especialistas do texto
    const specialists = lines
      .filter((line: string) => line.includes('**') || line.includes('Especialista') || line.includes('Expert'))
      .slice(0, 4) // Máximo 4 especialistas
      .map((line: string, index: number) => {
        const cleanLine = line.replace(/[*#-]/g, '').trim();
        return {
          name: cleanLine.split(':')[0] || cleanLine.substring(0, 50),
          mission: cleanLine.includes(':') ? cleanLine.split(':')[1]?.substring(0, 30) : 'Missão Especializada',
          description: cleanLine
        };
      });

    if (specialists.length === 0) {
      return (
        <div className="p-4 text-center text-foreground/60">
          Especialistas sendo ativados pela IA...
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specialists.map((specialist, index) => (
          <Card key={index} className="aurora-glass border-purple-500/30 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  {React.createElement(getSpecialistIcon('conversao'), { className: "h-5 w-5 text-aurora-electric-purple" })}
                  {specialist.name}
                </CardTitle>
                <Badge variant="outline" className={getSpecialistBadgeColor(index)}>
                  {specialist.mission}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 line-clamp-3">
                {specialist.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <section data-section="specialists-activated">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
        🧠 Especialistas Ativados
      </h2>
      {renderSpecialists()}
    </section>
  );
};

export default SpecialistsActivatedSection;
