
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Topic } from './types';

interface TrendingTopicsListProps {
  loading: boolean;
  topics: Topic[];
  onGenerate: (topicId: string) => void;
}

const TrendingTopicsList: React.FC<TrendingTopicsListProps> = ({
  loading,
  topics,
  onGenerate,
}) => {
  if (loading) {
    return null;
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Nenhum tópico encontrado para esta categoria.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topics.map((topic) => (
        <div 
          key={topic.id}
          className="p-3 border rounded-lg flex justify-between items-center hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1">
            <div className="font-medium mb-1 flex items-center">
              <span className="truncate">{topic.title}</span>
              {topic.score >= 95 && (
                <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                  <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                  Alta relevância
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {topic.tags.map((tag, i) => (
                <Badge variant="secondary" key={i} className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-primary font-medium">
              {topic.score}
            </div>
            <Button 
              size="sm"
              onClick={() => onGenerate(topic.id)}
              className="whitespace-nowrap"
            >
              <Zap className="h-4 w-4 mr-1" />
              Gerar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingTopicsList;
