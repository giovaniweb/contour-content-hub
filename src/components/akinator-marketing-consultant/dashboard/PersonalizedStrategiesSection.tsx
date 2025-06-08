
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface PersonalizedStrategiesSectionProps {
  aiSections: any;
  formatTitle: (text: string) => string;
}

const PersonalizedStrategiesSection: React.FC<PersonalizedStrategiesSectionProps> = ({ 
  aiSections, 
  formatTitle 
}) => {
  const getPersonalizedStrategies = () => {
    // Tentar usar dados da IA primeiro
    if (aiSections?.estrategias && Array.isArray(aiSections.estrategias) && aiSections.estrategias.length > 0) {
      return aiSections.estrategias;
    }

    // Fallback com estratégias padrão
    return [
      'Estratégia de diferenciação baseada em expertise técnica',
      'Programa de educação continuada para clientes',
      'Sistema de follow-up pós-procedimento automatizado'
    ];
  };

  const strategies = getPersonalizedStrategies();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
        📈 Estratégias Personalizadas
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {strategies.map((estrategia: string, index: number) => (
          <Card key={index} className="border-l-4 border-l-aurora-electric-purple aurora-glass hover:shadow-md transition-shadow border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-aurora-electric-purple text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm font-medium flex-1 line-clamp-3 text-foreground">
                  {formatTitle(estrategia)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PersonalizedStrategiesSection;
