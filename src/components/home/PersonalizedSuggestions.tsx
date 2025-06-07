
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ensureUserProfile } from '@/services/auth/userProfile';

interface SuggestionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
  tags: string[];
}

const PersonalizedSuggestions: React.FC = () => {
  const { user } = useAuth();
  const userProfile = user ? ensureUserProfile(user) : null;
  
  // Mock suggestions based on user profile
  const suggestions: SuggestionItem[] = [
    {
      id: '1',
      title: 'Roteiro para explicar procedimento de radiofrequência',
      description: 'Baseado no seu interesse em conteúdos educacionais',
      image: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png',
      category: 'Roteiro',
      link: '/script-generator?type=educational',
      tags: ['radiofrequência', 'educacional']
    },
    {
      id: '2',
      title: 'Ideias para conteúdos sobre benefícios da fotobiomodulação',
      description: 'Com base nos seus acessos recentes sobre luz LED',
      image: '/lovable-uploads/f10b82b4-cb1b-4038-be9c-b1ba32da698b.png',
      category: 'Inspiração',
      link: '/idea-validator?topic=photobiomodulation',
      tags: ['LED', 'fotobiomodulação']
    },
    {
      id: '3',
      title: 'Calendário de conteúdo para lançamento de serviço',
      description: 'Recomendado para sua estratégia de marketing',
      image: '/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png',
      category: 'Planejamento',
      link: '/content-planner?template=launch',
      tags: ['lançamento', 'estratégia']
    }
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  
  if (!userProfile) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Entre para ver recomendações personalizadas</h3>
        <p className="text-muted-foreground mb-4">
          Faça login para receber sugestões adaptadas ao seu perfil e histórico.
        </p>
        <div className="flex justify-center">
          <Button asChild variant="default">
            <a href="/login">Entrar</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {suggestions.map((item, i) => (
        <motion.div
          key={item.id}
          custom={i}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card className="h-full overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-video relative">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge>{item.category}</Badge>
              </div>
            </div>
            <CardContent className="p-5">
              <h3 className="font-medium text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map(tag => (
                  <span 
                    key={tag}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <Button asChild className="w-full" variant="outline">
                <a href={item.link}>Ver detalhes</a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PersonalizedSuggestions;
