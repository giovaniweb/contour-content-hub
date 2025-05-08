
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ChevronRight, Video, FileText, Image } from 'lucide-react';

// Types for trending items
interface TrendingItem {
  id: string;
  type: 'video' | 'script' | 'image' | 'document';
  title: string;
  views: number;
  description?: string;
  thumbnail?: string;
  link: string;
  date: string;
  badge?: string;
}

// Mock data for trending items (in a real application this would come from an API)
const SAMPLE_TRENDING: TrendingItem[] = [
  {
    id: '1',
    type: 'video',
    title: 'Demonstração Adella para flacidez facial',
    views: 280,
    thumbnail: 'https://images.unsplash.com/photo-1559599189-fe84dea4eb79?q=80&w=1000&auto=format&fit=crop',
    description: 'Vídeo demonstrativo sobre o uso do equipamento Adella para tratamentos de flacidez facial.',
    link: '/video-player?id=1',
    date: '2025-05-01',
    badge: 'Novo'
  },
  {
    id: '2',
    type: 'script',
    title: 'Roteiro: Benefícios da ultracavitação',
    views: 145,
    description: 'Roteiro detalhado para vídeo explicativo sobre ultracavitação e seus benefícios.',
    link: '/custom-gpt/scripts/2',
    date: '2025-05-03'
  },
  {
    id: '3',
    type: 'video',
    title: 'Como utilizar o Koios para gordura localizada',
    views: 198,
    thumbnail: 'https://images.unsplash.com/photo-1535748328504-e239d4586c8e?q=80&w=1000&auto=format&fit=crop',
    description: 'Tutorial para profissionais sobre o uso do Koios em tratamentos de gordura localizada.',
    link: '/video-player?id=3',
    date: '2025-04-28'
  },
  {
    id: '4',
    type: 'document',
    title: 'Artigo científico: Radiofrequência e colágeno',
    views: 112,
    description: 'Estudo sobre os efeitos da radiofrequência na produção de colágeno.',
    link: '/technical-documents/4',
    date: '2025-05-02'
  }
];

interface TrendingItemsProps {
  maxItems?: number;
}

const TrendingItems: React.FC<TrendingItemsProps> = ({ maxItems = 4 }) => {
  const items = SAMPLE_TRENDING.slice(0, maxItems);
  
  // Get appropriate icon based on content type
  const getIcon = (type: string) => {
    switch(type) {
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      case 'script':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-amber-500" />;
    }
  };
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-contourline-mediumBlue" />
          <h2 className="text-2xl font-bold">Conteúdo em Alta</h2>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-sm">
          <Link to="/media" className="flex items-center">
            Ver tudo <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link key={item.id} to={item.link}>
            <Card className="h-full border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
              {item.thumbnail && (
                <div className="h-40 overflow-hidden rounded-t-lg">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className={item.thumbnail ? "pb-2" : "pb-2 pt-6"}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getIcon(item.type)}
                    <CardTitle className="ml-2 text-lg">{item.title.length > 25 ? `${item.title.substring(0, 25)}...` : item.title}</CardTitle>
                  </div>
                  {item.badge && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 ml-2 badge-new">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-2">{item.description.length > 70 ? `${item.description.substring(0, 70)}...` : item.description}</p>
                )}
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                  <span>{item.views} visualizações</span>
                  <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingItems;
