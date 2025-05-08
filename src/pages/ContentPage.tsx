
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, Share2, FileText, VideoIcon, MessageSquare, Image } from "lucide-react";
import { motion } from "framer-motion";
import { staggerChildren, itemVariants } from "@/lib/animations";
import { useNavigate } from "react-router-dom";

// Mock data for content items
const contentItems = [
  {
    id: 1,
    title: "Como o Equipamento X revoluciona tratamentos faciais",
    type: "blog",
    icon: FileText,
    thumbnail: "/lovable-uploads/e96c0d46-8a86-4d83-bea8-bc63b46b1fea.png",
    date: "2025-05-05",
    author: "Dr. Maria Silva",
    status: "published",
    tags: ["tratamento facial", "equipamento", "tecnologia"],
    excerpt: "Descubra como o novo Equipamento X está revolucionando os tratamentos faciais em clínicas estéticas e dermatológicas."
  },
  {
    id: 2,
    title: "5 Benefícios do Tratamento Y para Rejuvenescimento",
    type: "video",
    icon: VideoIcon,
    thumbnail: "/assets/images/video-thumbnail-2.jpg",
    date: "2025-05-02",
    author: "Dr. João Santos",
    status: "published",
    tags: ["rejuvenescimento", "tratamento", "benefícios"],
    excerpt: "Um vídeo educativo sobre os principais benefícios do Tratamento Y para rejuvenescimento da pele."
  },
  {
    id: 3,
    title: "O que esperar da sua primeira sessão de tratamento com Aparelho Z",
    type: "article",
    icon: FileText,
    thumbnail: "/assets/images/article-thumbnail-1.jpg",
    date: "2025-04-28",
    author: "Dra. Ana Ferreira",
    status: "published",
    tags: ["primeira sessão", "aparelho Z", "tratamento"],
    excerpt: "Um guia completo sobre o que você deve esperar da sua primeira sessão com o revolucionário Aparelho Z."
  },
  {
    id: 4,
    title: "Depoimento - Resultados do Tratamento X após 3 meses",
    type: "video",
    icon: VideoIcon,
    thumbnail: "/assets/images/video-thumbnail-3.jpg",
    date: "2025-04-25",
    author: "Cliente: Fabiana Mendes",
    status: "published",
    tags: ["depoimento", "resultados", "tratamento X"],
    excerpt: "Fabiana compartilha sua experiência e resultados após 3 meses usando o Tratamento X."
  },
  {
    id: 5,
    title: "Perguntas frequentes sobre o Procedimento Y",
    type: "social",
    icon: MessageSquare,
    thumbnail: "/assets/images/social-thumbnail-1.jpg",
    date: "2025-04-20",
    author: "Equipe Fluida",
    status: "published",
    tags: ["FAQ", "procedimento Y", "dúvidas"],
    excerpt: "Respondemos as perguntas mais frequentes sobre o Procedimento Y para ajudar seus pacientes a entenderem melhor."
  },
  {
    id: 6,
    title: "Comparativo: Antes e depois do Tratamento Z",
    type: "image",
    icon: Image,
    thumbnail: "/assets/images/comparison-thumbnail.jpg",
    date: "2025-04-15",
    author: "Dra. Camila Oliveira",
    status: "published",
    tags: ["antes e depois", "tratamento Z", "resultados"],
    excerpt: "Imagens impressionantes mostrando os resultados do Tratamento Z em diferentes pacientes."
  },
];

const ContentPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("all");
  const navigate = useNavigate();
  
  // Filter content based on search query and active tab
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesTab = activeView === "all" || activeView === item.type;
    
    return matchesSearch && matchesTab;
  });
  
  const getIconForContentType = (type: string) => {
    switch (type) {
      case "blog":
      case "article":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <VideoIcon className="h-5 w-5" />;
      case "social":
        return <MessageSquare className="h-5 w-5" />;
      case "image":
        return <Image className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getContentUrl = (item: any) => {
    switch (item.type) {
      case "blog":
      case "article":
        return "/articles";
      case "video":
        return "/videos";
      case "social":
        return "/content-planner";
      default:
        return "/content";
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-contourline-darkBlue">Conteúdo</h1>
            <p className="text-muted-foreground">Organize seus conteúdos publicados</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar conteúdo..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="icon">
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="w-full"
          value={activeView}
          onValueChange={setActiveView}
        >
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="video">Vídeos</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="article">Artigos</TabsTrigger>
            <TabsTrigger value="image">Imagens</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeView} className="pt-6">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum conteúdo encontrado</p>
                {searchQuery && (
                  <Button onClick={() => setSearchQuery("")} className="mt-4">Limpar busca</Button>
                )}
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerChildren(0.1)}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredContent.map((item) => (
                  <motion.div 
                    key={item.id} 
                    variants={itemVariants}
                    className="cursor-pointer"
                    onClick={() => navigate(getContentUrl(item))}
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-all">
                      <div className="relative h-48">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-white/90 text-black hover:bg-white/80">
                            <div className="flex items-center gap-1">
                              {getIconForContentType(item.type)}
                              <span className="capitalize">{item.type}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white/80 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Mock share functionality
                            alert(`Compartilhando: ${item.title}`);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div>
                          <h3 className="font-medium line-clamp-2">{item.title}</h3>
                          <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
                            <span>{item.author}</span>
                            <span>{new Date(item.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                            {item.excerpt}
                          </p>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t flex flex-wrap gap-1">
                          {item.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ContentPage;
