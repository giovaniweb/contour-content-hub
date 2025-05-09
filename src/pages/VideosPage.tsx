
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List, Play, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { staggerChildren, itemVariants, fadeIn } from "@/lib/animations";
import { StoredVideo } from '@/types/video-storage';
import VideoPlayerModal from '@/components/video-player/VideoPlayerModal';
import { useSearchParams } from "react-router-dom";
import { getVideos } from '@/services/videoStorageService';

const VideosPage: React.FC = () => {
  console.log("VideosPage - Rendering videos page");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<StoredVideo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videos, setVideos] = useState<StoredVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Carregar os vídeos quando a página for montada ou os parâmetros mudarem
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const categoryParam = searchParams.get('category') || '';
        const equipmentParam = searchParams.get('equipment') || '';
        
        // Definir o filtro com base nos parâmetros da URL
        const filter = {
          search: searchQuery,
          tags: []
        };
        
        if (categoryParam) {
          filter.tags.push(categoryParam);
        }
        
        if (equipmentParam) {
          filter.tags.push(equipmentParam);
        }
        
        // Buscar os vídeos com o filtro
        const result = await getVideos(filter, { field: 'created_at', direction: 'desc' });
        
        if (result.error) {
          console.error("Erro ao buscar vídeos:", result.error);
          setVideos([]);
        } else {
          setVideos(result.videos || []);
        }
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [searchParams, searchQuery]);
  
  // Filtrar vídeos com base nos critérios de busca e na aba ativa
  const getFilteredVideos = () => {
    let filtered = videos;
    
    // Filtrar por busca textual
    if (searchQuery) {
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    // Filtrar por categoria (aba ativa)
    if (activeTab !== 'all') {
      if (activeTab === 'tutorials') {
        filtered = filtered.filter(video => video.tags?.includes('tutorial') || video.tags?.includes('guia'));
      } else if (activeTab === 'treatments') {
        filtered = filtered.filter(video => video.tags?.includes('tratamento') || video.tags?.includes('procedimento'));
      } else if (activeTab === 'equipment') {
        filtered = filtered.filter(video => video.tags?.includes('equipamento') || video.tags?.includes('aparelho'));
      }
    }
    
    return filtered;
  };
  
  const filteredVideos = getFilteredVideos();
  
  const handleOpenVideo = (video: StoredVideo) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const createScriptFromVideo = (videoId: string) => {
    // Navegar para a página de criação de roteiro com o vídeo selecionado
    setSearchParams(prev => {
      prev.set('videoInspirationId', videoId);
      return prev;
    });
    // Navegar para a página de criação de roteiro (implementação depende da estrutura do app)
    window.location.href = `/script-generator?videoInspirationId=${videoId}`;
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-contourline-darkBlue">Biblioteca de Vídeos</h1>
            <p className="text-muted-foreground">Explore nossa biblioteca de vídeos educacionais</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar vídeos..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "bg-muted" : ""}>
              <Grid className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => setViewMode("list")} className={viewMode === "list" ? "bg-muted" : ""}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
            <TabsTrigger value="treatments">Tratamentos</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[220px] bg-muted rounded-lg"></div>
                ))}
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum vídeo encontrado para: "{searchQuery}"</p>
                <Button onClick={() => setSearchQuery("")} className="mt-4">Limpar busca</Button>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerChildren(0.1)}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredVideos.map((video) => (
                  <motion.div key={video.id} variants={itemVariants}>
                    {viewMode === "grid" ? (
                      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-all group">
                        <div className="relative" onClick={() => handleOpenVideo(video)}>
                          <img 
                            src={video.thumbnail_url || '/assets/images/video-placeholder.jpg'}
                            alt={video.title} 
                            className="w-full aspect-video object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                            >
                              <Play className="h-6 w-6 fill-current" />
                            </Button>
                          </div>
                          <div className="absolute right-2 bottom-2 bg-black/70 text-white px-1.5 py-0.5 text-xs rounded">
                            {video.duration || "00:00"}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                          <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                            <span>{new Date(video.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {video.tags && video.tags.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {video.tags && video.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{video.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                createScriptFromVideo(video.id);
                              }}
                              className="text-xs"
                            >
                              Criar roteiro
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="cursor-pointer hover:shadow-md transition-all group">
                        <CardContent className="p-4 flex">
                          <div 
                            className="relative w-40 flex-shrink-0"
                            onClick={() => handleOpenVideo(video)}
                          >
                            <img 
                              src={video.thumbnail_url || '/assets/images/video-placeholder.jpg'}
                              alt={video.title} 
                              className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute right-1 bottom-1 bg-black/70 text-white px-1 py-0.5 text-xs rounded">
                              {video.duration || "00:00"}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 
                              className="font-medium group-hover:text-primary transition-colors"
                              onClick={() => handleOpenVideo(video)}
                            >
                              {video.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {video.description || "Sem descrição"}
                            </p>
                            <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                              <span>{new Date(video.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {video.tags && video.tags.slice(0, 3).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {video.tags && video.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{video.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  createScriptFromVideo(video.id);
                                }}
                              >
                                Criar roteiro
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {filteredVideos.length > 0 && !loading && (
              <div className="flex justify-center mt-8">
                <Button variant="outline">Carregar mais vídeos</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tutorials" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tutoriais serão exibidos aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="treatments" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tratamentos serão exibidos aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="equipment" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Equipamentos serão exibidos aqui</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modal de visualização de vídeo */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </Layout>
  );
};

export default VideosPage;
