
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { staggerChildren, itemVariants, fadeIn } from "@/lib/animations";

// Sample data for videos - in a real app, this would come from an API
const videoData = [
  {
    id: 1,
    title: "Como utilizar o Aparelho X para Tratamento Facial",
    thumbnail: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png",
    duration: "12:45",
    views: 1240,
    date: "2025-04-08",
    description: "Neste vídeo, mostramos como utilizar corretamente o Aparelho X para maximizar os resultados em tratamentos faciais.",
    tags: ["facial", "aparelho", "tutorial"]
  },
  {
    id: 2, 
    title: "Procedimento Y - Passo a passo detalhado",
    thumbnail: "/assets/images/video-thumbnail-2.jpg",
    duration: "8:32",
    views: 890,
    date: "2025-04-12",
    description: "Tutorial completo do Procedimento Y, ideal para clínicas estéticas que buscam excelência em atendimento.",
    tags: ["procedimento", "tutorial", "passo-a-passo"]
  },
  {
    id: 3,
    title: "Dicas para melhorar a comunicação com o paciente",
    thumbnail: "/assets/images/video-thumbnail-3.jpg",
    duration: "15:20",
    views: 2100,
    date: "2025-04-15",
    description: "Aprenda técnicas eficientes para melhorar a comunicação com seus pacientes e aumentar a satisfação nos atendimentos.",
    tags: ["comunicação", "pacientes", "dicas"]
  },
  {
    id: 4,
    title: "Novidades em equipamentos para 2025",
    thumbnail: "/assets/images/video-thumbnail-4.jpg",
    duration: "10:15",
    views: 1500,
    date: "2025-04-20",
    description: "Conheça os equipamentos mais inovadores lançados em 2025 para clínicas estéticas e de fisioterapia.",
    tags: ["equipamentos", "novidades", "tecnologia"]
  },
  {
    id: 5,
    title: "Demonstração do Tratamento Z",
    thumbnail: "/assets/images/video-thumbnail-5.jpg",
    duration: "18:50",
    views: 780,
    date: "2025-04-22",
    description: "Uma demonstração completa do Tratamento Z, desde a preparação até os cuidados pós-procedimento.",
    tags: ["tratamento", "demonstração", "passo-a-passo"]
  },
];

const VideosPage: React.FC = () => {
  console.log("VideosPage - Rendering videos page");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter videos based on search query
  const filteredVideos = videoData.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const openVideoDetails = (video: any) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
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
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
            <TabsTrigger value="treatments">Tratamentos</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-6">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
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
                  <motion.div key={video.id} variants={itemVariants} onClick={() => openVideoDetails(video)}>
                    {viewMode === "grid" ? (
                      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-all">
                        <div className="relative">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full aspect-video object-cover"
                          />
                          <div className="absolute right-2 bottom-2 bg-black/70 text-white px-1.5 py-0.5 text-xs rounded">
                            {video.duration}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium line-clamp-2">{video.title}</h3>
                          <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                            <span>{video.views} visualizações</span>
                            <span>{new Date(video.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {video.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-4 flex">
                          <div className="relative w-40 flex-shrink-0">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title} 
                              className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute right-1 bottom-1 bg-black/70 text-white px-1 py-0.5 text-xs rounded">
                              {video.duration}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium">{video.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {video.description}
                            </p>
                            <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                              <span>{video.views} visualizações</span>
                              <span>{new Date(video.date).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {video.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="tutorials" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tutoriais serão filtrados aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="treatments" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tratamentos serão filtrados aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="equipment" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Equipamentos serão filtrados aqui</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedVideo && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <DialogHeader>
                <DialogTitle>{selectedVideo.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <img 
                    src={selectedVideo.thumbnail} 
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 flex-wrap">
                    {selectedVideo.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedVideo.views} visualizações · {new Date(selectedVideo.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <ScrollArea className="h-32">
                  <p className="text-muted-foreground">
                    {selectedVideo.description}
                  </p>
                </ScrollArea>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline">Compartilhar</Button>
                  <Button>Baixar Vídeo</Button>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default VideosPage;
