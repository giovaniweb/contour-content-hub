
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ContentIdeasSectionProps {
  contentIdeas: string[];
}

export const ContentIdeasSection: React.FC<ContentIdeasSectionProps> = ({ contentIdeas }) => {
  return (
    <Card className="aurora-card border-aurora-sage/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-aurora-sage" />
          Mais Ideias de Conteúdo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-3">
          {contentIdeas.map((idea, index) => (
            <div key={index} className="p-3 aurora-glass rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-aurora-sage rounded-full"></div>
              <span className="text-sm text-foreground/90">{idea}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
