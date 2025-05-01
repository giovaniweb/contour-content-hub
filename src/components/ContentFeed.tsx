
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Heart, FileText, Download, LayoutGrid, LayoutList } from "lucide-react";

interface FeedItem {
  id: string;
  title: string;
  description: string;
  type: "vídeo" | "roteiro" | "ideia";
  imageUrl?: string;
  likes: number;
  isLiked: boolean;
}

interface ContentFeedProps {
  items?: FeedItem[];
}

const ContentFeed: React.FC<ContentFeedProps> = ({ items = [] }) => {
  // Estado para controlar o modo de visualização (lista ou grid)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Exemplo de itens de feed se não forem fornecidos
  const defaultItems: FeedItem[] = [
    {
      id: "1",
      title: "Harmonização Facial",
      description: "Vídeo explicativo sobre procedimento de harmonização facial com foco em resultados naturais.",
      type: "vídeo",
      imageUrl: "/placeholder.svg",
      likes: 24,
      isLiked: false
    },
    {
      id: "2",
      title: "Botox e seus benefícios",
      description: "Roteiro para vídeo educativo sobre os benefícios do botox além da estética.",
      type: "roteiro",
      imageUrl: "/placeholder.svg",
      likes: 15,
      isLiked: true
    },
    {
      id: "3",
      title: "Promoção de Final de Semana",
      description: "Ideia para storytelling sobre promoção especial de final de semana.",
      type: "ideia",
      imageUrl: "/placeholder.svg",
      likes: 32,
      isLiked: false
    }
  ];

  const feedItems = items.length > 0 ? items : defaultItems;
  
  const handleLike = (id: string) => {
    console.log(`Liked item ${id}`);
  };
  
  const handleGenerateScript = (id: string) => {
    console.log(`Generate script for item ${id}`);
  };
  
  const handleDownload = (id: string) => {
    console.log(`Download item ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Destaque horizontal */}
      <div className="bg-gradient-to-r from-contourline-darkBlue to-contourline-mediumBlue rounded-xl p-6 mb-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">O que você vai postar hoje?</h2>
        <p className="opacity-90 mb-4">Inspire-se com nossas sugestões personalizadas e crie conteúdo que engaja.</p>
        <div className="flex space-x-3">
          <Button variant="action">
            Gerar Roteiro
          </Button>
          <Button variant="action">
            Explorar Biblioteca
          </Button>
        </div>
      </div>
      
      {/* Controle de visualização (Lista/Grid) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-contourline-darkBlue">Feed de Conteúdo</h2>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "list" | "grid")}>
          <ToggleGroupItem value="list" aria-label="Ver em lista">
            <LayoutList className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Lista</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Ver em grid">
            <LayoutGrid className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Grid</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Feed vertical - modo lista ou grid */}
      {viewMode === "list" ? (
        <div className="space-y-6">
          {feedItems.map((item) => (
            <Card key={item.id} className="feed-item overflow-hidden border border-gray-100 shadow-sm hover:shadow-md">
              <div className="md:flex">
                {/* Imagem de preview */}
                <div className="md:w-1/3 h-48 md:h-auto bg-contourline-lightGray/50">
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                
                {/* Conteúdo */}
                <div className="flex-1 flex flex-col md:flex-row">
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-contourline-lightBlue/20 text-contourline-darkBlue mb-2">
                          {item.type}
                        </span>
                        <h3 className="text-lg font-semibold text-contourline-darkBlue">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  </div>
                  
                  {/* Ícones de ação na lateral */}
                  <div className="flex md:flex-col justify-end items-center p-4 space-y-0 space-x-4 md:space-x-0 md:space-y-6 border-t md:border-t-0 md:border-l border-gray-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleLike(item.id)}
                      className={`${item.isLiked ? 'text-red-500' : 'action-icon'}`}
                    >
                      <Heart className={item.isLiked ? 'fill-current' : ''} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleGenerateScript(item.id)}
                      className="action-icon"
                    >
                      <FileText />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(item.id)}
                      className="action-icon"
                    >
                      <Download />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedItems.map((item) => (
            <Card key={item.id} className="feed-item overflow-hidden border border-gray-100 shadow-sm hover:shadow-md">
              {/* Imagem de preview */}
              <div className="relative h-48 bg-contourline-lightGray/50">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLike(item.id)}
                  className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white ${item.isLiked ? 'text-red-500' : 'text-contourline-darkBlue/70'}`}
                >
                  <Heart className={item.isLiked ? 'fill-current h-4 w-4' : 'h-4 w-4'} />
                </Button>
              </div>
              
              {/* Conteúdo */}
              <CardContent className="p-4">
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-contourline-lightBlue/20 text-contourline-darkBlue mb-2">
                  {item.type}
                </span>
                <h3 className="text-lg font-semibold text-contourline-darkBlue truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleGenerateScript(item.id)}
                  className="action-icon"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  <span className="text-xs">Roteiro</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(item.id)}
                  className="action-icon"
                >
                  <Download className="h-4 w-4 mr-1" />
                  <span className="text-xs">Baixar</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentFeed;
