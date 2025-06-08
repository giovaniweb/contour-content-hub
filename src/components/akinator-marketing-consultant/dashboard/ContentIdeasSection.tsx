
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Play, MessageSquare, Users, Lightbulb, BarChart3, Eye, ChevronRight } from "lucide-react";

interface ContentIdeasProps {
  aiSections: any;
  cleanText: (text: string) => string;
  formatTitle: (text: string) => string;
}

const ContentIdeasSection: React.FC<ContentIdeasProps> = ({ 
  aiSections, 
  cleanText, 
  formatTitle 
}) => {
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const renderAIContentIdeas = () => {
    // Ideias padrão mais elaboradas quando a IA não retorna ideias específicas
    const defaultIdeas = [
      {
        title: "Before & After com Storytelling",
        description: "Casos reais de transformação com a jornada emocional da paciente, mostrando não apenas o resultado físico, mas o impacto na autoestima e confiança.",
        icon: <Camera className="h-5 w-5" />,
        category: "Transformação",
        engagement: "Alto",
        difficulty: "Médio",
        format: "Reel",
        details: "Combine vídeos curtos mostrando o antes e depois dos procedimentos, incluindo depoimentos emocionais das pacientes sobre como se sentem após o tratamento. Use música inspiradora e transições suaves."
      },
      {
        title: "Lives Educativas Semanais",
        description: "Transmissões ao vivo abordando dúvidas comuns, mitos sobre procedimentos e dicas de cuidados, criando conexão direta com o público.",
        icon: <Play className="h-5 w-5" />,
        category: "Educativo",
        engagement: "Muito Alto",
        difficulty: "Baixo",
        format: "Story",
        details: "Realize lives semanais de 15-20 minutos respondendo dúvidas do público. Crie um cronograma fixo (ex: terças às 19h) e promova antecipadamente. Salve as melhores perguntas para posts futuros."
      },
      {
        title: "Depoimentos em Vídeo Autênticos",
        description: "Pacientes reais compartilhando suas experiências completas, desde a consulta até os resultados, transmitindo confiança e credibilidade.",
        icon: <MessageSquare className="h-5 w-5" />,
        category: "Social Proof",
        engagement: "Alto",
        difficulty: "Baixo",
        format: "Carrossel",
        details: "Grave depoimentos curtos (30-60s) com pacientes satisfeitas. Foque na jornada emocional, medos iniciais e satisfação final. Use legendas para maior alcance."
      },
      {
        title: "Bastidores dos Procedimentos",
        description: "Conteúdo mostrando a preparação, cuidados e profissionalismo por trás dos tratamentos, desmistificando procedimentos e criando transparência.",
        icon: <Users className="h-5 w-5" />,
        category: "Transparência",
        engagement: "Médio",
        difficulty: "Médio",
        format: "Reel",
        details: "Mostre a preparação do ambiente, higienização, cuidados pré-procedimento. Explique cada etapa de forma didática, criando confiança através da transparência."
      },
      {
        title: "Dicas de Autocuidado Sazonal",
        description: "Conteúdo adaptado às estações do ano com cuidados específicos para cada período, posicionando a clínica como especialista em beleza integral.",
        icon: <Lightbulb className="h-5 w-5" />,
        category: "Lifestyle",
        engagement: "Médio",
        difficulty: "Baixo",
        format: "Story",
        details: "Crie posts temáticos por estação: verão (proteção solar, hidratação), inverno (combate ao ressecamento), etc. Use cores e elementos visuais da estação."
      },
      {
        title: "Comparativo de Tratamentos",
        description: "Análises educativas comparando diferentes opções de tratamento para a mesma preocupação, ajudando pacientes a tomar decisões informadas.",
        icon: <BarChart3 className="h-5 w-5" />,
        category: "Educativo",
        engagement: "Alto",
        difficulty: "Alto",
        format: "Carrossel",
        details: "Crie carrosséis comparativos mostrando prós, contras, indicações e resultados esperados de diferentes tratamentos. Use infográficos claros e linguagem acessível."
      }
    ];

    let ideas = [];
    
    if (!aiSections || !aiSections.ideias.length) {
      ideas = defaultIdeas.slice(0, 6);
    } else {
      ideas = aiSections.ideias.slice(0, 3).map((idea: any, index: number) => {
        const lines = idea.split('\n').filter((line: string) => line.trim());
        const title = cleanText(lines[0] ? lines[0].substring(0, 50) + (lines[0].length > 50 ? '...' : '') : `Ideia Personalizada ${index + 1}`);
        const description = cleanText(lines.slice(1).join(' ').substring(0, 120) + '...' || 'Estratégia de conteúdo desenvolvida especificamente para seu perfil de clínica');

        return {
          title,
          description,
          icon: [<Camera className="h-5 w-5" />, <Play className="h-5 w-5" />, <MessageSquare className="h-5 w-5" />][index],
          category: "IA Personalizada",
          engagement: "Alto",
          difficulty: "Médio",
          format: ["Reel", "Story", "Carrossel"][index],
          details: `Estratégia personalizada baseada no diagnóstico da sua clínica: ${cleanText(idea.substring(0, 200))}`
        };
      });
      
      ideas = [...ideas, ...defaultIdeas.slice(0, 3)];
    }

    const getEngagementColor = (engagement: string) => {
      switch (engagement) {
        case "Muito Alto": return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700";
        case "Alto": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700";
        case "Médio": return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700";
        default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
      }
    };

    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) {
        case "Baixo": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
        case "Médio": return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
        case "Alto": return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
        default: return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      }
    };

    const getFormatIcon = (format: string) => {
      switch (format) {
        case "Reel": return "📱";
        case "Story": return "📸";
        case "Carrossel": return "🎠";
        default: return "📄";
      }
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ideas.map((idea, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 aurora-glass border-purple-500/30 overflow-hidden relative">
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-card/90 text-xs border-purple-400/50 text-foreground">
                {getFormatIcon(idea.format)} {idea.format}
              </Badge>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-aurora-electric-purple to-aurora-neon-blue text-white rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {idea.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2 group-hover:text-aurora-electric-purple transition-colors">
                    {formatTitle(idea.title)}
                  </h3>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`text-xs px-2 py-1 ${getEngagementColor(idea.engagement)}`}>
                  📈 {idea.engagement}
                </Badge>
                <Badge variant="outline" className={`text-xs px-2 py-1 ${getDifficultyColor(idea.difficulty)}`}>
                  ⚙️ {idea.difficulty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 mb-4">
                {cleanText(idea.description)}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Badge variant="secondary" className="text-xs bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30">
                  {idea.category}
                </Badge>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs hover:bg-aurora-electric-purple/10 hover:text-aurora-electric-purple flex items-center gap-1"
                      onClick={() => setSelectedContent(idea)}
                    >
                      <Eye className="h-3 w-3" />
                      Ver Detalhes
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl aurora-glass border-purple-500/30">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-foreground">
                        {idea.icon}
                        {formatTitle(idea.title)}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getEngagementColor(idea.engagement)}>
                          📈 Engajamento {idea.engagement}
                        </Badge>
                        <Badge className={getDifficultyColor(idea.difficulty)}>
                          ⚙️ Dificuldade {idea.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-purple-400/50 text-foreground">
                          {getFormatIcon(idea.format)} {idea.format}
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground">Descrição:</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {cleanText(idea.description)}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-foreground">Como Executar:</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {cleanText(idea.details)}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <Button className="w-full bg-aurora-electric-purple hover:bg-aurora-electric-purple/90 text-white">
                          Adicionar ao Planejador de Conteúdo
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
            💡 Ideias de Conteúdo Personalizadas
          </h2>
          <p className="text-foreground/80 mt-1">
            Estratégias de conteúdo desenvolvidas especificamente para o perfil da sua clínica
          </p>
        </div>
        <Badge variant="outline" className="aurora-gradient-bg text-white border-aurora-electric-purple/50">
          {aiSections?.ideias.length > 0 ? 'IA Personalizada' : 'Sugestões Inteligentes'}
        </Badge>
      </div>
      {renderAIContentIdeas()}
    </section>
  );
};

export default ContentIdeasSection;
