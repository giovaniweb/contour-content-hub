
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, TrendingUp, Users, Calendar, Zap } from "lucide-react";

interface DiagnosticContentFormatterProps {
  content: string;
}

const DiagnosticContentFormatter: React.FC<DiagnosticContentFormatterProps> = ({ content }) => {
  // Função para limpar e estruturar o conteúdo
  const formatContent = (text: string) => {
    if (!text) return [];

    // Remove asteriscos e caracteres de markdown
    const cleanText = text.replace(/[*#]/g, '').trim();
    
    // Divide em parágrafos
    const paragraphs = cleanText.split('\n').filter(p => p.trim().length > 0);
    
    const sections: { title: string; content: string[]; icon: any; color: string }[] = [];
    let currentSection: { title: string; content: string[]; icon: any; color: string } | null = null;

    paragraphs.forEach(paragraph => {
      const trimmed = paragraph.trim();
      
      // Detecta títulos de seções
      if (trimmed.includes('Análise') || trimmed.includes('Diagnóstico')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: 'Análise Estratégica',
          content: [],
          icon: Target,
          color: 'border-aurora-electric-purple/30'
        };
      } else if (trimmed.includes('Recomendações') || trimmed.includes('Sugestões')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: 'Recomendações',
          content: [],
          icon: Lightbulb,
          color: 'border-aurora-sage/30'
        };
      } else if (trimmed.includes('Estratégia') || trimmed.includes('Plano')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: 'Estratégia de Crescimento',
          content: [],
          icon: TrendingUp,
          color: 'border-aurora-deep-purple/30'
        };
      } else if (trimmed.includes('Conteúdo') || trimmed.includes('Posts')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: 'Sugestões de Conteúdo',
          content: [],
          icon: Calendar,
          color: 'border-aurora-lavender/30'
        };
      } else if (trimmed.includes('Ações') || trimmed.includes('Próximos')) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: 'Próximas Ações',
          content: [],
          icon: Zap,
          color: 'border-aurora-turquoise/30'
        };
      } else {
        // Adiciona conteúdo à seção atual
        if (!currentSection) {
          currentSection = {
            title: 'Visão Geral',
            content: [],
            icon: Users,
            color: 'border-aurora-electric-purple/30'
          };
        }
        if (trimmed.length > 0) {
          currentSection.content.push(trimmed);
        }
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const sections = formatContent(content);

  if (sections.length === 0) {
    return (
      <Card className="aurora-card">
        <CardContent className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
          <p className="text-foreground/60">Diagnóstico sendo processado...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <Card key={index} className={`aurora-card ${section.color}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <section.icon className="h-5 w-5 text-aurora-electric-purple" />
              {section.title}
              <Badge variant="outline" className="ml-auto">
                {section.content.length} {section.content.length === 1 ? 'item' : 'itens'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-foreground/90 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DiagnosticContentFormatter;
