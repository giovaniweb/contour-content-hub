
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLayout from '@/components/layout/ContentLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter, Grid, LayoutList } from "lucide-react";
import { ROUTES } from '@/routes';
import GlassContainer from '@/components/ui/GlassContainer';

// Mock videos data
const videos = [
  {
    id: "1",
    title: "Como aplicar base líquida corretamente",
    duration: "4:32",
    views: 1892,
    thumbnail: "https://example.com/thumbs/makeup1.jpg",
    date: "2025-04-12"
  },
  {
    id: "2",
    title: "Top 5 produtos para pele oleosa",
    duration: "8:17",
    views: 3541,
    thumbnail: "https://example.com/thumbs/skincare1.jpg",
    date: "2025-04-15"
  },
  {
    id: "3",
    title: "Técnicas avançadas de contorno facial",
    duration: "12:45",
    views: 2187,
    thumbnail: "https://example.com/thumbs/makeup2.jpg",
    date: "2025-04-18"
  },
  {
    id: "4",
    title: "Resenha completa: Linha de hidratação X",
    duration: "15:22",
    views: 1543,
    thumbnail: "https://example.com/thumbs/product1.jpg",
    date: "2025-04-22"
  },
  {
    id: "5",
    title: "Maquiagem para festas noturnas",
    duration: "7:14",
    views: 2876,
    thumbnail: "https://example.com/thumbs/makeup3.jpg",
    date: "2025-04-25"
  },
  {
    id: "6",
    title: "Unboxing: Novidades do mês",
    duration: "18:06",
    views: 1287,
    thumbnail: "https://example.com/thumbs/unboxing.jpg",
    date: "2025-04-28"
  }
];

const VideosPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const handleCreateVideo = () => {
    navigate(ROUTES.VIDEOS.CREATE);
  };
  
  const handleViewVideo = (id: string) => {
    navigate(`${ROUTES.VIDEOS.PLAYER}/${id}`);
  };
  
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <ContentLayout
      title="Biblioteca de Vídeos"
      subtitle="Gerencie seus vídeos e conteúdo audiovisual"
      actions={
        <div className="flex gap-2">
          <Button onClick={handleCreateVideo} className="bg-gradient-to-r from-[#0094fb] to-[#f300fc] hover:opacity-90 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Vídeo
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="all" className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="vlogs">Vlogs</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar vídeos..."
                className="pl-9 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="border rounded-md flex">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-none rounded-l-md"
                onClick={() => setView('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-none rounded-r-md"
                onClick={() => setView('list')}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
      
      {filteredVideos.length > 0 ? (
        <div className={view === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
          : 'space-y-4'}>
          {filteredVideos.map((video) => (
            view === 'grid' ? (
              <GlassContainer 
                key={video.id} 
                className="overflow-hidden hover:shadow-md cursor-pointer"
                onClick={() => handleViewVideo(video.id)}
              >
                <div className="aspect-video bg-muted relative">
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{video.views.toLocaleString()} views</span>
                    <span>{new Date(video.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </GlassContainer>
            ) : (
              <GlassContainer 
                key={video.id}
                className="hover:shadow-md cursor-pointer"
                onClick={() => handleViewVideo(video.id)}
              >
                <div className="flex gap-4">
                  <div className="relative w-36 h-20 bg-muted rounded">
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-2">{video.title}</h3>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>{video.views.toLocaleString()} views</span>
                      <span>{new Date(video.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </GlassContainer>
            )
          ))}
        </div>
      ) : (
        <GlassContainer className="py-16">
          <div className="flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-medium">Nenhum vídeo encontrado</h2>
            <p className="text-muted-foreground text-center">
              Não encontramos vídeos correspondentes à sua busca.
            </p>
            <Button variant="outline" className="mt-6" onClick={handleCreateVideo}>
              Criar novo vídeo
            </Button>
          </div>
        </GlassContainer>
      )}
    </ContentLayout>
  );
};

export default VideosPage;
