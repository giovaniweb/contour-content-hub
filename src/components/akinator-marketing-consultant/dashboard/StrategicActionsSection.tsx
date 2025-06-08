
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StrategicActionsSectionProps {
  aiSections: any;
  cleanText: (text: string) => string;
  formatTitle: (text: string) => string;
}

const StrategicActionsSection: React.FC<StrategicActionsSectionProps> = ({ 
  aiSections, 
  cleanText, 
  formatTitle 
}) => {
  const renderAIStrategicActions = () => {
    if (!aiSections || !aiSections.acoes_estrategicas || !Array.isArray(aiSections.acoes_estrategicas)) {
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

    const actions = aiSections.acoes_estrategicas.slice(0, 4);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action: string, index: number) => (
          <Card key={index} className="border-l-4 border-l-aurora-neon-blue aurora-glass hover:shadow-md transition-shadow border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-aurora-neon-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm font-medium line-clamp-2 flex-1 text-foreground">{formatTitle(cleanText(action))}</p>
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
        📅 Plano de Ação Personalizado
      </h2>
      {renderAIStrategicActions()}
    </section>
  );
};

export default StrategicActionsSection;
