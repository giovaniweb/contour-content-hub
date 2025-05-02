
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Star, ArrowRight } from 'lucide-react';

const FeatureBanner: React.FC = () => {
  // Featured content - in a real implementation, these would come from an API
  const featuredContent = {
    title: "Técnicas avançadas com Adélla Laser",
    description: "Aprenda as melhores técnicas para tratamentos faciais utilizando o equipamento Adélla Laser",
    image: "https://images.unsplash.com/photo-1612270043573-65a76546f9e8?q=80&w=1171&auto=format&fit=crop",
    category: "Vídeo",
    duration: "06:45",
    author: "Dr. Carlos Mendes",
    date: "2 de maio de 2025"
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="relative h-[280px] sm:h-[320px]">
        <img 
          src={featuredContent.image} 
          alt={featuredContent.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20">
          <div className="absolute bottom-0 left-0 w-full p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary text-primary-foreground">{featuredContent.category}</Badge>
              <Badge variant="outline" className="bg-black/50 text-white border-none">
                {featuredContent.duration}
              </Badge>
              <Badge variant="outline" className="bg-black/50 text-white border-none flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                Destaque
              </Badge>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
              {featuredContent.title}
            </h2>
            
            <p className="text-white/80 mb-4 max-w-2xl">
              {featuredContent.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/70">
                <span>{featuredContent.author}</span>
                <span className="mx-2">•</span>
                <span>{featuredContent.date}</span>
              </div>
              
              <div className="flex gap-2">
                <Button className="gap-2">
                  <Play className="h-4 w-4" /> Assistir
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Ver mais <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FeatureBanner;
