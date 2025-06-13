
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Image, FileText, Eye } from 'lucide-react';
import CopyButton from '@/components/ui/CopyButton';

interface CarouselSlideCardProps {
  slide: {
    number: number;
    title: string;
    texto: string;
    imagem: string;
    content: string;
  };
}

const CarouselSlideCard: React.FC<CarouselSlideCardProps> = ({ slide }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: slide.number * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className="aurora-glass border-purple-400/30 border-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 h-full relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50" />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl aurora-float">🎠</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-400/30 aurora-shimmer">
                  Slide {slide.number}
                </Badge>
                <FileText className="h-4 w-4 text-purple-400" />
              </div>
              <h3 className="font-bold text-purple-300 text-lg aurora-heading filter drop-shadow-sm">
                {slide.title}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {/* Texto do Slide */}
            <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full aurora-pulse"></div>
                <span className="text-sm font-medium text-cyan-400">Texto do Slide</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-sm aurora-body pr-12">
                {slide.texto}
              </p>
              <CopyButton 
                text={slide.texto}
                successMessage={`Texto do slide ${slide.number} copiado!`}
              />
            </div>

            {/* Descrição da Imagem */}
            <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm relative">
              <div className="flex items-center gap-2 mb-3">
                <Image className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">Descrição Visual</span>
              </div>
              <p className="text-slate-200 leading-relaxed text-sm aurora-body pr-12">
                {slide.imagem}
              </p>
              <CopyButton 
                text={slide.imagem}
                successMessage={`Descrição visual do slide ${slide.number} copiada!`}
              />
            </div>

            {/* Preview Dica */}
            <div className="aurora-glass rounded-lg p-3 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-yellow-400" />
                <span className="text-xs font-medium text-yellow-400">Dica Visual</span>
              </div>
              <p className="text-slate-300 text-xs italic aurora-body">
                {getVisualTip(slide.number)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const getVisualTip = (slideNumber: number): string => {
  const tips = {
    1: "Primeira impressão é tudo! Use imagem impactante que pare o scroll nos primeiros segundos.",
    2: "Mostre o problema de forma visual. Use expressões e situações que gerem identificação.",
    3: "Destaque o equipamento ou solução em ação. Mostre tecnologia e profissionalismo.",
    4: "Evidencie os benefícios visualmente. Satisfação e resultados devem ser óbvios.",
    5: "CTA visual forte! Ambiente convidativo que convide à ação imediata."
  };
  return tips[slideNumber as keyof typeof tips] || "Mantenha consistência visual em todo o carrossel.";
};

export default CarouselSlideCard;
