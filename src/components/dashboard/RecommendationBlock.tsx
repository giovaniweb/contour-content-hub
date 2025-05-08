
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { FileText, VideoIcon, Calendar, ArrowRight, MessageSquare, Image } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  type: 'video' | 'article' | 'script' | 'social' | 'image';
  thumbnail: string;
  tags: string[];
  description: string;
  link: string;
}

// Mock recommendation data
const recommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Complete seu roteiro sobre tratamentos faciais',
    type: 'script',
    thumbnail: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png',
    tags: ['roteiro', 'facial'],
    description: 'Você tem um roteiro em progresso sobre tratamentos faciais.',
    link: '/scripts'
  },
  {
    id: '2',
    title: 'Planeje sua semana',
    type: 'social',
    thumbnail: '/assets/images/calendar-thumbnail.jpg',
    tags: ['planejamento', 'agenda'],
    description: 'Você tem 3 gravações pendentes para esta semana.',
    link: '/agenda'
  },
  {
    id: '3',
    title: 'Grave novo conteúdo',
    type: 'video',
    thumbnail: '/assets/images/record-thumbnail.jpg',
    tags: ['gravação', 'conteúdo'],
    description: 'Baseado no seu plano de conteúdo, sugerimos um vídeo sobre Hipro.',
    link: '/content-planner'
  },
  {
    id: '4',
    title: 'Revise sua estratégia',
    type: 'image',
    thumbnail: '/assets/images/strategy-thumbnail.jpg',
    tags: ['estratégia', 'marketing'],
    description: 'Sua estratégia de conteúdo para Maio precisa de atualização.',
    link: '/content-strategy'
  }
];

const RecommendationCard: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(recommendation.link);
  };
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'video': return <VideoIcon className="h-5 w-5" />;
      case 'article':
      case 'script': 
        return <FileText className="h-5 w-5" />;
      case 'social': 
        return <MessageSquare className="h-5 w-5" />;
      case 'image': 
        return <Image className="h-5 w-5" />;
      default: 
        return <Calendar className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={handleClick}>
      <div className="flex flex-col sm:flex-row h-full">
        <div className="sm:w-1/3">
          <img 
            src={recommendation.thumbnail} 
            alt={recommendation.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="sm: w-2/3 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getIcon(recommendation.type)}
              <h3 className="font-medium">{recommendation.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {recommendation.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button className="self-end flex items-center gap-1" variant="ghost" size="sm">
            <span>Ver</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const RecommendationBlock: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recomendações Personalizadas</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="text-sm"
          >
            Atualizar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationBlock;
