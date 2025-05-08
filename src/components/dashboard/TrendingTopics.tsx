
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Filter } from 'lucide-react';
import { Topic } from './types';
import CategoryFilter from './CategoryFilter';
import TrendingTopicsList from './TrendingTopicsList';
import LoadingIndicator from './LoadingIndicator';

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

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
            <CardTitle className="text-lg">Tópicos em Alta</CardTitle>
          </div>
          {!loading && (
            <CategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          )}
        </div>
        <CardDescription>
          Tópicos em tendência para sua clínica baseados em dados de mercado
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <TrendingTopicsList 
            loading={loading}
            topics={filteredTopics}
            onGenerate={handleGenerate}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
