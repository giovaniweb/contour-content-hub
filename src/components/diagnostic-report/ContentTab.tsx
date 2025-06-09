
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Facebook, Camera, Video, FileText, Copy } from "lucide-react";
import { DiagnosticSession } from '@/hooks/useDiagnosticPersistence';

interface ContentTabProps {
  session: DiagnosticSession;
}

const ContentTab: React.FC<ContentTabProps> = ({ session }) => {
  const getMainSpecialty = () => {
    if (session.state.clinicType === 'clinica_medica') {
      return session.state.medicalSpecialty || 'Medicina';
    }
    return session.state.aestheticFocus || 'Estética';
  };

  const contentSuggestions = [
    {
      type: "Post Instagram",
      title: `5 Benefícios de ${getMainSpecialty()}`,
      description: "Post educativo com carrossel explicando os principais benefícios",
      platform: "Instagram",
      format: "Carrossel",
      icon: Instagram,
      engagement: "Alto",
      content: `🌟 5 Benefícios Incríveis de ${getMainSpecialty()}

1️⃣ Melhora da autoestima e confiança
2️⃣ Resultados naturais e duradouros  
3️⃣ Procedimentos minimamente invasivos
4️⃣ Recuperação rápida e segura
5️⃣ Acompanhamento profissional especializado

✨ Agende sua consulta e descubra como podemos ajudar você!

#${getMainSpecialty().toLowerCase()} #beleza #autoestima #saude`
    },
    {
      type: "Stories",
      title: "Antes e Depois - Transformações",
      description: "Stories mostrando resultados reais de pacientes",
      platform: "Instagram",
      format: "Stories",
      icon: Camera,
      engagement: "Muito Alto",
      content: `📸 Stories Antes e Depois

• Mostre transformações reais (com autorização)
• Use enquetes: "Qual resultado mais te impressiona?"
• Adicione depoimentos dos pacientes
• Termine com call-to-action para agendamento

🎥 Dica: Use música trending para maior alcance!`
    },
    {
      type: "Vídeo",
      title: "Explicando o Procedimento",
      description: "Vídeo educativo sobre como funciona o tratamento",
      platform: "YouTube/Instagram",
      format: "Vídeo curto",
      icon: Video,
      engagement: "Alto",
      content: `🎬 Roteiro: Explicando ${getMainSpecialty()}

Abertura (0-5s):
"Você tem dúvidas sobre [procedimento]? Vou explicar tudo!"

Desenvolvimento (5-45s):
• O que é o procedimento
• Como funciona
• Tempo de duração
• Cuidados pós-tratamento

Fechamento (45-60s):
• Benefícios principais
• Call-to-action para agendamento`
    }
  ];

  const contentIdeas = [
    "Dicas de cuidados pós-tratamento",
    "Mitos e verdades sobre o procedimento",
    "Depoimentos de pacientes satisfeitos",
    "Tour pela clínica e equipamentos",
    "Dicas de preparação pré-consulta",
    "Comparativo: diferentes tipos de tratamento"
  ];

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'YouTube': return 'bg-red-500';
      case 'Facebook': return 'bg-blue-500';
      default: return 'bg-aurora-electric-purple';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'Muito Alto': return 'border-green-500/30 text-green-400';
      case 'Alto': return 'border-yellow-500/30 text-yellow-400';
      case 'Médio': return 'border-blue-500/30 text-blue-400';
      default: return 'border-aurora-electric-purple/30 text-aurora-electric-purple';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sugestões de Conteúdo */}
      <div className="grid gap-6">
        {contentSuggestions.map((suggestion, index) => (
          <Card key={index} className="aurora-card">
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
        ))}
      </div>

      {/* Ideias Extras */}
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

      {/* Calendário de Publicações */}
      <Card className="aurora-card border-aurora-deep-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-aurora-deep-purple" />
            Cronograma Sugerido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-7 gap-2 text-center">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
              <div key={day} className="p-2">
                <div className="text-xs font-medium text-foreground/60 mb-2">{day}</div>
                <div className="space-y-1">
                  {index % 2 === 0 && (
                    <div className="p-1 bg-aurora-electric-purple/20 rounded text-xs text-aurora-electric-purple">
                      Post
                    </div>
                  )}
                  {index % 3 === 0 && (
                    <div className="p-1 bg-aurora-sage/20 rounded text-xs text-aurora-sage">
                      Stories
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 aurora-glass rounded-lg">
            <p className="text-sm text-foreground/80">
              <strong>Frequência recomendada:</strong> 3-4 posts por semana + stories diários
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
