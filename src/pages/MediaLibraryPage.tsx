
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List, FileIcon, FileVideo, FileImage, FilePdf, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";
import { staggerChildren, itemVariants, fadeIn } from "@/lib/animations";

// Mock data for media files
const mediaFiles = [
  {
    id: 1,
    title: "Campanha de Marketing Digital - Equipamento X",
    type: "video",
    icon: FileVideo,
    extension: "MP4",
    thumbnail: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png",
    size: "45.2 MB",
    date: "2025-05-02",
    tags: ["marketing", "equipamento-x"],
    description: "Vídeo para campanha de marketing digital sobre o Equipamento X."
  },
  {
    id: 2,
    title: "Banner Promoção Maio 2025",
    type: "image",
    icon: FileImage,
    extension: "PSD",
    thumbnail: "/assets/images/banner-thumbnail.jpg",
    size: "32.8 MB",
    date: "2025-04-28",
    tags: ["banner", "promoção", "design"],
    description: "Banner para promoção de maio 2025. Arquivo editável em PSD."
  },
  {
    id: 3,
    title: "Artigo Científico - Tratamento Z",
    type: "document",
    icon: FilePdf,
    extension: "PDF",
    thumbnail: "/assets/images/pdf-thumbnail.jpg",
    size: "2.4 MB",
    date: "2025-04-25",
    tags: ["artigo", "científico", "tratamento-z"],
    description: "Artigo científico sobre os resultados do Tratamento Z."
  },
  {
    id: 4,
    title: "Guia de Uso - Equipamento Y",
    type: "document",
    icon: FileText,
    extension: "DOCX",
    thumbnail: "/assets/images/doc-thumbnail.jpg",
    size: "1.8 MB",
    date: "2025-04-20",
    tags: ["guia", "equipamento-y", "manual"],
    description: "Manual de instruções para o Equipamento Y."
  },
  {
    id: 5,
    title: "Gráficos de Resultados Q1 2025",
    type: "image",
    icon: FileImage,
    extension: "AI",
    thumbnail: "/assets/images/graph-thumbnail.jpg",
    size: "15.6 MB",
    date: "2025-04-15",
    tags: ["gráficos", "resultados", "design"],
    description: "Arquivos de design para gráficos de resultados do primeiro trimestre de 2025."
  },
];

const MediaLibraryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter media files based on search query
  const filteredMedia = mediaFiles.filter(media => 
    media.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    media.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    media.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    media.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const openMediaDetails = (media: any) => {
    setSelectedMedia(media);
    setIsDialogOpen(true);
  };
  
  const getMediaIcon = (media: any) => {
    const IconComponent = media.icon;
    return <IconComponent className="h-8 w-8" />;
  };
  
  const formatFileSize = (size: string) => {
    return size;
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-contourline-darkBlue">Biblioteca de Mídia</h1>
            <p className="text-muted-foreground">Gerencie todos os seus arquivos de mídia</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar arquivos..." 
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
            <TabsTrigger value="images">Imagens</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-6">
            {filteredMedia.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum arquivo encontrado para: "{searchQuery}"</p>
                <Button onClick={() => setSearchQuery("")} className="mt-4">Limpar busca</Button>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerChildren(0.1)}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredMedia.map((media) => (
                  <motion.div key={media.id} variants={itemVariants} onClick={() => openMediaDetails(media)}>
                    {viewMode === "grid" ? (
                      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-all">
                        <div className="relative h-40 bg-muted">
                          {media.thumbnail ? (
                            <img 
                              src={media.thumbnail} 
                              alt={media.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              {getMediaIcon(media)}
                            </div>
                          )}
                          <Badge className="absolute top-2 right-2">
                            {media.extension}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium line-clamp-2">{media.title}</h3>
                          <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                            <span>{formatFileSize(media.size)}</span>
                            <span>{new Date(media.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="cursor-pointer hover:shadow-md transition-all">
                        <CardContent className="p-4 flex items-center">
                          <div className="flex-shrink-0 mr-4 w-12 h-12 flex items-center justify-center bg-muted rounded-md">
                            {getMediaIcon(media)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{media.title}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <Badge variant="outline">{media.extension}</Badge>
                              <span className="text-sm text-muted-foreground">{formatFileSize(media.size)}</span>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(media.date).toLocaleDateString('pt-BR')}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="images" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Imagens serão filtradas aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Vídeos serão filtrados aqui</p>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Documentos serão filtrados aqui</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedMedia && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <DialogHeader>
                <DialogTitle>{selectedMedia.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="bg-muted rounded-lg overflow-hidden">
                  {selectedMedia.thumbnail ? (
                    <img 
                      src={selectedMedia.thumbnail} 
                      alt={selectedMedia.title}
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center">
                      {getMediaIcon(selectedMedia)}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <p className="font-medium">{selectedMedia.type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Formato</span>
                    <p className="font-medium">{selectedMedia.extension}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Tamanho</span>
                    <p className="font-medium">{formatFileSize(selectedMedia.size)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Data</span>
                    <p className="font-medium">{new Date(selectedMedia.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Tags</span>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {selectedMedia.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Descrição</span>
                  <p className="mt-1">{selectedMedia.description}</p>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" /> Baixar Arquivo
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default MediaLibraryPage;
