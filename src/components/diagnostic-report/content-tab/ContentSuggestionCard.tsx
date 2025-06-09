
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Copy } from "lucide-react";

interface ContentSuggestion {
  type: string;
  title: string;
  description: string;
  platform: string;
  format: string;
  icon: React.ComponentType<any>;
  engagement: string;
  content: string;
}

interface ContentSuggestionCardProps {
  suggestion: ContentSuggestion;
  getPlatformColor: (platform: string) => string;
  getEngagementColor: (engagement: string) => string;
}

export const ContentSuggestionCard: React.FC<ContentSuggestionCardProps> = ({
  suggestion,
  getPlatformColor,
  getEngagementColor
}) => {
  return (
    <Card className="aurora-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <suggestion.icon className="h-5 w-5 text-aurora-electric-purple" />
            {suggestion.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getPlatformColor(suggestion.platform)}>
              {suggestion.platform}
            </Badge>
            <Badge variant="outline" className={getEngagementColor(suggestion.engagement)}>
              {suggestion.engagement}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground/70">{suggestion.description}</p>
        
        <div className="p-4 aurora-glass rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-aurora-sage" />
            <span className="text-sm font-medium text-foreground">Conteúdo Sugerido:</span>
          </div>
          <pre className="text-sm text-foreground/90 whitespace-pre-wrap font-sans">
            {suggestion.content}
          </pre>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Copy className="h-3 w-3" />
            Copiar Texto
          </Button>
          <Badge variant="secondary" className="text-xs">
            {suggestion.format}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
