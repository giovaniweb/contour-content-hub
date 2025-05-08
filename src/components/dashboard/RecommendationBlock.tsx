
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Zap, Calendar, FileText, Play, PenTool } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  actionText: string;
  actionLink: string;
  color: string;
}

const SAMPLE_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    title: 'Complete seu roteiro',
    description: 'Você tem um roteiro em progresso sobre tratamentos faciais.',
    icon: FileText,
    actionText: 'Continuar roteiro',
    actionLink: '/custom-gpt?draft=123',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    id: '2',
    title: 'Planeje sua semana',
    description: 'Você tem 3 gravações pendentes para esta semana.',
    icon: Calendar,
    actionText: 'Ver agenda',
    actionLink: '/calendar',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: '3',
    title: 'Grave novo conteúdo',
    description: 'Baseado no seu plano de conteúdo, sugerimos um vídeo sobre Hipro.',
    icon: Play,
    actionText: 'Iniciar gravação',
    actionLink: '/video-storage/create',
    color: 'bg-red-50 text-red-600'
  },
  {
    id: '4',
    title: 'Revise sua estratégia',
    description: 'Sua estratégia de conteúdo para Maio precisa de atualização.',
    icon: PenTool,
    actionText: 'Revisar estratégia',
    actionLink: '/content-strategy',
    color: 'bg-green-50 text-green-600'
  }
];

interface RecommendationBlockProps {
  maxItems?: number;
}

const RecommendationBlock: React.FC<RecommendationBlockProps> = ({ maxItems = 4 }) => {
  const recommendations = SAMPLE_RECOMMENDATIONS.slice(0, maxItems);
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-contourline-mediumBlue" />
          <h2 className="text-2xl font-bold">Recomendações para Você</h2>
        </div>
        <Button variant="outline" size="sm" className="text-sm">
          Atualizar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {recommendations.map(item => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 group">
            <CardHeader className={`${item.color} bg-opacity-20 pb-3`}>
              <div className="flex items-center">
                <div className={`${item.color} p-2 rounded-md`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg ml-3">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-contourline-lightBlue/10 group-hover:border-contourline-lightBlue/30"
              >
                <a href={item.actionLink} className="flex items-center justify-center">
                  <Zap className="mr-2 h-4 w-4" />
                  {item.actionText}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendationBlock;
