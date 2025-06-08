
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Lightbulb } from "lucide-react";

interface ContentIdeasSection {
  aiSections: any;
  cleanText: (text: string) => string;
  formatTitle: (text: string) => string;
}

const ContentIdeasSection: React.FC<ContentIdeasSection> = ({ 
  aiSections, 
  cleanText, 
  formatTitle 
}) => {
  const renderAIContentIdeas = () => {
    if (!aiSections || !aiSections.sugestoes_conteudo || !Array.isArray(aiSections.sugestoes_conteudo)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} className="border-l-4 border-l-aurora-electric-purple/50 aurora-glass border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-aurora-electric-purple mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground/80 mb-2">Ideia de conteúdo sendo gerada...</p>
                    <Button size="sm" variant="outline" className="aurora-glass border-aurora-electric-purple/30">
                      <Plus className="h-3 w-3 mr-1" />
                      Criar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    const ideas = aiSections.sugestoes_conteudo.slice(0, 6);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea: string, index: number) => (
          <Card key={index} className="border-l-4 border-l-aurora-electric-purple aurora-glass hover:shadow-md transition-shadow border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-aurora-electric-purple mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-3 mb-3 text-foreground">{formatTitle(cleanText(idea))}</p>
                  <Button size="sm" variant="outline" className="aurora-glass border-aurora-electric-purple/30">
                    <Plus className="h-3 w-3 mr-1" />
                    Criar
                  </Button>
                </div>
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
        💡 Ideias de Conteúdo Personalizadas
      </h2>
      {renderAIContentIdeas()}
    </section>
  );
};

export default ContentIdeasSection;
