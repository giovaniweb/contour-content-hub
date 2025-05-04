
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader2, Star, TrendingUp, Filter, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScriptResponse } from '@/utils/api';
import { cn } from '@/lib/utils';

interface Topic {
  id: string;
  title: string;
  score: number;
  content?: string;
  tags: string[];
  category: string;
  equipment?: string;
}

// For trending topics
const SAMPLE_TOPICS: Topic[] = [
  { 
    id: '1', 
    title: 'Tratamento com Hipro para lipedema', 
    score: 98, 
    tags: ['tendência', 'hipro', 'lipedema'],
    category: 'tratamento',
    equipment: 'Hipro'
  },
  { 
    id: '2', 
    title: 'Adella Laser para rugas faciais', 
    score: 95,
    tags: ['tendência', 'adella', 'rugas'],
    category: 'rejuvenescimento',
    equipment: 'Adella'
  },
  { 
    id: '3', 
    title: 'Benefícios da ultracavitação com Adella', 
    score: 91,
    tags: ['tendência', 'adella', 'ultracavitação'],
    category: 'gordura localizada',
    equipment: 'Adella'
  },
  { 
    id: '4', 
    title: 'Antes e depois com ultracavitação', 
    score: 88,
    tags: ['tendência', 'resultados', 'ultracavitação'],
    category: 'resultados',
    equipment: 'Koios'
  },
  { 
    id: '5', 
    title: 'Comparativo entre Hipro e Ultralift', 
    score: 85,
    tags: ['tendência', 'comparativo', 'hipro', 'ultralift'],
    category: 'equipamentos',
    equipment: 'Hipro'
  }
];

const TrendingTopics: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        // In a real app, this would be an API call
        // For now, using sample data
        await new Promise(resolve => setTimeout(resolve, 800));
        setTopics(SAMPLE_TOPICS);
      } catch (error) {
        console.error('Failed to fetch trending topics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopics();
  }, []);
  
  const categories = ['all', ...Array.from(new Set(topics.map(topic => topic.category)))];
  
  const filteredTopics = activeCategory === 'all' ? 
    topics : 
    topics.filter(topic => topic.category === activeCategory);
  
  const handleGenerate = (topicId: string) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    navigate(`/custom-gpt?topic=${encodeURIComponent(topic.title)}&equipment=${encodeURIComponent(topic.equipment || '')}`);
  };
  
  const getAutoTitle = (topic: Topic): string => {
    if (topic.category === 'tratamento') {
      return `Como funciona o tratamento com ${topic.equipment || 'equipamento'}`;
    } else if (topic.category === 'resultados') {
      return `Resultados reais com ${topic.equipment || 'tecnologia'}`;
    } else if (topic.category === 'rejuvenescimento') {
      return `${topic.equipment || 'Tecnologia'} para rejuvenescimento: como funciona?`;
    } else {
      return topic.title;
    }
  };
  
  // Function to create a script from a topic
  const createScriptFromTopic = async (topic: Topic): Promise<ScriptResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For now, return a simulated response
    const scriptResponse: ScriptResponse = {
      id: `script-${Date.now()}`,
      title: topic.title,
      content: topic.content || `Roteiro gerado para o tópico: ${topic.title}`,
      type: 'videoScript',
      createdAt: new Date().toISOString(),
      suggestedVideos: [],
      captionTips: [],
      equipment: topic.equipment,
    };
    
    return scriptResponse;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
            <CardTitle className="text-lg">Tópicos em Alta</CardTitle>
          </div>
          {!loading && (
            <div className="flex gap-1 overflow-x-auto pb-1 max-w-[70%]">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={cn(
                    "capitalize cursor-pointer",
                    activeCategory === category ? 'bg-primary' : 'hover:bg-secondary'
                  )}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'all' ? 'Todos' : category}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <CardDescription>
          Tópicos em tendência para sua clínica baseados em dados de mercado
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum tópico encontrado para esta categoria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTopics.map((topic) => (
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
                    onClick={() => handleGenerate(topic.id)}
                    className="whitespace-nowrap"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Gerar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
