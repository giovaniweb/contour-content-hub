
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, ArrowLeft, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GeneratedIdea {
  id: string;
  title: string;
  description: string;
  platforms: string[];
  format: string;
}

interface IdeasGeneratorProps {
  onSelectIdea: (idea: GeneratedIdea) => void;
  onCancel: () => void;
}

const IdeasGenerator: React.FC<IdeasGeneratorProps> = ({ onSelectIdea, onCancel }) => {
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const generateIdeas = async () => {
      // Simulating API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated ideas
      const mockIdeas: GeneratedIdea[] = [
        {
          id: "1",
          title: "Tutorial de Maquiagem Rápida",
          description: "Video curto mostrando como fazer uma maquiagem completa em menos de 5 minutos para mães ocupadas.",
          platforms: ["Instagram", "TikTok"],
          format: "Reels"
        },
        {
          id: "2",
          title: "Série: Um Dia na Vida",
          description: "Acompanhe um dia na rotina de uma profissional de estética, mostrando os bastidores dos tratamentos.",
          platforms: ["YouTube", "Instagram"],
          format: "Vídeo longo + Stories"
        },
        {
          id: "3",
          title: "Antes e Depois: Transformações Reais",
          description: "Mostre resultados impressionantes de clientes reais com o equipamento Reverso.",
          platforms: ["Instagram", "Facebook"],
          format: "Carrossel"
        },
        {
          id: "4",
          title: "Mitos e Verdades sobre Tratamentos",
          description: "Desmistifique conceitos errados sobre procedimentos estéticos em um formato divertido e educativo.",
          platforms: ["TikTok", "Instagram"],
          format: "Vídeo curto interativo"
        },
        {
          id: "5",
          title: "Guia de Skincare por Idade",
          description: "Série de posts explicando os cuidados ideais com a pele para cada faixa etária.",
          platforms: ["Blog", "Instagram"],
          format: "Infográfico + Carrossel"
        }
      ];
      
      setIdeas(mockIdeas);
      setIsLoading(false);
    };

    generateIdeas();
  }, []);

  const handleLike = () => {
    if (currentIndex < ideas.length) {
      onSelectIdea(ideas[currentIndex]);
    }
  };

  const handleDislike = () => {
    setDirection('left');
    setTimeout(() => {
      setDirection(null);
      if (currentIndex < ideas.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Return to input mode if all ideas have been viewed
        onCancel();
      }
    }, 300);
  };

  const currentIdea = ideas[currentIndex];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={onCancel} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h2 className="text-xl font-semibold text-center fluida-gradient-text">
          Ideias para Inspirar
        </h2>
        <div className="w-[88px]"></div> {/* Placeholder for flex spacing */}
      </div>

      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <Loader className="h-8 w-8 text-fluida-blue animate-spin mb-4" />
            <p className="text-muted-foreground">Gerando ideias criativas...</p>
          </div>
        ) : (
          <>
            <div className="relative w-full h-[350px] mb-8">
              <AnimatePresence>
                {currentIdea && (
                  <motion.div
                    key={currentIdea.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, x: direction === 'left' ? -300 : 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute w-full"
                  >
                    <Card className="border border-fluida-blue/20 w-full mx-auto max-w-md shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-fluida-blue">{currentIdea.title}</h3>
                        <p className="text-gray-700 mb-4">{currentIdea.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Plataformas:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {currentIdea.platforms.map((platform, index) => (
                                <span key={index} className="text-xs bg-fluida-blue/10 text-fluida-blue px-2 py-1 rounded-full">
                                  {platform}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-500">Formato:</p>
                            <p className="text-sm">{currentIdea.format}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 rounded-full bg-white border-red-400 hover:bg-red-50"
                onClick={handleDislike}
              >
                <ThumbsDown className="h-6 w-6 text-red-500" />
              </Button>
              <Button
                size="lg"
                className="h-14 w-14 rounded-full bg-fluida-pink hover:bg-fluida-pink/90"
                onClick={handleLike}
              >
                <ThumbsUp className="h-6 w-6 text-white" />
              </Button>
            </div>
            
            <p className="text-muted-foreground mt-4 text-sm">
              {currentIndex + 1} de {ideas.length} ideias
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default IdeasGenerator;
