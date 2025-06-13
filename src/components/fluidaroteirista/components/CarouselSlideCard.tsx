
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import CopyButton from '@/components/ui/CopyButton';

interface CarouselSlideCardProps {
  slide: {
    number: number;
    title: string;
    texto: string;
    imagem: string;
  };
  index: number;
  total: number;
}

const getSlideIcon = (slideNumber: number): string => {
  const icons = {
    1: "🎯", // Gancho/Abertura
    2: "⚡", // Problema
    3: "💡", // Solução
    4: "✨", // Benefícios
    5: "📲"  // CTA
  };
  return icons[slideNumber as keyof typeof icons] || "📝";
};

const getSlideTheme = (slideNumber: number) => {
  const themes = {
    1: { 
      bg: "aurora-glass", 
      border: "border-aurora-electric-purple/30", 
      text: "text-aurora-electric-purple", 
      badge: "bg-aurora-electric-purple/20 text-aurora-electric-purple border-aurora-electric-purple/30",
      glow: "aurora-glow",
      gradient: "bg-gradient-to-br from-aurora-electric-purple/10 to-aurora-neon-blue/10"
    },
    2: { 
      bg: "aurora-glass", 
      border: "border-red-400/30", 
      text: "text-red-300", 
      badge: "bg-red-500/20 text-red-300 border-red-400/30",
      glow: "shadow-red-400/20",
      gradient: "bg-gradient-to-br from-red-500/10 to-orange-500/10"
    },
    3: { 
      bg: "aurora-glass", 
      border: "border-aurora-emerald/30", 
      text: "text-aurora-emerald", 
      badge: "bg-aurora-emerald/20 text-aurora-emerald border-aurora-emerald/30",
      glow: "aurora-glow-emerald",
      gradient: "bg-gradient-to-br from-aurora-emerald/10 to-aurora-lime/10"
    },
    4: { 
      bg: "aurora-glass", 
      border: "border-aurora-lavender/30", 
      text: "text-aurora-lavender", 
      badge: "bg-aurora-lavender/20 text-aurora-lavender border-aurora-lavender/30",
      glow: "shadow-aurora-lavender/20",
      gradient: "bg-gradient-to-br from-aurora-lavender/10 to-aurora-soft-pink/10"
    },
    5: { 
      bg: "aurora-glass", 
      border: "border-aurora-neon-blue/30", 
      text: "text-aurora-neon-blue", 
      badge: "bg-aurora-neon-blue/20 text-aurora-neon-blue border-aurora-neon-blue/30",
      glow: "aurora-glow-blue",
      gradient: "bg-gradient-to-br from-aurora-neon-blue/10 to-aurora-cyan/10"
    }
  };
  return themes[slideNumber as keyof typeof themes] || themes[1];
};

const CarouselSlideCard: React.FC<CarouselSlideCardProps> = ({ slide, index, total }) => {
  const icon = getSlideIcon(slide.number);
  const theme = getSlideTheme(slide.number);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: slide.number * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className={`${theme.bg} ${theme.border} ${theme.glow} border-2 hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden`}>
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 ${theme.gradient} opacity-50`} />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl aurora-float">{icon}</div>
            <div className="flex-1">
              <Badge variant="outline" className={`${theme.badge} border mb-2 aurora-shimmer`}>
                Slide {slide.number} de {total}
              </Badge>
              <h3 className={`font-bold ${theme.text} text-lg aurora-heading filter drop-shadow-sm`}>
                {slide.title}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {/* Seção Texto do Slide */}
            <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-aurora-emerald rounded-full aurora-pulse"></div>
                <span className="text-sm font-medium text-aurora-emerald">Texto do Slide</span>
              </div>
              <div className="text-slate-200 leading-relaxed text-sm aurora-body pr-12 whitespace-pre-wrap">
                {slide.texto}
              </div>
              <CopyButton 
                text={slide.texto}
                successMessage={`Texto do slide ${slide.number} copiado!`}
              />
            </div>

            {/* Seção Descrição da Imagem */}
            <div className="aurora-glass rounded-lg p-4 border border-white/10 backdrop-blur-sm relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-aurora-neon-blue rounded-full aurora-pulse"></div>
                <span className="text-sm font-medium text-aurora-neon-blue">Descrição da Imagem</span>
              </div>
              <div className="text-slate-300 leading-relaxed text-sm italic aurora-body pr-12 whitespace-pre-wrap">
                {slide.imagem}
              </div>
              <CopyButton 
                text={slide.imagem}
                successMessage={`Descrição da imagem do slide ${slide.number} copiada!`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CarouselSlideCard;
