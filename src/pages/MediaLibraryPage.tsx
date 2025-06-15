import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileVideo, BookOpen, FileImage, ArrowUpRight } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import { layouts } from "@/lib/design-system";

// Real-looking content for the media library
const featuredVideos = [
  {
    id: "vid1",
    title: "Demonstração da Tecnologia Adella",
    description: "Veja como utilizar o laser Adella em tratamentos faciais",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    viewCount: 567
  },
  {
    id: "vid2",
    title: "Tutorial de Ultralift para Iniciantes",
    description: "Aprenda todos os passos para tratamentos com Ultralift",
    thumbnailUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    viewCount: 423
  },
  {
    id: "vid3",
    title: "Resultados Antes e Depois: Hipro",
    description: "Demonstração de casos reais com resultados impressionantes",
    thumbnailUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    viewCount: 389
  }
];

const popularDocuments = [
  {
    id: "doc1",
    title: "Guia de Protocolos para Adella",
    description: "Protocolos completos para diferentes tratamentos",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    downloadCount: 218
  },
  {
    id: "doc2",
    title: "Manual Técnico do Ultralift",
    description: "Especificações e instruções detalhadas",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    downloadCount: 176
  },
  {
    id: "doc3",
    title: "Formulário de Consentimento",
    description: "Modelo para uso com pacientes",
    thumbnailUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    downloadCount: 145
  }
];

const beforeAfterImages = [
  {
    id: "img1",
    title: "Rejuvenescimento Facial",
    description: "Resultado após 3 sessões com Adella",
    thumbnailUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    downloadCount: 132
  },
  {
    id: "img2",
    title: "Tratamento para Rugas",
    description: "Resultado após 5 sessões com Hipro",
    thumbnailUrl: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    downloadCount: 97
  },
  {
    id: "img3",
    title: "Redução de Olheiras",
    description: "Resultado após protocolo combinado",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    downloadCount: 85
  }
];

const MediaLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigateToDetailed = (type: string) => {
    navigate(`/media-library?type=${type}`);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        {/* Hero section */}
        <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-fluida-blue to-fluida-pink relative mb-12">
          <div className="absolute inset-0 bg-black/50 z-0"></div>
          <div className="relative z-10 p-8 sm:p-12 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Biblioteca de Mídia Fluida</h1>
            <p className="text-lg sm:text-xl max-w-2xl mb-8">
              Acesse vídeos profissionais, imagens de alta qualidade e documentos exclusivos para impulsionar sua presença online e aumentar a confiança de seus pacientes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="default" className="bg-white text-fluida-blue hover:bg-white/90">
                Explorar Conteúdo
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Como Utilizar
              </Button>
            </div>
          </div>
        </section>
        
        {/* Content categories */}
        <Tabs defaultValue="videos" className="mb-12">
          <TabsList className="mb-8">
            <TabsTrigger value="videos" className="px-6 py-3">Vídeos</TabsTrigger>
            <TabsTrigger value="images" className="px-6 py-3">Imagens</TabsTrigger>
            <TabsTrigger value="documents" className="px-6 py-3">Documentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Vídeos em Destaque</h2>
                <p className="text-muted-foreground">
                  Demonstrações profissionais e tutoriais detalhados
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleNavigateToDetailed('videos')}
                className="flex items-center gap-1"
              >
                Ver Todos <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className={layouts.cardGrid}>
              {featuredVideos.map((video) => (
                <Card key={video.id} className="hover-lift overflow-hidden">
                  <LazyImage 
                    src={video.thumbnailUrl}
                    alt={video.title}
                    aspectRatio="video"
                    className="w-full h-48 object-cover"
                    fallbackSrc="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3"
                  />
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-full bg-blue-100">
                        <FileVideo className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium line-clamp-1">{video.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{video.description}</p>
                        <div className="text-xs text-muted-foreground">{video.viewCount} visualizações</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Imagens Antes e Depois</h2>
                <p className="text-muted-foreground">
                  Resultados comprovados para compartilhar com seus pacientes
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleNavigateToDetailed('images')}
                className="flex items-center gap-1"
              >
                Ver Todas <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className={layouts.cardGrid}>
              {beforeAfterImages.map((image) => (
                <Card key={image.id} className="hover-lift overflow-hidden">
                  <LazyImage 
                    src={image.thumbnailUrl}
                    alt={image.title}
                    aspectRatio="video"
                    className="w-full h-48 object-cover"
                    fallbackSrc="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3"
                  />
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-full bg-purple-100">
                        <FileImage className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-medium line-clamp-1">{image.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{image.description}</p>
                        <div className="text-xs text-muted-foreground">{image.downloadCount} downloads</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Documentos Populares</h2>
                <p className="text-muted-foreground">
                  Guias, protocolos e materiais técnicos para download
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleNavigateToDetailed('documents')}
                className="flex items-center gap-1"
              >
                Ver Todos <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className={layouts.cardGrid}>
              {popularDocuments.map((doc) => (
                <Card key={doc.id} className="hover-lift overflow-hidden">
                  <LazyImage 
                    src={doc.thumbnailUrl}
                    alt={doc.title}
                    aspectRatio="video"
                    className="w-full h-48 object-cover"
                    fallbackSrc="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3"
                  />
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-full bg-amber-100">
                        <BookOpen className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-medium line-clamp-1">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{doc.description}</p>
                        <div className="text-xs text-muted-foreground">{doc.downloadCount} downloads</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Content creation guidance */}
        <section className="bg-muted rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">Como Utilizar este Conteúdo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <CardTitle>Escolha o Material</CardTitle>
                <CardDescription>Navegue pelos vídeos, imagens e documentos disponíveis</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <span className="text-purple-600 font-bold text-lg">2</span>
                </div>
                <CardTitle>Faça o Download</CardTitle>
                <CardDescription>Baixe o conteúdo para usar em suas mídias</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <span className="text-green-600 font-bold text-lg">3</span>
                </div>
                <CardTitle>Compartilhe</CardTitle>
                <CardDescription>Publique nas redes sociais ou envie para seus pacientes</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default MediaLibraryPage;
