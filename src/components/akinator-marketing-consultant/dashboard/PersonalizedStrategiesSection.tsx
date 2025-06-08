
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
  const renderAIPersonalizedStrategies = () => {
    if (!aiSections || !aiSections.estrategias || !Array.isArray(aiSections.estrategias)) {
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
        {aiSections.estrategias.map((estrategia: string, index: number) => (
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

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
        📈 Estratégias Personalizadas
      </h2>
      {renderAIPersonalizedStrategies()}
    </section>
  );
};

export default PersonalizedStrategiesSection;
